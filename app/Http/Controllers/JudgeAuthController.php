<?php

namespace App\Http\Controllers;

use App\Models\Judge;
use Illuminate\Http\Request;
use Inertia\Inertia;

class JudgeAuthController extends Controller
{
    // 1. Show the PIN Login Page
    public function create()
    {
        return Inertia::render('JudgePortal/Login');
    }

    // 2. Check the PIN and log them in
    public function store(Request $request)
    {
        $request->validate([
            'number' => 'required|string|max:50|regex:/^[a-zA-Z0-9\s\-]+$/',
            'name' => 'required|string|max:100|regex:/^[a-zA-Z0-9\s\-]+$/',
        ]);

        // Search the database for a judge with this exact PIN
        $judge = Judge::where('pin', $request->pin)->first();

        if ($judge) {
            // If found, give them a "nametag" in the session memory
            session(['judge_id' => $judge->id]);
            
            // Send them to the score sheet! (We will build this page next)
            return redirect('/score-sheet');
        }

        // If the PIN is wrong, send them back with a red error
        return back()->withErrors([
            'pin' => 'Invalid PIN. Please check with the admin.'
        ]);
    }

    // 3. Log out
    public function destroy()
    {
        // Rip up the session nametag
        session()->forget('judge_id');
        return redirect('/judge/login');
    }
}