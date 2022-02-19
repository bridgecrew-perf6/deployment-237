<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    use HasFactory;
    protected $fillable =['booking_id','u_id','total_amount','total_discount','payable_amount','payment_status','transaction_id','payment_mode', 'coupon_amount', 'commission', 'tax', 'wallet_amount', 'credit_card_charges','is_refunded'];

    protected $casts = [
      'booking_id',
    ];

    public function booking(){
      return $this->belongsTo(Booking::class,'u_id','u_id');
    }
}
