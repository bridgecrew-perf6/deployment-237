<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class Withdrawal extends Model
{
    use HasFactory;

    protected $fillable = ['vendor_id','amount','payment_status','transaction_id', 'payment_date', 'payment_mode'];

    public function vendor(){
        return $this->belongsTo(User::class,'vendor_id','id');
    }
}
