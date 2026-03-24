import React, { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';

// The 'children' prop is the magic part. It represents whatever page is currently inside the frame!
export default function MainLayout({ children }) {
    // 1. All our Dark Mode logic lives here globally now!
    const[isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        if (localStorage.getItem('color-theme') === 'dark' || (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            setIsDarkMode(true);
            document.documentElement.classList.add('dark');
        } else {
            setIsDarkMode(false);
            document.documentElement.classList.remove('dark');
        }
    },[]);

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
                
                {/* GLOBAL Theme Toggle Button */}
                <div className="absolute top-0 right-0 z-10">
                    <button onClick={toggleTheme} type="button" className="text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg text-sm p-2 transition-colors">
                        {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    </button>
                </div>

                {/* This is where your page content will automatically be injected! */}
                {children}

            </div>
        </div>
    );
}