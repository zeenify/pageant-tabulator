<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\CategoryCriteria;
use Inertia\Inertia;
use Illuminate\Http\Request;

class CriteriaController extends Controller
{
    public function index(Request $request)
    {
        $categoryId = $request->query('category_id');
        $category = Category::findOrFail($categoryId);
        $criteria = CategoryCriteria::where('category_id', $categoryId)->get();

        return Inertia::render('Criteria/Index',[
            'category' => $category,
            'criteria_list' => $criteria
        ]);
    }

    public function store(Request $request)
    {
        // Calculate how much percentage is already used in this category
        $currentTotal = CategoryCriteria::where('category_id', $request->category_id)->sum('percentage');
        $available = 100 - $currentTotal;

        $validatedData = $request->validate([
            'category_id' => 'required|integer',
            'criteria_name' =>['required', 'string', 'min:2', 'max:100', 'regex:/^[a-zA-Z0-9\s\-\%]+$/'],
            // The Max allowed is whatever is left out of 100!
            'percentage' => "required|numeric|min:0|max:{$available}",
            'min_score' => 'required|integer|min:0',
            'max_score' => 'required|integer|gt:min_score',
        ],[
            'criteria_name.regex' => 'Name can only contain letters, numbers, spaces, hyphens, and %.',
            'max_score.gt' => 'Max score must be greater than the Min score.',
            'percentage.max' => "You only have {$available}% remaining to allocate."
        ]);

        try {
            CategoryCriteria::create([
                'category_id' => $request->category_id,
                'name' => $validatedData['criteria_name'],
                'percentage' => $validatedData['percentage'],
                'min_score' => $validatedData['min_score'],
                'max_score' => $validatedData['max_score'],
            ]);
            return redirect()->back()->with('success', 'Criteria added successfully!');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Failed to add criteria.');
        }
    }

    public function edit($id)
    {
        $criteria = CategoryCriteria::findOrFail($id);
        $category = Category::findOrFail($criteria->category_id);
        
        // Calculate the available percentage (excluding THIS criteria's current percentage so we can edit it)
        $otherCriteriaTotal = CategoryCriteria::where('category_id', $category->id)
                                              ->where('id', '!=', $id)
                                              ->sum('percentage');
        $available = 100 - $otherCriteriaTotal;

        return Inertia::render('Criteria/Edit',[
            'criteria' => $criteria,
            'category' => $category,
            'available' => $available // Send this to React!
        ]);
    }

    public function update(Request $request, $id)
    {
        $criteria = CategoryCriteria::findOrFail($id);
        
        $otherCriteriaTotal = CategoryCriteria::where('category_id', $criteria->category_id)
                                              ->where('id', '!=', $id)
                                              ->sum('percentage');
        $available = 100 - $otherCriteriaTotal;

        $validatedData = $request->validate([
            'criteria_name' =>['required', 'string', 'min:2', 'max:100', 'regex:/^[a-zA-Z0-9\s\-\%]+$/'],
            'percentage' => "required|numeric|min:0|max:{$available}",
            'min_score' => 'required|integer|min:0',
            'max_score' => 'required|integer|gt:min_score',
        ],[
            'criteria_name.regex' => 'Name can only contain letters, numbers, spaces, hyphens, and %.',
            'max_score.gt' => 'Max score must be greater than the Min score.',
            'percentage.max' => "You only have {$available}% remaining to allocate."
        ]);

        try {
            $criteria->update([
                'name' => $validatedData['criteria_name'],
                'percentage' => $validatedData['percentage'],
                'min_score' => $validatedData['min_score'],
                'max_score' => $validatedData['max_score'],
            ]);
            return redirect('/criteria?category_id=' . $criteria->category_id)->with('success', 'Criteria updated!');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Failed to update criteria.');
        }
    }

    public function destroy($id)
    {
        try {
            $criteria = CategoryCriteria::findOrFail($id);
            $criteria->delete();
            return redirect()->back()->with('success', 'Criteria deleted successfully!');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Cannot delete this criteria.');
        }
    }
}