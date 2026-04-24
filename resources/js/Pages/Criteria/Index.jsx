import React, { useState } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { ArrowLeft, Pencil, Trash2, ClipboardList, Plus, AlertTriangle, X, ChevronRight, PieChart } from 'lucide-react';

export default function Index({ category, criteria_list }) {
    
    // MATH: Calculate how much percentage is currently used and remaining
    const currentTotal = criteria_list.reduce((sum, crit) => sum + parseFloat(crit.percentage), 0);
    const remainingPercentage = (100 - currentTotal).toFixed(2);
    const isFull = currentTotal >= 100;

    const { data, setData, post, processing, reset, errors } = useForm({
        category_id: category.id,
        criteria_name: '',
        percentage: '',
        min_score: '',
        max_score: '',
    });

    const[showDeleteModal, setShowDeleteModal] = useState(false);
    const [criteriaToDelete, setCriteriaToDelete] = useState(null);

    const submitCriteria = (e) => {
        e.preventDefault();
        post('/criteria', { onSuccess: () => reset('criteria_name', 'percentage', 'min_score', 'max_score') });
    };

    const confirmDelete = () => {
        router.delete(`/criteria/${criteriaToDelete.id}`, { onSuccess: () => setShowDeleteModal(false) });
    };

    return (
        <MainLayout>
            <Head title={`Criteria - ${category.name}`} />

            {/* BREADCRUMBS */}
            <nav className="flex items-center text-sm text-slate-500 dark:text-slate-400 mb-6 font-medium">
                <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Dashboard</Link>
                <ChevronRight className="w-4 h-4 mx-2 opacity-50 flex-shrink-0" />
                <Link href="/categories" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Categories</Link>
                <ChevronRight className="w-4 h-4 mx-2 opacity-50 flex-shrink-0" />
                <span className="text-slate-800 dark:text-slate-200 font-semibold">Criteria</span>
            </nav>

            <div className="mb-8 pr-12">
                <h1 className="text-3xl font-bold tracking-tight transition-colors">Category: {category.name}</h1>
                <p className="mt-2 text-slate-600 dark:text-slate-400 transition-colors">Manage scoring criteria and weights</p>
            </div>

            {/* --- NEW: ALLOCATION PROGRESS BAR --- */}
            <div className="mb-6 bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                <div className="flex justify-between items-end mb-2">
                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-bold">
                        <PieChart className="w-5 h-5 text-blue-500" />
                        Criteria Allocation
                    </div>
                    <span className={`text-sm font-bold ${isFull ? 'text-emerald-600' : 'text-amber-600'}`}>
                        {currentTotal.toFixed(2)}% / 100%
                    </span>
                </div>
                {/* Progress Bar Track */}
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 mb-2 overflow-hidden flex">
                    {criteria_list.map((crit, idx) => {
                        // Alternate colors for the bar segments
                        const colors =['bg-blue-500', 'bg-indigo-500', 'bg-sky-500', 'bg-cyan-500', 'bg-teal-500'];
                        return (
                            <div 
                                key={crit.id} 
                                style={{ width: `${crit.percentage}%` }} 
                                className={`h-3 ${colors[idx % colors.length]} border-r border-white/20`}
                                title={`${crit.name}: ${crit.percentage}%`}
                            ></div>
                        );
                    })}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 text-right font-medium">
                    {isFull ? 'Allocation Complete!' : `${remainingPercentage}% remaining`}
                </p>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden transition-colors">
                
                <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 flex justify-between items-center">
                    <h2 className="text-lg font-semibold transition-colors">Criteria List</h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 transition-colors">
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase w-1/3">Name</th>
                                <th className="px-6 py-3 text-center text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase w-24">%</th>
                                <th className="px-6 py-3 text-center text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase w-24">Min</th>
                                <th className="px-6 py-3 text-center text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase w-24">Max</th>
                                <th className="px-6 py-3 text-center text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase w-32">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                            {criteria_list.length > 0 ? (
                                criteria_list.map((criteria) => (
                                    <tr key={criteria.id} className="hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                                        <td className="px-6 py-4 text-sm font-medium transition-colors align-middle">{criteria.name}</td>
                                        <td className="px-6 py-4 text-sm text-center align-middle font-bold text-blue-600 dark:text-blue-400">{Number(criteria.percentage).toFixed(2)}%</td>
                                        <td className="px-6 py-4 text-sm text-center align-middle">{criteria.min_score}</td>
                                        <td className="px-6 py-4 text-sm text-center align-middle">{criteria.max_score}</td>
                                        <td className="px-6 py-4 align-middle">
                                            <div className="flex items-center justify-center gap-2">
                                                <Link href={`/criteria/${criteria.id}/edit`} className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50">
                                                    <Pencil className="w-4 h-4" />
                                                </Link>                                             
                                                <button onClick={() => { setCriteriaToDelete(criteria); setShowDeleteModal(true); }} className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500">
                                            <ClipboardList className="w-12 h-12 mb-3 opacity-50" />
                                            <p className="text-sm font-medium">No criteria found</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Add Criteria Form */}
                <div className="px-6 py-5 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700 transition-colors">
                    <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4 uppercase tracking-wider">Add New Criteria</h3>
                    
                    <form className="flex flex-wrap items-end gap-3 sm:gap-4" onSubmit={submitCriteria}>
                        <div className="flex-1 min-w-[180px]">
                            <label className="block text-sm font-medium mb-1.5 transition-colors">Criteria Name</label>
                            <input 
                                type="text" required maxLength="100" disabled={isFull}
                                value={data.criteria_name}
                                onChange={e => setData('criteria_name', e.target.value)}
                                placeholder={isFull ? "Category full" : "e.g., Stage Presence"}
                                className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all disabled:opacity-50 disabled:bg-slate-100 dark:disabled:bg-slate-800"
                            />
                            {errors.criteria_name && <div className="text-red-500 text-xs mt-1">{errors.criteria_name}</div>}
                        </div>
                        
                        <div className="w-20">
                            <label className="block text-sm font-medium mb-1.5 transition-colors">%</label>
                            <input 
                                type="number" required min="0" step="0.01" disabled={isFull}
                                max={remainingPercentage} // SMART CAPPING!
                                value={data.percentage}
                                onChange={e => {
                                    let val = e.target.value;
                                    if (val > parseFloat(remainingPercentage)) val = remainingPercentage;
                                    if (val < 0 && val !== '') val = 0;
                                    setData('percentage', val);
                                }}
                                placeholder={remainingPercentage}
                                className="w-full px-2 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-center disabled:opacity-50 disabled:bg-slate-100 dark:disabled:bg-slate-800"
                            />
                            {errors.percentage && <div className="text-red-500 text-xs mt-1">{errors.percentage}</div>}
                        </div>
                        
                        <div className="w-20">
                            <label className="block text-sm font-medium mb-1.5 transition-colors">Min</label>
                            <input 
                                type="number" required min="0" disabled={isFull}
                                value={data.min_score}
                                onChange={e => setData('min_score', e.target.value)}
                                placeholder="0"
                                className="w-full px-2 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-center disabled:opacity-50 disabled:bg-slate-100 dark:disabled:bg-slate-800"
                            />
                            {errors.min_score && <div className="text-red-500 text-xs mt-1">{errors.min_score}</div>}
                        </div>
                        
                        <div className="w-20">
                            <label className="block text-sm font-medium mb-1.5 transition-colors">Max</label>
                            <input 
                                type="number" required min="1" disabled={isFull}
                                value={data.max_score}
                                onChange={e => {
                                    let val = e.target.value;
                                    if (val > parseFloat(remainingPercentage)) val = remainingPercentage;
                                    if (val < 0 && val !== '') val = 0;
                                    
                                    // NEW: Automatically sync the max_score to match the percentage!
                                    // We use parseInt because your database max_score is a whole number (int)
                                    setData(prevData => ({
                                        ...prevData,
                                        percentage: val,
                                        max_score: val ? parseInt(val) : ''
                                    }));
                                }}

                                placeholder="100"
                                className="w-full px-2 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-center disabled:opacity-50 disabled:bg-slate-100 dark:disabled:bg-slate-800"
                            />
                            {errors.max_score && <div className="text-red-500 text-xs mt-1">{errors.max_score}</div>}
                        </div>
                        
                        <div className="w-32 flex-shrink-0">
                            <button 
                                type="submit" 
                                disabled={processing || isFull}
                                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg shadow-sm transition-all h-[44px] whitespace-nowrap disabled:opacity-50"
                            >
                                <Plus className="w-4 h-4" />
                                Add
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Delete Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 dark:bg-slate-900/80 backdrop-blur-sm transition-all">
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-red-200 dark:border-red-900/50 w-full max-w-md mx-4 overflow-hidden">
                        <div className="px-6 py-4 bg-red-50 dark:bg-red-900/20 border-b border-red-100 dark:border-red-900/50 flex items-center gap-3">
                            <div className="w-10 h-10 bg-red-100 dark:bg-red-900/40 rounded-full flex items-center justify-center">
                                <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-500" />
                            </div>
                            <h3 className="text-lg font-semibold text-red-800 dark:text-red-400">Delete Criteria?</h3>
                        </div>
                        <div className="p-6">
                            <p className="text-slate-600 dark:text-slate-400 mb-4">You are about to permanently delete:</p>
                            <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg p-4 mb-6">
                                <p className="text-lg font-semibold text-slate-900 dark:text-white">{criteriaToDelete?.name}</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <button onClick={confirmDelete} className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-all">
                                    <Trash2 className="w-4 h-4" /> Delete
                                </button>
                                <button onClick={() => setShowDeleteModal(false)} className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-medium rounded-lg transition-all">
                                    <X className="w-4 h-4" /> Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </MainLayout>
    );
}