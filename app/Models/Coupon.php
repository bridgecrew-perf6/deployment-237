<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Coupon extends Model
{
    use HasFactory;
    protected $fillable = ['type_id', 'event_id', 'coupon_code', 'discount_amount', 'vendor_id', 'expiry_date'];
}
