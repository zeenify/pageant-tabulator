<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Category;
use App\Models\Contestant;
use App\Models\Judge;
use App\Models\Score;

class ResultController extends Controller
{
    public function index()
    {
        $eventId = session('active_event_id');

        // Fetch ALL categories so we can announce minor awards too!
        $categories = Category::where('event_id', $eventId)->get();
        $contestants = Contestant::where('event_id', $eventId)->orderByRaw('CAST(number AS UNSIGNED) ASC')->get();
        $judges = Judge::where('event_id', $eventId)->get();
        
        $categoryIds = $categories->pluck('id');
        $scores = Score::whereIn('category_id', $categoryIds)->get();

        return Inertia::render('Results/Index',[
            'categories' => $categories,
            'contestants' => $contestants,
            'judges' => $judges,
            'scores' => $scores
        ]);
    }

    public function print()
    {
        $eventId = session('active_event_id');

        $categories = Category::where('event_id', $eventId)->get();
        $contestants = Contestant::where('event_id', $eventId)->orderByRaw('CAST(number AS UNSIGNED) ASC')->get();
        $judges = Judge::where('event_id', $eventId)->get();
        
        $categoryIds = $categories->pluck('id');
        $scores = Score::whereIn('category_id', $categoryIds)->get();

        return Inertia::render('Results/Print',[
            'categories' => $categories,
            'contestants' => $contestants,
            'judges' => $judges,
            'scores' => $scores
        ]);
    }
}