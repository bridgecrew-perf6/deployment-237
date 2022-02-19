<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Booking;
use App\Models\Transaction;
use App\Models\Withdrawal;
use App\Models\Movie;
use App\Models\Concert;
use App\Models\Event;
use Response;
use Validator;
use App\Http\Controllers\BookingController;
use DB;

class VendorController extends Controller
{
        public function all_vendors(Request $request){
        $data = [];
        if($request->id != "" && $request->isMethod('get')){
            if($request->isMethod('get')){
                 $user = User::where('role', "2")->where('id',$request->id)->first();
                $data = Response::json($user,200);
            }
        }
        else{
            $data = User::where('role',"2")->get();
        }
        if($request->isMethod('post')){
            $input = $request->json()->all();
                $validated = array(
                    'user_id' => ['required'],
                    'first_name' => ['required','min:2' ,'string'],
                    'last_name' => ['required','min:2','string '],
                    'number' => ['required','digits:10'],
                    'city_name' => ['required'],
                    'email' => ['required','email'],
                    'commission' => ['required']
            );
                $validator = Validator::make($input,$validated);
                if($validator->fails()){
                    $data = Response::json($validator->errors(),400);
                }
                else{
                    $user_check = User::where('id',$request->user_id)->first();
                    if($user_check != ""){
                     $user = User::where('id',$request->user_id)
                            ->update([
                                 'first_name' => $input['first_name'] ,
                                 'last_name' => $input['last_name'],
                                 'number' => $input['number'],
                                 'city_name' => $input['city_name'],
                                 'street_address' => @$input['street_address'],
                                 'state' => @$input['state'],
                                 'zip' => @$input['zip'],
                                 'bank_name' => $input['bank_name'],
                                 'account_no' => $input['account_no'],
                                 'ifsc_code' => $input['ifsc_code'],
                                 'email' => $input['email'],
                                 'commission' => $input['commission'],
                                 'tax' => @$input['tax']?@$input['tax']:'0.00',
                                 'is_active' => $input['is_active']
                             ]);
                    $data = Response::json(['message'=>'Profile Updated'],200); 
                    }   
                    else{
                        $data = Response::json(['message'=>'Vendor Id Not found'],400);
                    }    
                }
            
        }
        return $data;
    }

    public function report($id){
        $headers = request()->headers->all();
        $find_vendor = User::where('role',"2")->where('id',$id)->get();
        if(count($find_vendor) > 0){
        $report = [];
        $ticket_quantity = 0;
        $revenue = 0;
        $booking = DB::table('bookings')->join('transactions','transactions.u_id', '=','bookings.u_id')->where('transactions.payment_status',true)->where('bookings.vendor_id',$id);
        if(isset($headers['authorization'])) {
            $booking = $booking->where('bookings.event_id',$headers['authorization']);
        }
        $booking = $booking->get();
        $movies = Movie::where('vendor_id',$id)->get();
        $concerts = Concert::where('vendor_id',$id)->get();
        $events = Event::where('vendor_id',$id)->get();
        
        foreach($booking as $book){
            $ticket_quantity += $book->item_quantity;
            $revenue += $book->wallet_amount;
        }
      
        
     
       
        $report['tickets'] = $ticket_quantity;
        $report['revenue'] = $revenue;
        $report['earnings'] = $revenue;
        $report['movies'] = count($movies);
        $report['concerts'] = count($concerts);
        $report['events'] = count($events);
        return Response::json($report,200);

        }
        else{
            return Response::json(['message'=>'undefined vendor id'],400);
        }
    }
    
    public function get_commission(Request $request, $event_id){
        $commissionArray = [];
        $eventDetails = Event::where('id', $event_id) -> first();
       
        if($eventDetails){
            $userDetails = User::where('id', $eventDetails -> vendor_id) -> first();
           
            $commissionArray["commission"] = $userDetails -> commission;
            $commissionArray["tax"] = $userDetails -> tax;
        }else{
            $commissionArray["commission"] = 0;
            $commissionArray["tax"] = 0;   
        }
            
        return Response::json($commissionArray, 200);
            
    }

    public function withdrawl_history(Request $request){
        $history =[];
        if($request->pending && $request->id != ""){
             $history = Withdrawal::where('vendor_id',$request->id)->where('payment_status',false)->get();
        }
        elseif($request->success && $request->id != ""){
             $history = Withdrawal::where('vendor_id',$request->id)->where('payment_status',true)->get();
        }else{
             $history = Withdrawal::where('vendor_id',$request->id)->get();
        }
        if(count($history) > 0 ){
            return Response::json($history,200);
        }else{
            return Response::json(['message'=>'No transactions found'],200);
        }
    }

    public function delete($id){
        $user = User::where('role', "2")->where('id',$id)->first();
        if($user != ""){
            $user->delete();
            return Response::json(['message'=>'vendor deleted'],200);
        }
        else{
            return Response::json(['error'=>'vendor not found'],400);
        }
    }

    public function transactions($id){
        $headers = request()->headers->all();
        $transactions = Transaction::with(['booking','booking.user'])->whereHas('booking', function($q)use ($id,$headers){
            if(isset($headers['authorization'])) {
                $q = $q->where('vendor_id',$id)->where('bookings.event_id',$headers['authorization']);
            } else {
                $q->where('vendor_id',$id);
            }
        })->get();
        return Response::json($transactions, 200);
    }

    public function refund($id){
        $transaction = Transaction::find($id)->update(['is_refunded' => 1]);
        return Response::json($transaction, 200);

    }
}
