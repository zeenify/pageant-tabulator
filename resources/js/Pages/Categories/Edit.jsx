import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Moon, Sun, Save, ArrowLeft, AlertCircle, ChevronRight } from 'lucide-react';
import MainLayout from '@/Layouts/MainLayout';

// Notice we receive the 'category' object that our Chef (Controller) sent us!
export default function Edit({ category }) {


    

    // 3. FORM SETUP: Notice we prepopulate it with `category.name`!
    const { data, setData, put, processing, errors } = useForm({
        category_name: category.name, 
    });

    // 4. SUBMIT FUNCTION: Uses PUT instead of POST because we are updating
    const submitEdit = (e) => {
        e.preventDefault();
        put(`/categories/${category.id}`); 
    };

    // 5. THE UI (The React Plate)
    return (
        <MainLayout>
            <Head title={`Edit Category - ${category.name}`} />

            <div className="max-w-2xl mx-auto relative">
                
                {/* BREADCRUMBS */}
                <nav className="flex items-center text-sm text-slate-500 dark:text-slate-400 mb-6 font-medium">
                    <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Dashboard</Link>
                    <ChevronRight className="w-4 h-4 mx-2 opacity-50 flex-shrink-0" />
                    <Link href="/categories" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Categories</Link>
                    <ChevronRight className="w-4 h-4 mx-2 opacity-50 flex-shrink-0" />
                    <span className="text-slate-800 dark:text-slate-200 font-semibold">Edit Category</span>
                </nav>

                {/* Page Header */}
                <div className="mb-8 pr-12">
                    <h1 className="text-3xl font-bold tracking-tight transition-colors">Edit Category</h1>
                    <p className="mt-2 text-slate-600 dark:text-slate-400 transition-colors">Update category information</p>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden transition-colors">
                    <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 transition-colors">
                        <h2 className="text-lg font-semibold dark:text-slate-100">Category Details</h2>
                    </div>
                    
                    <form onSubmit={submitEdit} className="p-6">
                        <div className="mb-6">
                            <label className="block text-sm font-medium mb-2 transition-colors">Category Name</label>
                            <input 
                                type="text" 
                                required              // <-- Added this
                                maxLength="100"       // <-- Added this
                                value={data.category_name}
                                onChange={(e) => setData('category_name', e.target.value)}
                                className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                            />
                            {/* Error validation display */}
                            {errors.category_name && <div className="text-red-500 text-sm mt-1">{errors.category_name}</div>}
                        </div>
                        
                        <div className="flex flex-col sm:flex-row items-center gap-3">
                            <button disabled={processing} type="submit" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-all duration-200 disabled:opacity-50">
                                <Save className="w-4 h-4" />
                                {processing ? 'Saving...' : 'Save Changes'}
                            </button>
                            <Link href="/categories" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-medium rounded-lg transition-all duration-200">
                                <ArrowLeft className="w-4 h-4" />
                                Cancel
                            </Link>
                        </div>
                    </form>
                </div>
            </div>

        </MainLayout>
    );
}
