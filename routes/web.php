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
use App\Http\Controllers\ContestantController; // Moved this to the top with the others!

use App\Http\Controllers\EventController; 

// NEW: Imports for our Admin Bouncer
use App\Http\Controllers\AdminAuthController;
use App\Http\Middleware\CheckAdmin;

// ==========================================
// 1. ADMIN LOGIN ROUTES (Open to everyone)
// ==========================================
Route::get('/admin/login', [AdminAuthController::class, 'create'])->name('admin.login');
Route::post('/admin/login', [AdminAuthController::class, 'store']);
Route::post('/admin/logout',[AdminAuthController::class, 'destroy'])->name('admin.logout');


// ==========================================
// 2. PROTECTED ADMIN ROUTES (Guarded by CheckAdmin)
// ==========================================
Route::middleware([CheckAdmin::class])->group(function () {
    
    // CHANGED: Now kicks you to the Lobby instead of Categories
    Route::get('/', function () {
        return redirect('/events');
    });

    // NEW: Events Lobby Routes
    Route::get('/events', [EventController::class, 'index']);
    Route::post('/events', [EventController::class, 'store']);
    Route::post('/events/{id}/enter',[EventController::class, 'enter']);
    Route::delete('/events/{id}', [EventController::class, 'destroy']);

    // Categories
    Route::get('/categories',[CategoryController::class, 'index']);
    Route::post('/categories',[CategoryController::class, 'store']);
    Route::get('/categories/{id}/edit', [CategoryController::class, 'edit']);
    Route::put('/categories/{id}',[CategoryController::class, 'update']);
    Route::delete('/categories/{id}',[CategoryController::class, 'destroy']);
    Route::post('/categories/{id}/activate',[CategoryController::class, 'activate']);
    Route::get('/categories/{id}/summary', [CategoryController::class, 'summary']);

    // Criteria
    Route::get('/criteria', [CriteriaController::class, 'index']);
    Route::post('/criteria', [CriteriaController::class, 'store']);
    Route::delete('/criteria/{id}',[CriteriaController::class, 'destroy']);
    Route::get('/criteria/{id}/edit',[CriteriaController::class, 'edit']);
    Route::put('/criteria/{id}', [CriteriaController::class, 'update']);

    // Judges
    Route::get('/judges', [JudgeController::class, 'index']);
    Route::post('/judges', [JudgeController::class, 'store']);
    Route::post('/judges/{id}/generate-pin', [JudgeController::class, 'generatePin']);
    Route::delete('/judges/{id}', [JudgeController::class, 'destroy']);
    Route::get('/judges/{id}/edit',[JudgeController::class, 'edit']);
    Route::put('/judges/{id}',[JudgeController::class, 'update']);

    // Contestants
    Route::get('/contestants',[ContestantController::class, 'index']);
    Route::post('/contestants',[ContestantController::class, 'store']);
    Route::get('/contestants/{id}/edit',[ContestantController::class, 'edit']);
    Route::put('/contestants/{id}', [ContestantController::class, 'update']);
    Route::patch('/contestants/{id}/status/{status}',[ContestantController::class, 'updateStatus']);
    Route::delete('/contestants/{id}', [ContestantController::class, 'destroy']);
});


// ==========================================
// 3. JUDGE PORTAL ROUTES (Guarded by PIN, NOT Admin Login)
// ==========================================
Route::get('/judge/login',[JudgeAuthController::class, 'create']);
Route::post('/judge/login', [JudgeAuthController::class, 'store']);
Route::post('/judge/logout', [JudgeAuthController::class, 'destroy']);

Route::get('/score-sheet',[ScoreController::class, 'index']);
Route::post('/score-sheet', [ScoreController::class, 'store']);


// ==========================================
// 4. ORIGINAL LARAVEL BREEZE ROUTES (Untouched)
// ==========================================
Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';