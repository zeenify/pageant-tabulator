import React, { useState } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { Building2, Plus, Trash2, ArrowRight, AlertTriangle, X, FolderOpen } from 'lucide-react';

export default function Index({ events }) {
    
    // Form for creating a new Event
    const { data, setData, post, processing, reset, errors } = useForm({
        name: '', 
    });

    // Delete Modal State
    const[showDeleteModal, setShowDeleteModal] = useState(false);
    const [eventToDelete, setEventToDelete] = useState(null);

    const submitEvent = (e) => {
        e.preventDefault();
        post('/events', {
            onSuccess: () => reset(),
        });
    };

    const confirmDelete = () => {
        router.delete(`/events/${eventToDelete.id}`, {
            onSuccess: () => setShowDeleteModal(false),
        });
    };

    return (
        <MainLayout>
            <Head title="Events Lobby" />

            {/* Page Header */}
            <div className="mb-8 pr-12">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white transition-colors">Franchise Lobby</h1>
                <p className="mt-2 text-slate-600 dark:text-slate-400 transition-colors">Select a pageant to manage, or create a new one.</p>
            </div>

            {/* Grid of Event Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {events.length > 0 ? (
                    events.map((event) => (
                        <div key={event.id} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 flex flex-col transition-all hover:shadow-md hover:border-blue-300 dark:hover:border-blue-700">
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400">
                                    <Building2 className="w-6 h-6" />
                                </div>
                                <button onClick={() => { setEventToDelete(event); setShowDeleteModal(true); }} className="text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg p-2 transition-colors">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                            
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">{event.name}</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 flex-1">Manage categories, criteria, contestants, and judges.</p>
                            
                            {/* THE ENTER BUTTON - Triggers the Sticky Note magic! */}
                            <Link 
                                href={`/events/${event.id}/enter`} 
                                method="post" 
                                as="button"
                                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-all duration-200"
                            >
                                Enter Event <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-12 flex flex-col items-center justify-center text-slate-400 bg-white dark:bg-slate-800 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
                        <FolderOpen className="w-12 h-12 mb-3 opacity-50" />
                        <p className="font-medium">No events found. Create your first pageant below!</p>
                    </div>
                )}
            </div>

            {/* Add Event Form */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden transition-colors">
                <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white transition-colors">Create New Event</h2>
                </div>
                <div className="p-6">
                    <form className="flex flex-col sm:flex-row items-end gap-4" onSubmit={submitEvent}>
                        <div className="flex-1 w-full">
                            <label className="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300 transition-colors">Event Name (e.g. Beauty Pageant 2024)</label>
                            <input 
                                type="text"
                                maxLength="100"
                                required
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="Enter event name..."
                                className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                            />
                            {errors.name && <div className="text-red-500 text-sm mt-1">{errors.name}</div>}
                        </div>
                        
                        <button 
                            type="submit" 
                            disabled={processing}
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-all duration-200 h-[42px] disabled:opacity-50"
                        >
                            <Plus className="w-4 h-4" />
                            {processing ? 'Creating...' : 'Create Event'}
                        </button>
                    </form>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 dark:bg-slate-900/80 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-red-200 dark:border-red-900/50 w-full max-w-md mx-4 overflow-hidden">
                        <div className="px-6 py-4 bg-red-50 dark:bg-red-900/20 border-b border-red-100 dark:border-red-900/50 flex items-center gap-3">
                            <div className="w-10 h-10 bg-red-100 dark:bg-red-900/40 rounded-full flex items-center justify-center">
                                <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-500" />
                            </div>
                            <h3 className="text-lg font-semibold text-red-800 dark:text-red-400">Delete Entire Event?</h3>
                        </div>
                        
                        <div className="p-6">
                            <p className="text-slate-600 dark:text-slate-400 mb-4">This will delete the event and all associated categories, judges, and contestants. Proceed with caution!</p>
                            <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg p-4 mb-4">
                                <p className="text-lg font-semibold text-slate-900 dark:text-white">{eventToDelete?.name}</p>
                            </div>
                            
                            <div className="flex items-center gap-3 mt-6">
                                <button 
                                    onClick={confirmDelete}
                                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg shadow-sm transition-all"
                                >
                                    <Trash2 className="w-4 h-4" /> Yes, Delete It
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


