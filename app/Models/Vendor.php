<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Vendor extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'first_name',
        'last_name',
        'number',
        'bank_name',
        'account_no',
        'ifsc_code',
        'email',
        'password',
    ];
}
