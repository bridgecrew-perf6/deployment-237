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
use Illuminate\Support\Facades\Mail;
use App\Mail\OrderMail;
use Carbon\Carbon;
use Config;

class BookingController extends Controller
{
    public function store(Request $request)
    {
        if ($request->isMethod('post')) {
            $data = $request->input();
            $validated = array(
                'user_id' => 'required',
                'booking_type' => 'required',
                'item_id' => 'required',
                'item_quantity' => 'required',
                'item_discount' => 'required',
                'package' => 'required'
            );
            $validator = Validator::make($data, $validated);
            if ($validator->fails()) {
                return Response::json($validator->errors(), 400);
            } else {

                $cardDetails = $data['credit_card'];
                $transactionDetails = $data['transactionResponse'];

                $user_find = User::find($data['user_id']);
                if ($user_find != "") {
                    $type = $data['booking_type'];
                    $booking_data = [];
                    $set_ticket_no = [];
                    $set_ticket_slot = [];

                    switch ($type) {
                        case "Movie":
                            $booking_data = Movie::find($data['item_id']);
                            $ticket_no = Booking::where('booking_type', "Movie")->latest()->orderBy('id', 'desc')->first();
                            if ($ticket_no != "") {
                                $set_ticket_no = $ticket_no->ticket_no + 1;
                                if ($booking_data->title == $ticket_no->item_name) {
                                    $set_ticket_slot = $ticket_no->ticket_slot + 1;
                                } else {
                                    $set_ticket_slot = 1;
                                }
                            } else {
                                $set_ticket_no = 7425;
                                $set_ticket_slot = 1;
                            }
                            break;
                        case "Concert":
                            $booking_data = Concert::find($data['item_id']);
                            $ticket_no = Booking::where('booking_type', "Concert")->latest()->orderBy('id', 'desc')->first();
                            if ($ticket_no != "") {
                                $set_ticket_no = $ticket_no->ticket_no + 1;
                                if ($booking_data->title == $ticket_no->item_name) {
                                    $set_ticket_slot = $ticket_no->ticket_slot;
                                } else {
                                    $set_ticket_slot = 1;
                                }
                            } else {
                                $set_ticket_no = 456251;
                                $set_ticket_slot = 1;
                            }
                            break;
                        case "Event":
                            $booking_data = Event::find($data['item_id']);
                            $ticket_no = Booking::where('booking_type', "Event")->orderBy('id', 'desc')->first();
                            if ($ticket_no != "") {
                                $set_ticket_no = $ticket_no->ticket_no;
                                if ($booking_data->title == $ticket_no->item_name) {
                                    $set_ticket_slot = $ticket_no->ticket_slot;
                                } else {
                                    $set_ticket_slot = 1;
                                }
                            } else {
                                $set_ticket_no = 65811;
                                $set_ticket_slot = 1;
                            }
                            break;
                        default:
                            return Response::json(['message' => "Not a valid booking type"], 400);
                    }


                    $bookingId = 'MYTICKET' . date('Y', time()) . substr(time(), -3);
                    $uniqid = Str::random(9);
                    $bookingID = [];

                    if ($data['coupon'] != '') {
                        $couponDetails = Coupon::where('coupon_code', $data['coupon'])->first();
                        $couponAmount =  $couponDetails->discount_amount;
                    } else {
                        $couponAmount = 0.00;
                    }



                    $vendorList = User::where('id', $booking_data['vendor_id'])->first();

                    //$ticketSlot = explode(',', $data['ticket_slot']);

                    $ticketSlot = $data['ticket_slot'];



                    if (!empty($booking_data)) {
                        for ($x = 0; $x <= $data['item_quantity'] - 1; $x++) {
                            $bookingID[] = $bookingId . $x;


                            $priceJson = json_decode($booking_data['price']);
                            $booking = Booking::create([
                                'booking_id' => $bookingId . $x,
                                'user_id' => $data['user_id'],
                                'u_id' => $uniqid,
                                'vendor_id' => $booking_data['vendor_id'],
                                'booking_type' => $data['booking_type'],
                                'item_name' => $booking_data['title'],
                                'address' => $booking_data['address'],
                                'item_quantity' => 1,
                                'coupon' => $data['coupon'] ? $data['coupon'] : '',
                                'commission' => $data['totalCommission'],
                                'tax' => $data['totalTax'],
                                'booking_status' => 0,
                                'event_id' => $booking_data->id,
                                'amount' => $ticketSlot[$x]['price'],
                                'discount' => @$priceJson[0]->discount ?: 0,
                                'package' => $ticketSlot[$x]['category'],
                                'ticket_no' => $set_ticket_no,
                                'ticket_slot' => $ticketSlot[$x]['label'],
                            ]);
                        }



                        $total_amount = $data['amount'];
                        $total_discount = $total_amount * (int)(@$priceJson[0]->discount ?: 0) / 100;

                        Transaction::create([
                            'booking_id' => json_encode($bookingID),
                            'u_id' => $uniqid,
                            'payment_status' => 1,
                            'transaction_id' => $transactionDetails['responseCode'] == 1 ? $transactionDetails['transId'] : '',
                            'payment_mode' => $transactionDetails['responseCode'] == 1 ? 'Online' : '',
                            'total_amount' => $total_amount,
                            'total_discount' => $total_discount,
                            'coupon_amount' => $couponAmount,
                            'payable_amount' => $total_amount - $total_discount - $couponAmount,
                            'commission' => $data['totalCommission'],
                            'credit_card_charges' => $data['credit_card_charges'],
                            'tax' => $data['totalTax'],
                            'wallet_amount' => ($total_amount - ($total_discount + $couponAmount + $data['totalCommission'] + $data['totalTax'] + $data['credit_card_charges']))
                        ]);

                        $emailcontent = [
                            'site_title' => Config::get('constants.COMPANY_NAME'),
                            'font_url' => Config::get('constants.FRONT_URL'),
                            'booking_id' => json_encode($bookingID),
                            'total_amount' => $total_amount,
                            'total_discount' => $total_discount,
                            'email' => $user_find['email'],
                            'tax' => $data['totalTax'],
                            'credit_card_charges' => $data['credit_card_charges'],
                            'item_quantity' => 1,
                            'first_name' => $user_find['first_name'],
                            'last_name' => $user_find['last_name'],
                            'city_name' => $user_find['city_name'],
                            'number' => $user_find['number'],
                            'totalCommission' => $data['totalCommission'],
                        ];

                        Mail::to($user_find['email'])->send(new OrderMail($emailcontent));

                        return Response::json($bookingID, 200);
                    } else {
                        return Response::json(['message' => 'unable to find items with given id'], 200);
                    }
                } else {
                    return Response::json(['message' => 'user not found'], 404);
                }
            }
        }
        if ($request->isMethod('get')) {
            $data = Booking::with('user', 'vendor')->get();
            return Response::json($data, 200);
        }
    }

    public function booking_by_user($id)
    {
        //$data = User::with('user_bookings')->where('id',$id)->where('role',"1")->get();
        $data = DB::table('bookings')
            ->join('users', 'users.id', '=', 'bookings.user_id')
            ->join('transactions', 'transactions.u_id', '=', 'bookings.u_id')
            ->select('transactions.payment_status as payment_status', 'bookings.*', DB::raw("CONCAT(bookings.package,'-',bookings.ticket_no,'-',bookings.ticket_slot) AS TICKET_ID"))
            ->where('bookings.user_id', $id)
            ->get();
        return Response::json($data, 200);
    }

    public function booking_by_vendor($id)
    {
        $headers = request()->headers->all();
        $dataArray = [];
        $data = DB::table('bookings')
            ->join('users AS A', 'A.id', '=', 'bookings.vendor_id')
            ->join('users AS B', 'B.id', '=', 'bookings.user_id')
            ->select('bookings.*', 'A.first_name as vendor_fast_name', 'A.last_name as vendor_last_name', 'B.first_name as user_first_name', 'B.last_name as user_last_name')
            ->where('A.id', $id);
        if(isset($headers['authorization'])) {
            $data = $data->where('bookings.event_id',$headers['authorization']);
        }
        $data = $data->get();

        foreach ($data as $val) {

            $transactiondetails = Transaction::where('u_id', $val->u_id)->first();

            $dataArray[] = (object)[
                'id' => $val->id,
                'booking_id' => $val->booking_id,
                'vendor_id' => $val->vendor_id,
                'event_id' => $val->event_id,
                'user_id' => $val->user_id,
                'u_id' => $val->u_id,
                'coupon' => $val->coupon,
                'booking_type' => $val->booking_type,
                'item_name' => $val->item_name,
                'item_quantity' => $val->item_quantity,
                'amount' => $val->amount,
                'discount' => @$transactiondetails->coupon_amount + @$transactiondetails->total_discount,
                'package' => $val->package,
                'ticket_no' => $val->ticket_no,
                'ticket_slot' => $val->ticket_slot,
                'address' => $val->address,
                'booking_status' => @$transactiondetails->payment_status,
                'checkin_status' => $val->booking_status,
                'created_at' => $val->created_at,
                'updated_at' => $val->updated_at,
                'vendor_fast_name' => $val->vendor_fast_name,
                'vendor_last_name' => $val->vendor_last_name,
                'user_first_name' => $val->user_first_name,
                'user_last_name' => $val->user_last_name,
                'date' => Carbon::parse($val->created_at)->format('F dS Y')
            ];
        }


        return Response::json($dataArray, 200);
    }

    public function delete($id)
    {
        if ($id != "") {
            $find_movie = Booking::find($id);
            if ($find_movie != "") {
                $find_movie->delete();
                return Response::json(['message' => 'data deleted'], 200);
            } else {
                return Response::json(['message' => 'undefined booking id'], 404);
            }
        }
    }

    public function success_payment(Request $request)
    {
        $data = $request->json()->all();
        $validated = array(
            'booking_id' => ['required'],
            'transaction_id' => ['required', 'min:4'],
            'payment_mode' => ['required', 'min:4']
        );
        $validator = Validator::make($data, $validated);
        if ($validator->fails()) {
            return Response::json($validator->errors(), 400);
        } else {
            $check_booking = Transaction::where('booking_id', $data['booking_id'])->first();
            if ($check_booking != "") {
                $tranc = Transaction::where('booking_id', $data['booking_id'])
                    ->update([
                        'payment_status' => true,
                        'transaction_id' => $data['transaction_id'],
                        'payment_mode' => $data['payment_mode']
                    ]);
                return Response::json(['message' => 'data updated'], 200);
            } else {
                return Response::json(['message' => 'no transaction found with this id'], 402);
            }
        }
    }

    public function earnings_by_vendor($id)
    {
        $headers = request()->headers->all();
        $total_erning = DB::table('bookings')
            ->join('transactions', 'transactions.u_id', '=', 'bookings.u_id')
            ->join('users', 'users.id', '=', 'bookings.vendor_id')
            ->where('transactions.payment_status', true)
            ->where('bookings.vendor_id', $id);

        if(isset($headers['authorization'])) {
            $total_erning = $total_erning->where('bookings.event_id',$headers['authorization']);
        }
        $total_erning = $total_erning->get(['transactions.wallet_amount', 'bookings.commission']);

        $total_withdrawl = Withdrawal::where('payment_status', 1)->where('vendor_id', $id)->get();
        $withdrawl = 0;

        foreach ($total_withdrawl as $wid) {
            $withdrawl += $wid->amount;
        }
        $ernings = 0;

        foreach ($total_erning as $amount) {
            $ernings += $amount->wallet_amount;
        }



        return Response::json(['earning_amount' => number_format($ernings, 2), 'withdrawl_amount' => number_format($withdrawl, 2), 'wallet_balance' => number_format(($ernings - $withdrawl), 2)], 200);
    }



    public function withdrawl_store(Request $request)
    {
        $data = $request->json()->all();
        $validated = array(
            'vendor_id' => ['required'],
            'amount' => ['required'],
        );
        $validator = Validator::make($data, $validated);
        if ($validator->fails()) {
            return Response::json($validator->errors(), 400);
        } else {
            $vendor = User::where('role', "2")->where('is_active', 1)->where('id', $data['vendor_id'])->get();
            //echo $vendor;
            if (count($vendor) > 0) {

                //$ernings = $this->earnings_by_vendor($request->vendor_id);



                $total_erning = DB::table('bookings')
                    ->join('transactions', 'transactions.u_id', '=', 'bookings.u_id')
                    ->join('users', 'users.id', '=', 'bookings.vendor_id')
                    ->where('transactions.payment_status', true)
                    ->where('bookings.vendor_id', $request->vendor_id)
                    ->get(['transactions.wallet_amount']);

                $total_withdrawl = Withdrawal::where('payment_status', 1)->where('vendor_id', $request->vendor_id)->get();
                $withdrawl = 0;

                foreach ($total_withdrawl as $wid) {
                    $withdrawl += $wid->amount;
                }
                $ernings = 0;

                foreach ($total_erning as $amount) {
                    $ernings += $amount->wallet_amount;
                }






                $walletBalance = $ernings - $withdrawl;



                if ($walletBalance == 0) {
                    return Response::json(['message' => 'no blance in your wallet'], 200);
                } elseif ($data['amount'] >= $walletBalance) {
                    return Response::json(['message' => 'please choose a less amount'], 200);
                } else {
                    $data = Withdrawal::create([
                        'vendor_id' => $data['vendor_id'],
                        'amount' => $data['amount']
                    ]);
                    return Response::json($data, 200);
                }
            } else {
                return Response::json(['message' => 'vendor not found with this id'], 400);
            }
        }
    }


    public function booking_history(Request $request)
    {

        if ($request->method() == 'POST') {
            $bookingHistory = Booking::select(['booking_id', 'booking_type', 'item_name', 'amount', 'discount', 'ticket_no', 'ticket_slot'])
                ->join('users', 'users.id', '=', 'bookings.user_id');

            if ($request->input('city_name') != '') {
                $bookingHistory = $bookingHistory->where('users.city_name', $request->input('city_name'));
            }

            if ($request->input('type') != '') {
                $bookingHistory = $bookingHistory->where('booking_status', $request->input('type'));
            }

            if ($request->input('event_id') != '' && $request->input('booking_type') != '') {
                $bookingHistory = $bookingHistory->where('bookings.booking_type', $request->input('booking_type'))->where('bookings.event_id', $request->input('event_id'));
            }

            $result = $bookingHistory->get();


            return Response::json(['data' => $result], 200);
        } else {
            return Response::json(['message' => 'Unknown method'], 400);
        }
    }

    public function paid_withdrawl_history(Request $request)
    {
        if ($request->method() == 'POST') {
            $withdrawDetails = Withdrawal::where('id', $request->input('withdraw_id'))->first();

            $total_erning = DB::table('bookings')
                ->join('transactions', 'transactions.u_id', '=', 'bookings.u_id')
                ->join('users', 'users.id', '=', 'bookings.vendor_id')
                ->where('transactions.payment_status', true)
                ->where('bookings.vendor_id', $withdrawDetails->vendor_id)
                ->get(['wallet_amount']);

            $total_withdrawl = Withdrawal::where('payment_status', 1)->where('vendor_id', $withdrawDetails->vendor_id)->get();
            $withdrawl = 0;

            foreach ($total_withdrawl as $wid) {
                $withdrawl += $wid->amount;
            }
            $ernings = 0;

            foreach ($total_erning as $amount) {
                $ernings += $amount->wallet_amount;
            }




            $wallet_ballance = $ernings - $withdrawl;

            if ($wallet_ballance >=  $withdrawDetails->amount) {

                $walletUpdate = Withdrawal::find($request->input('withdraw_id'));

                $walletUpdate->fill([

                    'payment_status' => 1,
                    'transaction_id' => $request->input('transaction_id'),
                    'payment_mode' => $request->input('payment_mode'),
                    'payment_date' => date('Y-m-d', strtotime($request->input('payment_date')))
                ]);

                if ($walletUpdate->save()) {
                    return Response::json(['message' => 'data updated'], 200);
                } else {
                    return Response::json(['message' => 'data updated error'], 200);
                }
            } else {
                return Response::json(['message' => 'Wallet balance is insufficient'], 200);
            }
        } else {
            return Response::json(['message' => 'Unknown method'], 400);
        }
    }

    public function get_booking_status($id)
    {
        $bookingStatus = Booking::where('booking_id', $id)->first();
        if ($bookingStatus->booking_status == 0) {
            return Response::json(['message' => 'Not Scanned'], 200);
        } elseif ($bookingStatus->booking_status == 1) {
            return Response::json(['message' => 'Already Scanned'], 200);
        }
    }

    public function update_booking_status(Request $request)
    {
        if ($request->method() == 'POST') {

            $bookingStatus = Booking::where('booking_id', $request->input('booking_id'))->first();

            if ($bookingStatus->booking_status == 0) {
                $booking  = Booking::find($bookingStatus->id);


                $booking->fill([
                    'booking_status' => 1
                ]);

                $booking->save();


                return Response::json(['message' => 'Vaild Ticket'], 200);
            } elseif ($bookingStatus->booking_status == 1) {
                return Response::json(['message' => 'Already entry'], 200);
            } else {
                return Response::json(['message' => 'Invalid Ticket'], 200);
            }
        } else {
            return Response::json(['message' => 'Unknown method'], 400);
        }
    }

    public function chart(Request $request)
    {
        if ($request->method() == 'POST') {
            $totalAmount = 0;
            $result['Day'] = 'Sales';
            $chart = Transaction::where('bookings.vendor_id', $request->post('vendor_id'))
                ->where('transactions.payment_status', 1)
                ->whereMonth('transactions.created_at', $request->post('month'))
                ->join('bookings', 'bookings.u_id', '=', 'transactions.u_id')
                ->select('bookings.id', 'bookings.vendor_id', 'bookings.amount', 'bookings.created_at')
                ->get();

            foreach ($chart as $value) {

                if (array_key_exists(date('d', strtotime($value->created_at)), $result)) {

                    $result[date('d', strtotime($value->created_at))] += $value->amount;
                } else {

                    $result[date('d', strtotime($value->created_at))] = $value->amount;
                }
            }

            echo json_encode((object)$result);
        } else {
            return Response::json(['message' => 'Unknown method'], 400);
        }
    }
}
