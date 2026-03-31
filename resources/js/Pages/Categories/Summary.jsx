import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { ArrowLeft, Printer, CheckSquare } from 'lucide-react';

export default function Summary({ category, judges, contestants, scores }) {
    
    // 1. Checkbox States (From your sketch!)
    const[showEliminated, setShowEliminated] = useState(false);
    const [showDisqualified, setShowDisqualified] = useState(false);

    // 2. MATH: Calculate total score given by each judge for each contestant
    const getJudgeTotalForContestant = (contestantId, judgeId) => {
        const judgeScores = scores.filter(s => s.contestant_id === contestantId && s.judge_id === judgeId);
        
        if (judgeScores.length === 0) return null; // Judge hasn't scored them yet

        let sum = 0;
        judgeScores.forEach(s => sum += parseFloat(s.value));
        return sum;
    };

    // 3. MATH: Calculate the Grand Total (Average of all judges' scores)
    const getGrandTotal = (contestantId) => {
        let totalSum = 0;
        let judgeCount = 0;

        judges.forEach(j => {
            const score = getJudgeTotalForContestant(contestantId, j.id);
            if (score !== null) {
                totalSum += score;
                judgeCount++;
            }
        });

        // If no judges have scored yet, return 0
        if (judgeCount === 0) return 0;
        
        // Return the Average Score
        return (totalSum / judgeCount).toFixed(2);
    };

    // 4. MATH: Calculate Official Ranks
    const getRanks = () => {
        const totals = contestants.map(c => ({ id: c.id, total: parseFloat(getGrandTotal(c.id)) }));
        
        // Sort highest to lowest
        totals.sort((a, b) => b.total - a.total);
        
        const ranks = {};
        totals.forEach((t, index) => {
            // Only rank them if they actually have a score above 0
            ranks[t.id] = t.total > 0 ? index + 1 : '-'; 
        });
        return ranks;
    };

    const currentRanks = getRanks();

    // 5. FILTER: Hide eliminated/disqualified if checkboxes are unchecked
    const visibleContestants = contestants.filter(c => {
        if (c.status === 'Eliminated' && !showEliminated) return false;
        if (c.status === 'Disqualified' && !showDisqualified) return false;
        return true;
    });

    return (
        <MainLayout>
            <Head title={`${category.name} - Summary`} />

            <div className="max-w-6xl mx-auto">
                
                {/* --- NON-PRINTABLE CONTROLS --- */}
                <div className="print:hidden">
                    <div className="mb-6 flex justify-between items-end">
                        <Link href="/categories" className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors">
                            <ArrowLeft className="w-4 h-4" />
                            <span className="text-sm font-medium">Back to Categories</span>
                        </Link>

                        <button 
                            onClick={() => window.print()}
                            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium shadow-sm transition-colors"
                        >
                            <Printer className="w-4 h-4" />
                            Print Summary
                        </button>
                    </div>

                    <div className="mb-6 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-wrap gap-6">
                        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider w-full mb-1">Filter View</h3>
                        
                        <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
                            <input 
                                type="checkbox" 
                                checked={showEliminated}
                                onChange={(e) => setShowEliminated(e.target.checked)}
                                className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                            />
                            Show Eliminated
                        </label>
                        
                        <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
                            <input 
                                type="checkbox" 
                                checked={showDisqualified}
                                onChange={(e) => setShowDisqualified(e.target.checked)}
                                className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                            />
                            Show Disqualified
                        </label>
                    </div>
                </div>

                {/* --- PRINTABLE SUMMARY SHEET --- */}
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden print:shadow-none print:border-none print:bg-white">
                    
                    <div className="px-6 py-6 border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 print:bg-white print:border-b-2 print:border-black">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white print:text-black">Category: {category.name}</h2>
                        <p className="text-slate-500 dark:text-slate-400 print:text-slate-700 mt-1">Summary of all judges' scores</p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-slate-100 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700 print:bg-slate-100 print:text-black">
                                    <th className="px-4 py-3 text-left font-semibold text-sm text-slate-700 dark:text-slate-300 print:border-b print:border-black">Contestants</th>
                                    
                                    {/* Generate a column for each Judge */}
                                    {judges.map(j => (
                                        <th key={j.id} className="px-4 py-3 text-center font-semibold text-sm text-slate-700 dark:text-slate-300 print:border-b print:border-black">
                                            Judge {j.number}
                                        </th>
                                    ))}
                                    
                                    <th className="px-4 py-3 text-center font-bold text-sm bg-blue-50 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 print:bg-slate-200 print:text-black print:border-b print:border-black">Total</th>
                                    <th className="px-4 py-3 text-center font-bold text-sm bg-amber-50 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400 print:bg-slate-200 print:text-black print:border-b print:border-black">Rank</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-slate-700 print:divide-slate-300">
                                {visibleContestants.length > 0 ? (
                                    visibleContestants.map(c => (
                                        <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors print:text-black">
                                            <td className="px-4 py-3 text-sm font-medium text-slate-900 dark:text-white print:text-black">
                                                <span className="text-slate-400 dark:text-slate-500 mr-2">#{c.number}</span>
                                                {c.name}
                                                
                                                {/* Show a tiny red badge if they are eliminated/disqualified but visible */}
                                                {c.status !== 'Active' && (
                                                    <span className="ml-2 text-[10px] uppercase tracking-wider text-red-500 font-bold print:text-red-700">({c.status})</span>
                                                )}
                                            </td>

                                            {/* Print each Judge's total score for this contestant */}
                                            {judges.map(j => {
                                                const score = getJudgeTotalForContestant(c.id, j.id);
                                                return (
                                                    <td key={j.id} className="px-4 py-3 text-center text-sm font-mono text-slate-600 dark:text-slate-300 print:text-black">
                                                        {score !== null ? score.toFixed(2) : '-'}
                                                    </td>
                                                );
                                            })}

                                            <td className="px-4 py-3 text-center font-bold text-blue-700 bg-blue-50/30 dark:text-blue-400 dark:bg-blue-900/10 print:text-black print:bg-slate-50">
                                                {getGrandTotal(c.id)}
                                            </td>
                                            
                                            <td className="px-4 py-3 text-center font-bold text-amber-700 bg-amber-50/30 dark:text-amber-400 dark:bg-amber-900/10 print:text-black print:bg-slate-50 text-lg">
                                                {currentRanks[c.id]}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={judges.length + 3} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                                            No contestants match your current filter view.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </MainLayout>
    );
}