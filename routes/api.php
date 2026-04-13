<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Import all your API Controllers
use App\Http\Controllers\Api\CategoryApiController;
use App\Http\Controllers\Api\JudgeApiController;
use App\Http\Controllers\Api\ContestantApiController;
use App\Http\Controllers\Api\CriteriaApiController;

// Automatically generate standard REST API routes for everything!
Route::apiResource('categories', CategoryApiController::class);
Route::apiResource('judges', JudgeApiController::class);
Route::apiResource('contestants', ContestantApiController::class);
Route::apiResource('criteria', CriteriaApiController::class);