<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Subscriber;
use Response;
use Validator;

class SubscriberController extends Controller
{
    public function index(Request $request){

        if($request->isMethod('post')){
            $validated = array(
                'email' => 'required | email | unique:subscribers'
            );

            $validator = Validator::make($request->all(),$validated);
            if($validator->fails()){
                return Response::json($validator->errors(),400);
            }
            else{
                $data = Subscriber::create([
                    'email' => $request->email
                ]);
                return Response::json($data,200);
            }
        }
        if($request->isMethod('get')){
            return Response::json(Subscriber::all(),200);
        }
    }
}
