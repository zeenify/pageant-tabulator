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
        // FIX 1: We only validate the PIN now! No more name/number checks here.
        $request->validate([
            'pin' => 'required|string|size:4',
        ]);

        // Search the database for a judge with this exact PIN
        $judge = Judge::where('pin', $request->pin)->first();

        if ($judge) {
            // Give them a "nametag" in the session memory
            session(['judge_id' => $judge->id]);
            
            // FIX 2: AUTOMATIC EVENT ROUTING
            // The system now knows exactly which pageant this judge belongs to!
            session(['active_event_id' => $judge->event_id]);
            
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
        // Rip up the session memory
        session()->forget('judge_id');
        session()->forget('active_event_id'); // Clear the event memory too!
        
        return redirect('/judge/login');
    }
}