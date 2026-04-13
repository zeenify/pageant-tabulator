<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryApiController extends Controller
{
    // 1. GET: Fetch all categories (REST Standard)
    public function index()
    {
        $categories = Category::all();
        
        return response()->json([
            'message' => 'Categories retrieved successfully',
            'data' => $categories
        ], 200); // 200 OK
    }

    // 2. POST: Create a new category
    public function store(Request $request)
    {
        $validated = $request->validate([
            'category_name' => 'required|string|max:100',
        ]);

        $category = Category::create([
            'name' => $validated['category_name']
        ]);

        return response()->json([
            'message' => 'Category created successfully',
            'data' => $category
        ], 201); // 201 Created
    }

    // 3. GET: Fetch a single category by ID
    public function show($id)
    {
        $category = Category::find($id);

        if (!$category) {
            return response()->json(['message' => 'Category not found'], 404);
        }

        return response()->json([
            'message' => 'Category found',
            'data' => $category
        ], 200);
    }

    // 4. PUT: Update a category
    public function update(Request $request, $id)
    {
        $category = Category::find($id);

        if (!$category) {
            return response()->json(['message' => 'Category not found'], 404);
        }

        $validated = $request->validate([
            'category_name' => 'required|string|max:100',
        ]);

        $category->update([
            'name' => $validated['category_name']
        ]);

        return response()->json([
            'message' => 'Category updated successfully',
            'data' => $category
        ], 200);
    }

    // 5. DELETE: Remove a category
    public function destroy($id)
    {
        $category = Category::find($id);

        if (!$category) {
            return response()->json(['message' => 'Category not found'], 404);
        }

        $category->delete();

        return response()->json([
            'message' => 'Category deleted successfully'
        ], 200);
    }
}