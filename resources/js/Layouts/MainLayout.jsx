import React, { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Moon, Sun, FolderOpen, Users, Crown, Menu, X } from 'lucide-react';

export default function MainLayout({ children }) {
    // 1. Theme and Mobile Sidebar States
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    
    // Inertia's usePage gives us the current URL so we can highlight the active menu item!
    const { url } = usePage();

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

    // Navigation Menu Items
    const navItems =[
        { name: 'Categories', href: '/categories', icon: FolderOpen, activePattern: '/categor' },
        { name: 'Judges', href: '/judges', icon: Users, activePattern: '/judge' },
        { name: 'Contestants', href: '/contestants', icon: Crown, activePattern: '/contestant' },
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-200 text-slate-900 dark:text-slate-100 flex">
            
            {/* MOBILE OVERLAY: Darkens the screen when sidebar is open on small screens */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden backdrop-blur-sm"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* SIDEBAR */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto flex flex-col ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                
                {/* Sidebar Header (Logo/Title) */}
                <div className="h-16 flex items-center px-6 border-b border-slate-200 dark:border-slate-700">
                    <Crown className="w-6 h-6 text-blue-600 dark:text-blue-400 mr-2" />
                    <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">Tabulator</span>
                    
                    {/* Mobile Close Button */}
                    <button className="ml-auto lg:hidden text-slate-500 hover:text-slate-800 dark:hover:text-white" onClick={() => setIsSidebarOpen(false)}>
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Sidebar Navigation Links */}
                <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                    {navItems.map((item) => {
                        // Check if the current URL contains the activePattern (e.g. highlights if we are on /categories or /categories/1/edit)
                        const isActive = url.startsWith(item.activePattern);
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => setIsSidebarOpen(false)} // Close sidebar on mobile when clicked
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
                                    isActive 
                                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400' 
                                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-slate-200'
                                }`}
                            >
                                <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'opacity-70'}`} />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                {/* Sidebar Footer (Optional: branding or extra links) */}
                <div className="p-4 border-t border-slate-200 dark:border-slate-700">
                    <p className="text-xs text-center text-slate-400 font-medium">&copy; {new Date().getFullYear()} Pageant System</p>
                </div>
            </aside>

            {/* MAIN CONTENT AREA */}
            <div className="flex-1 flex flex-col min-w-0">
                
                {/* Top Navigation Bar */}
                <header className="h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-4 sm:px-6 lg:px-8 transition-colors sticky top-0 z-30">
                    
                    {/* Mobile Hamburger Menu */}
                    <button 
                        onClick={() => setIsSidebarOpen(true)}
                        className="lg:hidden text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 focus:outline-none"
                    >
                        <Menu className="w-6 h-6" />
                    </button>

                    {/* Right Side (Theme Toggle) */}
                    <div className="ml-auto flex items-center gap-4">
                        <button 
                            onClick={toggleTheme} 
                            type="button" 
                            className="text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg p-2 transition-colors"
                            title="Toggle Dark Mode"
                        >
                            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>
                    </div>
                </header>

                {/* Page Content Injection */}
                <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto w-full relative">
                    {children}
                </main>

            </div>
        </div>
    );
}