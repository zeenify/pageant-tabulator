<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;

class CheckAdmin
{
    public function handle(Request $request, Closure $next): Response
    {
        // Check if they are officially logged in to the database
        if (!Auth::check()) {
            return redirect('/admin/login');
        }

        return $next($request);
    }
}