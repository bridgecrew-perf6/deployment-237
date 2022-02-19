<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Validator;
use App\Models\Coupon;
use Response;
use App\Models\Event;
use App\Models\Concert;

class CouponController extends Controller
{
    public function index(Request $request){
     
        if($request->isMethod('post') && $request->id == ""){
            $validated = array(
                'type_id' => ['required'],
                'event_id' => ['required'],
                'coupon_code' => ['required'],
                'expiry_date' => ['required'],
                'discount_amount' => ['required']
            );
            $validator = Validator::make($request->all(),$validated);
            if($validator->fails()){
                return Response::json($validator->errors(),400);
            }
            else{               
                
                $event = Coupon::create([
                    'type_id' => $request->type_id,
                    'event_id' => $request->event_id,
                    'coupon_code' => $request->coupon_code,
                    'discount_amount' => $request -> discount_amount,
                    'vendor_id' => $request -> vendor_id,
                    'expiry_date' => date('Y-m-d', strtotime($request->expiry_date)),
                ]);
                return Response::json($event,200);
            }
        }

        // Get By Id
        elseif($request->isMethod('get') && $request->id != ""){
            $event = Coupon::find($request->id);
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
          
            $validated = array(
                'type_id' => ['required'],
                'event_id' => ['required'],
                'coupon_code' => ['required'],
                'expiry_date' => ['required']
            );
            $validator = Validator::make($request->all(),$validated);
            if($validator->fails()){
                return Response::json($validator->errors(),400);
            }
            else{
                $event_present = Coupon::find($request->id);
                //Check if Blog Id Is present
                if($event_present != ""){              

                   
                    $blog = Coupon::where('id',$request->id)
                                    ->update([
                                        'type_id' => $request->type_id,
                                        'event_id' => $request->event_id,
                                        'coupon_code' => $request->coupon_code,
                                        'vendor_id' => $request -> vendor_id,
                                        'discount_amount' => $request->discount_amount,
                                        'expiry_date' => date('Y-m-d', strtotime($request->expiry_date)),
                                    ]);
                    return Response::json(['message'=>'data successfully updated'],200);
                
              }
              else{
                return Response::json(['message'=> 'undefined coupon id'],404);
              }
            }
        }

        // Get All data
        else{
            $couponData = [];
            $coupon = Coupon::query();
            $headers = request()->headers->all();
            if(isset($headers['authorization'])) {
                $coupon = $coupon->where('event_id',$headers['authorization']);
            }
            $coupon = $coupon->get();
            foreach($coupon as $coupon_val){
                if($coupon_val -> type_id == 1){
                    $eventData = Event::where('id', $coupon_val -> event_id) -> first();
                    if($eventData)
                    {
                        $couponData[] = (object)[
                            'id' => $coupon_val ->id,
                            'e_id' => $eventData -> id,
                            'type_id' => $coupon_val -> type_id == 1?'Event':'Concert',
                            'event_id' => $eventData -> title,
                            'discount_amount' => $coupon_val -> discount_amount,
                            'coupon_code' => $coupon_val -> coupon_code,
                            'expiry_date' => $coupon_val -> expiry_date
                        ];  
                    }
                }else{
                    $eventData = Concert::where('id', $coupon_val -> event_id) -> first();
                    if($eventData)
                    {
                        $couponData[] = (object)[
                            'id' => $coupon_val ->id,
                            'type_id' => $coupon_val -> type_id == 1?'Event':'Concert',
                            'e_id' => $eventData -> id,
                            'event_id' => $eventData -> title,
                            'discount_amount' => $coupon_val -> discount_amount,
                            'coupon_code' => $coupon_val -> coupon_code,
                            'expiry_date' => $coupon_val -> expiry_date
                        ]; 
                    }
                }
            }
            $objectData = $couponData;
            return Response::json($objectData,200);
        }
    }
    
     public function delete($id){
      if($id != ""){
           $find_event = Coupon::find($id);
           if($find_event != ""){
               $find_event->delete();
               return Response::json(['message'=> 'data deleted'],200);
           }
           else{
               return Response::json(['message'=> 'undefined event id'],404);
           }
       }
   }
   
      public function valid_coupon(Request $request, $coupon_code, $event_id){
        if($request -> method() == 'GET'){
            $today = date('Y-m-d', time());
            $couponCode = $coupon_code;
            $eventId = $event_id;
            $coupon = Coupon::where('expiry_date', '>=', $today) -> where(['coupon_code'=> $couponCode, 'event_id' => $eventId]) -> first();
           
            if($coupon != ''){
                return Response::json(['data'=> $coupon],200);
            }else{
                return Response::json(['message'=> 'Invaild Coupon Code'],404);
            }
        }
   }
}
