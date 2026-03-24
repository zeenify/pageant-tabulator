import React, { useState } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { Pencil, Trash2, Key, Users, Plus, AlertTriangle, X, RefreshCw } from 'lucide-react';

export default function Index({ judges, currentSort }) {
    // 1. ADD FORM SETUP
    const { data, setData, post, processing, reset, errors } = useForm({
        number: '',
        name: '',
    });

    const submitJudge = (e) => {
        e.preventDefault();
        post('/judges', { onSuccess: () => reset() });
    };

    // 2. SORTING/FILTERING LOGIC
    const handleSortChange = (e) => {
        // This instantly reloads the data with the new sort parameter!
        router.get('/judges', { sort: e.target.value }, { preserveState: true });
    };

    // 3. DELETE MODAL STATE
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const[judgeToDelete, setJudgeToDelete] = useState(null);

    const confirmDelete = () => {
        router.delete(`/judges/${judgeToDelete.id}`, { onSuccess: () => setShowDeleteModal(false) });
    };

    // 4. PIN GENERATION MODAL STATE
    const [showPinModal, setShowPinModal] = useState(false);
    const [judgeForPin, setJudgeForPin] = useState(null);

    const confirmGeneratePin = () => {
        router.post(`/judges/${judgeForPin.id}/generate-pin`, {}, { onSuccess: () => setShowPinModal(false) });
    };

    return (
        <MainLayout>
            <Head title="Judges" />

            {/* Header & Filter Row */}
            <div className="mb-8 pr-12 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight transition-colors">Judges</h1>
                    <p className="mt-2 text-slate-600 dark:text-slate-400 transition-colors">Manage panel and access PINs</p>
                </div>

                {/* Filter / Sort Tool */}
                <div className="flex flex-col">
                    <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Sort Arrangement</label>
                    <select 
                        value={currentSort} 
                        onChange={handleSortChange}
                        className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm cursor-pointer dark:text-white transition-colors"
                    >
                        <option value="number_asc">No. (Ascending: 1, 2, 3)</option>
                        <option value="number_desc">No. (Descending: 3, 2, 1)</option>
                        <option value="name_asc">Name (A to Z)</option>
                        <option value="name_desc">Name (Z to A)</option>
                    </select>
                </div>
            </div>

            {/* Main Card */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden transition-colors">
                
                {/* Table Header */}
                <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
                    <h2 className="text-lg font-semibold transition-colors">Panel Roster</h2>
                </div>

                {/* Judges Table */}
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 transition-colors">
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase w-24">No.</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Name</th>
                                <th className="px-6 py-3 text-center text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase w-32">PIN</th>
                                <th className="px-6 py-3 text-center text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase w-48">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                            {judges.length > 0 ? (
                                judges.map((judge) => (
                                    <tr key={judge.id} className="hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                                        <td className="px-6 py-4 text-sm font-medium transition-colors">{judge.number}</td>
                                        <td className="px-6 py-4 text-sm transition-colors">{judge.name}</td>
                                        <td className="px-6 py-4 text-sm text-center">
                                            {/* PIN Display Badge */}
                                            <span className="inline-block px-3 py-1 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-md font-mono text-lg tracking-widest text-slate-800 dark:text-slate-200">
                                                {judge.pin}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-2">
                                                {/* Edit Button */}
                                                <Link 
                                                    href={`/judges/${judge.id}/edit`}
                                                    className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </Link>

                                                {/* Generate New PIN Button */}
                                                <button 
                                                    onClick={() => {
                                                        setJudgeForPin(judge);
                                                        setShowPinModal(true);
                                                    }}
                                                    title="Generate New PIN"
                                                    className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/50"
                                                >
                                                    <Key className="w-4 h-4" />
                                                </button>
                                                
                                                {/* Delete Button */}
                                                <button 
                                                    onClick={() => {
                                                        setJudgeToDelete(judge);
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
                                    <td colSpan="4" className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500">
                                            <Users className="w-12 h-12 mb-3 opacity-50" />
                                            <p className="text-sm font-medium">No judges found</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Add Judge Form */}
                <div className="px-6 py-5 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700 transition-colors">
                    <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4 uppercase tracking-wider">Add New Judge</h3>
                    <form className="flex flex-wrap items-end gap-3 sm:gap-4" onSubmit={submitJudge}>
                        
                        {/* Number Input */}
                        <div className="w-24">
                            <label className="block text-sm font-medium mb-1.5 transition-colors">No.</label>
                            <input 
                                type="text" 
                                value={data.number} 
                                onChange={(e) => setData('number', e.target.value)} 
                                placeholder="e.g., 1"
                                className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-center"
                            />
                            {errors.number && <div className="text-red-500 text-xs mt-1">{errors.number}</div>}
                        </div>

                        {/* Name Input */}
                        <div className="flex-1 min-w-[200px]">
                            <label className="block text-sm font-medium mb-1.5 transition-colors">Judge Name</label>
                            <input 
                                type="text" 
                                value={data.name} 
                                onChange={(e) => setData('name', e.target.value)} 
                                placeholder="Enter judge name..."
                                className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                            />
                            {errors.name && <div className="text-red-500 text-xs mt-1">{errors.name}</div>}
                        </div>
                        
                        {/* Add Button */}
                        <div className="w-32 flex-shrink-0">
                            <button 
                                type="submit" 
                                disabled={processing} 
                                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-all h-[44px] whitespace-nowrap disabled:opacity-50"
                            >
                                <Plus className="w-4 h-4" />
                                Add
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* --- MODALS --- */}

            {/* Delete Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 dark:bg-slate-900/80 backdrop-blur-sm transition-all">
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-red-200 dark:border-red-900/50 w-full max-w-md mx-4 overflow-hidden">
                        <div className="px-6 py-4 bg-red-50 dark:bg-red-900/20 border-b border-red-100 dark:border-red-900/50 flex items-center gap-3">
                            <div className="w-10 h-10 bg-red-100 dark:bg-red-900/40 rounded-full flex items-center justify-center">
                                <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-500" />
                            </div>
                            <h3 className="text-lg font-semibold text-red-800 dark:text-red-400">Delete Judge?</h3>
                        </div>
                        <div className="p-6">
                            <p className="text-slate-600 dark:text-slate-400 mb-4">You are about to permanently delete:</p>
                            <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg p-4 mb-6">
                                <p className="text-lg font-semibold text-slate-900 dark:text-white">Judge {judgeToDelete?.number} - {judgeToDelete?.name}</p>
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

            {/* PIN Generation Modal */}
            {showPinModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 dark:bg-slate-900/80 backdrop-blur-sm transition-all">
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-amber-200 dark:border-amber-900/50 w-full max-w-md mx-4 overflow-hidden">
                        <div className="px-6 py-4 bg-amber-50 dark:bg-amber-900/20 border-b border-amber-100 dark:border-amber-900/50 flex items-center gap-3">
                            <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/40 rounded-full flex items-center justify-center">
                                <RefreshCw className="w-5 h-5 text-amber-600 dark:text-amber-500" />
                            </div>
                            <h3 className="text-lg font-semibold text-amber-800 dark:text-amber-400">Generate New PIN?</h3>
                        </div>
                        <div className="p-6">
                            <p className="text-slate-600 dark:text-slate-400 mb-4">This will immediately invalidate the old PIN for:</p>
                            <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg p-4 mb-6">
                                <p className="text-lg font-semibold text-slate-900 dark:text-white">Judge {judgeForPin?.number} - {judgeForPin?.name}</p>
                                <p className="text-sm font-mono text-slate-500 mt-1">Current PIN: {judgeForPin?.pin}</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <button onClick={confirmGeneratePin} className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg transition-all">
                                    <Key className="w-4 h-4" /> Generate
                                </button>
                                <button onClick={() => setShowPinModal(false)} className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-medium rounded-lg transition-all">
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