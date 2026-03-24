<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\CategoryCriteria;
use Inertia\Inertia;
use Illuminate\Http\Request;

class CriteriaController extends Controller
{
    // 1. SHOW THE PAGE
    public function index(Request $request)
    {
        // Get the category_id from the URL (e.g., ?category_id=1)
        $categoryId = $request->query('category_id');

        // Fetch the specific category so we can display its name at the top of the page
        $category = Category::findOrFail($categoryId);

        // Fetch ONLY the criteria that belong to this category
        $criteria = CategoryCriteria::where('category_id', $categoryId)->get();

        return Inertia::render('Criteria/Index',[
            'category' => $category,
            'criteria_list' => $criteria
        ]);
    }

    // 2. ADD NEW CRITERIA
    public function store(Request $request)
    {
        $request->validate([
            'category_id' => 'required|integer',
            'criteria_name' => 'required|string|max:255',
            'percentage' => 'required|numeric|min:0|max:100',
            'min_score' => 'required|integer|min:0',
            'max_score' => 'required|integer|min:1',
        ]);

        CategoryCriteria::create([
            'category_id' => $request->category_id,
            'name' => $request->criteria_name,
            'percentage' => $request->percentage,
            'min_score' => $request->min_score,
            'max_score' => $request->max_score,
        ]);

        return redirect()->back();
    }

    // 3. DELETE CRITERIA
    public function destroy($id)
    {
        $criteria = CategoryCriteria::findOrFail($id);
        $criteria->delete();

        return redirect()->back();
    }

    // Fetch the single criteria and send it to the Edit Page
    public function edit($id)
    {
        $criteria = CategoryCriteria::findOrFail($id);
        
        // We also need the category so we can show its name and have a working "Back" button
        $category = Category::findOrFail($criteria->category_id);
        
        return Inertia::render('Criteria/Edit', [
            'criteria' => $criteria,
            'category' => $category
        ]);
    }

    // Save the updated changes
    public function update(Request $request, $id)
    {
        $request->validate([
            'criteria_name' => 'required|string|max:255',
            'percentage' => 'required|numeric|min:0|max:100',
            'min_score' => 'required|integer|min:0',
            'max_score' => 'required|integer|min:1',
        ]);

        $criteria = CategoryCriteria::findOrFail($id);
        
        $criteria->update([
            'name' => $request->criteria_name,
            'percentage' => $request->percentage,
            'min_score' => $request->min_score,
            'max_score' => $request->max_score,
        ]);

        // Magically redirect back to that specific category's criteria list!
        return redirect('/criteria?category_id=' . $criteria->category_id);
    }
}