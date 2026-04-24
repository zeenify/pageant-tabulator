import React, { useEffect } from 'react';
import { Head } from '@inertiajs/react';

// Notice we default criteria =[] just to be safe
export default function Print({ category, criteria = [], judges = [], contestants = [], scores =[] }) {
    
    useEffect(() => {
        // Automatically open the print dialog when the page loads
        setTimeout(() => {
            window.print();
        }, 500);
    },[]);

    const params = new URLSearchParams(window.location.search);
    const showEliminated = params.get('showEliminated') === 'true';
    const showDisqualified = params.get('showDisqualified') === 'true';

    const visibleContestants = contestants.filter(c => {
        if (c.status === 'Eliminated' && !showEliminated) return false;
        if (c.status === 'Disqualified' && !showDisqualified) return false;
        return true;
    });

    // 1. Calculate Average per Criteria across all Judges
    const getCriteriaAverage = (contestantId, criteriaId) => {
        const critScores = scores.filter(s => s.contestant_id === contestantId && s.criteria_id === criteriaId);
        if (critScores.length === 0) return null; 
        
        let sum = 0;
        let count = 0;
        judges.forEach(j => {
            const score = critScores.find(s => s.judge_id === j.id);
            if (score) {
                sum += parseFloat(score.value);
                count++;
            }
        });
        
        if (count === 0) return null;
        return sum / count;
    };

    // 2. Get Grand Total 
    const getGrandTotal = (contestantId) => {
        let totalSum = 0;
        let hasScores = false;
        criteria.forEach(c => {
            const avg = getCriteriaAverage(contestantId, c.id);
            if (avg !== null) {
                totalSum += avg;
                hasScores = true;
            }
        });
        return hasScores ? totalSum.toFixed(2) : '0.00';
    };

    // 3. Calculate Ranking
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

    return (
        <div className="min-h-screen bg-white text-black p-8 font-sans">
            <Head title={`Print - ${category?.name || 'Category'}`} />

            <style>
                {`
                @media print {
                    @page { size: landscape; margin: 15mm; }
                    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th, td { border: 1px solid #000; padding: 10px; text-align: center; font-size: 13px; }
                th { font-weight: bold; background-color: #f3f4f6 !important; }
                .text-left { text-align: left; }
                `}
            </style>

            <div className="text-center mb-6">
                <h1 className="text-2xl font-bold uppercase tracking-widest">{category?.name}</h1>
                <p className="text-sm font-semibold mt-1 text-gray-600">Consolidated Tabulation Sheet</p>
            </div>

            <table>
                <thead>
                    <tr>
                        <th style={{ width: '5%' }}>No.</th>
                        <th className="text-left" style={{ width: '25%' }}>Contestant Name</th>
                        
                        {/* Dynamically Generate the Criteria Columns */}
                        {criteria.map(c => (
                            <th key={c.id}>
                                {c.name}<br/>
                                <span style={{ fontSize: '11px', fontWeight: 'normal' }}>({c.percentage}%)</span>
                            </th>
                        ))}
                        
                        <th style={{ width: '10%' }}>Total (100%)</th>
                        <th style={{ width: '10%' }}>Rank</th>
                    </tr>
                </thead>
                <tbody>
                    {visibleContestants.length > 0 ? (
                        visibleContestants.map(c => (
                            <tr key={c.id}>
                                <td className="font-bold">{c.number}</td>
                                <td className="text-left font-semibold">
                                    {c.name}
                                    {c.status !== 'Active' && <span className="ml-1 text-[10px] text-gray-500 uppercase">({c.status})</span>}
                                </td>
                                
                                {/* Dynamically Insert the Average Scores for each Criteria */}
                                {criteria.map(crit => {
                                    const avg = getCriteriaAverage(c.id, crit.id);
                                    return (
                                        <td key={crit.id}>
                                            {avg !== null ? avg.toFixed(2) : '-'}
                                        </td>
                                    );
                                })}
                                
                                <td className="font-bold text-blue-800">
                                    {getGrandTotal(c.id)}
                                </td>
                                <td className="font-bold text-lg text-amber-800">
                                    {currentRanks[c.id]}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={criteria.length + 4} className="text-center text-gray-500 py-4">
                                No data to display.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            <div className="flex justify-around items-end mt-24">
                <div className="flex flex-col items-center">
                    <div className="w-64 border-b border-black mb-2"></div>
                    <p className="font-bold text-sm uppercase">Tabulator / System Admin</p>
                </div>
                <div className="flex flex-col items-center">
                    <div className="w-64 border-b border-black mb-2"></div>
                    <p className="font-bold text-sm uppercase">Chairman of the Board</p>
                </div>
            </div>
        </div>
    );
}