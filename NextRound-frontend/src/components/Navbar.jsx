import {
    Search,
    Zap,
    LogIn,
    UserCircle,
    LogOut,
    Bell,
} from 'lucide-react';

import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';

function Navbar() {
    const { user, logout } = useAuth();

    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

    const profileRef = useRef(null);
    const notificationsRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                profileRef.current &&
                !profileRef.current.contains(event.target)
            ) {
                setIsProfileOpen(false);
            }

            if (
                notificationsRef.current &&
                !notificationsRef.current.contains(event.target)
            ) {
                setIsNotificationsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleProfileToggle = () => {
        setIsProfileOpen((prev) => !prev);
        setIsNotificationsOpen(false);
    };

    const handleNotificationsToggle = () => {
        setIsNotificationsOpen((prev) => !prev);
        setIsProfileOpen(false);
    };

    const handleLogout = async () => {
        await logout();

        setIsProfileOpen(false);
        setIsNotificationsOpen(false);
    };

    return (
        <nav className="relative z-[100] border-b border-white/10 bg-[#0B0F19]/95 backdrop-blur">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">

                {/* Logo */}
                <Link
                    to="/"
                    className="flex items-center gap-2"
                >
                    <Zap
                        size={28}
                        className="fill-[#7C3AED] text-[#7C3AED]"
                    />

                    <span className="text-xl font-black tracking-tight text-white">
                        NEXTROUND
                    </span>
                </Link>

                {/* Navigation */}
                <div className="hidden items-center gap-8 md:flex">

                    <Link
                        to="/tournaments"
                        className="text-sm text-gray-300 transition hover:text-white"
                    >
                        Tournaments
                    </Link>

                    <Link
                        to="/games"
                        className="text-sm text-gray-300 transition hover:text-white"
                    >
                        Games
                    </Link>

                    <Link
                        to="/rankings"
                        className="text-sm text-gray-300 transition hover:text-white"
                    >
                        Rankings
                    </Link>

                    <Link
                        to="/about"
                        className="text-sm text-gray-300 transition hover:text-white"
                    >
                        About
                    </Link>

                </div>

                {/* Right side */}
                <div className="flex items-center gap-4">

                    {/* Search */}
                    <div className="hidden items-center rounded-lg border border-white/15 bg-[#111827] px-3 py-2 lg:flex">
                        <Search
                            size={16}
                            className="mr-2 text-gray-500"
                        />

                        <input
                            type="text"
                            placeholder="Search tournaments..."
                            className="w-44 bg-transparent text-sm text-white outline-none placeholder:text-gray-500"
                        />
                    </div>

                    {user ? (
                        <>
                            {/* Notifications */}
                            <div
                                ref={notificationsRef}
                                className="relative"
                            >
                                <button
                                    onClick={handleNotificationsToggle}
                                    className="relative flex h-10 w-10 items-center justify-center rounded-lg text-gray-400 transition hover:bg-white/5 hover:text-white"
                                    aria-label="Notifications"
                                >
                                    <Bell size={20} />

                                    {/* Unread badge */}
                                    <span className="absolute right-1.5 top-1.5 flex h-2.5 w-2.5 rounded-full bg-[#8B5CF6] ring-2 ring-[#0B0F19]" />
                                </button>

                                {isNotificationsOpen && (
                                    <div className="absolute right-0 top-12 z-50 w-80 overflow-hidden rounded-xl border border-white/10 bg-[#111827] shadow-2xl">

                                        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                                            <h3 className="font-semibold text-white">
                                                Notifications
                                            </h3>

                                            <button className="text-xs text-[#A78BFA] hover:text-[#C4B5FD]">
                                                Mark all as read
                                            </button>
                                        </div>

                                        <div className="max-h-80 overflow-y-auto">

                                            {/* Example notification */}
                                            <div className="flex gap-3 border-b border-white/5 px-4 py-4 transition hover:bg-white/5">
                                                <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#8B5CF6]" />

                                                <div>
                                                    <p className="text-sm font-medium text-white">
                                                        Match scheduled
                                                    </p>

                                                    <p className="mt-1 text-xs leading-5 text-gray-400">
                                                        Your next match has been scheduled.
                                                    </p>

                                                    <p className="mt-2 text-xs text-gray-600">
                                                        Just now
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex gap-3 border-b border-white/5 px-4 py-4 transition hover:bg-white/5">
                                                <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#8B5CF6]" />

                                                <div>
                                                    <p className="text-sm font-medium text-white">
                                                        Registration approved
                                                    </p>

                                                    <p className="mt-1 text-xs leading-5 text-gray-400">
                                                        Your tournament registration was approved.
                                                    </p>

                                                    <p className="mt-2 text-xs text-gray-600">
                                                        2 hours ago
                                                    </p>
                                                </div>
                                            </div>

                                        </div>

                                        <div className="border-t border-white/10 px-4 py-3 text-center">
                                            <Link
                                                to="/notifications"
                                                onClick={() =>
                                                    setIsNotificationsOpen(false)
                                                }
                                                className="text-sm font-medium text-[#A78BFA] transition hover:text-[#C4B5FD]"
                                            >
                                                View all notifications
                                            </Link>
                                        </div>

                                    </div>
                                )}
                            </div>

                            {/* Profile */}
                            <div
                                ref={profileRef}
                                className="relative"
                            >
                                <button
                                    onClick={handleProfileToggle}
                                    className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition hover:bg-white/5"
                                >
                                    <UserCircle
                                        size={28}
                                        className="text-[#A78BFA]"
                                    />

                                    <span className="hidden text-sm font-medium text-white sm:block">
                                        {user.name}
                                    </span>
                                </button>

                                {isProfileOpen && (
                                    <div className="absolute right-0 top-12 z-100 w-48 rounded-xl border border-white/10 bg-[#111827] p-2 shadow-2xl">

                                        <Link
                                            to="/profile"
                                            onClick={() =>
                                                setIsProfileOpen(false)
                                            }
                                            className="block rounded-lg px-3 py-2 text-sm text-gray-300 transition hover:bg-white/5 hover:text-white"
                                        >
                                            Profile
                                        </Link>

                                        <Link
                                            to="/dashboard"
                                            onClick={() =>
                                                setIsProfileOpen(false)
                                            }
                                            className="block rounded-lg px-3 py-2 text-sm text-gray-300 transition hover:bg-white/5 hover:text-white"
                                        >
                                            Dashboard
                                        </Link>

                                        <div className="my-1 border-t border-white/10" />

                                        <button
                                            onClick={handleLogout}
                                            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-400 transition hover:bg-red-500/10"
                                        >
                                            <LogOut size={16} />
                                            Logout
                                        </button>

                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <>
                            {/* Guest */}
                            <Link
                                to="/login"
                                className="flex items-center gap-2 text-sm font-medium text-white transition hover:text-[#A78BFA]"
                            >
                                <LogIn size={16} />
                                Login
                            </Link>

                            <Link
                                to="/register"
                                className="rounded-lg bg-[#7C3AED] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#6D28D9]"
                            >
                                Register
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;