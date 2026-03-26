import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { Save, ArrowLeft } from 'lucide-react';

export default function Edit({ contestant }) {
    const { data, setData, put, processing, errors } = useForm({
        number: contestant.number,
        name: contestant.name,
    });

    const submitEdit = (e) => {
        e.preventDefault();
        put(`/contestants/${contestant.id}`); 
    };

    return (
        <MainLayout>
            <Head title={`Edit Contestant - ${contestant.name}`} />
            <div className="max-w-2xl mx-auto">
                <div className="mb-6">
                    <Link href="/contestants" className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200">
                        <ArrowLeft className="w-4 h-4" />
                        <span className="text-sm font-medium">Back to Contestants</span>
                    </Link>
                </div>

                <div className="mb-8">
                    <h1 className="text-3xl font-bold transition-colors">Edit Contestant</h1>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                    <form onSubmit={submitEdit} className="p-6">
                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium mb-2">No.</label>
                                <input type="number" value={data.number} onChange={(e) => setData('number', e.target.value)} className="w-full sm:w-32 px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
                                {errors.number && <div className="text-red-500 text-sm mt-1">{errors.number}</div>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Name</label>
                                <input type="text" value={data.name} onChange={(e) => setData('name', e.target.value)} className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
                                {errors.name && <div className="text-red-500 text-sm mt-1">{errors.name}</div>}
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row items-center gap-3 mt-8">
                            <button disabled={processing} type="submit" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg disabled:opacity-50">
                                <Save className="w-4 h-4" /> {processing ? 'Saving...' : 'Save Changes'}
                            </button>
                            <Link href="/contestants" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-medium rounded-lg">
                                <ArrowLeft className="w-4 h-4" /> Cancel
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </MainLayout>
    );
}