import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { ArrowLeft, Printer } from 'lucide-react'; 

export default function Summary({ category, criteria, judges, contestants, scores }) {
    const[showEliminated, setShowEliminated] = useState(false);
    const [showDisqualified, setShowDisqualified] = useState(false);

    // Grab a single specific score
    const getSpecificScore = (contestantId, judgeId, criteriaId) => {
        const score = scores.find(s => s.contestant_id === contestantId && s.judge_id === judgeId && s.criteria_id === criteriaId);
        return score ? parseFloat(score.value).toFixed(2) : '-';
    };

    // Calculate total for a single judge
    const getJudgeTotalForContestant = (contestantId, judgeId) => {
        const judgeScores = scores.filter(s => s.contestant_id === contestantId && s.judge_id === judgeId);
        if (judgeScores.length === 0) return null;
        let sum = 0;
        judgeScores.forEach(s => sum += parseFloat(s.value));
        return sum;
    };

    // Calculate Grand Total Average
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
        if (judgeCount === 0) return 0;
        return (totalSum / judgeCount).toFixed(2);
    };

    // Calculate Ranks
    const getRanks = () => {
        const totals = contestants.map(c => ({ id: c.id, total: parseFloat(getGrandTotal(c.id)) }));
        totals.sort((a, b) => b.total - a.total);
        const ranks = {};
        totals.forEach((t, index) => {
            ranks[t.id] = t.total > 0 ? index + 1 : '-'; 
        });
        return ranks;
    };

    const currentRanks = getRanks();

    const visibleContestants = contestants.filter(c => {
        if (c.status === 'Eliminated' && !showEliminated) return false;
        if (c.status === 'Disqualified' && !showDisqualified) return false;
        return true;
    });

    return (
        <MainLayout>
            <Head title={`${category.name} - Master Tabulation`} />
            
            <div className="max-w-[1400px] mx-auto">
                
                {/* --- CONTROLS --- */}
                <div className="mb-6 flex justify-between items-end">
                    <Link href="/categories" className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                        <span className="text-sm font-medium">Back to Categories</span>
                    </Link>

                    {/* THIS IS THE NEW PRINT BUTTON (No Excel!) */}
                    <a 
                        href={`/categories/${category.id}/print?showEliminated=${showEliminated}&showDisqualified=${showDisqualified}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-lg font-medium shadow-sm transition-colors"
                    >
                        <Printer className="w-4 h-4" />
                        Print Results
                    </a>
                </div>

                <div className="mb-6 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-wrap gap-6">
                    <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider w-full mb-1">Filter View</h3>
                    <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
                        <input type="checkbox" checked={showEliminated} onChange={(e) => setShowEliminated(e.target.checked)} className="w-5 h-5 rounded border-slate-300 text-blue-600" />
                        Show Eliminated
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
                        <input type="checkbox" checked={showDisqualified} onChange={(e) => setShowDisqualified(e.target.checked)} className="w-5 h-5 rounded border-slate-300 text-blue-600" />
                        Show Disqualified
                    </label>
                </div>

                {/* --- LIVE PREVIEW SHEET --- */}
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                    
                    <div className="px-6 py-6 border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white uppercase">Master Tabulation Preview</h2>
                        <p className="text-slate-500 dark:text-slate-400 font-semibold text-lg mt-1">Segment: {category.name}</p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse border border-slate-300">
                            <thead>
                                <tr className="bg-slate-200 dark:bg-slate-700">
                                    <th colSpan="2" className="px-3 py-2 border border-slate-300 text-center font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
                                        Contestant
                                    </th>
                                    
                                    {judges.map(j => (
                                        <th key={`judge-${j.id}`} colSpan={criteria.length + 1} className="px-3 py-2 border border-slate-300 text-center font-bold uppercase tracking-wider text-slate-800 dark:text-slate-100 bg-slate-300 dark:bg-slate-600">
                                            Judge {j.number}: {j.name}
                                        </th>
                                    ))}
                                    
                                    <th colSpan="2" className="px-3 py-2 border border-slate-300 text-center font-bold uppercase tracking-wider text-blue-900 dark:text-blue-100 bg-blue-100 dark:bg-blue-900/50">
                                        Final Results
                                    </th>
                                </tr>

                                <tr className="bg-slate-100 dark:bg-slate-800">
                                    <th className="px-2 py-2 border border-slate-300 text-center font-semibold text-slate-600 dark:text-slate-300 w-12">No.</th>
                                    <th className="px-4 py-2 border border-slate-300 text-left font-semibold text-slate-600 dark:text-slate-300 min-w-[200px]">Name</th>
                                    
                                    {judges.map(j => (
                                        <React.Fragment key={`headers-${j.id}`}>
                                            {criteria.map(c => (
                                                <th key={`crit-${c.id}`} className="px-2 py-2 border border-slate-300 text-center text-[11px] font-semibold text-slate-600 dark:text-slate-400 leading-tight max-w-[80px]">
                                                    {c.name}<br/>({c.percentage}%)
                                                </th>
                                            ))}
                                            <th className="px-2 py-2 border border-slate-300 text-center font-bold text-slate-800 dark:text-slate-200 bg-slate-200/50 dark:bg-slate-700/50">
                                                Total
                                            </th>
                                        </React.Fragment>
                                    ))}
                                    
                                    <th className="px-3 py-2 border border-slate-300 text-center font-bold text-blue-800 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/20">Grand Total</th>
                                    <th className="px-3 py-2 border border-slate-300 text-center font-bold text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-900/20">Rank</th>
                                </tr>
                            </thead>
                            
                            <tbody className="bg-white dark:bg-slate-900">
                                {visibleContestants.length > 0 ? (
                                    visibleContestants.map(c => (
                                        <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                            <td className="px-2 py-2 border border-slate-300 text-center font-bold text-slate-900 dark:text-white">{c.number}</td>
                                            <td className="px-4 py-2 border border-slate-300 text-left text-sm font-medium text-slate-900 dark:text-white truncate">
                                                {c.name}
                                                {c.status !== 'Active' && <span className="ml-2 text-[9px] uppercase text-red-500 font-bold">({c.status})</span>}
                                            </td>

                                            {judges.map(j => {
                                                const totalScore = getJudgeTotalForContestant(c.id, j.id);
                                                return (
                                                    <React.Fragment key={`scores-${j.id}-${c.id}`}>
                                                        {criteria.map(crit => (
                                                            <td key={`val-${crit.id}`} className="px-2 py-2 border border-slate-300 text-center text-sm font-mono text-slate-600 dark:text-slate-400">
                                                                {getSpecificScore(c.id, j.id, crit.id)}
                                                            </td>
                                                        ))}
                                                        <td className="px-2 py-2 border border-slate-300 text-center font-bold text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-800/50">
                                                            {totalScore !== null ? totalScore.toFixed(2) : '-'}
                                                        </td>
                                                    </React.Fragment>
                                                );
                                            })}

                                            <td className="px-3 py-2 border border-slate-300 text-center font-bold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/10">
                                                {getGrandTotal(c.id)}
                                            </td>
                                            
                                            <td className="px-3 py-2 border border-slate-300 text-center font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/10 text-lg">
                                                {currentRanks[c.id]}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={(judges.length * (criteria.length + 1)) + 4} className="px-6 py-8 text-center text-slate-500 dark:text-slate-400 border border-slate-300">
                                            No data to display.
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