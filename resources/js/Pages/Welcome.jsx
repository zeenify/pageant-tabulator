import React from 'react';
import { Head, Link } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { FolderOpen, Users, Crown, ChevronRight } from 'lucide-react';

export default function Welcome() {
    return (
        <MainLayout>
            <Head title="Dashboard" />

            {/* Welcome Header */}
            <div className="mb-10">
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white transition-colors">
                    Pageant Tabulator System
                </h1>
                <p className="mt-2 text-slate-600 dark:text-slate-400 text-lg transition-colors">
                    Select a module below to manage your pageant data.
                </p>
            </div>

            {/* Navigation Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* 1. Categories Card */}
                <Link 
                    href="/categories" 
                    className="group bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-200 flex flex-col h-full"
                >
                    <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
                        <FolderOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2 transition-colors">Categories & Criteria</h2>
                    <p className="text-slate-600 dark:text-slate-400 text-sm flex-1 transition-colors">
                        Set up your pageant scoring categories, adjust criteria weights, and set min/max scores.
                    </p>
                    <div className="mt-4 flex items-center text-blue-600 dark:text-blue-400 text-sm font-medium">
                        Manage Categories <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                </Link>

                {/* 2. Judges Card */}
                <Link 
                    href="/judges" 
                    className="group bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md hover:border-amber-300 dark:hover:border-amber-700 transition-all duration-200 flex flex-col h-full"
                >
                    <div className="w-12 h-12 bg-amber-50 dark:bg-amber-900/30 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
                        <Users className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                    </div>
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2 transition-colors">Judges Panel</h2>
                    <p className="text-slate-600 dark:text-slate-400 text-sm flex-1 transition-colors">
                        Add judges to your roster, manage their access, and generate secure login PINs.
                    </p>
                    <div className="mt-4 flex items-center text-amber-600 dark:text-amber-400 text-sm font-medium">
                        Manage Judges <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                </Link>

                {/* 3. Contestants Card */}
                <Link 
                    href="/contestants" 
                    className="group bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md hover:border-emerald-300 dark:hover:border-emerald-700 transition-all duration-200 flex flex-col h-full"
                >
                    <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
                        <Crown className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2 transition-colors">Contestants</h2>
                    <p className="text-slate-600 dark:text-slate-400 text-sm flex-1 transition-colors">
                        Add candidates, assign numbers, and update their statuses (Active, Eliminated, Disqualified).
                    </p>
                    <div className="mt-4 flex items-center text-emerald-600 dark:text-emerald-400 text-sm font-medium">
                        Manage Contestants <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                </Link>

            </div>
        </MainLayout>
    );
}