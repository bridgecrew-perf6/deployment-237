<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\Tag;

class Event extends Model
{
    use HasFactory;

    protected $fillable =['vendor_id','title', 'workspaceKey', 'event_key', 'secret_key', 'tax', 'image','address','date','exclusive','price','starting_time', 'ending_time', 'artist','artist_image', 'language', 'total_tickets', 'category', 'exclusive', 'artist_facebook_link', 'artist_twitter_link', 'about','disclaimer','terms','cccharge'];

    protected $appends = ['event_tags'];

    public function vendor(){
        return $this->belongsTo(User::class);
    }

    public function tags()
    {
        return $this->belongsToMany(Tag::class);
    }

    public function getEventTagsAttribute()
    {
        return $this->tags->pluck('name')->toArray();
    }
}
