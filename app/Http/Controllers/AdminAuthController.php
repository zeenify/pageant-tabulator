<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class AdminAuthController extends Controller
{
    public function create()
    {
        return Inertia::render('Admin/Login');
    }

    public function store(Request $request)
    {
        // 1. Validate that they typed a name and password
        $credentials = $request->validate([
            'name' => ['required', 'string'],
            'password' => ['required'],
        ]);

        // 2. Auth::attempt securely encrypts the password and checks the 'users' table!
        if (Auth::attempt($credentials)) {
            $request->session()->regenerate();
            return redirect()->intended('/events');
        }

        // 3. If wrong, send them back
        return back()->withErrors([
            'name' => 'The provided username/password do not match our records.',
        ]);
    }

    public function destroy(Request $request)
    {
        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        // Clear the pageant sticky notes
        session()->forget(['active_event_id', 'active_event_name']);

        return redirect('/admin/login');
    }
}