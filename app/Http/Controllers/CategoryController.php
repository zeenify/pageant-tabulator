<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Category; // Bring in our Model
use Inertia\Inertia;     

class CategoryController extends Controller
{
    public function index()
    {
        // 1. Fetch all categories from the database
        $allCategories = Category::all();

        // 2. Send them across the bridge to a React page called 'Categories/Index'
        return Inertia::render('Categories/Index',[
            'categories' => $allCategories
        ]);
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



}
