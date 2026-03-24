<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CategoryCriteria extends Model
{
    // Tell Laravel the exact name of your database table
    protected $table = 'category_criteria';

    // Turn off default timestamps
    public $timestamps = false;

    // The columns we are allowed to save data into
    protected $fillable =[
        'category_id', 
        'name', 
        'percentage', 
        'min_score', 
        'max_score'
    ];
}
