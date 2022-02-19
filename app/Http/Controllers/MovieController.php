<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Validator;
use App\Models\Movie;
use App\Models\User;
use Response;
use Illuminate\Support\Facades\File;

class MovieController extends Controller
{
        public function index(Request $request){
        $discount = "";
        if($request->discount != ""){
            $discount =$request->price * ($request->discount / 100);
        }
        else{
            $discount = 0;
        }
        //Store Fresh Data
        if($request->isMethod('post') && $request->id == ""){
            $validated = array(
                'vendor_id' =>['required'],
                'title' => ['required','min:5'],
                'rating' => ['required','min:2'],
                'popularity' => ['required','min:2'],
                'image' => ['required','image'],
                'date' => ['required'],
                'tag' => ['required'],
                'price' => ['required','min:2'],
                'time' => ['required']
            );
            $validator = Validator::make($request->all(),$validated);
            if($validator->fails()){
                return Response::json($validator->errors(),400);
            }
            else{
                $file = $request->file('image');
                $name = time().'.'.$file->getClientOriginalExtension();
                $destinationPath = public_path('uploads/movies/');
                $file->move($destinationPath, $name);
                $movie = Movie::create([
                    'vendor_id' => $request->vendor_id,
                    'title' => $request->title,
                    'rating' => $request->rating,
                    'popularity' => $request->popularity,
                    'date' => $request->date,
                    'tag' => $request->tag,
                    'image' => 'uploads/movies/'.$name,
                    'price' => $request->price,
                    'selling_price' => $request->price - $discount,
                    'discount' => $request->discount ? $request->discount : "0",
                    'time' => $request->time

                ]);
                return Response::json($movie,200);
            }
        }

        // Get By Id
        elseif($request->isMethod('get') && $request->id != ""){
            $movie = Movie::find($request->id);
            if($movie != ""){
                return Response::json($movie,200);
            }
            else{
                return Response::json(['message'=>'undefined movie id'],404);
            }
        }

        // Update By Id
        elseif($request->isMethod('post') && $request->id != ""){
            $old = $request->old_image;
            $validated = array(
               'id' => ['required'],
               'title' => ['min:5','required'],
               'rating' => ['min:2','required'],
               'popularity' => ['required','min:2'],
               'image' => ['image'],
               'date' => ['required'],
               'tag' => ['required'],
               'old_image' => ['required'],
               'is_active' => ['required'],
               'price' => ['required','min:2'],
               'time' => ['required']
            );
            $validator = Validator::make($request->all(),$validated);
            if($validator->fails()){
                return Response::json($validator->errors(),400);
            }
            else{
                $movie_present = Movie::find($request->id);

                //Check if Blog Id Is present
                if($movie_present != ""){

                // Check Has New Image
                if($request->hasFile('image')){
                     File::delete($old);
                     $file = $request->file('image');
                     $name = time().'.'.$file->getClientOriginalExtension();
                     $destinationPath = public_path('uploads/movies');
                     $file->move($destinationPath, $name);
                     $movie = Movie::where('id',$request->id)
                            ->update([
                                'title' => $request->title,
                                'rating' => $request->rating,
                                'popularity' => $request->popularity,
                                'image' => 'uploads/movies/'.$name,
                                'date' => $request->date,
                                'tag' => $request->tag,
                                'selling_price' => $request->price - $discount,
                                'is_active' => $request->is_active,
                                'price' => $request->price,
                                'discount' => $request->discount ? $request->discount : "0",
                                'time' => $request->time

                            ]);
                    return Response::json(['message'=>'data successfully updated'],200);
                }
                else{
                    $movie = Movie::where('id',$request->id)
                            ->update([
                                'title' => $request->title,
                                'rating' => $request->rating,
                                'popularity' => $request->popularity,
                                'image' => $old,
                                'date' => $request->date,
                                'tag' => $request->tag,
                                'selling_price' => $request->price - $discount,
                                'is_active' => $request->is_active,
                                'price' => $request->price,
                                'discount' => $request->discount ? $request->discount : "0",
                                'time' => $request->time
                            ]);
                    return Response::json(['message'=>'data successfully updated'],200);
                }
              }
              else{
                return Response::json(['message'=> 'undefined movie id'],404);
              }
            }
        }

        // Get All data
        else{
            $movie = Movie::where('is_active',1)->get();
            return Response::json($movie,200);
        }
    }

    public function delete($id){
         // Delete a Record
       if($id != ""){
            $find_movie = Movie::find($id);
            if($find_movie != ""){
                File::delete($find_movie->image);
                $find_movie->delete();
                return Response::json(['message'=> 'data deleted'],200);
            }
            else{
                return Response::json(['message'=> 'undefined movie id'],404);
            }
        }
    }

     public function movies_by_vendor($id){
        $data = User::with('movies')->where('id',$id)->where('role',"2")->get();
        return Response::json($data,200);
    }
}
