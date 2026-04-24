import React, { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import { LogOut, Save, Clock, CheckCircle, RefreshCw, Medal, Sparkles } from 'lucide-react';

export default function ScoreSheet({ status, judge, category, criteria, contestants, existingScores }) {
    
    const [scores, setScores] = useState({});
    const [isSaving, setIsSaving] = useState(false);
    
    // NEW STATES: For tracking submission status & notifications
    const[hasSubmitted, setHasSubmitted] = useState(false);
    const [showSuccessToast, setShowSuccessToast] = useState(false);

    useEffect(() => {
        document.documentElement.classList.remove('dark'); 

        if (existingScores && existingScores.length > 0) {
            setHasSubmitted(true); // Flag that the judge has already scored this category
            
            const initialScores = {};
            existingScores.forEach(score => {
                if (!initialScores[score.contestant_id]) initialScores[score.contestant_id] = {};
                initialScores[score.contestant_id][score.criteria_id] = score.value;
            });
            setScores(initialScores);
        }
    }, [existingScores]);

    // --- SECURE SCORE CHANGE ---
    const handleScoreChange = (contestantId, crit, value) => {
        // 1. Allow empty box
        if (value === '') {
            setScores(prev => ({ ...prev, [contestantId]: { ...prev[contestantId], [crit.id]: '' } }));
            return;
        }

        // 2. Cap the score instantly if they type over the max
        let numValue = parseFloat(value);
        if (numValue > crit.max_score) {
            value = crit.max_score.toString();
        }

        setScores(prev => ({
            ...prev,
            [contestantId]: {
                ...prev[contestantId],
                [crit.id]: value
            }
        }));
    };

    const submitScores = () => {
        setIsSaving(true);
        router.post('/score-sheet', { scores: scores }, {
            preserveScroll: true,
            onSuccess: () => {
                setHasSubmitted(true);
                setShowSuccessToast(true);
                setTimeout(() => setShowSuccessToast(false), 3000); // Hide toast after 3s
            },
            onFinish: () => setIsSaving(false)
        });
    };

    const handleLogout = () => {
        router.post('/judge/logout');
    };

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

    return (
        <div className="min-h-screen bg-slate-50 font-sans relative pb-20">
            <Head title={`Score Sheet - ${category.name}`} />

            {/* FLOATING SUCCESS TOAST */}
            <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] transition-all duration-500 ease-out ${showSuccessToast ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
                <div className="bg-slate-900 text-white px-6 py-3.5 rounded-full shadow-2xl flex items-center gap-3 font-medium tracking-wide">
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                    Scores Successfully Recorded!
                </div>
            </div>

            <div className="sticky top-0 z-50 bg-slate-50/90 backdrop-blur-md pt-4 pb-4 px-4">
                <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-center sm:text-left w-full sm:w-auto">
                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-2">
                            {/* NEW: MAJOR vs MINOR TAG */}
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest rounded-md border ${category.is_minor ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>
                                {category.is_minor ? <Sparkles className="w-3 h-3" /> : <Medal className="w-3 h-3" />}
                                {category.is_minor ? 'Minor / Special Award' : 'Major Segment'}
                            </span>
                            <span className="text-slate-400">|</span>
                            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">
                                Judge {judge.number} • {judge.name}
                            </p>
                        </div>
                        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
                            {category.name}
                        </h1>
                    </div>
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <button onClick={handleLogout} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium transition-colors">
                            <LogOut className="w-4 h-4" />
                            <span className="text-sm">Log Out</span>
                        </button>
                        
                        {/* DYNAMIC SUBMIT BUTTON */}
                        <button onClick={submitScores} disabled={isSaving} className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold shadow-md transition-all disabled:opacity-50 whitespace-nowrap ${hasSubmitted ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'bg-emerald-600 hover:bg-emerald-700 text-white'}`}>
                            {isSaving ? (
                                <Clock className="w-5 h-5 animate-spin" />
                            ) : (
                                hasSubmitted ? <RefreshCw className="w-5 h-5" /> : <Save className="w-5 h-5" />
                            )}
                            <span className="text-sm">
                                {isSaving ? 'Saving...' : (hasSubmitted ? 'Update Scores' : 'Submit Scores')}
                            </span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 pb-6">
                
                {/* NEW: ALREADY SUBMITTED BANNER */}
                {hasSubmitted && (
                    <div className="mb-4 bg-emerald-50 border border-emerald-200 text-emerald-800 px-5 py-4 rounded-xl flex items-start gap-3 shadow-sm animate-fade-in-up">
                        <CheckCircle className="w-6 h-6 text-emerald-600 flex-shrink-0" />
                        <div>
                            <h4 className="font-bold text-sm">Scores successfully transmitted!</h4>
                            <p className="text-xs text-emerald-700 mt-1 leading-relaxed">
                                Your results for this segment are safely stored in the tabulation system. If you need to make corrections or finalize changes, simply edit the boxes below and click the <strong>"Update Scores"</strong> button.
                            </p>
                        </div>
                    </div>
                )}

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
                                                    value={scores[c.id]?.[crit.id] ?? ''}
                                                    onChange={(e) => handleScoreChange(c.id, crit, e.target.value)}
                                                    onBlur={(e) => {
                                                        let val = parseFloat(e.target.value);
                                                        if (!isNaN(val) && val < crit.min_score) {
                                                            handleScoreChange(c.id, crit, crit.min_score.toString());
                                                        }
                                                    }}
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