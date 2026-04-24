<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' =>[
                'user' => $request->user(),
            ],
            // THIS IS THE MISSING PIECE!
            // It tells Laravel to send the session variable to every React page.
            'active_event_name' => \App\Models\Event::find($request->session()->get('active_event_id'))?->name,
            
            // (If you also added the flash messages earlier, they should be here too)
            'flash' =>[
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
        ];
    }

}
