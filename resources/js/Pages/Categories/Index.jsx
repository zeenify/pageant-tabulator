import React, { useState } from 'react';
import { Head, Link, useForm, router} from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { Moon, Sun, Pencil, Trash2, Gem, FolderOpen, Plus, AlertTriangle, X } from 'lucide-react';

export default function Index({ categories }) {


    // NEW: Setup the form
    const { data, setData, post, processing, reset, errors } = useForm({
        category_name: '', // This matches the name the Controller expects
    });

    // NEW: Memory for the Delete Modal
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const[categoryToDelete, setCategoryToDelete] = useState(null);

    const confirmDelete = () => {
        router.delete(`/categories/${categoryToDelete.id}`, {
            onSuccess: () => setShowDeleteModal(false), // Close modal when done!
        });
    };

    // NEW: The function that runs when you click "Add Category"
    const submitCategory = (e) => {
        e.preventDefault(); // Stops the page from doing a hard refresh
        post('/categories', {
            onSuccess: () => reset(), // If it saves successfully, empty the input box!
        });
    };



    return (
        <MainLayout>
            <Head title="Categories" />


                
                {/* Page Header */}
                <div className="mb-8 pr-12">
                    <h1 className="text-3xl font-bold tracking-tight transition-colors">Categories</h1>
                    <p className="mt-2 text-slate-600 dark:text-slate-400 transition-colors">Manage pageant scoring categories and their criteria</p>
                </div>

                {/* Main Card */}
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden transition-colors">
                    
                    {/* Table Header */}
                    <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
                        <h2 className="text-lg font-semibold transition-colors">Category List</h2>
                    </div>

                    {/* Categories Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 transition-colors">
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider w-24">Number</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-center text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider w-48">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                {/* REACT MAP: This replaces your PHP foreach loop! */}
                                {categories.length > 0 ? (
                                    categories.map((category, index) => (
                                        <tr key={category.id} className="hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium transition-colors">
                                                {index + 1}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm transition-colors">
                                                {category.name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center justify-center gap-2">
                                                    {/* Edit Link (takes us to the new Edit page) */}
                                                    <Link 
                                                        href={`/categories/${category.id}/edit`} 
                                                        className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50"
                                                    >
                                                        <Pencil className="w-4 h-4" />
                                                    </Link>
                                                    
                                                    {/* Delete Button (Opens the Modal) */}
                                                    <button 
                                                        onClick={() => {
                                                            setCategoryToDelete(category);
                                                            setShowDeleteModal(true);
                                                        }}
                                                        className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                    
                                                    {/* Add Criteria (We will build this later) */}
                                                    <Link 
                                                        href={`/criteria?category_id=${category.id}`} 
                                                        className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/50"
                                                    >
                                                        <Gem className="w-4 h-4" />
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="3" className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500">
                                                <FolderOpen className="w-12 h-12 mb-3 opacity-50" />
                                                <p className="text-sm font-medium">No categories found</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Add Category Form (UI Only for now) */}
                    <div className="px-6 py-5 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700 transition-colors">
                        <form className="flex flex-col sm:flex-row items-end gap-4" onSubmit={submitCategory}>
                            <div className="flex-1 w-full">
                                <label className="block text-sm font-medium mb-1.5 transition-colors">Category Name</label>
                                <input 
                                    type="text"
                                    maxLength="100"
                                    required
                                    value={data.category_name} // 1. Bind to React memory
                                    onChange={(e) => setData('category_name', e.target.value)} // 2. Update memory as you type
                                    placeholder="Enter new category name..."
                                    className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                                />
                                {/* If Laravel validation fails, it magically shows the error here! */}
                                {errors.category_name && <div className="text-red-500 text-sm mt-1">{errors.category_name}</div>}
                            </div>
                            
                            <button 
                                type="submit" 
                                disabled={processing} // 3. Prevent spam clicking while saving!
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-all duration-200 h-[42px] disabled:opacity-50"
                            >
                                <Plus className="w-4 h-4" />
                                {processing ? 'Adding...' : 'Add Category'}
                            </button>
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
                            <h3 className="text-lg font-semibold text-red-800 dark:text-red-400">Delete Category?</h3>
                        </div>
                        
                        <div className="p-6">
                            <p className="text-slate-600 dark:text-slate-400 mb-4">You are about to permanently delete:</p>
                            <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg p-4 mb-4">
                                <p className="text-lg font-semibold text-slate-900 dark:text-white">{categoryToDelete?.name}</p>
                            </div>
                            
                            <div className="flex items-center gap-3 mt-6">
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