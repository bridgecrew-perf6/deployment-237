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
use DB;

class AdminController extends Controller
{
        public function report(){
            $headers = request()->headers->all();
            $report = [];
            $ticket_quantity = 0;
            $revenue = 0;
            $booking = DB::table('bookings')->join('transactions','transactions.u_id', '=','bookings.u_id')->where('transactions.payment_status',true);
            if(isset($headers['authorization'])) {
                $booking = $booking->where('bookings.event_id',$headers['authorization']);
            }
            $booking = $booking->get();
            $movies = Movie::all();
            $concerts = Concert::all();
            $events = Event::all();
            foreach($booking as $book){
                $ticket_quantity += $book->item_quantity;
                $revenue += $book->payable_amount;
            }
            $report['tickets_sold'] = $ticket_quantity;
            $report['revenue'] = $revenue;
            $report['total_movies'] = count($movies);
            $report['total_concerts'] = count($concerts);
            $report['total_events'] = count($events);
            return Response::json($report,200);
        }

        public function approved_withdrawl(Request $request){
        $data = $request->json()->all();
        $validated = array(
            'id' => ['required'],
            'transaction_id' => ['required','min:4'],
            'payment_mode' => ['required','min:4']
        );
        $validator = Validator::make($data,$validated);
        if($validator->fails()){
            return Response::json($validator->errors(),400);
        }
        else{
            $check_wd = Withdrawal::where('id',$data['id'])->first();
            if($check_wd != ""){
            $tranc = Withdrawal::where('id',$data['id'])
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

     public function withdrawls(){
        $withdrawl = Withdrawal::with('vendor')->get();
        return Response::json($withdrawl,200);
     }
}
