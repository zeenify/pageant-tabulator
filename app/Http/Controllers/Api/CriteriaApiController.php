<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CategoryCriteria;
use Illuminate\Http\Request;

class CriteriaApiController extends Controller
{
    public function index(Request $request) {
        // Optional: Filter by category_id if provided (e.g., /api/criteria?category_id=1)
        if ($request->has('category_id')) {
            return response()->json(CategoryCriteria::where('category_id', $request->category_id)->get(), 200);
        }
        return response()->json(CategoryCriteria::all(), 200);
    }

    public function store(Request $request) {
        $validated = $request->validate([
            'category_id' => 'required|integer',
            'name' => 'required|string|max:100',
            'percentage' => 'required|numeric|min:0|max:100',
            'min_score' => 'required|integer|min:0',
            'max_score' => 'required|integer|gt:min_score',
        ]);

        $criteria = CategoryCriteria::create($validated);
        return response()->json(['message' => 'Criteria created', 'data' => $criteria], 201);
    }

    public function show($id) {
        $criteria = CategoryCriteria::find($id);
        return $criteria ? response()->json($criteria, 200) : response()->json(['message' => 'Not found'], 404);
    }

    public function update(Request $request, $id) {
        $criteria = CategoryCriteria::find($id);
        if (!$criteria) return response()->json(['message' => 'Not found'], 404);

        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'percentage' => 'required|numeric|min:0|max:100',
            'min_score' => 'required|integer|min:0',
            'max_score' => 'required|integer|gt:min_score',
        ]);

        $criteria->update($validated);
        return response()->json(['message' => 'Criteria updated', 'data' => $criteria], 200);
    }

    public function destroy($id) {
        $criteria = CategoryCriteria::find($id);
        if (!$criteria) return response()->json(['message' => 'Not found'], 404);

        $criteria->delete();
        return response()->json(['message' => 'Criteria deleted'], 200);
    }
}