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
        $validatedData = $request->validate([
            'category_id' => 'required|integer',
            'criteria_name' =>[
                'required', 'string', 'min:2', 'max:100', 
                'regex:/^[a-zA-Z0-9\s\-\%]+$/' // Allows letters, numbers, spaces, hyphens, and %
            ],
            'percentage' => 'required|numeric|min:0|max:100',
            'min_score' => 'required|integer|min:0',
            'max_score' => 'required|integer|gt:min_score', // MUST be greater than min_score!
        ],[
            'criteria_name.regex' => 'Name can only contain letters, numbers, spaces, hyphens, and %.',
            'max_score.gt' => 'Max score must be greater than the Min score.'
        ]);

        CategoryCriteria::create([
            'category_id' => $request->category_id,
            'name' => $validatedData['criteria_name'],
            'percentage' => $validatedData['percentage'],
            'min_score' => $validatedData['min_score'],
            'max_score' => $validatedData['max_score'],
        ]);

        return redirect()->back();
    }

    // SAVE EDITED CRITERIA
    public function update(Request $request, $id)
    {
        $validatedData = $request->validate([
            'criteria_name' =>[
                'required', 'string', 'min:2', 'max:100', 
                'regex:/^[a-zA-Z0-9\s\-\%]+$/'
            ],
            'percentage' => 'required|numeric|min:0|max:100',
            'min_score' => 'required|integer|min:0',
            'max_score' => 'required|integer|gt:min_score', // MUST be greater than min_score!
        ],[
            'criteria_name.regex' => 'Name can only contain letters, numbers, spaces, hyphens, and %.',
            'max_score.gt' => 'Max score must be greater than the Min score.'
        ]);

        $criteria = CategoryCriteria::findOrFail($id);
        
        $criteria->update([
            'name' => $validatedData['criteria_name'],
            'percentage' => $validatedData['percentage'],
            'min_score' => $validatedData['min_score'],
            'max_score' => $validatedData['max_score'],
        ]);

        return redirect('/criteria?category_id=' . $criteria->category_id);
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

    
}