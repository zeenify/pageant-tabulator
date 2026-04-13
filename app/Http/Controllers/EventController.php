<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Event;
use Inertia\Inertia;

class EventController extends Controller
{
    public function index()
    {
        // Get all pageants to show in the Lobby
        $events = Event::all();
        
        return Inertia::render('Events/Index', [
            'events' => $events
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:100'
        ]);

        Event::create([
            'name' => $request->name
        ]);

        return back();
    }

    public function enter($id)
    {
        // THE STICKY NOTE MAGIC!
        // We save the ID of the pageant they clicked into Laravel's Session memory
        session(['active_event_id' => $id]);
        
        // Send them into the building (Categories page)
        return redirect('/categories');
    }

    public function destroy($id)
    {
        Event::destroy($id);
        
        // If they deleted the event they are currently inside, clear the sticky note!
        if (session('active_event_id') == $id) {
            session()->forget('active_event_id');
        }
        
        return back();
    }
}