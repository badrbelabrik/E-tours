import { useState } from 'react';
import { Link,useLocation, useNavigate } from 'react-router-dom';
import {
    Eye,
    EyeOff,
    Lock,
    Mail,
    ArrowRight,
    Zap,
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';

function Login() {
    const location = useLocation();
    const successMessage = location.state?.message;
    const navigate = useNavigate();
    const { login } = useAuth();

    const [form, setForm] = useState({
        email: '',
        password: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (event) => {
        setForm({
            ...form,
            [event.target.name]: event.target.value,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError('');
        setLoading(true);

        try {
            await login(form.email, form.password);

            navigate('/');
        } catch (error) {
            if (error.response?.status === 401) {
                setError('Invalid email or password.');
            } else if (error.response?.data?.message) {
                setError(error.response.data.message);
            } else {
                setError('Unable to sign in. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen overflow-hidden bg-[#0B0F19] text-white">

            {/* Background glow */}
            <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-[#7C3AED]/10 blur-[140px]" />

            <div className="relative flex min-h-screen flex-col items-center px-6 py-12">

                {/* Logo */}
                <Link
                    to="/"
                    className="flex items-center gap-2"
                >
                    <Zap
                        size={32}
                        className="fill-[#7C3AED] text-[#7C3AED]"
                    />

                    <span className="text-2xl font-black tracking-tight">
                        NEXTROUND
                    </span>
                </Link>

                {/* Auth navigation */}
                <div className="mt-8 flex items-center gap-10 text-lg">
                    <Link
                        to="/login"
                        className="relative pb-3 font-medium text-[#A78BFA]"
                    >
                        Login

                        <span className="absolute bottom-0 left-0 h-0.5 w-full rounded-full bg-[#7C3AED]" />
                    </Link>

                    <Link
                        to="/register"
                        className="pb-3 font-medium text-gray-400 transition hover:text-white"
                    >
                        Sign up
                    </Link>
                </div>

                {/* Login card */}
                <div className="mt-8 w-full max-w-md rounded-xl border border-white/10 bg-[#111827] p-8 shadow-2xl shadow-black/30">

                    <div className="mb-8 text-center">
                        <h1 className="text-3xl font-black">
                            Welcome back
                        </h1>

                        <p className="mt-2 text-sm text-gray-400">
                            Sign in to continue to NextRound
                        </p>
                    </div>
                    {/* Succes message after registration */}
                    {successMessage && (
                        <div className="mb-6 rounded-lg border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-400">
                            {successMessage}
                        </div>
                    )}

                    {/* Error */}
                    {error && (
                        <div className="mb-6 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                            {error}
                        </div>
                    )}

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-5"
                    >

                        {/* Email */}
                        <div>
                            <label
                                htmlFor="email"
                                className="mb-2 block text-sm font-medium text-gray-300"
                            >
                                Email
                            </label>

                            <div className="flex items-center rounded-lg border border-white/10 bg-[#0B0F19] transition focus-within:border-[#7C3AED]">
                                <Mail
                                    size={18}
                                    className="ml-4 text-gray-500"
                                />

                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    placeholder="you@example.com"
                                    autoComplete="email"
                                    required
                                    className="w-full bg-transparent px-3 py-3.5 text-sm text-white outline-none placeholder:text-gray-600"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label
                                htmlFor="password"
                                className="mb-2 block text-sm font-medium text-gray-300"
                            >
                                Password
                            </label>

                            <div className="flex items-center rounded-lg border border-white/10 bg-[#0B0F19] transition focus-within:border-[#7C3AED]">
                                <Lock
                                    size={18}
                                    className="ml-4 text-gray-500"
                                />

                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    placeholder="Enter your password"
                                    autoComplete="current-password"
                                    required
                                    className="w-full bg-transparent px-3 py-3.5 text-sm text-white outline-none placeholder:text-gray-600"
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    className="mr-4 text-gray-500 transition hover:text-gray-300"
                                    aria-label={
                                        showPassword
                                            ? 'Hide password'
                                            : 'Show password'
                                    }
                                >
                                    {showPassword ? (
                                        <EyeOff size={18} />
                                    ) : (
                                        <Eye size={18} />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Login button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#7C3AED] py-3.5 font-semibold transition hover:bg-[#6D28D9] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {loading ? 'Signing in...' : 'Login'}

                            {!loading && (
                                <ArrowRight size={18} />
                            )}
                        </button>

                    </form>

                    {/* Register */}
                    <div className="mt-7 text-center">
                        <p className="text-sm text-gray-500">
                            Don't have an account?
                        </p>

                        <Link
                            to="/register"
                            className="mt-1 inline-block text-sm font-semibold text-[#A78BFA] transition hover:text-[#C4B5FD]"
                        >
                            Create an account
                        </Link>
                    </div>

                </div>

                {/* Bottom text */}
                <p className="mt-8 text-xs text-gray-600">
                    Compete. Organize. Dominate.
                </p>

            </div>
        </div>
    );
}

export default Login;