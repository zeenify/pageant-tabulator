<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminAuthController extends Controller
{
    // 1. Show the Admin Login Page
    public function create()
    {
        return Inertia::render('Admin/Login');
    }

    // 2. Check the Hardcoded Credentials
    public function store(Request $request)
    {
        // HARDCODED CHECK: admin / admin
        if ($request->username === 'admin' && $request->password === 'admin') {
            
            // Give them the Admin VIP Pass in the session
            session(['is_admin' => true]);
            
            return redirect('/categories');
        }

        // If wrong, send them back with an error
        return back()->withErrors([
            'username' => 'Invalid username or password.'
        ]);
    }

    // 3. Log Out
    public function destroy()
    {
        session()->forget('is_admin');
        return redirect('/admin/login');
    }
}