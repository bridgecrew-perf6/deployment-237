<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Validator;
use App\Models\Concert;
use Response;
use Illuminate\Support\Facades\File;
use App\Models\User;

class ConcertController extends Controller
{
    public function index(Request $request){
    
        if($request->isMethod('post') && $request->id == ""){
            $validated = array(
                'vendor_id' => ['required'],
                'title' => ['required'],
                'address' => ['required'],
                'image' => ['required','image'],
                'date' => ['required'],
                'exclusive' => ['required'],
                'price' => ['required','min:2'],
                'about' => ['required','min:10'],
                'disclaimer' => ['required','min:10'],
                'terms' => ['required','min:10'],
                'event_key' => ['required'],
                'workspaceKey' => ['required'],
                'secret_key' => ['required']
            );
            $validator = Validator::make($request->all(),$validated);
            if($validator->fails()){
                return Response::json($validator->errors(),400);
            }
            else{
                // image 1 store
                $file = $request->file('image');
                $name = time().'.'.$file->getClientOriginalExtension();
                $destinationPath = public_path('uploads/concerts/');
                $file->move($destinationPath, $name);
                
                   if($request->hasFile('artist_image')){
                     $file2 = $request->file('artist_image');
                     $name2 = time().'artist.'.$file2->getClientOriginalExtension();
                     $name3 = 'uploads/concerts/'.$name2;
                     $file2->move($destinationPath, $name2);
                    }else{
                        $name3 = '';
                    }
                    
                
                $event = Concert::create([
                    'vendor_id' => $request->vendor_id,
                    'title' => $request->title,
                    'address' => $request->address,
                    'date' => $request->date,
                    'exclusive' => $request->exclusive,
                    'language' =>  $request -> language,
                    'total_tickets' => $request -> total_tickets,
                    'category' => $request -> category,
                    'artist_facebook_link' =>  $request -> artist_facebook_link?$request -> artist_facebook_link:'',
                    'artist_twitter_link' => $request -> artist_twitter_link?$request -> artist_twitter_link:'',
                    'image' => 'uploads/concerts/'.$name,
                    'price' => $request->price,
                    'starting_time' => $request->starting_time,
                    'ending_time' => $request->ending_time,
                    'artist' => $request->artist?$request->artist:'',
                    'artist_image' => $name3?$name3:'',
                    'about' => $request->about ,
                    'disclaimer' => $request->disclaimer ,
                    'event_key' => $request -> event_key,
                    'workspaceKey' => $request -> workspaceKey,
                    'secret_key' => $request -> secret_key,
                    'terms' => $request->terms 
                ]);
                return Response::json($event,200);
            }
        }

        // Get By Id
        elseif($request->isMethod('get') && $request->id != ""){
            $event = Concert::find($request->id);
            if($event != ""){
                return Response::json($event,200);
            }
            else{
                return Response::json(['message'=>'undefined event id'],404);
            }
        }

        // Update By Id
        elseif($request->isMethod('post') && $request->id != ""){
            $old = $request->old_image;
            $old2 = $request->old_image2;
            $validated = array(
               'id' => ['required'],
               'is_active' => ['required'],
               'title' => ['required'],
               'address' => ['required'],
               'image' => ['image'],
               'date' => ['required'],
               'exclusive' => ['required'],
               'old_image' => ['required'],
               'is_active' =>['required'],
               'price' => ['required','min:2'],
               'about' => ['required','min:10'],
               'disclaimer' => ['required','min:10'],
               'terms' => ['required','min:10']
            );
            $validator = Validator::make($request->all(),$validated);
            if($validator->fails()){
                return Response::json($validator->errors(),400);
            }
            else{
                $event_present = Concert::find($request->id);

                //Check if Blog Id Is present
                if($event_present != ""){

                // Check Has New Image
                if($request->hasFile('image') || $request->hasFile('artist_image')){
                     $destinationPath = public_path('uploads/concerts');
                      $name1 = "";
                      $name3 ="";
                    if($request->hasFile('image')){
                     File::delete($old);
                     $file = $request->file('image');
                     $name = time().'.'.$file->getClientOriginalExtension();
                     $name1 = 'uploads/concerts/'.$name;
                     $file->move($destinationPath, $name);
                        }else{
                             $name1 = $old;
                        }
                    if($request->hasFile('artist_image')){
                     $file2 = $request->file('artist_image');
                     $name2 = time().'artist.'.$file2->getClientOriginalExtension();
                     $name3 = 'uploads/concerts/'.$name2;
                     $file2->move($destinationPath, $name2);
                     
                      $blog = Concert::where('id',$request->id)
                            ->update([
                                'title' => $request->title,
                                'address' => $request->address,
                                'image' => $name1,
                                'date' => $request->date,
                                'exclusive' => $request->exclusive,
                                'language' =>  $request -> language,
                                'total_tickets' => $request -> total_tickets,
                                'category' => $request -> category,
                                'artist_facebook_link' =>  $request -> artist_facebook_link?$request -> artist_facebook_link:'',
                                'artist_twitter_link' => $request -> artist_twitter_link?$request -> artist_twitter_link:'',
                                'is_active' => $request->is_active,
                                'tax' => 0,
                                'price' => $request->price,
                                'is_active' => $request->is_active,
                                'starting_time' => $request->starting_time,
                                'ending_time' => $request->ending_time,
                                'artist' => $request->artist?$request->artist:'',
                                'artist_image' => $name3,
                                'about' => $request->about ,
                                'disclaimer' => $request->disclaimer ,
                                'event_key' => $request -> event_key,
                                'workspaceKey' => $request -> workspaceKey,
                                'secret_key' => $request -> secret_key,
                                'terms' => $request->terms

                            ]);
                    }else{
                         $blog = Concert::where('id',$request->id)
                            ->update([
                                'title' => $request->title,
                                'address' => $request->address,
                                'image' => $name1,
                                'date' => $request->date,
                                'exclusive' => $request->exclusive,
                                'language' =>  $request -> language,
                                'total_tickets' => $request -> total_tickets,
                                'category' => $request -> category,
                                'artist_facebook_link' =>  $request -> artist_facebook_link?$request -> artist_facebook_link:'',
                                'artist_twitter_link' => $request -> artist_twitter_link?$request -> artist_twitter_link:'',
                                'is_active' => $request->is_active,
                                'price' => $request->price,
                                'tax' => 0,
                                'is_active' => $request->is_active,
                                'starting_time' => $request->starting_time,
                                'ending_time' => $request->ending_time,
                                'artist' => $request->artist?$request->artist:'',
                                'about' => $request->about ,
                                'disclaimer' => $request->disclaimer ,
                                'event_key' => $request -> event_key,
                                'workspaceKey' => $request -> workspaceKey,
                                'secret_key' => $request -> secret_key,
                                'terms' => $request->terms

                            ]);
                    }
                    
                    return Response::json(['message'=>'data successfully updated'],200);
                }
                else{
                    $blog = Concert::where('id',$request->id)
                            ->update([
                                'title' => $request->title,
                                'address' => $request->address,
                                'date' => $request->date,
                                'exclusive' => $request->exclusive,
                                'language' =>  $request -> language,
                                'total_tickets' => $request -> total_tickets,
                                'category' => $request -> category,
                                'artist_facebook_link' =>  $request -> artist_facebook_link?$request -> artist_facebook_link:'',
                                'artist_twitter_link' => $request -> artist_twitter_link?$request -> artist_twitter_link:'',
                                'is_active' => $request->is_active,
                                'price' => $request->price,
                                'tax' => @$request->tax,
                                'is_active' => $request->is_active,
                                'starting_time' => $request->starting_time,
                                'ending_time' => $request->ending_time,
                                'artist' => $request->artist?$request->artist:'',
                                'about' => $request->about ,
                                'disclaimer' => $request->disclaimer ,
                                'event_key' => $request -> event_key,
                                'workspaceKey' => $request -> workspaceKey,
                                'secret_key' => $request -> secret_key,
                                'terms' => $request->terms 
                            ]);
                    return Response::json(['message'=>'data successfully updated'],200);
                }
              }
              else{
                return Response::json(['message'=> 'undefined event id'],404);
              }
            }
        }

        // Get All data
        else{
            $event = Concert::where('is_active',1)->get();
            return Response::json($event,200);
        }
    }

    public function delete($id){
         // Delete a Record
       if($id != ""){
            $find_concert = Concert::find($id);
            if($find_concert != ""){
                File::delete($find_concert->image);
                $find_concert->delete();
                return Response::json(['message'=> 'data deleted'],200);
            }
            else{
                return Response::json(['message'=> 'undefined event id'],404);
            }
        }
    }

    public function concerts_by_vendor($id){
        $data = User::with('concert')->where('id',$id)->where('role',"2")->get();
        return Response::json($data,200);
    }

    public function filter(Request $request){
        $data = [];
        $todayDate = date('m/d/Y', time());
        if($request->isMethod('get') && $request->upcoming == true){
            $data = Concert::where('date', '>',  $todayDate)->where('is_active','1')->get();
        }else if($request->isMethod('get') && $request->exclusive == true){
            $data = Concert::where('exclusive', 1)->where('is_active','1')->get();
        }else{
            $data = Concert::where('date', '>=', $todayDate)->where('is_active','1')->get();
        }
        return Response::json($data,200);
    }
    
    public function concert_offer(Request $request){
            $offerData = [];
            $todayDate = date('m/d/Y', time());
            $event = Concert::where('date', '>=', $todayDate)->where('is_active','1')->get();
            foreach($event as $value){
             $priceDetails = json_decode($value -> price);
                if($priceDetails[0] -> discount > 0){
                    $offerData[] = (object) [
                        'id' => $value -> id,
                        'vendor_id' => $value -> vendor_id,
                        'title' => $value -> title,
                        'image' => $value -> image,
                        'address' => $value -> address,
                        'date' => $value -> date,
                        'price' => $value -> price,
                        'event_key' => $value -> event_key,
                        'secret_key' => $value -> secret_key,
                        'workspaceKey' => $value -> workspaceKey,
                        'starting_time' => $value -> starting_time,
                        'ending_time' => $value -> ending_time,                        
                    ];
                }
            }
            return Response::json($offerData, 200);
    }
}
