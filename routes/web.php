<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\CriteriaController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\CategoryController;
use App\Http\Controllers\JudgeController;
use App\Http\Controllers\JudgeAuthController;
use App\Http\Controllers\ScoreController;

Route::get('/', function () {
    return Inertia::render('Welcome');
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::get('/categories',[CategoryController::class, 'index']);
Route::post('/categories',[CategoryController::class, 'store']);

// Show the Edit Page
Route::get('/categories/{id}/edit', [CategoryController::class, 'edit']);
// Receive the updated data (PUT is used for updating existing data)
Route::put('/categories/{id}',[CategoryController::class, 'update']);
// Receive the delete command (DELETE is used for removing data)
Route::delete('/categories/{id}', [CategoryController::class, 'destroy']);

// Criteria Routes
Route::get('/criteria', [CriteriaController::class, 'index']);
Route::post('/criteria', [CriteriaController::class, 'store']);
Route::delete('/criteria/{id}',[CriteriaController::class, 'destroy']);

// Show the Edit Criteria Page
Route::get('/criteria/{id}/edit', [CriteriaController::class, 'edit']);
// Receive the updated Criteria data
Route::put('/criteria/{id}', [CriteriaController::class, 'update']);

// Judges Routes
Route::get('/judges', [JudgeController::class, 'index']);
Route::post('/judges', [JudgeController::class, 'store']);
Route::post('/judges/{id}/generate-pin', [JudgeController::class, 'generatePin']);
Route::delete('/judges/{id}', [JudgeController::class, 'destroy']);

// Show the Edit Judge Page
Route::get('/judges/{id}/edit',[JudgeController::class, 'edit']);
// Receive the updated Judge data
Route::put('/judges/{id}',[JudgeController::class, 'update']);

use App\Http\Controllers\ContestantController;

// Contestants Routes
Route::get('/contestants',[ContestantController::class, 'index']);
Route::post('/contestants',[ContestantController::class, 'store']);
Route::get('/contestants/{id}/edit',[ContestantController::class, 'edit']);
Route::put('/contestants/{id}', [ContestantController::class, 'update']);
Route::patch('/contestants/{id}/status/{status}',[ContestantController::class, 'updateStatus']);
Route::delete('/contestants/{id}', [ContestantController::class, 'destroy']);

// Activate a category for the judges
Route::post('/categories/{id}/activate',[CategoryController::class, 'activate']);

// Judge Portal Routes (No admin layout, just for judges on their phones)
Route::get('/judge/login',[JudgeAuthController::class, 'create']);
Route::post('/judge/login', [JudgeAuthController::class, 'store']);
Route::post('/judge/logout', [JudgeAuthController::class, 'destroy']);

// Judge Score Sheet Routes
Route::get('/score-sheet',[ScoreController::class, 'index']);
Route::post('/score-sheet', [ScoreController::class, 'store']);

// Show the Print Summary for a Category
Route::get('/categories/{id}/summary', [CategoryController::class, 'summary']);

require __DIR__.'/auth.php';
