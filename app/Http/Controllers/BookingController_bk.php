<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Booking;
use App\Models\Movie;
use App\Models\Concert;
use App\Models\Event;
use App\Models\User;
use App\Models\Transaction;
use App\Models\Coupon;
use Illuminate\Support\Str;
use Response;
use Validator;
use DB;
use App\Models\Withdrawal;

class BookingController extends Controller
{
    public function store(Request $request){
        if($request->isMethod('post')){
        $data = $request->json()->all();
        $validated = array(
            'user_id' => 'required',
            'booking_type' => 'required',
            'item_id' => 'required',
            'item_quantity' => 'required',
            'item_discount' => 'required',
            'item_price' => 'required',
            'item_sell_price' => 'required',
            'package' => 'required'
        );
        $validator = Validator::make($data,$validated);
        if($validator->fails()){
            return Response::json($validator->errors(),400);
        }
        else{
            
            
            /* Call payment gateway */
                
                $url = "https://api-cert.payeezy.com/v1/transactions";
                $formData = [
                    'merchant_ref' => 'Astonishing-Sale',
                    'transaction_type' => 'authorize',
                    'method' => 'credit_card',
                    'amount' => 100,
                    'currency_code' => 'USD',
                    'credit_card' => [
                            "type"=> "visa",
                            "cardholder_name"=> "John Smith",
                            "card_number" => "4788250000028291",
                            "exp_date" => "1030",
                            "cvv" => "123"
                    ]
                ];
        
                $paymentdata = json_encode($formData);
                $curl = curl_init();
                curl_setopt($curl, CURLOPT_POST, 1);
                curl_setopt($curl, CURLOPT_POSTFIELDS, $paymentdata);
                curl_setopt($curl, CURLOPT_URL, $url);
                curl_setopt($curl, CURLOPT_HTTPHEADER, array(
                  'apikey: y6pWAJNyJyjGv66IsVuWnklkKUPFbb0a',
                  'Content-Type: application/json',
                  'token: fdoa-a480ce8951daa73262734cf102641994c1e55e7cdf4c02b6',
                  'Authorization: MTM2NDU0MmI5OGRlYjliMjZkYzU5OWE3YjgyNzJiOTBiNjk1MDU1ODZmNDMxMmZkZWNmNjYxMDY3NDE4ZmM5Yg==',
                ));
                curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
                curl_setopt($curl, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
                $result = curl_exec($curl);
                if(!$result){die("Connection Failure");}
                curl_close($curl);
                $result = json_decode($result);
                
           /* End Payment gateway */
            
            $user_find = User::find($data['user_id']);
            if($user_find != ""){
            $type = $data['booking_type'];
            $booking_data = [];
            $set_ticket_no = [];
            $set_ticket_slot = [];
            switch ($type) {
              case "Movie":
                $booking_data = Movie::find($data['item_id']);
                $ticket_no = Booking::where('booking_type',"Movie")->latest()->orderBy('id', 'desc')->first();
                if($ticket_no != ""){
                    $set_ticket_no = $ticket_no->ticket_no + 1;
                    if($booking_data->title == $ticket_no ->item_name){
                        $set_ticket_slot = $ticket_no->ticket_slot + 1;
                    }
                    else{
                        $set_ticket_slot = 1; 
                    }
                }else{
                    $set_ticket_no = 7425;
                    $set_ticket_slot = 1;
                }
                break;
              case "Concert":
                  $booking_data = Concert::find($data['item_id']);
                   $ticket_no = Booking::where('booking_type',"Concert")->latest()->orderBy('id', 'desc')->first();
                if($ticket_no != ""){
                    $set_ticket_no = $ticket_no->ticket_no +1;
                    if($booking_data->title == $ticket_no ->item_name){
                        $set_ticket_slot = $ticket_no->ticket_slot;
                    }
                    else{
                        $set_ticket_slot = 1; 
                    }
                }else{
                    $set_ticket_no = 456251;
                    $set_ticket_slot = 1;
                }
                break;
              case "Event":
                  $booking_data = Event::find($data['item_id']);
                   $ticket_no = Booking::where('booking_type',"Event")->orderBy('id', 'desc')->first();
                if($ticket_no != ""){
                    $set_ticket_no = $ticket_no->ticket_no;
                   if($booking_data->title == $ticket_no ->item_name){
                        $set_ticket_slot = $ticket_no->ticket_slot;
                    }
                    else{
                        $set_ticket_slot = 1; 
                    }
                }else{
                    $set_ticket_no = 65811;
                    $set_ticket_slot = 1;
                }
                break;
              default:
               return Response::json(['message' => "Not a valid booking type"],400);
            }
            
          
            $bookingId = 'MYTICKET'.date('Y', time()).substr(time(), -3);
            $uniqid = Str::random(9);
            $bookingID = [];
            
            if($data['coupon'] != ''){
            $couponDetails = Coupon::where('coupon_code', $data['coupon']) -> first();
            $couponAmount =  $couponDetails -> discount_amount;
            }else{
            $couponAmount = 0.00;    
            }
            
          
            if(!empty($booking_data)){
               for ($x = 0; $x <= $data['item_quantity'] - 1; $x++) {
                $bookingID[] = $bookingId.$x;
            //     $data = [
            //             'booking_id' => $bookingId.$x,
            //             'user_id' => $data['user_id'],
            //             'u_id' => $uniqid,
            //             'vendor_id' => $booking_data['vendor_id'],
            //             'booking_type' => $data['booking_type'],
            //             'item_name' => $booking_data['title'],
            //             'address' => $booking_data['address'],
            //             'item_quantity' => 1,
            //             'coupon' => $data['coupon']?$data['coupon']:'',
            //             'booking_status'=> $result -> transaction_status == 'approved'?1:0,
            //             'event_id' => $booking_data -> id,
            //             'amount' => $data['item_price'],
            //             'discount' => $data['item_discount'],
            //             'package' => $data['package'],
            //             'ticket_no' => $set_ticket_no,
            //             'ticket_slot' => $data['ticket_slot'],
            //         ];
            //         return Response::json(['message' => ],400);
            // die;
                    $booking = Booking::create([
                        'booking_id' => $bookingId.$x,
                        'user_id' => $data['user_id'],
                        'u_id' => $uniqid,
                        'vendor_id' => $booking_data['vendor_id'],
                        'booking_type' => $data['booking_type'],
                        'item_name' => $booking_data['title'],
                        'address' => $booking_data['address'],
                        'item_quantity' => 1,
                        'coupon' => $data['coupon']?$data['coupon']:'',
                        'booking_status'=> $result -> transaction_status == 'approved'?1:0,
                        'event_id' => $booking_data -> id,
                        'amount' => $data['item_price'],
                        'discount' => $data['item_discount'],
                        'package' => $data['package'],
                        'ticket_no' => $set_ticket_no,
                        'ticket_slot' => $data['ticket_slot'],
                    ]);
                }
                
                
            $total_amount = $data['item_price'] * $data['item_quantity'];
            $total_discount = $total_amount * $data['item_discount'] / 100;
            Transaction::create([
                'booking_id' => json_encode($bookingID),
                'u_id' => $uniqid,
                'payment_status'=> $result -> transaction_status == 'approved'?1:0,
                'transaction_id' => $result -> transaction_status == 'approved'?$result -> transaction_id:'',
                'payment_mode'=> $result -> transaction_status == 'approved'?'Online':'',
                'total_amount' =>$total_amount,
                'total_discount' => $total_discount,
                'coupon_amount' => $couponAmount,
                'payable_amount' =>$total_amount - $total_discount - $couponAmount
            ]);
            return Response::json($bookingID,200);
            }
            else{
                 return Response::json(['message'=>'unable to find items with given id'],200);
            }
        }else{
            return Response::json(['message'=>'user not found'],404);
        }
        }
    }
    if($request->isMethod('get')){
        $data = Booking::with('user','vendor')->get();
        return Response::json($data,200);
    }
 }

     public function booking_by_user($id){
        //$data = User::with('user_bookings')->where('id',$id)->where('role',"1")->get();
        $data = DB::table('bookings')
                ->join('users','users.id','=','bookings.user_id')
                ->join('transactions','transactions.u_id', '=','bookings.u_id')
                ->select('transactions.payment_status as payment_status','bookings.*', DB::raw("CONCAT(bookings.package,'-',bookings.ticket_no,'-',bookings.ticket_slot) AS TICKET_ID"))
                ->where('bookings.user_id',$id)
                ->get();
        return Response::json($data,200);
     }

     public function booking_by_vendor($id){
        $dataArray = [];
        $data = DB::table('bookings')
            ->join('users AS A', 'A.id', '=', 'bookings.vendor_id')
            ->join('users AS B', 'B.id', '=', 'bookings.user_id')
            ->select('bookings.*','A.first_name as vendor_fast_name','A.last_name as vendor_last_name','B.first_name as user_first_name','B.last_name as user_last_name')
            ->where('A.id',$id)
            ->get();
            
        foreach($data as $val){
         
            $transactiondetails = Transaction::where('u_id', $val -> u_id) -> first();

            $dataArray[] = (object)[
                        'id' => $val -> id,
                        'booking_id' => $val -> booking_id,
                        'vendor_id' => $val -> vendor_id,
                        'event_id' => $val -> event_id,
                        'user_id' => $val -> user_id,
                        'u_id' => $val -> u_id,
                        'coupon' => $val -> coupon,
                        'booking_type' => $val -> booking_type,
                        'item_name' => $val -> item_name,
                        'item_quantity' => $val -> item_quantity,
                        'amount' => $transactiondetails -> payable_amount,
                        'discount' => $transactiondetails -> coupon_amount + $transactiondetails ->total_discount,
                        'package' => $val -> package,
                        'ticket_no' => $val -> ticket_no,
                        'ticket_slot' => $val -> ticket_slot,
                        'address' => $val -> address,
                        'booking_status' => $transactiondetails -> payment_status,
                        'created_at' => $val -> created_at,
                        'updated_at' => $val -> updated_at,
                        'vendor_fast_name' => $val -> vendor_fast_name,
                        'vendor_last_name' => $val -> vendor_last_name,
                        'user_first_name' => $val -> user_first_name,
                        'user_last_name' => $val -> user_last_name,
                ];
        }   
        
        
        return Response::json($dataArray,200);
     }

     public function delete($id){
          if($id != ""){
            $find_movie = Booking::find($id);
            if($find_movie != ""){
                $find_movie->delete();
                return Response::json(['message'=> 'data deleted'],200);
            }
            else{
                return Response::json(['message'=> 'undefined booking id'],404);
            }
        }
     }

     public function success_payment(Request $request){
        $data = $request->json()->all();
        $validated = array(
            'booking_id' => ['required'],
            'transaction_id' => ['required','min:4'],
            'payment_mode' => ['required','min:4']
        );
        $validator = Validator::make($data,$validated);
        if($validator->fails()){
            return Response::json($validator->errors(),400);
        }
        else{
            $check_booking = Transaction::where('booking_id',$data['booking_id'])->first();
            if($check_booking != ""){
            $tranc = Transaction::where('booking_id',$data['booking_id'])
                    ->update([
                        'payment_status' => true,
                        'transaction_id' => $data['transaction_id'],
                        'payment_mode' => $data['payment_mode']
                    ]);
                return Response::json(['message'=>'data updated'],200);
            }
            else{
                return Response::json(['message'=>'no transaction found with this id'],402);
            }
        }
     }

     public function earnings_by_vendor($id){
        $total_erning = DB::table('bookings')
                ->join('transactions','transactions.u_id' ,'=' ,'bookings.u_id')
                ->join('users','users.id', '=' ,'bookings.vendor_id')
                ->where('transactions.payment_status',true)
                ->where('bookings.vendor_id',$id)
                ->get(['payable_amount','commission']);
                
        $total_withdrawl = Withdrawal::where('payment_status',1)->where('vendor_id',$id)->get();
        $withdrawl = 0;
        
        foreach($total_withdrawl as $wid){
            $withdrawl += $wid->amount;
        }
        $ernings = 0;
        
        foreach($total_erning as $amount){
            $ernings += $amount->payable_amount;
        }
        
        
        $commission = $ernings * $amount->commission/100;
        
        
        return Response::json(['earning_amount' => $ernings, 'withdrawl_amount' => number_format($withdrawl,2), 'commission' => $commission, 'commission_percentage' => $amount->commission, 'wallet_balance' => $ernings - ($commission + $withdrawl)],200);
     }
     
     

     public function withdrawl_store(Request $request){
        $data = $request->json()->all();
        $validated = array(
            'vendor_id' => ['required'],
            'amount' => ['required'],
        );
        $validator = Validator::make($data,$validated);
        if($validator->fails()){
            return Response::json($validator->errors(),400);
        }
        else{
            $vendor = User::where('role',"2")->where('is_active',1)->where('id',$data['vendor_id'])->get();
            //echo $vendor;
            if(count($vendor) > 0 ){
                $ernings = $this->earnings_by_vendor($request->vendor_id);
                if($ernings->wallet_balance == 0){
                   return Response::json(['message'=>'no blance in your wallet'],200);
                }elseif($data['amount'] >= $ernings->wallet_balance){
                    return Response::json(['message'=>'please choose a less amount'],200);
                }else{
            $data = Withdrawal::create([
                'vendor_id' => $data['vendor_id'],
                'amount' => $data['amount']
            ]);
            return Response::json($data,200);
             }
         }
        else{
            return Response::json(['message'=>'vendor not found with this id'],400);
       }
     }
     }  
     
     
     public function booking_history(Request $request){
         
         if($request -> method() == 'POST'){
             $bookingHistory = Booking::select(['booking_id', 'booking_type', 'item_name', 'amount', 'discount', 'ticket_no', 'ticket_slot'])
                                ->join('users', 'users.id', '=', 'bookings.user_id');
                                
             if($request -> input('city_name') != ''){
             $bookingHistory = $bookingHistory -> where('users.city_name', $request -> input('city_name'));
                                
             }
             if($request -> input('event_id') != '' && $request -> input('booking_type') != '' ){
                   $bookingHistory = $bookingHistory -> where('bookings.booking_type', $request -> input('booking_type'))->where('bookings.event_id', $request -> input('event_id'));
             }
             
             $result = $bookingHistory -> get();
            
            
             return Response::json(['data' => $result],200);
         }else{
             return Response::json(['message'=>'Unknown method'],400);
         }
         
     }
     
        public function paid_withdrawl_history(Request $request){
         if($request -> method() == 'POST'){
             $withdrawDetails = Withdrawal::where('id', $request ->input('withdraw_id') ) -> first();

              $total_erning = DB::table('bookings')
                ->join('transactions','transactions.u_id' ,'=' ,'bookings.u_id')
                ->join('users','users.id', '=' ,'bookings.vendor_id')
                ->where('transactions.payment_status',true)
                ->where('bookings.vendor_id', $withdrawDetails -> vendor_id)
                ->get(['payable_amount','commission']);
                
                $total_withdrawl = Withdrawal::where('payment_status',1)->where('vendor_id', $withdrawDetails -> vendor_id)->get();
                $withdrawl = 0;
                
                foreach($total_withdrawl as $wid){
                    $withdrawl += $wid->amount;
                }
                $ernings = 0;
                
                foreach($total_erning as $amount){
                    $ernings += $amount->payable_amount;
                }
                
                
                $commission = $ernings * $amount->commission/100;
                
                
               $wallet_ballance = $ernings - ($commission + $withdrawl);
               
               if($wallet_ballance >=  $withdrawDetails -> amount){
                   
                   $walletUpdate = Withdrawal::find($request -> input('withdraw_id'));
                   
                   $walletUpdate -> fill([
                       
                                'payment_status' => 1,
                                'transaction_id' => $request -> input('transaction_id'),
                                'payment_mode' => $request -> input('payment_mode'),
                                'payment_date' => date('Y-m-d H:i:s', time())
                       ]);
                       
                       if($walletUpdate -> save()){
                            return Response::json(['message'=>'data updated'],200);
                       }else{
                           return Response::json(['message'=>'data updated error'],200); 
                       }
                   
                   
               }else{
                   return Response::json(['message'=>'Wallet balance is insufficient'],200);
               }
            
             
         }else{
             return Response::json(['message'=>'Unknown method'],400);
         }
     }
     
     
     public function update_booking_status(Request $request){
         if($request -> method() == 'POST'){
             
             $bookingStatus = Booking::where('booking_id', $request -> input('booking_id')) -> first();
             
             if($bookingStatus -> booking_status == 0){
                 $booking  = Booking::find($bookingStatus -> id);
                 
                 
                 $booking -> fill([
                        'booking_status' => 1
                     ]);
                     
                $booking -> save();
                
                
                return Response::json(['message'=>'Vaild Ticket'],200);
                 
             }elseif($bookingStatus -> booking_status == 1){
                 return Response::json(['message'=>'Already entry'],200);
             }else{
                 return Response::json(['message'=>'Invalid Ticket'],200);
             }
             
         }else{
             return Response::json(['message'=>'Unknown method'],400);
         }
         
     }
}
