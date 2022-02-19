<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Validator;
use Response;
use Config;
use App\Models\User;
use App\Mail\WelcomeMail;
use App\Models\Vendor;
use App\Models\Movie;
use App\Models\Event;
use App\Models\Concert;
use Illuminate\Validation\Rules\Password;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Password as Pass;

class AuthController extends Controller
{
    public function register(Request $request){
        $data = $request->json()->all();
        if($request->isMethod('post') && $request->role != ""){
            $validated = array(
                    'first_name' => ['required','min:2' ,'string'],
                    'last_name' => ['required','min:2','string '],
                    'number' => ['required','digits:10'],
                    'city_name' => ['required'],
                    'email' => ['required','email','unique:users'],
                    'password' => ['required', Password::min(8)->symbols()],
                    'role' => ['required','integer']
            );

            $validator = Validator::make($data,$validated);

        if($validator->fails()){
            return Response::json($validator->errors(),400);
        }
        else{
            $user = User::create([
                'first_name' => $data['first_name'] ,
                'last_name' => $data['last_name'],
                'number' => $data['number'],
                'email' => $data['email'],
                'city_name' => $data['city_name'],
                'password' => Hash::make($data['password']),
                'role' => $data['role'],
                'commission' => $data['role'] == 2 ? 50 : null,
            ]);
        $emailcontent = [
            'site_title' => Config::get('constants.COMPANY_NAME'),
            'font_url' => Config::get('constants.FRONT_URL'),
            'name' => $data['first_name'],
            'email' => $data['email'],
            'city_name' => $data['city_name'],
            'password' => $data['password']
        ];
   
            Mail::to($data['email'])->send(new WelcomeMail($emailcontent));
            return Response::json($user,200);
        }
        }
        else{
            return Response::json(['message' => 'undefined user role'],404);
        }
    }

    public function login(Request $request){
        $data = $request->json()->all();
        if($request->isMethod('post')){
            $validated = array(
                'email' => ['required'],
                'password' => ['required']
            );
             $validator = Validator::make($data,$validated);
             if($validator->fails()){
                return Response::json($validator->errors(),400);
             }
             else{
                $loginData = User::where('email',$data['email'])->first();
                if($loginData ==""){
                    $loginData = User::where('username', $data['email'])->where('role', '3')->first();
                }
                if($loginData->role == 2) {
                    $events = Event::where('vendor_id',$loginData->id)->get();
                } else if($loginData->role == 0) {
                    $events = Event::all();
                } else if($loginData->role == 3) {
                    $events = Event::where('vendor_id', $loginData->vendor_id)->get();
                } else {
                    $events = [];
                }
                if($loginData != "" && $loginData['is_active']){
                    if(Hash::check($data['password'], $loginData['password'])){
                        return Response::json(['user' => $loginData,'events' => $events],200);
                    }
                    else{
                        return Response::json(['message' => 'Incorrect Password'],403);
                    }
                }
                elseif($loginData != "" && $loginData['is_active'] == false){
                    return Response::json(['message'=>'Please Wait For Admin Approval'],401);
                }else{
                    return Response::json(['message'=>'Email id not registered'],401);
                }
             }
        }
    }


    public function change_password(Request $request){
        $data = $request->json()->all();
        $validated = array(
            'user_id' => ['required'],
            'password' => ['required',"confirmed", Password::min(8)->symbols()],
        );
        $validator = Validator::make($data,$validated);
        if($validator->fails()){
            return Response::json($validator->errors(),400);
        }
        else{
            $user = User::find($data['user_id']);
                if($user != ""){
                $user->password = Hash::make($data['password']);
                    if($user->save()){
                        return Response::json(["message"=>"Profile Updated Successfully"],200);
                    }
                }
                else{
                    return Response::json(['message'=>'User Not Found'],400);
                }
         }
    }

    public function reset_password(Request $request){
        $validated = array(
            "email" =>['required','email'],
        );
        $validator = Validator::make($request->all(),$validated);
        if($validator->fails()){
            return Response::json($validator->errors(),400);
        }
        else{
            $check = User::where('email',$request->email)->first();
            if(!empty($check)){
                $credentials = $request->validate(['email' => 'required|email']);
                Pass::sendResetLink($credentials);
                return Response::json(['message' => 'Password reset link has been sent to your registred email address'],200);
            }
            else{
                return Response::json(['message' => 'invalid email id'],400);
            }
        }
    }


    public function reset(Request $request) {
        $data = $request->json()->all();
        $validated = array(
            'email' => "required",
            'token' => 'required|string',
            'password' => ['required', 'string', 'min:8',"confirmed"],
        );
        $validator = Validator::make($data,$validated);
        if($validator->fails()){
            return Response::json($validator->errors(),400);
        }
        else{

            $check = User::where('email',$request->email)->first();
            if(!empty($check)){
            $reset_password_status = Pass::reset($data, function ($user, $password) {
            $user->password = Hash::make($password);
            $user->save();
        });

        if ($reset_password_status == Pass::INVALID_TOKEN) {
            return Response::json(["msg" => "Invalid token"], 400);
            }
        }
        else{
             return Response::json(['msg' => 'invalid email id'],400);
        }
        return Response::json(["msg" => "Password has been successfully changed"],200);
    }
}

    public function search_key(Request $request){
       $data = [];
       $data1 = Event::where('title', 'like', '%' .$request -> input('title').'%')
       ->where('date', 'like', '%' .$request -> input('date').'%')
       ->where('about', 'like', '%' .$request -> input('about').'%')
       ->where('address', 'like', '%' .$request -> input('address').'%')
       ->where('artist', 'like', '%' .$request -> input('artist').'%')
       ->where('category', 'like', '%' .$request -> input('category').'%')
       ->where('language', 'like', '%' .$request -> input('language').'%')
       ->orWhereHas('tags', function ($query) use ($request) {
           if ($request -> input('artist') != "") {
               return $query->where('name', 'like', '%' .$request -> input('artist').'%');
           }else{
               return $query->orWhere('name', 'like', '%' .$request -> input('artist').'%');
           }
        }) 
       ->get(['title', 'price','date','image','starting_time', 'ending_time','is_active','id']);
       if(count($data1) > 0 ){
        $data["events"] = $data1;
       }
       $data2 = Movie::where('title', 'like', '%' .$request -> input('title').'%')
       ->where('date', 'like', '%' .$request -> input('date').'%')
       ->get(['title', 'price','date','image','time','is_active','id']);
        if(count($data2) > 0){
        $data['movies'] = $data2;
       }
       $data3 = Concert::where('title', 'like', '%' .$request -> input('title').'%')
       ->where('date', 'like', '%' .$request -> input('date').'%')
       ->where('about', 'like', '%' .$request -> input('about').'%')
       ->where('address', 'like', '%' .$request -> input('address').'%')
       ->where('artist', 'like', '%' .$request -> input('artist').'%')
       ->where('category', 'like', '%' .$request -> input('category').'%')
       ->where('language', 'like', '%' .$request -> input('language').'%')
       ->get(['title', 'price','date','image','starting_time', 'ending_time','is_active','id']);
        if(count($data3) > 0){
        $data['concerts'] = $data3;
       }
       if(count($data) > 0 ){
       return Response::json($data,200);
     }
        else{
             return Response::json(['message' =>'no data found'],200);
        }
    }
}