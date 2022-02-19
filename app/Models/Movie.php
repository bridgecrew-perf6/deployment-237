<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class Movie extends Model
{
    use HasFactory;

    protected $fillable =['vendor_id','title','rating','popularity','image','date','tag','price','selling_price','discount','time'];

    public function vendor(){
        return $this->belongsTo(User::class);
    }
}
