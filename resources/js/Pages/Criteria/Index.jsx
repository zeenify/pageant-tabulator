import React, { useState } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { ArrowLeft, Pencil, Trash2, ClipboardList, Plus, AlertTriangle, X } from 'lucide-react';

export default function Index({ category, criteria_list }) {
    // Form Setup (Notice we include category_id in the hidden data)
    const { data, setData, post, processing, reset, errors } = useForm({
        category_id: category.id,
        criteria_name: '',
        percentage: '',
        min_score: '',
        max_score: '',
    });

    // Delete Modal State
    const[showDeleteModal, setShowDeleteModal] = useState(false);
    const [criteriaToDelete, setCriteriaToDelete] = useState(null);

    const submitCriteria = (e) => {
        e.preventDefault();
        post('/criteria', {
            // Only reset the text boxes, keep the category_id intact!
            onSuccess: () => reset('criteria_name', 'percentage', 'min_score', 'max_score'),
        });
    };

    const confirmDelete = () => {
        router.delete(`/criteria/${criteriaToDelete.id}`, {
            onSuccess: () => setShowDeleteModal(false),
        });
    };

    return (
        <MainLayout>
            <Head title={`Criteria - ${category.name}`} />

            {/* Back Navigation */}
            <div className="mb-6">
                <Link href="/categories" className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                    <span className="text-sm font-medium">Back to Categories</span>
                </Link>
            </div>

            {/* Page Header */}
            <div className="mb-8 pr-12">
                <h1 className="text-3xl font-bold tracking-tight transition-colors">Category: {category.name}</h1>
                <p className="mt-2 text-slate-600 dark:text-slate-400 transition-colors">Manage scoring criteria and weights</p>
            </div>

            {/* Main Card */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden transition-colors">
                
                {/* Table Header */}
                <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 flex justify-between items-center">
                    <h2 className="text-lg font-semibold transition-colors">Criteria</h2>
                    <span className="text-sm text-slate-500 dark:text-slate-400">{criteria_list.length} total</span>
                </div>

                {/* Criteria Table */}
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
                                        <td className="px-6 py-4 text-sm text-center align-middle">{Number(criteria.percentage).toFixed(2)}%</td>
                                        <td className="px-6 py-4 text-sm text-center align-middle">{criteria.min_score}</td>
                                        <td className="px-6 py-4 text-sm text-center align-middle">{criteria.max_score}</td>
                                        <td className="px-6 py-4 align-middle">
                                            <div className="flex items-center justify-center gap-2">
                                                {/* Edit Link */}
                                                <Link 
                                                    href={`/criteria/${criteria.id}/edit`} 
                                                    className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </Link>                                             
                                                {/* Delete Button */}
                                                <button 
                                                    onClick={() => {
                                                        setCriteriaToDelete(criteria);
                                                        setShowDeleteModal(true);
                                                    }}
                                                    className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50"
                                                >
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
                    
                    {/* flex-wrap and items-end perfectly aligns the boxes horizontally */}
                    <form className="flex flex-wrap items-end gap-3 sm:gap-4" onSubmit={submitCriteria}>
                        
                        {/* Name (Takes up all extra space, slightly smaller minimum) */}
                        <div className="flex-1 min-w-[180px]">
                            <label className="block text-sm font-medium mb-1.5 transition-colors">Criteria Name</label>
                            <input 
                                type="text"
                                required              // <-- Added
                                maxLength="100"       // <-- Added
                                value={data.criteria_name}
                                onChange={e => setData('criteria_name', e.target.value)}
                                placeholder="e.g., Stage Presence"
                                className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                            />
                            {errors.criteria_name && <div className="text-red-500 text-xs mt-1">{errors.criteria_name}</div>}
                        </div>
                        
                        {/* Percentage (Reduced to w-20 and px-2) */}
                        <div className="w-20">
                            <label className="block text-sm font-medium mb-1.5 transition-colors">%</label>
                            <input 
                                type="number" 
                                required              // <-- Added
                                min="0"               // <-- Added (No negative percentages)
                                max="100"             // <-- Added (Cannot be over 100%)
                                step="0.01"
                                value={data.percentage}
                                onChange={e => setData('percentage', e.target.value)}
                                placeholder="25"
                                className="w-full px-2 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-center"
                            />
                            {errors.percentage && <div className="text-red-500 text-xs mt-1">{errors.percentage}</div>}
                        </div>
                        
                        {/* Min Score (Reduced to w-20 and px-2) */}
                        <div className="w-20">
                            <label className="block text-sm font-medium mb-1.5 transition-colors">Min</label>
                            <input 
                                type="number" 
                                required              // <-- Added
                                min="0"               // <-- Added
                                value={data.min_score}
                                onChange={e => setData('min_score', e.target.value)}
                                placeholder="0"
                                className="w-full px-2 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-center"
                            />
                            {errors.min_score && <div className="text-red-500 text-xs mt-1">{errors.min_score}</div>}
                        </div>
                        
                        {/* Max Score (Reduced to w-20 and px-2) */}
                        <div className="w-20">
                            <label className="block text-sm font-medium mb-1.5 transition-colors">Max</label>
                            <input 
                                type="number" 
                                required              // <-- Added 
                                min="1"               // <-- Added
                                value={data.max_score}
                                onChange={e => setData('max_score', e.target.value)}
                                placeholder="100"
                                className="w-full px-2 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-center"
                            />
                            {errors.max_score && <div className="text-red-500 text-xs mt-1">{errors.max_score}</div>}
                        </div>
                        
                        {/* Add Button - Given a guaranteed width of w-32 (128px) */}
                        <div className="w-32 flex-shrink-0">
                            <button 
                                type="submit" 
                                disabled={processing}
                                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg shadow-sm transition-all h-[44px] whitespace-nowrap disabled:opacity-50"
                            >
                                <Plus className="w-4 h-4" />
                                Add
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
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
                                <button 
                                    onClick={confirmDelete}
                                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg shadow-sm transition-all"
                                >
                                    <Trash2 className="w-4 h-4" /> Yes, Delete
                                </button>
                                <button 
                                    onClick={() => setShowDeleteModal(false)}
                                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-medium rounded-lg transition-all"
                                >
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