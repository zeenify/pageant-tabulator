import React, { useState } from 'react';
import { Head, Link, useForm, router} from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { Pencil, Trash2, Gem, FolderOpen, Plus, AlertTriangle, X, CheckCircle2, Printer, ChevronRight } from 'lucide-react';

export default function Index({ categories, activeCategoryId }) {

    // Setup the Add Form
    const { data, setData, post, processing, reset, errors } = useForm({
        category_name: '', 
        is_minor: false, // <-- State for the checkbox
    });

    // Modals
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState(null);

    const confirmDelete = () => {
        router.delete(`/categories/${categoryToDelete.id}`, { onSuccess: () => setShowDeleteModal(false) });
    };

    const activateCategory = (id) => {
        router.post(`/categories/${id}/activate`);
    };

    const submitCategory = (e) => {
        e.preventDefault(); 
        post('/categories', { onSuccess: () => reset() });
    };

    // Reusable Table Row Component
    const CategoryRow = ({ category, index }) => (
        <tr className="hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium transition-colors">
                {index + 1}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm transition-colors font-bold flex items-center gap-3">
                {category.name}
                
                {/* DYNAMIC BADGES: Instantly tells you what kind of category this is! */}
                {category.is_minor ? (
                    <span className="text-[10px] uppercase tracking-wider bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full dark:bg-purple-900/30 dark:text-purple-400 font-bold">
                        Minor Award
                    </span>
                ) : (
                    <span className="text-[10px] uppercase tracking-wider bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full dark:bg-amber-900/30 dark:text-amber-400 font-bold">
                        Main Crown
                    </span>
                )}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center justify-center gap-2">
                    <button 
                        onClick={() => activateCategory(category.id)}
                        title={activeCategoryId == category.id ? "Currently Active!" : "Activate for Judges"}
                        className={`inline-flex items-center justify-center w-9 h-9 rounded-lg transition-colors ${
                            activeCategoryId == category.id 
                            ? 'bg-emerald-500 text-white shadow-md' 
                            : 'bg-slate-100 text-slate-400 hover:bg-emerald-100 hover:text-emerald-600 dark:bg-slate-700 dark:hover:bg-emerald-900/30'
                        }`}
                    >
                        <CheckCircle2 className="w-5 h-5" />
                    </button>
                    <Link href={`/categories/${category.id}/edit`} className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50">
                        <Pencil className="w-4 h-4" />
                    </Link>
                    <Link href={`/criteria?category_id=${category.id}`} className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/50">
                        <Gem className="w-4 h-4" />
                    </Link>
                    <button onClick={() => { setCategoryToDelete(category); setShowDeleteModal(true); }} className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50">
                        <Trash2 className="w-4 h-4" />
                    </button>
                    <Link href={`/categories/${category.id}/summary`} className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600 ml-2 border border-slate-300 dark:border-slate-600">
                        <Printer className="w-4 h-4" />
                    </Link>
                </div>
            </td>
        </tr>
    );

    return (
        <MainLayout>
            <Head title="Categories" />

            <div className="mb-8 pr-12">
                <nav className="flex items-center text-sm text-slate-500 dark:text-slate-400 mb-3 font-medium">
                    <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Dashboard</Link>
                    <ChevronRight className="w-4 h-4 mx-2 opacity-50 flex-shrink-0" />
                    <span className="text-slate-800 dark:text-slate-200 font-semibold">Categories</span>
                </nav>
                <h1 className="text-3xl font-bold tracking-tight transition-colors">Segments & Awards</h1>
                <p className="mt-2 text-slate-600 dark:text-slate-400 transition-colors">Manage main crown categories and special minor awards.</p>
            </div>

            {/* COMBINED CATEGORIES TABLE */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden mb-8">
                <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 flex items-center gap-2">
                    <FolderOpen className="w-5 h-5 text-blue-500" />
                    <h2 className="text-lg font-bold transition-colors text-slate-800 dark:text-slate-100">Category List</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700">
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase w-24">No.</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Name & Type</th>
                                <th className="px-6 py-3 text-center text-xs font-semibold text-slate-500 uppercase w-64">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                            {categories.length > 0 ? categories.map((c, i) => <CategoryRow key={c.id} category={c} index={i} />) : (
                                <tr><td colSpan="3" className="px-6 py-8 text-center text-slate-400">No categories found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ADD FORM */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden transition-colors">
                <div className="px-6 py-5 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                    <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Add New Segment</h3>
                </div>
                <div className="p-6">
                    <form className="flex flex-col sm:flex-row items-end gap-6" onSubmit={submitCategory}>
                        <div className="flex-1 w-full">
                            <label className="block text-sm font-medium mb-1.5 transition-colors">Segment Name</label>
                            <input 
                                type="text" maxLength="100" required
                                value={data.category_name} 
                                onChange={(e) => setData('category_name', e.target.value)} 
                                placeholder="e.g., Evening Gown or Best in Talent"
                                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                            />
                            {errors.category_name && <div className="text-red-500 text-sm mt-1">{errors.category_name}</div>}
                        </div>
                        
                        <div className="mb-2">
                            <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                                <input 
                                    type="checkbox" 
                                    checked={data.is_minor}
                                    onChange={(e) => setData('is_minor', e.target.checked)}
                                    className="w-5 h-5 rounded border-slate-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                                />
                                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">This is a Minor Award (Auto-creates 1-10 Scale)</span>
                            </label>
                        </div>
                        
                        <button type="submit" disabled={processing} className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 text-white font-bold rounded-xl shadow-md h-[46px] disabled:opacity-50">
                            <Plus className="w-5 h-5" />
                            {processing ? 'Adding...' : 'Add Segment'}
                        </button>
                    </form>
                </div>
            </div>

            {/* Delete Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 dark:bg-slate-900/80 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-red-200 dark:border-red-900/50 w-full max-w-md mx-4 overflow-hidden">
                        <div className="px-6 py-4 bg-red-50 dark:bg-red-900/20 border-b border-red-100 dark:border-red-900/50 flex items-center gap-3">
                            <div className="w-10 h-10 bg-red-100 dark:bg-red-900/40 rounded-full flex items-center justify-center">
                                <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-500" />
                            </div>
                            <h3 className="text-lg font-semibold text-red-800 dark:text-red-400">Delete Category?</h3>
                        </div>
                        <div className="p-6">
                            <p className="text-slate-600 dark:text-slate-400 mb-4">You are about to permanently delete:</p>
                            <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg p-4 mb-4">
                                <p className="text-lg font-semibold text-slate-900 dark:text-white">{categoryToDelete?.name}</p>
                            </div>
                            <div className="flex items-center gap-3 mt-6">
                                <button onClick={confirmDelete} className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg shadow-sm transition-all">
                                    <Trash2 className="w-4 h-4" /> Yes, Delete
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