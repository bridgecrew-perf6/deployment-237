<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\State;
use App\Models\City;
use Response;
use Validator;

class UserController extends Controller
{
    public function all_users(Request $request){
        $data = [];
        if($request->id != "" && $request->isMethod('get')){
            if($request->isMethod('get')){
                $user = User::where('role', "1")->where('id',$request->id)->first();
                $data = Response::json($user,200);
            }
        }
        else{
            $data = User::where('role', "1")->get();
        }
        if($request->isMethod('post')){
            $input = $request->json()->all();
                $validated = array(
                    'user_id' => ['required'],
                    'first_name' => ['required','min:2' ,'string'],
                    'last_name' => ['required','min:2','string '],
                    'number' => ['required','digits:10'],
                    'city_name' => ['required'],
                    'email' => ['required','email'],
                    'is_active' => ['required']
            );
                $validator = Validator::make($input,$validated);
                if($validator->fails()){
                    $data = Response::json($validator->errors(),400);
                }
                else{
                    $user_check = User::where('id',$request->user_id)->first();
                    if($user_check != ""){
                     $user = User::where('id',$request->user_id)
                            ->update([
                                 'first_name' => $input['first_name'] ,
                                 'last_name' => $input['last_name'],
                                 'city_name' => $input['city_name'],
                                 'number' => $input['number'],
                                 'email' => $input['email'],
                                 'street_address' => @$input['street_address'],
                                 'state' => @$input['state'],
                                 'zip' => @$input['zip'],
                                 'is_active' => $input['is_active']
                             ]);
                    $data = Response::json(['message'=>'Profile Updated'],200); 
                    }   
                    else{
                        $data = Response::json(['message'=>'User Id Not found'],400);
                    }    
                }
            
        }
        return $data;
    }

    public function all_states(Request $request){
        $data = [];
        $data = State::all();
        return $data;
    }

    public function allcities_bystate($id){
        $data = [];
        $statedet = State::where('state',$id)->first();
        $data = City::where('state_code',$statedet['state_code'])->get();
        return $data;
    }

    public function delete($id){
        $user = User::where('role', "1")->where('id',$id)->first();
        if($user != ""){
            $user->delete();
            return Response::json(['message'=>'user deleted'],200);
        }
        else{
            return Response::json(['error'=>'user not found'],400);
        }
    }
}
