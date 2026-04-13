<?php

namespace App\Http\Controllers;

use App\Models\Judge;
use Inertia\Inertia;
use Illuminate\Http\Request;

class JudgeController extends Controller
{
    // 1. SHOW JUDGES & HANDLE SORTING
    public function index(Request $request)
    {
        // Get the requested sort order (Default to sorting by number ascending)
        $sortBy = $request->query('sort', 'number_asc');

        // ADDED THE FILTER! Start the query locked to the current event.
        $eventId = session('active_event_id');
        $query = Judge::where('event_id', $eventId);

        // Apply the filter/sort
        if ($sortBy === 'number_asc') $query->orderByRaw('CAST(number AS UNSIGNED) ASC');
        if ($sortBy === 'number_desc') $query->orderByRaw('CAST(number AS UNSIGNED) DESC');
        if ($sortBy === 'name_asc') $query->orderBy('name', 'asc');
        if ($sortBy === 'name_desc') $query->orderBy('name', 'desc');

        return Inertia::render('Judges/Index',[
            'judges' => $query->get(),
            'currentSort' => $sortBy // Pass the current sort back so the dropdown remembers it
        ]);
    }

    // 2. ADD A JUDGE
    public function store(Request $request)
    {
        $request->validate([
            'number' => 'required|string|max:50',
            'name' => 'required|string|max:100',
        ]);

        // Generate a random 4-digit PIN automatically upon creation (0000 to 9999)
        $randomPin = str_pad(mt_rand(0, 9999), 4, '0', STR_PAD_LEFT);

        Judge::create([
            'event_id' => session('active_event_id'), // ADDED: Save the Sticky Note ID!
            'number' => $request->number,
            'name' => $request->name,
            'pin' => $randomPin,
        ]);

        return redirect()->back();
    }

    // 3. GENERATE A NEW PIN
    public function generatePin($id)
    {
        $judge = Judge::findOrFail($id);
        
        // Overwrite the old PIN with a new 4-digit PIN
        $judge->update([
            'pin' => str_pad(mt_rand(0, 9999), 4, '0', STR_PAD_LEFT)
        ]);

        return redirect()->back();
    }

    // 4. DELETE A JUDGE
    public function destroy($id)
    {
        Judge::findOrFail($id)->delete();
        return redirect()->back();
    }

    // 5. SHOW EDIT PAGE
    public function edit($id)
    {
        $judge = Judge::findOrFail($id);
        
        return Inertia::render('Judges/Edit',[
            'judge' => $judge
        ]);
    }

    // 6. SAVE EDITED DATA
    public function update(Request $request, $id)
    {
        $request->validate([
            'number' => 'required|string|max:50',
            'name' => 'required|string|max:100',
        ]);

        $judge = Judge::findOrFail($id);
        
        // We only update the name and number (the PIN stays the same!)
        $judge->update([
            'number' => $request->number,
            'name' => $request->name,
        ]);

        return redirect('/judges');
    }
}