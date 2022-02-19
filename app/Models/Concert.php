<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class Concert extends Model
{
    use HasFactory;

     protected $fillable =['vendor_id','title', 'workspaceKey', 'event_key', 'secret_key', 'artist','image','address', 'exclusive', 'date','price','starting_time', 'ending_time', 'language', 'total_tickets', 'category', 'artist_facebook_link', 'artist_twitter_link', 'is_active','artist_image','about','disclaimer','terms'];

    public function vendor(){
        return $this->belongsTo(User::class);
    }
}
