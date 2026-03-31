<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Category; // Bring in our Model
use Inertia\Inertia;     
use Illuminate\Support\Facades\Cache;

use App\Models\Judge;
use App\Models\Contestant;
use App\Models\Score;

class CategoryController extends Controller
{
    public function index()
    {
        $allCategories = Category::all();
        
        // Check the "sticky note" to see which category is currently active
        $activeCategoryId = Cache::get('active_category_id');

        return Inertia::render('Categories/Index',[
            'categories' => $allCategories,
            'activeCategoryId' => $activeCategoryId // Pass it to React!
        ]);
    }

    public function activate($id)
    {
        // Save it forever (until you activate a different one)
        Cache::forever('active_category_id', $id);
        
        return redirect()->back();
    }


    public function store(Request $request)
    {
        // 1. Validate: Make sure the user actually typed a name
       $validatedData = $request->validate([
            'category_name' =>[
                'required', 
                'string', 
                'min:2',          // Must be at least 2 characters long
                'max:100',        // Cannot be longer than 100 characters
                'regex:/^[a-zA-Z0-9\s\-]+$/' // ONLY allows letters, numbers, spaces, and hyphens (No weird symbols!)
            ],
        ],[
            // Custom Error Message if they try to use weird symbols
            'category_name.regex' => 'The category name can only contain letters, numbers, spaces, and hyphens.'
        ]);

        // 2. Save it to the database! 
        // (This works because we added $fillable in the Model earlier!)
        Category::create([
            'name' => $request->category_name
        ]);

        // 3. Tell the browser to just stay on the same page
        // Inertia will automatically refresh the React data in the background!
        return redirect()->back();
    }

    public function edit($id)
    {
        $category = Category::findOrFail($id);
        
        return Inertia::render('Categories/Edit',[
            'category' => $category
        ]);
    }

    // 2. Save the updated changes to the database
    public function update(Request $request, $id)
    {
        // ADDED STRICT VALIDATION HERE TOO!
        $validatedData = $request->validate([
            'category_name' =>[
                'required', 
                'string', 
                'min:2',
                'max:100',
                'regex:/^[a-zA-Z0-9\s\-]+$/'
            ],
        ],[
            'category_name.regex' => 'The category name can only contain letters, numbers, spaces, and hyphens.'
        ]);

        $category = Category::findOrFail($id);
        $category->update([
            'name' => $validatedData['category_name'] // Use the cleaned data!
        ]);

        // Go back to the main categories list
        return redirect('/categories');
    }

    // 3. Delete the category from the database
    public function destroy($id)
    {
        $category = Category::findOrFail($id);
        $category->delete();

        // Stay on the page (Inertia will remove it from the screen instantly!)
        return redirect()->back();
    }

    // 5. PRINT SUMMARY PAGE
    public function summary($id)
    {
        $category = Category::findOrFail($id);
        
        // Gather ALL the data needed for the Master Sheet
        $judges = Judge::orderByRaw('CAST(number AS UNSIGNED) ASC')->get();
        $contestants = Contestant::orderByRaw('CAST(number AS UNSIGNED) ASC')->get();
        $scores = Score::where('category_id', $id)->get();

        return Inertia::render('Categories/Summary',[
            'category' => $category,
            'judges' => $judges,
            'contestants' => $contestants,
            'scores' => $scores
        ]);
    }



}
