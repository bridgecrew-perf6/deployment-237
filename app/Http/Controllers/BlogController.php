<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Response;
use Validator;
use App\Models\Blog;
use Illuminate\Support\Facades\File;

class BlogController extends Controller
{
    public function index(Request $request){

        //Store Fresh Data
        if($request->isMethod('post') && $request->id == ""){
            $validated = array(
                'title' => ['required','min:5'],
                'description' => ['required','min:20'],
                'image' => ['required','image']
            );
            $validator = Validator::make($request->all(),$validated);
            if($validator->fails()){
                return Response::json($validator->errors(),400);
            }
            else{
                $file = $request->file('image');
                $name = time().'.'.$file->getClientOriginalExtension();
                $destinationPath = public_path('uploads/blogs/');
                $file->move($destinationPath, $name);
                $blog = Blog::create([
                    'title' => $request->title,
                    'description' => $request->description,
                    'image' => 'uploads/blogs/'.$name
                ]);
                return Response::json($blog,200);
            }
        }

        // Get By Id
        elseif($request->isMethod('get') && $request->id != ""){
            $blog = Blog::find($request->id);
            if($blog != ""){
                return Response::json($blog,200);
            }
            else{
                return Response::json(['message'=>'undefined blog id'],404);
            }
        }

        // Update By Id
        elseif($request->isMethod('post') && $request->id != ""){
            $old = $request->old_image;
            $validated = array(
               'id' => ['required'],
               'title' => ['min:5','required'],
               'description' => ['min:20','required'],
               'image' => ['image'],
               'is_active' => ['required'],
               'old_image' => ['required']
            );
            $validator = Validator::make($request->all(),$validated);
            if($validator->fails()){
                return Response::json($validator->errors(),400);
            }
            else{
                $blog_present = Blog::find($request->id);

                //Check if Blog Id Is present
                if($blog_present != ""){

                // Check Has New Image
                if($request->hasFile('image')){
                     File::delete($old);
                     $file = $request->file('image');
                     $name = time().'.'.$file->getClientOriginalExtension();
                     $destinationPath = public_path('uploads/blogs');
                     $file->move($destinationPath, $name);
                     $blog = Blog::where('id',$request->id)
                            ->update([
                                'title' => $request->title,
                                'description' => $request->description,
                                'image' => 'uploads/blogs/'.$name,
                                'is_active' => $request->is_active
                            ]);
                    return Response::json(['message'=>'data successfully updated'],200);
                }
                else{
                    $blog = Blog::where('id',$request->id)
                            ->update([
                                'title' => $request->title,
                                'description' => $request->description,
                                'image' => $old,
                                'is_active' => $request->is_active
                            ]);
                    return Response::json(['message'=>'data successfully updated'],200);
                }
              }
              else{
                return Response::json(['message'=> 'undefined blog id'],404);
              }
            }
        }

        // Get All data
        else{
            $blog = Blog::all();
            return Response::json($blog,200);
        }
    }

    public function delete($id){
         // Delete a Record
       if($id != ""){
            $find_blog = Blog::find($id);
            if($find_blog != ""){
                File::delete($find_blog->image);
                $find_blog->delete();
                return Response::json(['message'=> 'data deleted'],200);
            }
            else{
                return Response::json(['message'=> 'undefined blog id'],404);
            }
        }
    }
}
