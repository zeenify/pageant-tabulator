import React, { useEffect } from 'react';
import { Head, useForm, Link } from '@inertiajs/react'; // <-- Added Link here
import { Lock, LogIn, Users } from 'lucide-react';       // <-- Added Users icon

export default function AdminLogin() {
    const { data, setData, post, processing, errors } = useForm({
        username: '',
        password: '',
    });

    useEffect(() => {
        document.documentElement.classList.remove('dark'); // Force Light Mode
    },[]);

    const submit = (e) => {
        e.preventDefault();
        post('/admin/login');
    };

    return (
        <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center p-4 font-sans">
            <Head title="Admin Login" />

            <div className="w-full max-w-[400px] bg-white rounded-[2rem] shadow-2xl overflow-hidden">
                
                <div className="bg-slate-800 px-8 py-10 text-center relative overflow-hidden">
                    <div className="relative z-10 w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm border border-white/20">
                        <Lock className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="relative z-10 text-2xl font-bold text-white tracking-tight">Admin Portal</h1>
                    <p className="relative z-10 text-slate-400 mt-1 text-sm font-medium">Tabulator System Access</p>
                </div>

                <div className="p-8">
                    <form onSubmit={submit} className="space-y-5">
                        {errors.username && (
                            <p className="text-red-600 text-center text-sm font-semibold bg-red-50 py-2.5 rounded-xl border border-red-100">
                                {errors.username}
                            </p>
                        )}
                        
                        <div>
                            <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">Username</label>
                            <input
                                type="text"
                                required
                                value={data.username}
                                onChange={(e) => setData('username', e.target.value)}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900 outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">Password</label>
                            <input
                                type="password"
                                required
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900 outline-none"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-base font-bold py-3.5 rounded-xl shadow-md transition-all mt-6 disabled:opacity-50"
                        >
                            {processing ? 'Authenticating...' : 'Secure Login'}
                            <LogIn className="w-5 h-5" />
                        </button>
                    </form>

                    {/* SWITCH TO JUDGE PORTAL LINK */}
                    <div className="mt-6 text-center">
                        <Link href="/judge/login" className="inline-flex items-center justify-center gap-1.5 text-sm font-medium text-slate-400 hover:text-blue-500 transition-colors">
                            <Users className="w-4 h-4" />
                            Are you a Judge? Login here
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}