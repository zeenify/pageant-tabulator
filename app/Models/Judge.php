<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Judge extends Model
{
    protected $table = 'judge'; 
    public $timestamps = false; 

    protected $fillable =['event_id', 'name', 'number', 'pin'];

}








