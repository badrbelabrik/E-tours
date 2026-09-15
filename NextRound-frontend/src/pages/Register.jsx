import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    ArrowRight,
    Eye,
    EyeOff,
    Lock,
    Mail,
    User,
    Zap,
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';

function Register() {
    const navigate = useNavigate();
    const { register } = useAuth();

    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] =
        useState(false);

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

        if (form.password !== form.password_confirmation) {
            setError('Passwords do not match.');
            return;
        }

        setLoading(true);

        try {
            await register(
                form.name,
                form.email,
                form.password,
                form.password_confirmation
            );

            navigate('/login', {
                state: {
                    message: 'Account created successfully. You can now log in.',
                },
            });
        } catch (error) {
            if (error.response?.status === 422) {
                const errors = error.response.data.errors;

                if (errors) {
                    const firstError = Object.values(errors)[0]?.[0];

                    setError(
                        firstError ||
                        'Please check the information you entered.'
                    );
                } else {
                    setError(
                        error.response.data.message ||
                        'Please check the information you entered.'
                    );
                }
            } else {
                setError(
                    'Unable to create your account. Please try again.'
                );
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen overflow-hidden bg-[#0B0F19] text-white">

            {/* Background glow */}
            <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-[#7C3AED]/10 blur-[140px]" />

            <div className="relative flex min-h-screen flex-col items-center px-6 py-10">

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
                        className="pb-3 font-medium text-gray-400 transition hover:text-white"
                    >
                        Login
                    </Link>

                    <Link
                        to="/register"
                        className="relative pb-3 font-medium text-[#A78BFA]"
                    >
                        Sign up

                        <span className="absolute bottom-0 left-0 h-0.5 w-full rounded-full bg-[#7C3AED]" />
                    </Link>

                </div>

                {/* Register card */}
                <div className="mt-8 w-full max-w-md rounded-xl border border-white/10 bg-[#111827] p-8 shadow-2xl shadow-black/30">

                    <div className="mb-8 text-center">
                        <h1 className="text-3xl font-black">
                            Create your account
                        </h1>

                        <p className="mt-2 text-sm text-gray-400">
                            Join the NextRound community.
                        </p>
                    </div>

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

                        {/* Name */}
                        <div>
                            <label
                                htmlFor="name"
                                className="mb-2 block text-sm font-medium text-gray-300"
                            >
                                Name
                            </label>

                            <div className="flex items-center rounded-lg border border-white/10 bg-[#0B0F19] transition focus-within:border-[#7C3AED]">

                                <User
                                    size={18}
                                    className="ml-4 text-gray-500"
                                />

                                <input
                                    id="name"
                                    type="text"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    placeholder="Your name"
                                    autoComplete="name"
                                    required
                                    className="w-full bg-transparent px-3 py-3.5 text-sm text-white outline-none placeholder:text-gray-600"
                                />

                            </div>
                        </div>

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
                                    type={
                                        showPassword
                                            ? 'text'
                                            : 'password'
                                    }
                                    name="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    placeholder="Enter your password"
                                    autoComplete="new-password"
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

                        {/* Confirm password */}
                        <div>
                            <label
                                htmlFor="password_confirmation"
                                className="mb-2 block text-sm font-medium text-gray-300"
                            >
                                Confirm password
                            </label>

                            <div className="flex items-center rounded-lg border border-white/10 bg-[#0B0F19] transition focus-within:border-[#7C3AED]">

                                <Lock
                                    size={18}
                                    className="ml-4 text-gray-500"
                                />

                                <input
                                    id="password_confirmation"
                                    type={
                                        showPasswordConfirmation
                                            ? 'text'
                                            : 'password'
                                    }
                                    name="password_confirmation"
                                    value={form.password_confirmation}
                                    onChange={handleChange}
                                    placeholder="Confirm your password"
                                    autoComplete="new-password"
                                    required
                                    className="w-full bg-transparent px-3 py-3.5 text-sm text-white outline-none placeholder:text-gray-600"
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPasswordConfirmation(
                                            !showPasswordConfirmation
                                        )
                                    }
                                    className="mr-4 text-gray-500 transition hover:text-gray-300"
                                    aria-label={
                                        showPasswordConfirmation
                                            ? 'Hide password'
                                            : 'Show password'
                                    }
                                >
                                    {showPasswordConfirmation ? (
                                        <EyeOff size={18} />
                                    ) : (
                                        <Eye size={18} />
                                    )}
                                </button>

                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#7C3AED] py-3.5 font-semibold transition hover:bg-[#6D28D9] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {loading
                                ? 'Creating account...'
                                : 'Create account'}

                            {!loading && (
                                <ArrowRight size={18} />
                            )}
                        </button>

                    </form>

                    {/* Login */}
                    <div className="mt-7 text-center">
                        <p className="text-sm text-gray-500">
                            Already have an account?
                        </p>

                        <Link
                            to="/login"
                            className="mt-1 inline-block text-sm font-semibold text-[#A78BFA] transition hover:text-[#C4B5FD]"
                        >
                            Login
                        </Link>
                    </div>

                </div>

                <p className="mt-8 text-xs text-gray-600">
                    Compete. Organize. Dominate.
                </p>

            </div>
        </div>
    );
}

export default Register;