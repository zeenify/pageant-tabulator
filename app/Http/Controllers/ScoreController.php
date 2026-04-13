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
        $activeCategoryId = Cache::get('active_category_id');

        // Fetch the active category (if one exists)
        $category = null;
        if ($activeCategoryId) {
            $category = Category::find($activeCategoryId);
        }

        // FRANCHISE SECURITY CHECK:
        // If there is no active category, OR if the active category belongs to a DIFFERENT pageant,
        // we show the "Waiting for Admin" screen.
        if (!$category || $category->event_id !== $judge->event_id) {
            return Inertia::render('JudgePortal/ScoreSheet',[
                'status' => 'waiting',
                'judge' => $judge
            ]);
        }

        // If it passes the check, grab criteria for this category
        $criteria = CategoryCriteria::where('category_id', $activeCategoryId)->get();
        
        // Grab contestants (ONLY the ones that belong to this specific pageant!)
        $contestants = Contestant::where('event_id', $judge->event_id)
                                 ->where('status', 'Active')
                                 ->orderByRaw('CAST(number AS UNSIGNED) ASC')
                                 ->get();

        // Fetch any scores this judge already saved for this category
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

        $scores = $request->input('scores',[]);

        foreach ($scores as $contestantId => $criteriaScores) {
            foreach ($criteriaScores as $criteriaId => $value) {
                if ($value !== null && $value !== '') {
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