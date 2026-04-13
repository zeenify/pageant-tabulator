<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckAdmin
{
    public function handle(Request $request, Closure $next): Response
    {
        // If the admin is NOT logged in, kick them out to the login page!
        if (!session('is_admin')) {
            return redirect('/admin/login');
        }

        return $next($request);
    }
}