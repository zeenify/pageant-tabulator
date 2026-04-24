import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { Save, ArrowLeft, ChevronRight } from 'lucide-react';

export default function Edit({ criteria, category, available }) {
    const { data, setData, put, processing, errors } = useForm({
        criteria_name: criteria.name,
        percentage: criteria.percentage,
        min_score: criteria.min_score,
        max_score: criteria.max_score,
    });

    const submitEdit = (e) => {
        e.preventDefault();
        put(`/criteria/${criteria.id}`); 
    };

    return (
        <MainLayout>
            <Head title={`Edit Criteria - ${category.name}`} />

            <div className="max-w-2xl mx-auto">
                
                <nav className="flex items-center text-sm text-slate-500 dark:text-slate-400 mb-6 font-medium">
                    <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Dashboard</Link>
                    <ChevronRight className="w-4 h-4 mx-2 opacity-50 flex-shrink-0" />
                    <Link href="/categories" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Categories</Link>
                    <ChevronRight className="w-4 h-4 mx-2 opacity-50 flex-shrink-0" />
                    <Link href={`/criteria?category_id=${category.id}`} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Criteria</Link>
                    <ChevronRight className="w-4 h-4 mx-2 opacity-50 flex-shrink-0" />
                    <span className="text-slate-800 dark:text-slate-200 font-semibold">Edit Criteria</span>
                </nav>

                <div className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight transition-colors">Edit Criteria</h1>
                    <p className="mt-2 text-slate-600 dark:text-slate-400 transition-colors">Category: {category.name}</p>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden transition-colors">
                    <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 flex justify-between items-center transition-colors">
                        <h2 className="text-lg font-semibold dark:text-slate-100">Criteria Details</h2>
                        <span className="text-sm font-bold text-amber-600 dark:text-amber-500 bg-amber-50 dark:bg-amber-900/30 px-3 py-1 rounded-full">
                            Max Allowed: {parseFloat(available).toFixed(2)}%
                        </span>
                    </div>
                    
                    <form onSubmit={submitEdit} className="p-6">
                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium mb-2 transition-colors">Criteria Name</label>
                                <input type="text" required maxLength="100" value={data.criteria_name} onChange={(e) => setData('criteria_name', e.target.value)} className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
                                {errors.criteria_name && <div className="text-red-500 text-sm mt-1">{errors.criteria_name}</div>}
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium mb-2 transition-colors">Percentage (%)</label>
                                <input 
                                    type="number" required min="0" step="0.01" 
                                    max={available} // SMART CAPPING!
                                    value={data.percentage}
                                    onChange={(e) => {
                                        let val = e.target.value;
                                        if (val > parseFloat(available)) val = available;
                                        if (val < 0 && val !== '') val = 0;
                                        setData('percentage', val);
                                    }}
                                    className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" 
                                />
                                {errors.percentage && <div className="text-red-500 text-sm mt-1">{errors.percentage}</div>}
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2 transition-colors">Min Score</label>
                                    <input type="number" required min="0" value={data.min_score} onChange={(e) => setData('min_score', e.target.value)} className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
                                    {errors.min_score && <div className="text-red-500 text-sm mt-1">{errors.min_score}</div>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2 transition-colors">Max Score</label>
                                    <input type="number" required min="1" value={data.max_score} onChange={(e) => {
                                        let val = e.target.value;
                                        if (val > parseFloat(available)) val = available;
                                        if (val < 0 && val !== '') val = 0;
                                        
                                        // NEW: Auto-sync here too!
                                        setData(prevData => ({
                                            ...prevData,
                                            percentage: val,
                                            max_score: val ? parseInt(val) : ''
                                        }));
                                    }}
                                    className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
                                    {errors.max_score && <div className="text-red-500 text-sm mt-1">{errors.max_score}</div>}
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row items-center gap-3 mt-8">
                            <button disabled={processing} type="submit" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-all disabled:opacity-50">
                                <Save className="w-4 h-4" /> {processing ? 'Saving...' : 'Save Changes'}
                            </button>
                            <Link href={`/criteria?category_id=${category.id}`} className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-medium rounded-lg transition-all">
                                <ArrowLeft className="w-4 h-4" /> Cancel
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </MainLayout>
    );
}