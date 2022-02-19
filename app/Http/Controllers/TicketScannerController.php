<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Response;
use App\Mail\WelcomeMail;
use Config;
use Illuminate\Support\Facades\Mail;

class TicketScannerController extends Controller
{
    
    public function scannerlist($vendorId)
    {
        $headers = request()->headers->all();
        $scanner_list = User::with(['scannerEvents'])->where('role', "3")
        ->where('vendor_id',$vendorId);
        if(isset($headers['authorization'])) {
            $scanner_list = $scanner_list->whereHas('scannerEvents',function($q) use ($headers){
                $q->where('event_id',$headers['authorization']);
            });
        }
        $scanner_list = $scanner_list->get();
        return response()->json($scanner_list);
    }

    public function show($id)
    {
        return User::where("id", $id)->with('role', '3')->first();
    }


    public function create(Request $request){
        $data = $request->all();
        $this->validate($request, [
            'vendor_id' => ['required'],
            'first_name' => ['required','min:2' ,'string'],
            'last_name' => ['required','min:2','string '],
            'number' => ['required','digits:10'],
            'city_name' => ['required'],
            'email' => ['required','email', 'unique:users,email'],
            'is_active' => ['required'],
            'username' => ['required'],
            // 'street_address' => ['required'],
            // 'state' => ['required'],
            // 'zip' => ['required'],
        ]);

        $data['password'] = app('hash')->make($request->input('password'));
        $data['role'] = '3';
        try {
            $user = User::create($data);
            $user->scannerEvents()->sync($request->input('event_ids'));
            $emailcontent = [
                'site_title' => Config::get('constants.COMPANY_NAME'),
                'font_url' => Config::get('constants.FRONT_URL'),
                'name' => $data['first_name'],
                'email' => $data['email'],
                'city_name' => $data['city_name'],
                'password' => $data['password']
            ];
            Mail::to($data['email'])->send(new WelcomeMail($emailcontent));
            return response()->json($user);
        } catch (\Exception $e) {
            return response()->json($e->getMessage(),500);
        }
    }

    public function update(Request $request)
    {
        $this->validate($request, [
            'vendor_id' => ['required'],
            'first_name' => ['required','min:2' ,'string'],
            'last_name' => ['required','min:2','string '],
            'number' => ['required','digits:10'],
            'city_name' => ['required'],
            'email' => ['required','email', 'unique:users,email,'.$request->id],
            'is_active' => ['required'],
            // 'street_address' => ['required'],
            // 'state' => ['required'],
            // 'zip' => ['required'],
            'username' => ['required'],
        ]);


        $user = User::where('id', $request->id)->first();
        $user->first_name = $request->input('first_name');
        $user->last_name = $request->input('last_name');
        $user->email = $request->input('email');
        $user->role = '3';
        $user->vendor_id = $request->input('vendor_id');
        $user->number = $request->input('number');
        $user->city_name = $request->input('city_name');
        $user->username = @$request->input('username');
        // $user->street_address = $request->input('street_address');
        // $user->state = $request->input('state');
        // $user->zip = $request->input('zip');        
        if ($request->input('password')) {
            $user->password = app('hash')->make($request->input('password'));
        }
        try {
            $user->save();
            $user->scannerEvents()->sync($request->input('event_ids'));
            return $user;
        } catch (\Exception $exception) {
            return new Response([
                'message' => "Error Ticket scanner"
            ], 400);
        }
    }


      public function delete($id){

        $user = User::where('role', "3")->where('id',$id)->first();

        if($user){
            $user->delete();
            return Response::json(['message'=>'Ticket scanner deleted'],200);
        }else{
            return Response::json(['error'=>'Ticket scanner not found'],400);
        }

    }

}