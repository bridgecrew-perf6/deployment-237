<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Scopes\EventScope;
use App\Models\Vendor;

class Booking extends Model
{
    use HasFactory;

    protected static function booted()
    {
        $headers = request()->headers->all();
        if(isset($headers['authorization']))
        {
            static::addGlobalScope(new EventScope($headers['authorization'][0]));
        }
    }

    protected $fillable = ['booking_id','user_id','u_id','vendor_id','booking_type','item_name','item_quantity','amount','discount', 'commission', 'tax', 'ticket_no','ticket_slot','booking_status','package','address', 'event_id', 'coupon'];

    public function user(){
        return $this->belongsTo(User::class,'user_id','id');
    }
    public function vendor(){
        return $this->belongsTo(Vendor::class,'vendor_id','id');
    }
}
