import React, { useEffect } from 'react';
import { Head } from '@inertiajs/react';

export default function Print({ categories = [], contestants = [], judges =[], scores =[] }) {
    
    useEffect(() => {
        setTimeout(() => {
            window.print();
        }, 800);
    },[]);

    const params = new URLSearchParams(window.location.search);
    const showEliminated = params.get('showEliminated') === 'true';
    const showDisqualified = params.get('showDisqualified') === 'true';
    const filter = params.get('filter') || 'all';

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
        <div className="min-h-screen bg-white text-black p-8 font-sans max-w-[1400px] mx-auto">
            <Head title="Print - Official Pageant Results" />

            <style>
                {`
                @media print {
                    @page { size: landscape; margin: 15mm; }
                    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                    .page-break { page-break-before: always; }
                }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th, td { border: 1px solid #000; padding: 10px; text-align: center; font-size: 14px; }
                th { font-weight: bold; background-color: #f3f4f6 !important; }
                .text-left { text-align: left; }
                `}
            </style>

            <div className="text-center mb-10">
                <h1 className="text-4xl font-black uppercase tracking-widest mb-2">Official Pageant Results</h1>
                <div className="w-48 h-1 bg-black mx-auto mb-2"></div>
                <p className="text-xl font-bold text-gray-700">
                    {filter === 'tabulation' && 'Master Tabulation & Overall Winners'}
                    {filter === 'major' && 'Major Segment Winners'}
                    {filter === 'minor' && 'Minor & Special Awards'}
                    {filter === 'all' && 'List of Winners & Awardees'}
                </p>
            </div>

            <div className="flex flex-wrap -mx-4 justify-center">
                
                {/* THE ROYAL COURT */}
                {(filter === 'all' || filter === 'tabulation') && (
                    <div className={`px-4 mb-8 ${filter === 'all' ? 'w-full md:w-1/2' : 'w-full max-w-3xl'}`}>
                        <div className="border-2 border-black p-6 bg-amber-50/20 h-full shadow-sm">
                            <h2 className="text-2xl font-black uppercase text-center mb-6 tracking-wider border-b border-black pb-4">The Royal Court</h2>
                            
                            {placings.length > 0 ? (
                                <div className="space-y-6">
                                    {placings.slice(0, 5).map((placing, index) => (
                                        <div key={placing.contestant.id} className={`flex items-center justify-between ${index === 0 ? 'bg-amber-100 p-4 border border-amber-300' : 'p-2 border-b border-gray-200'}`}>
                                            <div>
                                                <p className={`font-black uppercase ${index === 0 ? 'text-xl text-amber-900' : 'text-lg text-gray-800'}`}>
                                                    {getRunnerUpTitle(index)}
                                                </p>
                                                <p className={`font-bold ${index === 0 ? 'text-2xl mt-1' : 'text-xl'}`}>
                                                    No. {placing.contestant.number} - {placing.contestant.name}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm text-gray-500 uppercase font-bold">Final Score</p>
                                                <p className={`font-black ${index === 0 ? 'text-xl text-blue-800' : 'text-lg'}`}>{placing.total.toFixed(2)}%</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-center text-gray-500">No results tabulated yet.</p>
                            )}
                        </div>
                    </div>
                )}

                {/* AWARDS COLUMNS */}
                {(filter === 'all' || filter === 'major' || filter === 'minor') && (
                    <div className={`px-4 mb-8 flex flex-col gap-6 ${filter === 'all' ? 'w-full md:w-1/2' : 'w-full max-w-4xl'}`}>
                        
                        {/* MAJOR SEGMENT WINNERS */}
                        {(filter === 'all' || filter === 'major') && (
                            <div className="border border-black p-5 h-full shadow-sm">
                                <h2 className="text-lg font-black uppercase mb-4 tracking-wider bg-gray-100 p-2">Major Segment Winners</h2>
                                <div className="space-y-3">
                                    {majorCategories.map(cat => {
                                        const result = getCategoryWinner(cat.id);
                                        return (
                                            <div key={cat.id} className="flex justify-between items-center border-b border-gray-200 pb-2">
                                                <div className="w-1/3 font-bold text-sm">{cat.name}</div>
                                                <div className="w-1/2 text-left">
                                                    {result.winners.length > 0 
                                                        ? result.winners.map(w => <span key={w.id} className="font-bold text-base block">No. {w.number} - {w.name}</span>)
                                                        : <span className="text-gray-400 italic">No scores</span>}
                                                </div>
                                                <div className="w-1/6 text-right font-mono font-bold">{result.score}</div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* MINOR AWARDS */}
                        {(filter === 'all' || filter === 'minor') && minorCategories.length > 0 && (
                            <div className="border border-black p-5 h-full shadow-sm mt-4">
                                <h2 className="text-lg font-black uppercase mb-4 tracking-wider bg-gray-100 p-2 text-purple-900">Special / Minor Awards</h2>
                                <div className="space-y-3">
                                    {minorCategories.map(cat => {
                                        const result = getCategoryWinner(cat.id);
                                        return (
                                            <div key={cat.id} className="flex justify-between items-center border-b border-gray-200 pb-2">
                                                <div className="w-1/3 font-bold text-sm text-purple-800">{cat.name}</div>
                                                <div className="w-1/2 text-left">
                                                    {result.winners.length > 0 
                                                        ? result.winners.map(w => <span key={w.id} className="font-bold text-base block">No. {w.number} - {w.name}</span>)
                                                        : <span className="text-gray-400 italic">No scores</span>}
                                                </div>
                                                <div className="w-1/6 text-right font-mono font-bold text-gray-500">{result.score}</div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* TABULATION SHEET */}
            {(filter === 'all' || filter === 'tabulation') && (
                <>
                    {filter === 'all' && <div className="page-break"></div>}

                    <div className="text-center mb-6 mt-6">
                        <h2 className="text-2xl font-bold uppercase tracking-widest">Master Tabulation Breakdown</h2>
                        <p className="text-sm font-semibold mt-1 text-gray-600">Breakdown of Major Category Scores</p>
                    </div>

                    <table>
                        <thead>
                            <tr>
                                <th style={{ width: '5%' }}>No.</th>
                                <th className="text-left" style={{ width: '25%' }}>Contestant Name</th>
                                {majorCategories.map(cat => (
                                    <th key={cat.id}>{cat.name}</th>
                                ))}
                                <th style={{ width: '12%', backgroundColor: '#dbeafe !important' }}>FINAL SCORE (%)</th>
                                <th style={{ width: '10%', backgroundColor: '#fef3c7 !important' }}>RANK</th>
                            </tr>
                        </thead>
                        <tbody>
                            {visibleContestants.length > 0 ? (
                                visibleContestants.map(c => {
                                    const rank = currentRanks[c.id] || '-';
                                    const isChampion = rank === 1;

                                    return (
                                        <tr key={c.id} style={{ backgroundColor: isChampion ? 'rgba(254, 243, 199, 0.4)' : 'transparent' }}>
                                            <td className="font-bold text-lg">{c.number}</td>
                                            <td className="text-left font-bold text-base">
                                                {c.name}
                                                {c.status !== 'Active' && <span className="ml-2 text-[11px] text-gray-500 uppercase">({c.status})</span>}
                                            </td>
                                            
                                            {majorCategories.map(cat => {
                                                const avgScore = getCategoryAverage(c.id, cat.id);
                                                return (
                                                    <td key={`${cat.id}-${c.id}`} className="font-mono">
                                                        {avgScore !== null ? avgScore : '-'}
                                                    </td>
                                                );
                                            })}
                                            
                                            <td className="font-black text-xl text-blue-800" style={{ backgroundColor: 'rgba(219, 234, 254, 0.4)' }}>
                                                {getOverallGrandTotal(c.id)}%
                                            </td>
                                            <td className="font-black text-2xl text-amber-800" style={{ backgroundColor: 'rgba(254, 243, 199, 0.6)' }}>
                                                {rank}
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={majorCategories.length + 4} className="text-center text-gray-500 py-6 text-lg">
                                        No data to display.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </>
            )}

            <div className="flex justify-around items-end mt-24 pb-12">
                <div className="flex flex-col items-center">
                    <div className="w-72 border-b-2 border-black mb-2"></div>
                    <p className="font-bold text-sm uppercase">Tabulator / System Admin</p>
                </div>
                <div className="flex flex-col items-center">
                    <div className="w-72 border-b-2 border-black mb-2"></div>
                    <p className="font-bold text-sm uppercase">Chairman of the Board</p>
                </div>
            </div>
        </div>
    );
}