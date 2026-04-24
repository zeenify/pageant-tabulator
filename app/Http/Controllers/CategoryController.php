<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Category;
use Inertia\Inertia;     
use Illuminate\Support\Facades\Cache;

use App\Models\Judge;
use App\Models\Contestant;
use App\Models\Score;
use App\Models\CategoryCriteria;

class CategoryController extends Controller
{
    public function index()
    {
        $eventId = session('active_event_id');
        $allCategories = Category::where('event_id', $eventId)->get();
        $activeCategoryId = Cache::get('active_category_id');

        return Inertia::render('Categories/Index',[
            'categories' => $allCategories,
            'activeCategoryId' => $activeCategoryId 
        ]);
    }

    public function activate($id)
    {
        Cache::forever('active_category_id', $id);
        return redirect()->back();
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'category_name' =>['required', 'string', 'min:2', 'max:100', 'regex:/^[a-zA-Z0-9\s\-]+$/'],
            'is_minor' => 'boolean'
        ],[
            'category_name.regex' => 'The category name can only contain letters, numbers, spaces, and hyphens.'
        ]);

        $category = Category::create([
            'event_id' => session('active_event_id'),
            'name' => $validatedData['category_name'],
            'is_minor' => $request->is_minor ?? false
        ]);

        if ($category->is_minor) {
            CategoryCriteria::create([
                'category_id' => $category->id,
                'name' => 'Score',
                'percentage' => 100.00,
                'min_score' => 1,
                'max_score' => 10,
            ]);
        }

        return redirect()->back()->with('success', 'Category successfully added!');
    }

    public function update(Request $request, $id)
    {
        $validatedData = $request->validate([
            'category_name' =>['required', 'string', 'min:2', 'max:100', 'regex:/^[a-zA-Z0-9\s\-]+$/'],
            'is_minor' => 'boolean'
        ]);

        try {
            $category = Category::findOrFail($id);
            $category->update([
                'name' => $validatedData['category_name'],
                'is_minor' => $request->is_minor ?? false
            ]);

            return redirect('/categories')->with('success', 'Category successfully updated!');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Failed to update category.');
        }
    }

    public function edit($id)
    {
        $category = Category::findOrFail($id);
        
        return Inertia::render('Categories/Edit',[
            'category' => $category
        ]);
    }

    public function destroy($id)
    {
        $category = Category::findOrFail($id);
        $category->delete();
        return redirect()->back();
    }

    public function summary($id)
    {
        $eventId = session('active_event_id');
        $category = Category::findOrFail($id);
        $criteria = CategoryCriteria::where('category_id', $id)->get();
        $judges = Judge::where('event_id', $eventId)->orderByRaw('CAST(number AS UNSIGNED) ASC')->get();
        $contestants = Contestant::where('event_id', $eventId)->orderByRaw('CAST(number AS UNSIGNED) ASC')->get();
        $scores = Score::where('category_id', $id)->get();

        return Inertia::render('Categories/Summary',[
            'category' => $category,
            'criteria' => $criteria,
            'judges' => $judges,
            'contestants' => $contestants,
            'scores' => $scores
        ]);
    }

    // Paste this at the bottom of CategoryController.php (before the last closing bracket)
    public function print($id)
    {
        $eventId = session('active_event_id');
        $category = Category::findOrFail($id);
        
        // Fetching the criteria specifically for this category!
        $criteria = CategoryCriteria::where('category_id', $id)->get();
        
        $judges = Judge::where('event_id', $eventId)->orderByRaw('CAST(number AS UNSIGNED) ASC')->get();
        $contestants = Contestant::where('event_id', $eventId)->orderByRaw('CAST(number AS UNSIGNED) ASC')->get();
        $scores = Score::where('category_id', $id)->get();

        return Inertia::render('Categories/Print',[
            'category' => $category,
            'criteria' => $criteria, // <--- This MUST be passed to React
            'judges' => $judges,
            'contestants' => $contestants,
            'scores' => $scores
        ]);
    }
}