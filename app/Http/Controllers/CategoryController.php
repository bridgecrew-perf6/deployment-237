<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use Validator;
use App\Models\Category;
use Response;

class CategoryController extends Controller
{
    public function index(Request $request){
     
        if($request->isMethod('post') && $request->id == ""){
            $validated = array(
                'name' => ['required']
            );
            $validator = Validator::make($request->all(),$validated);
            if($validator->fails()){
                return Response::json($validator->errors(),400);
            }
            else{
              
                $Category = Category::create([
                    'name' => $request->name
                ]);
                return Response::json($Category,200);
            }
        }

        // Get By Id
        elseif($request->isMethod('get') && $request->id != ""){
            $Category = Category::find($request->id);
            if($Category != ""){
                return Response::json($Category,200);
            }
            else{
                return Response::json(['message'=>'undefined Category id'],404);
            }
        }

        // Update By Id
        elseif($request->isMethod('post') && $request->id != ""){
            $validated = array(
               'name' => ['required']
            );
            $validator = Validator::make($request->all(),$validated);
            if($validator->fails()){
                return Response::json($validator->errors(),400);
            }
            else{
                $Category_present = Category::find($request->id);
                //Check if Blog Id Is present
                if($Category_present != ""){             
                    $blog = Category::where('id',$request->id)
                            ->update([
                                'name' => $request->name,
                                ]);
                    return Response::json(['message'=>'data successfully updated'],200);                
              }
              else{
                return Response::json(['message'=> 'undefined Category id'],404);
              }
            }
        }

        // Get All data
        else{
            $Category = Category::get();
            return Response::json($Category,200);
        }
    }

    public function delete($id){
       if($id != ""){
            $find_Category = Category::find($id);
            if($find_Category != ""){
                $find_Category->delete();
                return Response::json(['message'=> 'data deleted'],200);
            }
            else{
                return Response::json(['message'=> 'undefined Category id'],404);
            }
        }
    }

    public function Categorys_by_vendor($id){
        $data = User::with('Categorys')->where('id',$id)->where('role',"2")->get();
        return Response::json($data,200);
    }

    public function filter(Request $request){
        $data = [];
        if($request->isMethod('get') && $request->upcoming == true){
            $data = Category::where('tag','upcoming')->where('is_active','1')->get();
        }
         if($request->isMethod('get') && $request->exclusive == true){
            $data = Category::where('tag','exclusive')->where('is_active','1')->get();
        }
        if($request->isMethod('get') && $request->now_showing == true){
            $data = Category::where('tag','nowShowing')->where('is_active','1')->get();
        }
        return Response::json($data,200);
    }
}
