import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { Printer, Trophy, ChevronRight, Medal, Crown, X, Layers } from 'lucide-react';

export default function Index({ categories, contestants, judges, scores }) {
    
    const[showEliminated, setShowEliminated] = useState(false);
    const[showDisqualified, setShowDisqualified] = useState(false);
    
    const [viewMode, setViewMode] = useState('tabulation');
    const[showPrintModal, setShowPrintModal] = useState(false);

    const visibleContestants = contestants.filter(c => {
        if (c.status === 'Eliminated' && !showEliminated) return false;
        if (c.status === 'Disqualified' && !showDisqualified) return false;
        return true;
    });

    const majorCategories = categories.filter(c => !c.is_minor);
    const minorCategories = categories.filter(c => c.is_minor);

    const getCategoryAverage = (contestantId, categoryId) => {
        const categoryScores = scores.filter(s => s.contestant_id === contestantId && s.category_id === categoryId);
        if (categoryScores.length === 0) return null; 

        let totalSum = 0;
        let judgeCount = 0;
        judges.forEach(j => {
            const judgeSpecificScores = categoryScores.filter(s => s.judge_id === j.id);
            if (judgeSpecificScores.length > 0) {
                let judgeSum = 0;
                judgeSpecificScores.forEach(s => judgeSum += parseFloat(s.value));
                totalSum += judgeSum;
                judgeCount++;
            }
        });

        if (judgeCount === 0) return null;
        return (totalSum / judgeCount).toFixed(2);
    };

    // --- UPDATED MATH: Converts total to an Average / Percentage ---
    const getOverallGrandTotal = (contestantId) => {
        if (majorCategories.length === 0) return "0.00";

        let finalScore = 0;
        majorCategories.forEach(cat => {
            const catAvg = getCategoryAverage(contestantId, cat.id);
            if (catAvg !== null) finalScore += parseFloat(catAvg);
        });

        // Divides the sum by the number of categories to get the final average out of 100
        return (finalScore / majorCategories.length).toFixed(2);
    };

    const getCategoryWinner = (categoryId) => {
        let highestScore = -1;
        let winners =[]; 

        visibleContestants.forEach(c => {
            const scoreStr = getCategoryAverage(c.id, categoryId);
            if (scoreStr !== null) {
                const score = parseFloat(scoreStr);
                if (score > highestScore) {
                    highestScore = score;
                    winners = [c];
                } else if (score === highestScore && score > 0) {
                    winners.push(c);
                }
            }
        });
        return { winners, score: highestScore > -1 ? highestScore.toFixed(2) : '-' };
    };

    const getPlacings = () => {
        const totals = visibleContestants.map(c => ({ contestant: c, total: parseFloat(getOverallGrandTotal(c.id)) }));
        totals.sort((a, b) => b.total - a.total); 
        return totals.filter(t => t.total > 0);
    };

    const placings = getPlacings();
    const currentRanks = {};
    placings.forEach((p, i) => currentRanks[p.contestant.id] = i + 1);

    const getRunnerUpTitle = (index) => {
        if (index === 0) return "GRAND CHAMPION";
        if (index === 1) return "1st Runner-Up";
        if (index === 2) return "2nd Runner-Up";
        if (index === 3) return "3rd Runner-Up";
        return `${index}th Runner-Up`;
    };

    return (
        <MainLayout>
            <Head title="Overall Results" />

            <div className="max-w-[1400px] mx-auto">
                
                <nav className="flex items-center text-sm text-slate-500 dark:text-slate-400 mb-3 font-medium">
                    <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Dashboard</Link>
                    <ChevronRight className="w-4 h-4 mx-2 opacity-50 flex-shrink-0" />
                    <span className="text-slate-800 dark:text-slate-200 font-semibold">Overall Results</span>
                </nav>

                <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
                            <Trophy className="w-8 h-8 text-amber-500" />
                            Official Pageant Results
                        </h1>
                        <p className="mt-2 text-slate-600 dark:text-slate-400">Live declaration of winners and final tabulation.</p>
                    </div>

                    <button 
                        onClick={() => setShowPrintModal(true)}
                        className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold shadow-md transition-all"
                    >
                        <Printer className="w-5 h-5" />
                        Print Official Results
                    </button>
                </div>

                {/* FILTER & VIEW TOGGLE BOARD */}
                <div className="mb-8 bg-white dark:bg-slate-800 p-5 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Layers className="w-5 h-5 text-blue-500" />
                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Select View:</label>
                        <select 
                            value={viewMode}
                            onChange={(e) => setViewMode(e.target.value)}
                            className="px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-sm font-semibold focus:ring-2 focus:ring-blue-500 cursor-pointer text-slate-800 dark:text-slate-200"
                        >
                            <option value="tabulation">🏆 Overall Tabulation & Royal Court</option>
                            <option value="major">🏅 Major Segment Winners</option>
                            <option value="minor">✨ Minor & Special Awards</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-6 border-t sm:border-t-0 sm:border-l border-slate-200 dark:border-slate-700 pt-4 sm:pt-0 sm:pl-6">
                        <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300 font-medium text-sm">
                            <input type="checkbox" checked={showEliminated} onChange={(e) => setShowEliminated(e.target.checked)} className="w-5 h-5 rounded border-slate-300 text-blue-600" />
                            Show Eliminated
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300 font-medium text-sm">
                            <input type="checkbox" checked={showDisqualified} onChange={(e) => setShowDisqualified(e.target.checked)} className="w-5 h-5 rounded border-slate-300 text-blue-600" />
                            Show Disqualified
                        </label>
                    </div>
                </div>

                {/* ==========================================
                    VIEW 1: OVERALL TABULATION & ROYAL COURT
                ========================================== */}
                {viewMode === 'tabulation' && (
                    <div className="space-y-8 animate-fade-in-up">
                        {/* The Royal Court */}
                        <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-2xl shadow-sm border border-amber-200 dark:border-amber-800/50 p-6 max-w-4xl mx-auto w-full">
                            <div className="flex items-center justify-center gap-3 mb-6 border-b border-amber-200 dark:border-amber-800/50 pb-4">
                                <Crown className="w-8 h-8 text-amber-600 dark:text-amber-400" />
                                <h2 className="text-2xl font-black uppercase tracking-widest text-amber-900 dark:text-amber-300 text-center">The Royal Court</h2>
                            </div>
                            
                            {placings.length > 0 ? (
                                <div className="space-y-4">
                                    {placings.slice(0, 5).map((placing, index) => (
                                        <div key={placing.contestant.id} className={`flex items-center justify-between p-4 rounded-xl ${index === 0 ? 'bg-amber-500 text-white shadow-md transform scale-[1.02]' : 'bg-white/60 dark:bg-slate-800/50 text-slate-800 dark:text-slate-200 border border-amber-100 dark:border-amber-900/30'}`}>
                                            <div>
                                                <p className={`font-black uppercase tracking-wider ${index === 0 ? 'text-amber-100 text-sm' : 'text-xs text-amber-700 dark:text-amber-500'}`}>
                                                    {getRunnerUpTitle(index)}
                                                </p>
                                                <p className={`font-bold ${index === 0 ? 'text-2xl' : 'text-lg'}`}>
                                                    #{placing.contestant.number} - {placing.contestant.name}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className={`text-xs uppercase font-bold ${index === 0 ? 'text-amber-200' : 'text-slate-400'}`}>Final Score</p>
                                                <p className={`font-black ${index === 0 ? 'text-2xl' : 'text-lg'}`}>{placing.total.toFixed(2)}%</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 text-amber-700/50 dark:text-amber-500/50 font-medium">Scores are still being calculated...</div>
                            )}
                        </div>

                        {/* Master Tabulation */}
                        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
                                <h2 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-widest">Master Tabulation Data</h2>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse border border-slate-300">
                                    <thead>
                                        <tr className="bg-slate-200 dark:bg-slate-700">
                                            <th className="px-4 py-3 border border-slate-300 text-center font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200 w-16">No.</th>
                                            <th className="px-4 py-3 border border-slate-300 text-left font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200 min-w-[250px]">Contestant Name</th>
                                            
                                            {majorCategories.map(cat => (
                                                <th key={`cat-${cat.id}`} className="px-4 py-3 border border-slate-300 text-center font-bold uppercase tracking-wider text-slate-800 dark:text-slate-100 bg-slate-300 dark:bg-slate-600 max-w-[120px]">
                                                    {cat.name}
                                                </th>
                                            ))}
                                            
                                            <th className="px-4 py-3 border border-slate-300 text-center font-black uppercase tracking-wider text-blue-900 dark:text-blue-100 bg-blue-200 dark:bg-blue-900/50 text-sm">FINAL SCORE (%)</th>
                                            <th className="px-4 py-3 border border-slate-300 text-center font-black uppercase tracking-wider text-amber-900 dark:text-amber-100 bg-amber-200 dark:bg-amber-900/50 text-sm">RANK</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white dark:bg-slate-900">
                                        {visibleContestants.length > 0 ? (
                                            visibleContestants.map(c => {
                                                const rank = currentRanks[c.id];
                                                const isChampion = rank === 1;

                                                return (
                                                    <tr key={c.id} className={`transition-colors ${isChampion ? 'bg-amber-50/50 dark:bg-amber-900/10' : 'hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                                                        <td className="px-4 py-3 border border-slate-300 text-center font-bold text-slate-900 dark:text-white text-lg">{c.number}</td>
                                                        <td className="px-4 py-3 border border-slate-300 text-left font-bold text-slate-900 dark:text-white text-base whitespace-nowrap">
                                                            {c.name}
                                                            {isChampion && <Trophy className="inline-block w-4 h-4 ml-2 text-amber-500 mb-1" />}
                                                            {c.status !== 'Active' && <span className="ml-2 text-xs uppercase text-red-500 font-bold">({c.status})</span>}
                                                        </td>

                                                        {majorCategories.map(cat => {
                                                            const avgScore = getCategoryAverage(c.id, cat.id);
                                                            return (
                                                                <td key={`score-${cat.id}-${c.id}`} className="px-4 py-3 border border-slate-300 text-center font-mono text-slate-600 dark:text-slate-300 text-base">
                                                                    {avgScore !== null ? avgScore : <span className="text-slate-300 dark:text-slate-600">-</span>}
                                                                </td>
                                                            );
                                                        })}

                                                        <td className="px-4 py-3 border border-slate-300 text-center font-black text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/10 text-lg">
                                                            {getOverallGrandTotal(c.id)}%
                                                        </td>
                                                        <td className="px-4 py-3 border border-slate-300 text-center font-black text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/10 text-xl">{rank || '-'}</td>
                                                    </tr>
                                                );
                                            })
                                        ) : (
                                            <tr>
                                                <td colSpan={majorCategories.length + 4} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400 border border-slate-300 text-lg">
                                                    No data to display.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}


                {/* ==========================================
                    VIEW 2: MAJOR SEGMENT WINNERS
                ========================================== */}
                {viewMode === 'major' && (
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 animate-fade-in-up max-w-4xl mx-auto">
                        <div className="flex items-center gap-3 mb-6 border-b border-slate-100 dark:border-slate-700 pb-4">
                            <Medal className="w-8 h-8 text-blue-500" />
                            <h2 className="text-2xl font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">Major Segment Winners</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {majorCategories.map(cat => {
                                const result = getCategoryWinner(cat.id);
                                return (
                                    <div key={cat.id} className="flex flex-col bg-slate-50 dark:bg-slate-900/50 p-5 rounded-xl border border-slate-200 dark:border-slate-700">
                                        <div className="font-bold text-sm text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3">{cat.name}</div>
                                        <div className="flex-1">
                                            {result.winners.length > 0 
                                                ? result.winners.map(w => <span key={w.id} className="font-black text-xl text-blue-600 dark:text-blue-400 block mb-1">#{w.number} {w.name}</span>)
                                                : <span className="text-slate-400 text-sm italic">Pending Scores</span>}
                                        </div>
                                        <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center">
                                            <span className="text-xs font-bold text-slate-400 uppercase">Segment Score</span>
                                            <span className="font-mono font-black text-lg text-slate-700 dark:text-slate-300">{result.score}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}


                {/* ==========================================
                    VIEW 3: MINOR & SPECIAL AWARDS
                ========================================== */}
                {viewMode === 'minor' && (
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 animate-fade-in-up max-w-4xl mx-auto">
                        <div className="flex items-center gap-3 mb-6 border-b border-slate-100 dark:border-slate-700 pb-4">
                            <Medal className="w-8 h-8 text-purple-500" />
                            <h2 className="text-2xl font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">Minor & Special Awards</h2>
                        </div>
                        {minorCategories.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {minorCategories.map(cat => {
                                    const result = getCategoryWinner(cat.id);
                                    return (
                                        <div key={cat.id} className="flex flex-col bg-purple-50/50 dark:bg-purple-900/10 p-5 rounded-xl border border-purple-100 dark:border-purple-900/30">
                                            <div className="font-bold text-sm text-purple-800 dark:text-purple-400 uppercase tracking-widest mb-3">{cat.name}</div>
                                            <div className="flex-1">
                                                {result.winners.length > 0 
                                                    ? result.winners.map(w => <span key={w.id} className="font-black text-xl text-purple-700 dark:text-purple-300 block mb-1">#{w.number} {w.name}</span>)
                                                    : <span className="text-slate-400 text-sm italic">Pending Scores</span>}
                                            </div>
                                            <div className="mt-3 pt-3 border-t border-purple-200 dark:border-purple-800/50 flex justify-between items-center">
                                                <span className="text-xs font-bold text-purple-400 uppercase">Segment Score</span>
                                                <span className="font-mono font-black text-lg text-purple-900 dark:text-purple-200">{result.score}</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-12 text-slate-500 font-medium">No minor or special awards have been configured for this event.</div>
                        )}
                    </div>
                )}
            </div>

            {/* PRINT MODAL */}
            {showPrintModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 dark:bg-slate-900/80 backdrop-blur-sm transition-all">
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-emerald-200 dark:border-emerald-900/50 w-full max-w-md mx-4 overflow-hidden">
                        <div className="px-6 py-4 bg-emerald-50 dark:bg-emerald-900/20 border-b border-emerald-100 dark:border-emerald-900/50 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/40 rounded-full flex items-center justify-center">
                                    <Printer className="w-5 h-5 text-emerald-600 dark:text-emerald-500" />
                                </div>
                                <h3 className="text-lg font-semibold text-emerald-800 dark:text-emerald-400">Print Results</h3>
                            </div>
                            <button onClick={() => setShowPrintModal(false)} className="text-emerald-700 dark:text-emerald-400 hover:text-emerald-900">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6">
                            <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm font-medium">Select which section of the results you want to print out:</p>
                            
                            <div className="flex flex-col gap-3">
                                {/* TABULATION ONLY */}
                                <a href={`/results/print?filter=tabulation&showEliminated=${showEliminated}&showDisqualified=${showDisqualified}`} target="_blank" rel="noopener noreferrer" onClick={() => setShowPrintModal(false)} className="inline-flex items-center justify-between px-4 py-3 bg-amber-50 text-amber-700 hover:bg-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:hover:bg-amber-900/40 rounded-lg font-medium transition-colors border border-amber-200 dark:border-amber-800">
                                    Overall Winners & Tabulation
                                    <ChevronRight className="w-4 h-4" />
                                </a>
                                
                                {/* MAJOR ONLY */}
                                <a href={`/results/print?filter=major&showEliminated=${showEliminated}&showDisqualified=${showDisqualified}`} target="_blank" rel="noopener noreferrer" onClick={() => setShowPrintModal(false)} className="inline-flex items-center justify-between px-4 py-3 bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/40 rounded-lg font-medium transition-colors border border-blue-200 dark:border-blue-800">
                                    Major Segment Winners Only
                                    <ChevronRight className="w-4 h-4" />
                                </a>

                                {/* MINOR ONLY */}
                                <a href={`/results/print?filter=minor&showEliminated=${showEliminated}&showDisqualified=${showDisqualified}`} target="_blank" rel="noopener noreferrer" onClick={() => setShowPrintModal(false)} className="inline-flex items-center justify-between px-4 py-3 bg-purple-50 text-purple-700 hover:bg-purple-100 dark:bg-purple-900/20 dark:text-purple-400 dark:hover:bg-purple-900/40 rounded-lg font-medium transition-colors border border-purple-200 dark:border-purple-800">
                                    Minor & Special Awards Only
                                    <ChevronRight className="w-4 h-4" />
                                </a>

                                {/* ALL SEGMENTS */}
                                <a href={`/results/print?filter=all&showEliminated=${showEliminated}&showDisqualified=${showDisqualified}`} target="_blank" rel="noopener noreferrer" onClick={() => setShowPrintModal(false)} className="inline-flex items-center justify-between px-4 py-3 bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600 rounded-lg font-medium transition-colors border border-slate-300 dark:border-slate-600 mt-2">
                                    Complete Report (All Data)
                                    <ChevronRight className="w-4 h-4" />
                                </a>
                            </div>

                            <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700 text-right">
                                <button onClick={() => setShowPrintModal(false)} className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-medium rounded-lg transition-all">
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </MainLayout>
    );
}