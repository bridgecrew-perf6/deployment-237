<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Validator;
use App\Models\Event;
use Response;
use Illuminate\Support\Facades\File;
use App\Models\User;
use App\Models\Tag;
use App\Models\Booking;

class EventController extends Controller
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
                'language' => ['required'],
                'total_tickets' => ['required'],
                'category' => ['required'],
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
                $destinationPath = public_path('uploads/events/');
                $file->move($destinationPath, $name);
                // image 2 store

                if($request->hasFile('artist_image')){
                     $file2 = $request->file('artist_image');
                     $name2 = time().'artist.'.$file2->getClientOriginalExtension();
                     $name3 = 'uploads/events/'.$name2;
                     $file2->move($destinationPath, $name2);
                    }else{
                        $name3 = '';
                }

                $event = Event::create([
                    'vendor_id' => $request->vendor_id,
                    'title' => $request->title,
                    'address' => $request->address,
                    'date' => date('m/d/Y', strtotime($request->date)),
                    'exclusive' => $request->exclusive,
                    'language' =>  $request -> language?$request -> language:'',
                    'total_tickets' => $request -> total_tickets,
                    'category' => $request -> category,
                    'artist_facebook_link' =>  $request -> artist_facebook_link?$request -> artist_facebook_link:'',
                    'artist_twitter_link' => $request -> artist_twitter_link?$request -> artist_twitter_link:'',
                    'image' => 'uploads/events/'.$name,
                    'price' => $request->price,
                    'starting_time' => $request->starting_time,
                    'ending_time' => $request->ending_time,
                    'artist' => $request->artist?$request->artist:'',
                    'artist_image' => $name3?'uploads/events/'.$name3:'',
                    'about' => $request->about ,
                    'disclaimer' => $request->disclaimer ,
                    'event_key' => $request -> event_key,
                    'workspaceKey' => $request -> workspaceKey,
                    'terms' => $request->terms,
                    'secret_key' => $request -> secret_key
                ]);
                if(isset($request->event_tags)){
                    $tags = json_decode($request->event_tags);
                    foreach($tags as $tag){
                        $tagObj = Tag::firstOrCreate([
                            'name' => $tag
                        ]);
                        $tagId[]=$tagObj->id;
                    }
                    $event->tags()->sync($tagId);
                }
                return Response::json($event,200);
            }
        }

        // Get By Id
        elseif($request->isMethod('get') && $request->id != ""){
            $event = Event::find($request->id);
            $event -> total_tickets =  $this -> available_seat($event -> id);

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
               'terms' => ['required','min:10'],
                'event_key' => ['required'],
                'workspaceKey' => ['required'],
               'secret_key' => ['required'],
            );
            $validator = Validator::make($request->all(),$validated);
            if($validator->fails()){
                return Response::json($validator->errors(),400);
            }
            else{
                $event_present = Event::find($request->id);
                //Check if Blog Id Is present
                if($event_present != ""){
                // Check Has New Image
                if($request->hasFile('image') || $request->hasFile('artist_image')){
                    $destinationPath = public_path('uploads/events');
                    $name1 = "";
                    $name3 ="";
                    if($request->hasFile('image')){
                     // image 1 store
                     $file = $request->file('image');
                     $name = time().'.'.$file->getClientOriginalExtension();
                     $name1 = 'uploads/events/'.$name;
                     $file->move($destinationPath, $name);
                    }else{
                        $name1 = $old;
                    }

                    if($request->hasFile('artist_image')){
                      // image 2 store
                     $file2 = $request->file('artist_image');
                     $name2 = time().'artist.'.$file2->getClientOriginalExtension();
                     $name3 = 'uploads/events/'.$name2;
                     $file2->move($destinationPath, $name2);

                       $blog = Event::where('id',$request->id)
                            ->update([
                                'title' => $request->title,
                                'address' => $request->address,
                                'image' => $name1,
                                'date' => date('m/d/Y', strtotime($request->date)),
                                'exclusive' => $request->exclusive,
                                'language' =>  $request -> language?$request -> language:'',
                                'total_tickets' => $request -> total_tickets,
                                'category' => $request -> category,
                                'artist_facebook_link' =>  $request -> artist_facebook_link?$request -> artist_facebook_link:'',
                                'artist_twitter_link' => $request -> artist_twitter_link?$request -> artist_twitter_link:'',
                                'is_active' => $request->is_active,
                                // 'selling_price' => $request->price - $discount,
                                'price' => $request->price,
                                // 'discount' => $request->discount ? $request->discount : "0",
                                'starting_time' => $request->starting_time,
                                'ending_time' => $request->ending_time,
                                'artist' => $request->artist?$request->artist:'',
                                'artist_image' => $name3,
                                'tax' => @$request->tax ? : 0,
                                'cccharge' => @$request->cccharge ? : 0,
                                'about' => $request->about ,
                                'event_key' => $request -> event_key,
                                'workspaceKey' => $request -> workspaceKey,
                                'secret_key' => $request -> secret_key,
                                'disclaimer' => $request->disclaimer ,
                                'terms' => $request->terms

                            ]);
                            $event = Event::where('id',$request->id)->first();
                            if(isset($request->event_tags)){
                                $tags = json_decode($request->event_tags);
                                foreach($tags as $tag){
                                    $tagObj = Tag::firstOrCreate([
                                        'name' => $tag
                                    ]);
                                    $tagId[]=$tagObj->id;
                                }
                                $event->tags()->sync($tagId);
                            }
                    return Response::json(['message'=>'data successfully updated'],200);

                    }else{
                          $blog = Event::where('id',$request->id)
                            ->update([
                                'title' => $request->title,
                                'address' => $request->address,
                                'image' => $name1,
                                'date' => date('m/d/Y', strtotime($request->date)),
                                'exclusive' => $request->exclusive,
                                'language' =>  $request -> language?$request -> language:'',
                                'total_tickets' => $request -> total_tickets,
                                'category' => $request -> category,
                                'artist_facebook_link' =>  $request -> artist_facebook_link?$request -> artist_facebook_link:'',
                                'artist_twitter_link' => $request -> artist_twitter_link?$request -> artist_twitter_link:'',
                                'is_active' => $request->is_active,
                                // 'selling_price' => $request->price - $discount,
                                'price' => $request->price,
                                'tax' => @$request->tax ? :0,
                                'cccharge' => @$request->cccharge ? : 0,
                                // 'discount' => $request->discount ? $request->discount : "0",
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
                            $event = Event::where('id',$request->id)->first();
                            if(isset($request->event_tags)){
                                $tags = json_decode($request->event_tags);
                                foreach($tags as $tag){
                                    $tagObj = Tag::firstOrCreate([
                                        'name' => $tag
                                    ]);
                                    $tagId[]=$tagObj->id;
                                }
                                $event->tags()->sync($tagId);
                            }
                    return Response::json(['message'=>'data successfully updated'],200);
                    }

                }
                else{
                    $blog = Event::where('id',$request->id)
                            ->update([
                                'title' => $request->title,
                                'address' => $request->address,
                                'date' => date('m/d/Y', strtotime($request->date)),
                                'exclusive' => $request->exclusive,
                                'language' =>  $request -> language,
                                'total_tickets' => $request -> total_tickets,
                                'category' => $request -> category,
                                'artist_facebook_link' =>  $request -> artist_facebook_link?$request -> artist_facebook_link:'',
                                'artist_twitter_link' => $request -> artist_twitter_link?$request -> artist_twitter_link:'',
                                'is_active' => $request->is_active,
                                'price' => $request->price,
                                'tax' => @$request->tax ? : 0,
                                'cccharge' => @$request->cccharge ? : 0,
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
                                $event = Event::where('id',$request->id)->first();
                                if(isset($request->event_tags)){
                                    $tags = json_decode($request->event_tags);
                                    foreach($tags as $tag){
                                        $tagObj = Tag::firstOrCreate([
                                            'name' => $tag
                                        ]);
                                        $tagId[]=$tagObj->id;
                                    }
                                    $event->tags()->sync($tagId);
                                }
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
            $event = Event::all();
            return Response::json($event,200);
        }
    }

    public function delete($id){
         // Delete a Record
       if($id != ""){
            $find_event = Event::find($id);
            if($find_event != ""){
                File::delete($find_event->image);
                File::delete($find_event->artist_image);
                $find_event->delete();
                return Response::json(['message'=> 'data deleted'],200);
            }
            else{
                return Response::json(['message'=> 'undefined event id'],404);
            }
        }
    }

    public function event_tags(){
        $tags = Tag::all()->pluck('name');
        return Response::json($tags,200);
    }

    public function events_by_vendor($id){
        $data = User::with('events')->where('id',$id)->where('role',"2")->get();
        return Response::json($data,200);
    }

    public function update_event_status(Request $request){
        if ($request->isMethod('post') && $request->id != "") {
            $event = Event::find($request->id);
            $event->is_active = $request->is_active;
            $event->save();
            return Response::json(['message'=> 'Event status Updated'], 200);
        }
    }

    public function available_seat($event_tbl_id){
        $data = Event::where('id',$event_tbl_id)->select('total_tickets')->first();
        $bookingData = Booking::where('event_id', $event_tbl_id)-> count();
        return $data ->total_tickets - $bookingData;
    }


    public function filter(Request $request){
        $data = [];
        $todayDate = date('m/d/Y', time());

        if($request->isMethod('get') && $request->upcoming == true){
            $data = Event::where('date', '>',  $todayDate)->where('is_active','1')->get();
        }else if($request->isMethod('get') && $request->exclusive == true){
            $data = Event::where('exclusive', 1)->where('is_active','1')->get();
        }else{
            $data = Event::where('date', '>=', $todayDate)->where('is_active','1')->get();
        }
        return Response::json($data,200);
    }

      public function event_offer(Request $request){
            $offerData = [];
            $todayDate = date('m/d/Y', time());
            $event = Event::where('date', '>=', $todayDate)->where('is_active','1')->get();
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
                        'workspaceKey' => $value -> workspaceKey,
                        'secret_key' => $value -> secret_key,
                        'starting_time' => $value -> starting_time,
                        'ending_time' => $value -> ending_time,
                    ];
                }
            }
            return Response::json($offerData, 200);
    }

}
