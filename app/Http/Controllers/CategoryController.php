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
        $request->validate([
            'category_name' => 'required|string|max:255',
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
        $request->validate([
            'category_name' => 'required|string|max:255',
        ]);

        $category = Category::findOrFail($id);
        $category->update([
            'name' => $request->category_name
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
