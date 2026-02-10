import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        // Dummy authentication
        if (email === 'admin@hrms.com' && password === 'admin') {
            localStorage.setItem('isAuthenticated', 'true');
            navigate('/dashboard');
        } else {
            setError('Invalid credentials. Use admin@hrms.com / admin');
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full border border-slate-100">
                <div className="flex justify-center mb-6">
                    <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center text-white">
                        <Lock className="w-6 h-6" />
                    </div>
                </div>

                <h2 className="text-2xl font-bold text-center text-slate-900 mb-2">Welcome Back</h2>
                <p className="text-center text-slate-500 mb-8">Sign in to HRMS Lite Admin</p>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                        <input
                            type="email"
                            required
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin@hrms.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                        <input
                            type="password"
                            required
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-primary-600 text-white font-medium py-2.5 rounded-lg hover:bg-primary-700 transition-colors mt-2"
                    >
                        Sign In
                    </button>
                </form>

                <div className="mt-6 text-center text-xs text-slate-400">
                    Demo Credentials: admin@hrms.com / admin
                </div>
            </div>
        </div>
    );
};

export default Login;
