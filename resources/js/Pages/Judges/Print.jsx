import React, { useEffect } from 'react';
import { Head } from '@inertiajs/react';

export default function Print({ judge, categories =[], criteria = [], contestants = [], scores =[] }) {
    
    useEffect(() => {
        // Automatically open the print dialog when the page loads
        setTimeout(() => {
            window.print();
        }, 500);
    },[]);

    // 1. Read what we want to print from the URL (main, minor, or all)
    const params = new URLSearchParams(window.location.search);
    const filterType = params.get('filter') || 'all';

    // 2. Filter the categories array before we map over it!
    const filteredCategories = categories.filter(c => {
        const isMinor = Boolean(c.is_minor);
        if (filterType === 'main') return !isMinor; // Show only if is_minor is false
        if (filterType === 'minor') return isMinor; // Show only if is_minor is true
        return true; // Show everything if 'all'
    });

    // 3. Set a dynamic subtitle based on the filter
    let subtitle = "Official Score Summary (All Segments)";
    if (filterType === 'main') subtitle = "Official Score Summary (Main Categories)";
    if (filterType === 'minor') subtitle = "Official Score Summary (Minor Awards)";

    // Helper function to grab a specific score given by this judge
    const getScore = (contestantId, criteriaId) => {
        const score = scores.find(s => s.contestant_id === contestantId && s.criteria_id === criteriaId);
        return score ? parseFloat(score.value) : null;
    };

    // Calculate total score this judge gave to a contestant in a specific category
    const getCategoryTotal = (contestantId, categoryCriteria) => {
        let total = 0;
        let hasScore = false;

        categoryCriteria.forEach(crit => {
            const score = getScore(contestantId, crit.id);
            if (score !== null) {
                total += score;
                hasScore = true;
            }
        });

        return hasScore ? total.toFixed(2) : '-';
    };

    return (
        <div className="min-h-screen bg-white text-black p-8 font-sans">
            <Head title={`Print - Judge ${judge?.number}`} />

            <style>
                {`
                @media print {
                    @page { size: portrait; margin: 15mm; }
                    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                    .page-break-inside-avoid { page-break-inside: avoid; }
                }
                table { width: 100%; border-collapse: collapse; margin-top: 10px; margin-bottom: 30px; }
                th, td { border: 1px solid #000; padding: 8px; text-align: center; font-size: 13px; }
                th { font-weight: bold; background-color: #f3f4f6 !important; }
                .text-left { text-align: left; }
                `}
            </style>

            <div className="text-center mb-8 border-b-2 border-black pb-6">
                <h1 className="text-3xl font-bold uppercase tracking-widest">Judge {judge?.number}</h1>
                <h2 className="text-xl font-semibold mt-1">{judge?.name}</h2>
                <p className="text-sm font-semibold mt-2 text-gray-600">{subtitle}</p>
            </div>

            {/* Loop through FILTERED categories and create a table for each */}
            {filteredCategories.length > 0 ? (
                filteredCategories.map((category) => {
                    // Get criteria only for this specific category
                    const categoryCriteria = criteria.filter(c => c.category_id === category.id);
                    
                    return (
                        <div key={category.id} className="page-break-inside-avoid">
                            <h3 className="text-lg font-bold uppercase tracking-wide bg-gray-100 p-2 border border-black border-b-0">
                                {category.name}
                            </h3>
                            
                            <table>
                                <thead>
                                    <tr>
                                        <th style={{ width: '5%' }}>No.</th>
                                        <th className="text-left" style={{ width: '35%' }}>Contestant Name</th>
                                        
                                        {categoryCriteria.map(c => (
                                            <th key={c.id}>
                                                {c.name}<br/>
                                                <span style={{ fontSize: '11px', fontWeight: 'normal' }}>({c.min_score}-{c.max_score} pts)</span>
                                            </th>
                                        ))}
                                        
                                        <th style={{ width: '15%' }}>Total Score</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {contestants.length > 0 ? (
                                        contestants.map(c => (
                                            <tr key={c.id}>
                                                <td className="font-bold">{c.number}</td>
                                                <td className="text-left font-semibold">
                                                    {c.name}
                                                    {c.status !== 'Active' && <span className="ml-1 text-[10px] text-gray-500 uppercase">({c.status})</span>}
                                                </td>
                                                
                                                {/* Show the score for each criteria */}
                                                {categoryCriteria.map(crit => {
                                                    const score = getScore(c.id, crit.id);
                                                    return (
                                                        <td key={crit.id} className="font-mono">
                                                            {score !== null ? score.toFixed(2) : '-'}
                                                        </td>
                                                    );
                                                })}
                                                
                                                <td className="font-bold text-blue-800">
                                                    {getCategoryTotal(c.id, categoryCriteria)}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={categoryCriteria.length + 3} className="text-center text-gray-500 py-4">
                                                No contestants found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    );
                })
            ) : (
                <div className="text-center py-12 text-gray-500 text-lg italic">
                    No segments found matching your filter selection.
                </div>
            )}

            <div className="flex justify-start items-end mt-20">
                <div className="flex flex-col items-center">
                    <div className="w-64 border-b border-black mb-2"></div>
                    <p className="font-bold text-sm uppercase">Judge {judge?.number}: {judge?.name}</p>
                    <p className="text-xs text-gray-600 mt-1">Signature over Printed Name</p>
                </div>
            </div>
        </div>
    );
}