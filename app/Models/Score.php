<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Score extends Model
{
    protected $table = 'score';
    public $timestamps = false;

    protected $fillable =[
        'category_id',
        'judge_id',
        'contestant_id',
        'criteria_id',
        'value'
    ];
}