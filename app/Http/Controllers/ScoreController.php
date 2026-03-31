<?php

namespace App\Http\Controllers;

use App\Models\Judge;
use App\Models\Category;
use App\Models\Contestant;
use App\Models\CategoryCriteria;
use App\Models\Score;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Cache;

class ScoreController extends Controller
{
    // 1. SHOW THE SCORE SHEET TO THE JUDGE
    public function index()
    {
        // Security: Make sure they actually logged in with a PIN!
        $judgeId = session('judge_id');
        if (!$judgeId) {
            return redirect('/judge/login');
        }

        $judge = Judge::findOrFail($judgeId);
        
        // Read the "Sticky Note" to see which category is currently live
        $activeCategoryId = Cache::get('active_category_id');

        // If you (the Admin) haven't clicked "Activate" on any category yet:
        if (!$activeCategoryId) {
            return Inertia::render('JudgePortal/ScoreSheet',[
                'status' => 'waiting',
                'judge' => $judge
            ]);
        }

        // If there IS an active category, gather all the data for the matrix table!
        $category = Category::findOrFail($activeCategoryId);
        $criteria = CategoryCriteria::where('category_id', $activeCategoryId)->get();
        $contestants = Contestant::where('status', 'Active')->orderByRaw('CAST(number AS UNSIGNED) ASC')->get();

        // Fetch any scores this judge already saved for this category (so they don't disappear on refresh)
        $existingScores = Score::where('judge_id', $judgeId)
                               ->where('category_id', $activeCategoryId)
                               ->get();

        return Inertia::render('JudgePortal/ScoreSheet',[
            'status' => 'active',
            'judge' => $judge,
            'category' => $category,
            'criteria' => $criteria,
            'contestants' => $contestants,
            'existingScores' => $existingScores
        ]);
    }

    // 2. SAVE THE SCORES
    public function store(Request $request)
    {
        $judgeId = session('judge_id');
        $activeCategoryId = Cache::get('active_category_id');

        if (!$judgeId || !$activeCategoryId) {
            return redirect()->back();
        }

        // The React frontend will send us a massive array of all the scores in the table
        $scores = $request->input('scores',[]);

        // Loop through the table and save each box into the database
        foreach ($scores as $contestantId => $criteriaScores) {
            foreach ($criteriaScores as $criteriaId => $value) {
                if ($value !== null && $value !== '') {
                    // updateOrCreate means "If they already scored this, update it. If not, create it!"
                    Score::updateOrCreate([
                            'judge_id' => $judgeId,
                            'category_id' => $activeCategoryId,
                            'contestant_id' => $contestantId,
                            'criteria_id' => $criteriaId,
                        ],
                        ['value' => $value]
                    );
                }
            }
        }

        return redirect()->back();
    }
}