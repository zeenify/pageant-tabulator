import React, { useState, useEffect } from 'react';
import { Moon, Sun, Home } from 'lucide-react';
import { Link } from '@inertiajs/react';

export default function MainLayout({ children }) {
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        if (localStorage.getItem('color-theme') === 'dark' || (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            setIsDarkMode(true);
            document.documentElement.classList.add('dark');
        } else {
            setIsDarkMode(false);
            document.documentElement.classList.remove('dark');
        }
    },[ ] );

    const toggleTheme = () => {
        if (isDarkMode) {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('color-theme', 'light');
            setIsDarkMode(false);
        } else {
            document.documentElement.classList.add('dark');
            localStorage.setItem('color-theme', 'dark');
            setIsDarkMode(true);
        }
    };

    return (
        <div className="bg-slate-50 dark:bg-slate-900 min-h-screen py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-200 text-slate-900 dark:text-slate-100">
            <div className="max-w-6xl mx-auto relative">
                
                {/* GLOBAL Dashboard Home Button (NEW) */}
                <div className="absolute top-0 left-0 z-10">
                    <Link href="/" className="inline-flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg text-sm p-2 transition-colors font-medium">
                        <Home className="w-5 h-5" />
                        <span className="hidden sm:inline">Dashboard</span>
                    </Link>
                </div>

                {/* GLOBAL Theme Toggle Button */}
                <div className="absolute top-0 right-0 z-10">
                    <button onClick={toggleTheme} type="button" className="text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg text-sm p-2 transition-colors">
                        {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    </button>
                </div>

                {/* Added pt-12 (padding-top) so the absolute buttons don't cover your page headers! */}
                <div className="pt-12">
                    {children}
                </div>

            </div>
        </div>
    );
}