import React, { useState } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { Pencil, Trash2, Ban, UserMinus, Users, Plus, AlertTriangle, X, ChevronRight, CheckCircle2 } from 'lucide-react';

export default function Index({ contestants, currentSort }) {
    const { data, setData, post, processing, reset, errors } = useForm({
        number: '',
        name: '',
    });

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [contestantToDelete, setContestantToDelete] = useState(null);

    const submitContestant = (e) => {
        e.preventDefault();
        post('/contestants', { onSuccess: () => reset() });
    };

    const confirmDelete = () => {
        router.delete(`/contestants/${contestantToDelete.id}`, { onSuccess: () => setShowDeleteModal(false) });
    };

    const handleSortChange = (e) => {
        router.get('/contestants', { sort: e.target.value }, { preserveState: true });
    };

    const changeStatus = (id, status) => {
        router.patch(`/contestants/${id}/status/${status}`);
    };

    return (
        <MainLayout>
            <Head title="Contestants" />

            {/* Header & Filter Row */}
            <div className="mb-8 pr-12 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    {/* BREADCRUMBS */}
                    <nav className="flex items-center text-sm text-slate-500 dark:text-slate-400 mb-3 font-medium">
                        <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Dashboard</Link>
                        <ChevronRight className="w-4 h-4 mx-2 opacity-50 flex-shrink-0" />
                        <span className="text-slate-800 dark:text-slate-200 font-semibold">Contestants</span>
                    </nav>

                    <h1 className="text-3xl font-bold tracking-tight transition-colors">Contestants</h1>
                    <p className="mt-2 text-slate-600 dark:text-slate-400 transition-colors">Manage contestant roster and statuses</p>
                </div>
                <div className="flex flex-col">
                    <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Sort Arrangement</label>
                    <select 
                        value={currentSort} 
                        onChange={handleSortChange}
                        className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm cursor-pointer transition-colors"
                    >
                        <option value="number_asc">No. (Ascending: 1, 2, 3)</option>
                        <option value="number_desc">No. (Descending: 3, 2, 1)</option>
                        <option value="name_asc">Name (A to Z)</option>
                        <option value="name_desc">Name (Z to A)</option>
                    </select>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden transition-colors">
                <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
                    <h2 className="text-lg font-semibold transition-colors">Roster</h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 transition-colors">
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase w-24">No.</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Name</th>
                                <th className="px-6 py-3 text-center text-xs font-semibold text-slate-500 uppercase w-32">Status</th>
                                <th className="px-6 py-3 text-center text-xs font-semibold text-slate-500 uppercase w-56">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                            {contestants.length > 0 ? (
                                contestants.map((c) => (
                                    <tr key={c.id} className="hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                                        <td className="px-6 py-4 text-sm font-medium">{c.number}</td>
                                        <td className="px-6 py-4 text-sm">{c.name}</td>
                                        <td className="px-6 py-4 text-sm text-center">
                                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                                                c.status === 'Active' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' :
                                                c.status === 'Eliminated' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400' :
                                                'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                            }`}>
                                                {c.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-2">
                                                {/* If Active, show Edit, Eliminate, Disqualify */}
                                                {c.status === 'Active' ? (
                                                    <>
                                                        <Link href={`/contestants/${c.id}/edit`} className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50" title="Edit">
                                                            <Pencil className="w-4 h-4" />
                                                        </Link>
                                                        <button onClick={() => changeStatus(c.id, 'Eliminated')} className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-900/50" title="Eliminate">
                                                            <UserMinus className="w-4 h-4" />
                                                        </button>
                                                        <button onClick={() => changeStatus(c.id, 'Disqualified')} className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-300 dark:hover:bg-slate-600" title="Disqualify">
                                                            <Ban className="w-4 h-4" />
                                                        </button>
                                                    </>
                                                ) : (
                                                    /* If Eliminated/Disqualified, show RESTORE button */
                                                    <button onClick={() => changeStatus(c.id, 'Active')} className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/50" title="Restore to Active">
                                                        <CheckCircle2 className="w-4 h-4" />
                                                    </button>
                                                )}

                                                {/* Delete is always available */}
                                                <button onClick={() => { setContestantToDelete(c); setShowDeleteModal(true); }} className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50" title="Delete">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center justify-center text-slate-400">
                                            <Users className="w-12 h-12 mb-3 opacity-50" />
                                            <p className="text-sm font-medium">No contestants found</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="px-6 py-5 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700 transition-colors">
                    <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4 uppercase tracking-wider">Add New Contestant</h3>
                    <form className="flex flex-wrap items-end gap-3 sm:gap-4" onSubmit={submitContestant}>
                        <div className="w-24">
                            <label className="block text-sm font-medium mb-1.5 transition-colors">No.</label>
                            <input type="number" value={data.number} onChange={(e) => setData('number', e.target.value)} placeholder="e.g., 1" className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-center" />
                            {errors.number && <div className="text-red-500 text-xs mt-1">{errors.number}</div>}
                        </div>
                        <div className="flex-1 min-w-[200px]">
                            <label className="block text-sm font-medium mb-1.5 transition-colors">Contestant Name</label>
                            <input type="text" value={data.name} onChange={(e) => setData('name', e.target.value)} placeholder="Enter name..." className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
                            {errors.name && <div className="text-red-500 text-xs mt-1">{errors.name}</div>}
                        </div>
                        <div className="w-32 flex-shrink-0">
                            <button type="submit" disabled={processing} className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-700 text-white font-medium rounded-lg h-[44px] disabled:opacity-50">
                                <Plus className="w-4 h-4" /> Add
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 dark:bg-slate-900/80 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-red-200 dark:border-red-900/50 w-full max-w-md mx-4 overflow-hidden">
                        <div className="px-6 py-4 bg-red-50 dark:bg-red-900/20 border-b border-red-100 dark:border-red-900/50 flex items-center gap-3">
                            <div className="w-10 h-10 bg-red-100 dark:bg-red-900/40 rounded-full flex items-center justify-center">
                                <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-500" />
                            </div>
                            <h3 className="text-lg font-semibold text-red-800 dark:text-red-400">Delete Contestant?</h3>
                        </div>
                        <div className="p-6">
                            <p className="text-slate-600 dark:text-slate-400 mb-4">You are about to permanently delete:</p>
                            <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg p-4 mb-6">
                                <p className="text-lg font-semibold">Contestant {contestantToDelete?.number} - {contestantToDelete?.name}</p>
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