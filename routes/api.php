<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\VendorController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\BlogController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\MovieController;
use App\Http\Controllers\ConcertController;
use App\Http\Controllers\SubscriberController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CouponController;
use App\Http\Controllers\ExcelController;
use App\Http\Controllers\TicketScannerController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('/register',[AuthController::class,'register']);
Route::post('/login',[AuthController::class,'login']);
Route::any('/vendors',[VendorController::class,'all_vendors']);

Route::any('/get-commission/{event_id}', [VendorController::class, 'get_commission']);

Route::any('/users',[UserController::class,'all_users']);
Route::get('/states',[UserController::class,'all_states']);
Route::get('/citiesbystate/{id}',[UserController::class,'allcities_bystate']);

Route::post('/change_password',[AuthController::class,'change_password']);
Route::any('/contact',[ContactController::class,'store']);
Route::any('/blog',[BlogController::class,'index']);
Route::get('/blog-delete/{id}',[BlogController::class,'delete']);
Route::any('/event',[EventController::class,'index']);
Route::get('/event-tags',[EventController::class,'event_tags']);
Route::get('/event-delete/{id}',[EventController::class,'delete']);

Route::any('/coupon',[CouponController::class,'index']);
Route::get('/coupon-delete/{id}',[CouponController::class,'delete']);

Route::get('/available-seat/{event_tbl_id}',[EventController::class,'available_seat']);

Route::any('/category',[CategoryController::class,'index']);
Route::get('/category-delete/{id}',[CategoryController::class,'delete']);
Route::get('/valid-coupon/{coupon_code}/{event_id}', [CouponController::class, 'valid_coupon']);


Route::any('/movie',[MovieController::class,'index']);
Route::get('/movie-delete/{id}',[MovieController::class,'delete']);
Route::get('/events-by-vendor/{id}',[EventController::class,'events_by_vendor']);
Route::post('/update-event-status',[EventController::class,'update_event_status']);
Route::get('/movies-by-vendor/{id}',[MovieController::class,'movies_by_vendor']);
Route::any('/concert',[ConcertController::class,'index']);
Route::get('/concert-delete/{id}',[ConcertController::class,'delete']);
Route::get('/concert-by-vendor/{id}',[ConcertController::class,'concerts_by_vendor']);
Route::any('/subscribe',[SubscriberController::class,'index']);

Route::any('/booking',[BookingController::class,'store']);

Route::any('/booking-delete/{id}',[BookingController::class,'delete']);
Route::get('/booking-by-user/{id}',[BookingController::class,'booking_by_user']);
Route::get('/booking-by-vendor/{id}',[BookingController::class,'booking_by_vendor']);
Route::post('/reset-password',[AuthController::class,'reset_password']);
Route::post('/reset',[AuthController::class,'reset']);
Route::post('/search',[AuthController::class,'search_key']);
Route::post('/success-payment',[BookingController::class,'success_payment']);
Route::get('/earning-by-vendor/{id}',[BookingController::class,'earnings_by_vendor']);
Route::post('/withdrawl-req',[BookingController::class,'withdrawl_store']);
Route::get('/report/{id}',[VendorController::class,'report']);

Route::get('/withdrawl-history',[VendorController::class,'withdrawl_history']);

Route::get('/get-booking-status/{id}',[BookingController::class,'get_booking_status']);
Route::post('/update-booking-status', [BookingController::class, 'update_booking_status']);



Route::get('/admin-report',[AdminController::class,'report']);
Route::post('/approved-withdrawl',[AdminController::class,'approved_withdrawl']);
Route::get('/all-withdrawls',[AdminController::class,'withdrawls']);
Route::get('/user-delete/{id}',[UserController::class,'delete']);
Route::get('/vendor-delete/{id}',[VendorController::class,'delete']);
Route::get('/filter-event',[EventController::class,'filter']);
Route::get('/filter-concert',[ConcertController::class,'filter']);
Route::get('/event-offer', [EventController::class,'event_offer']);
Route::get('/concert-offer', [ConcertController::class,'concert_offer']);
Route::post('/booking-history', [BookingController::class, 'booking_history']);
Route::post('/paid-withdrawl-history', [BookingController::class, 'paid_withdrawl_history']);
Route::post('/chart', [BookingController::class, 'chart']);
Route::get('/excel-report', [ExcelController::class, 'report']);

Route::get('/get-ticket-scanner-list/{id}', [TicketScannerController::class, 'scannerlist']);
Route::get('/ticket-scanner-delete/{id}', [TicketScannerController::class, 'delete']);
Route::post('/ticket-scanner-create', [TicketScannerController::class, 'create']);
Route::post('/ticket-scanner-update', [TicketScannerController::class, 'update']);
Route::get('/ticket-scanner-show/{id}', [TicketScannerController::class, 'show']);
Route::get('/transactions/{id}', [VendorController::class, 'transactions']);
Route::get('/refund/{id}', [VendorController::class, 'refund']);
