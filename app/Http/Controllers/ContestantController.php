<?php

namespace App\Http\Controllers;

use App\Models\Contestant;
use Inertia\Inertia;
use Illuminate\Http\Request;

class ContestantController extends Controller
{
    public function index(Request $request)
    {
        $sortBy = $request->query('sort', 'number_asc');
        
        // ADDED THE FILTER! Start the query locked to the current event.
        $eventId = session('active_event_id');
        $query = Contestant::where('event_id', $eventId);

        if ($sortBy === 'number_asc') $query->orderByRaw('CAST(number AS UNSIGNED) ASC');
        if ($sortBy === 'number_desc') $query->orderByRaw('CAST(number AS UNSIGNED) DESC');
        if ($sortBy === 'name_asc') $query->orderBy('name', 'asc');
        if ($sortBy === 'name_desc') $query->orderBy('name', 'desc');

        return Inertia::render('Contestants/Index',[
            'contestants' => $query->get(),
            'currentSort' => $sortBy
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'number' => 'required|integer',
            'name' => 'required|string|max:100',
        ]);

        Contestant::create([
            'event_id' => session('active_event_id'), // ADDED: Save the Sticky Note ID!
            'number' => $request->number,
            'name' => $request->name,
            'status' => 'Active', // Default status
        ]);

        return redirect()->back();
    }

    public function edit($id)
    {
        return Inertia::render('Contestants/Edit',['contestant' => Contestant::findOrFail($id)]);
    }

    public function update(Request $request, $id)
    {
        $request->validate(['number' => 'required|integer', 'name' => 'required|string|max:100']);
        Contestant::findOrFail($id)->update(['number' => $request->number, 'name' => $request->name]);
        return redirect('/contestants');
    }

    public function updateStatus($id, $status)
    {
        Contestant::findOrFail($id)->update(['status' => $status]);
        return redirect()->back();
    }

    public function destroy($id)
    {
        Contestant::findOrFail($id)->delete();
        return redirect()->back();
    }
}