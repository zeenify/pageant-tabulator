<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Judge;
use Illuminate\Http\Request;

class JudgeApiController extends Controller
{
    public function index() {
        return response()->json(Judge::all(), 200);
    }

    public function store(Request $request) {
        $validated = $request->validate([
            'number' => 'required|string|max:50',
            'name' => 'required|string|max:100',
        ]);
        
        $judge = Judge::create([
            'number' => $validated['number'],
            'name' => $validated['name'],
            'pin' => str_pad(mt_rand(0, 9999), 4, '0', STR_PAD_LEFT)
        ]);

        return response()->json(['message' => 'Judge created', 'data' => $judge], 201);
    }

    public function show($id) {
        $judge = Judge::find($id);
        return $judge ? response()->json($judge, 200) : response()->json(['message' => 'Not found'], 404);
    }

    public function update(Request $request, $id) {
        $judge = Judge::find($id);
        if (!$judge) return response()->json(['message' => 'Not found'], 404);

        $validated = $request->validate([
            'number' => 'required|string|max:50',
            'name' => 'required|string|max:100',
        ]);

        $judge->update($validated);
        return response()->json(['message' => 'Judge updated', 'data' => $judge], 200);
    }

    public function destroy($id) {
        $judge = Judge::find($id);
        if (!$judge) return response()->json(['message' => 'Not found'], 404);
        
        $judge->delete();
        return response()->json(['message' => 'Judge deleted'], 200);
    }
}