import React, { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import { LogOut, Save, Clock, CheckCircle } from 'lucide-react';

export default function ScoreSheet({ status, judge, category, criteria, contestants, existingScores }) {
    
    const [scores, setScores] = useState({});
    const[isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        document.documentElement.classList.remove('dark'); 

        if (existingScores && existingScores.length > 0) {
            const initialScores = {};
            existingScores.forEach(score => {
                if (!initialScores[score.contestant_id]) initialScores[score.contestant_id] = {};
                initialScores[score.contestant_id][score.criteria_id] = score.value;
            });
            setScores(initialScores);
        }
    }, [existingScores]);

    const handleScoreChange = (contestantId, criteriaId, value) => {
        setScores(prev => ({
            ...prev,
            [contestantId]: {
                ...prev[contestantId],
                [criteriaId]: value
            }
        }));
    };

    const submitScores = () => {
        setIsSaving(true);
        router.post('/score-sheet', { scores: scores }, {
            preserveScroll: true,
            onFinish: () => setIsSaving(false)
        });
    };

    const handleLogout = () => {
        router.post('/judge/logout');
    };

    // --- MATH LOGIC ---
    const getContestantTotal = (contestantId) => {
        let total = 0;
        criteria?.forEach(c => {
            const val = parseFloat(scores[contestantId]?.[c.id]) || 0;
            total += val;
        });
        return total.toFixed(2);
    };

    const getRanks = () => {
        if (!contestants) return {};
        const totals = contestants.map(c => ({ id: c.id, total: parseFloat(getContestantTotal(c.id)) }));
        totals.sort((a, b) => b.total - a.total);
        const ranks = {};
        totals.forEach((t, index) => { ranks[t.id] = index + 1; });
        return ranks;
    };

    const currentRanks = getRanks();

    // --- WAITING ROOM ---
    if (status === 'waiting') {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4 font-sans">
                <Head title="Waiting Room" />
                <div className="bg-white p-8 rounded-3xl shadow-xl max-w-sm w-full text-center border border-slate-100">
                    <Clock className="w-16 h-16 text-blue-500 mx-auto mb-4 animate-pulse" />
                    <h1 className="text-2xl font-bold text-slate-900 mb-1">Judge {judge.number}</h1>
                    <p className="text-slate-500 mb-8 text-sm">Please wait for the Tabulator to activate the next category.</p>
                    <button onClick={() => window.location.reload()} className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium shadow-md transition-colors mb-3">
                        Refresh Page
                    </button>
                    <button onClick={handleLogout} className="w-full py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-medium transition-colors">
                        Log Out
                    </button>
                </div>
            </div>
        );
    }

    // --- ACTIVE SCORE SHEET ---
    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            <Head title={`Score Sheet - ${category.name}`} />

            {/* NEW STICKY CONTROL CENTER CARD */}
            <div className="sticky top-0 z-50 bg-slate-50/90 backdrop-blur-md pt-4 pb-4 px-4">
                <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    
                    {/* Left Side: Info */}
                    <div className="text-center sm:text-left w-full sm:w-auto">
                        <p className="text-blue-600 text-xs font-extrabold uppercase tracking-widest mb-1">
                            Judge {judge.number} • {judge.name}
                        </p>
                        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
                            {category.name}
                        </h1>
                    </div>

                    {/* Right Side: Actions */}
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <button onClick={handleLogout} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium transition-colors">
                            <LogOut className="w-4 h-4" />
                            <span className="text-sm">Log Out</span>
                        </button>
                        <button onClick={submitScores} disabled={isSaving} className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl font-bold shadow-md transition-all disabled:opacity-50 whitespace-nowrap">
                            {isSaving ? <Clock className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                            <span className="text-sm">{isSaving ? 'Saving...' : 'Submit Scores'}</span>
                        </button>
                    </div>

                </div>
            </div>

            {/* TABLE SECTION (Locked to max-w-5xl so it perfectly matches the Control Card above it) */}
            <div className="max-w-5xl mx-auto px-4 pb-12">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse whitespace-nowrap">
                            
                            <thead>
                                <tr className="bg-slate-100 border-b border-slate-200 text-slate-700">
                                    <th className="px-4 py-3 text-left font-semibold text-sm sticky left-0 bg-slate-100 shadow-[1px_0_0_0_#e2e8f0] z-10">Contestant</th>
                                    
                                    {criteria.map(c => (
                                        <th key={c.id} className="px-4 py-3 text-center font-semibold text-sm">
                                            {c.name}
                                            <div className="text-[10px] text-slate-500 font-normal mt-0.5">({c.min_score} - {c.max_score})</div>
                                        </th>
                                    ))}
                                    
                                    <th className="px-4 py-3 text-center font-bold text-sm bg-blue-50 text-blue-800">Total</th>
                                    <th className="px-4 py-3 text-center font-bold text-sm bg-amber-50 text-amber-800">Rank</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-100">
                                {contestants.map(c => (
                                    <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-4 py-3 text-sm font-medium text-slate-900 sticky left-0 bg-white shadow-[1px_0_0_0_#e2e8f0]">
                                            <span className="text-slate-400 mr-2">#{c.number}</span>
                                            {c.name}
                                        </td>

                                        {criteria.map(crit => (
                                            <td key={crit.id} className="px-2 py-2 text-center">
                                                <input 
                                                    type="number"
                                                    min={crit.min_score}
                                                    max={crit.max_score}
                                                    step="0.01"
                                                    value={scores[c.id]?.[crit.id] || ''}
                                                    onChange={(e) => handleScoreChange(c.id, crit.id, e.target.value)}
                                                    className="w-20 px-2 py-2 text-center text-sm font-semibold border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-inner bg-slate-50 focus:bg-white transition-colors"
                                                />
                                            </td>
                                        ))}

                                        <td className="px-4 py-3 text-center font-bold text-blue-700 bg-blue-50/30">
                                            {getContestantTotal(c.id)}
                                        </td>

                                        <td className="px-4 py-3 text-center font-bold text-amber-700 bg-amber-50/30">
                                            {currentRanks[c.id]}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>

                        </table>
                    </div>
                </div>
            </div>

        </div>
    );
}