import React, { useEffect } from 'react';
import { Head, useForm, Link } from '@inertiajs/react'; // <-- Added Link
import { KeyRound, LogIn, ShieldAlert } from 'lucide-react'; // <-- Added ShieldAlert

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        pin: '',
    });

    useEffect(() => {
        document.documentElement.classList.remove('dark');
    },[]);

    const submit = (e) => {
        e.preventDefault();
        post('/judge/login');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex flex-col justify-center items-center p-4 sm:p-8 font-sans">
            <Head title="Judge Login" />

            <div className="w-full max-w-[400px] bg-white rounded-[2rem] shadow-2xl overflow-hidden">
                
                {/* Header Section */}
                <div className="bg-blue-600 px-8 py-10 text-center relative overflow-hidden">
                    <div className="absolute top-[-20px] left-[-20px] w-24 h-24 bg-white opacity-10 rounded-full blur-xl"></div>
                    <div className="absolute bottom-[-20px] right-[-20px] w-32 h-32 bg-white opacity-10 rounded-full blur-xl"></div>

                    <div className="relative z-10 w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm border border-white/30 shadow-inner">
                        <KeyRound className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="relative z-10 text-2xl font-bold text-white tracking-tight">Judge Portal</h1>
                    <p className="relative z-10 text-blue-100 mt-1 text-sm font-medium">Enter your 4-digit access PIN</p>
                </div>

                {/* Login Form */}
                <div className="p-8 pb-6">
                    <form onSubmit={submit} className="space-y-6">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 mb-3 uppercase tracking-widest text-center">
                                Secure PIN
                            </label>
                            <input
                                type="text"
                                inputMode="numeric"
                                maxLength="4"
                                required
                                value={data.pin}
                                onChange={(e) => setData('pin', e.target.value.replace(/[^0-9]/g, ''))}
                                placeholder="••••"
                                className="w-full text-center text-4xl tracking-[0.5em] font-mono py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900 outline-none"
                            />
                            {errors.pin && (
                                <p className="text-red-600 text-center text-sm mt-3 font-semibold bg-red-50 py-2.5 rounded-xl border border-red-100">
                                    {errors.pin}
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={processing || data.pin.length < 4}
                            className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-lg font-bold py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100"
                        >
                            {processing ? 'Verifying...' : 'Access Score Sheet'}
                            <LogIn className="w-5 h-5" />
                        </button>
                    </form>
                </div>
                
                {/* Footer with Switch Link */}
                <div className="bg-slate-50 py-5 flex flex-col items-center border-t border-slate-100">
                    <p className="text-xs font-semibold text-slate-400 mb-2">Pageant Tabulator &copy; {new Date().getFullYear()}</p>
                    
                    {/* SWITCH TO ADMIN PORTAL LINK */}
                    <Link href="/admin/login" className="inline-flex items-center gap-1 text-xs font-bold text-blue-500 hover:text-blue-700 transition-colors uppercase tracking-wider">
                        <ShieldAlert className="w-3.5 h-3.5" />
                        Admin Access
                    </Link>
                </div>

            </div>
        </div>
    );
}