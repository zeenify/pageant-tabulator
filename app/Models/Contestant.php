<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Contestant extends Model
{
    protected $table = 'contestant';
    public $timestamps = false;
    protected $fillable = ['name', 'number', 'status'];
}