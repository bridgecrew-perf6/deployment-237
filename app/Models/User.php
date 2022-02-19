<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use App\Models\Event;
use App\Models\Movie;
use App\Models\Concert;
use App\Models\Booking;
class User extends Authenticatable
{
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'first_name',
        'last_name',
        'number',
        'email',
        'city_name',
        // 'street_address',
        // 'state',
        'commission',
        'bank_name',
        'account_no',
        'ifsc_code',
        'password',
        'role',
        'vendor_id',
        'is_active',
        'username'
        // 'zip'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    public function events(){
        return $this->hasMany(Event::class,'vendor_id');
    }
    public function movies(){
        return $this->hasMany(Movie::class,'vendor_id');
    }
    public function concert(){
        return $this->hasMany(Concert::class,'vendor_id','id');
    }
    public function user_bookings(){
        return $this->hasMany(Booking::class,'user_id');
    }
    public function vendoor_bookings(){
        return $this->hasMany(Booking::class,'vendor_id');
    }

    public function scannerEvents() {
        return $this->belongsToMany(Event::class,'event_scanner');
    }
}