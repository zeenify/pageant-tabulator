<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Contestant;
use Illuminate\Http\Request;

class ContestantApiController extends Controller
{
    public function index() {
        return response()->json(Contestant::all(), 200);
    }

    public function store(Request $request) {
        $validated = $request->validate([
            'number' => 'required|integer',
            'name' => 'required|string|max:100',
        ]);

        $contestant = Contestant::create([
            'number' => $validated['number'],
            'name' => $validated['name'],
            'status' => 'Active'
        ]);

        return response()->json(['message' => 'Contestant created', 'data' => $contestant], 201);
    }

    public function show($id) {
        $contestant = Contestant::find($id);
        return $contestant ? response()->json($contestant, 200) : response()->json(['message' => 'Not found'], 404);
    }

    public function update(Request $request, $id) {
        $contestant = Contestant::find($id);
        if (!$contestant) return response()->json(['message' => 'Not found'], 404);

        $validated = $request->validate([
            'number' => 'required|integer',
            'name' => 'required|string|max:100',
            'status' => 'sometimes|string|max:50'
        ]);

        $contestant->update($validated);
        return response()->json(['message' => 'Contestant updated', 'data' => $contestant], 200);
    }

    public function destroy($id) {
        $contestant = Contestant::find($id);
        if (!$contestant) return response()->json(['message' => 'Not found'], 404);

        $contestant->delete();
        return response()->json(['message' => 'Contestant deleted'], 200);
    }
}