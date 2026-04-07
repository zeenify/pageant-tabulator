import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
// Notice ChevronRight is added here!
import { Save, ArrowLeft, ChevronRight } from 'lucide-react';

export default function Edit({ judge }) {
    const { data, setData, put, processing, errors } = useForm({
        number: judge.number,
        name: judge.name,
    });

    const submitEdit = (e) => {
        e.preventDefault();
        put(`/judges/${judge.id}`); 
    };

    return (
        <MainLayout>
            <Head title={`Edit Judge - ${judge.name}`} />

            <div className="max-w-2xl mx-auto">
                
                {/* BREADCRUMBS */}
                <nav className="flex items-center text-sm text-slate-500 dark:text-slate-400 mb-6 font-medium">
                    <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Dashboard</Link>
                    <ChevronRight className="w-4 h-4 mx-2 opacity-50 flex-shrink-0" />
                    <Link href="/judges" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Judges</Link>
                    <ChevronRight className="w-4 h-4 mx-2 opacity-50 flex-shrink-0" />
                    <span className="text-slate-800 dark:text-slate-200 font-semibold">Edit Judge</span>
                </nav>

                {/* Page Header */}
                <div className="mb-8 pr-12">
                    <h1 className="text-3xl font-bold tracking-tight transition-colors">Edit Judge</h1>
                    <p className="mt-2 text-slate-600 dark:text-slate-400 transition-colors">Update judge information</p>
                </div>

                {/* Edit Form Card */}
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden transition-colors">
                    <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 transition-colors">
                        <h2 className="text-lg font-semibold dark:text-slate-100">Judge Details</h2>
                    </div>
                    
                    <form onSubmit={submitEdit} className="p-6">
                        <div className="space-y-5">
                            
                            <div>
                                <label className="block text-sm font-medium mb-2 transition-colors">No.</label>
                                <input 
                                    type="text" 
                                    required        // <-- Added Security
                                    maxLength="50"  // <-- Added Security
                                    value={data.number}
                                    onChange={(e) => setData('number', e.target.value)}
                                    className="w-full sm:w-32 px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                                />
                                {errors.number && <div className="text-red-500 text-sm mt-1">{errors.number}</div>}
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium mb-2 transition-colors">Judge Name</label>
                                <input 
                                    type="text" 
                                    required        // <-- Added Security
                                    maxLength="100" // <-- Added Security
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                                />
                                {errors.name && <div className="text-red-500 text-sm mt-1">{errors.name}</div>}
                            </div>

                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row items-center gap-3 mt-8">
                            <button disabled={processing} type="submit" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-all duration-200 disabled:opacity-50">
                                <Save className="w-4 h-4" />
                                {processing ? 'Saving...' : 'Save Changes'}
                            </button>
                            <Link href="/judges" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-medium rounded-lg transition-all duration-200">
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