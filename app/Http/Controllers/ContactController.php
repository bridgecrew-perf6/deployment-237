<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Response;
use Validator;
use App\Models\Contact;

class ContactController extends Controller
{
    public function store(Request $request){
        if($request->isMethod('post')){
        $data = $request->json()->all();
        $validated = array(
            'name' => ['required','min:2'],
            'email' =>['required','min:5','email'],
            'number' => ['required','digits:10'],
            'message' =>['required','min:10']
        );

        $validator = Validator::make($data,$validated);
        if($validator->fails()){
            return Response::json($validator->errors(),400);
        }
        else{
            $contact = Contact::create([
                'name' => $data['name'],
                'email' => $data['email'],
                'number' => $data['number'],
                'message' => $data['message']
            ]);
            return Response::json($contact,200);
        }
    }
        elseif($request->isMethod('get') && $request->id != "")
        {
            $data = Contact::find($request->id);
            if($data != ""){
            return Response::json($data,200);
        }
    else
        {
            return Response::json(['message'=>"undefined contact id"],404);
        }
    }
    else{
        $data = Contact::all();
        return Response::json($data,200);
    }
    
}
}
