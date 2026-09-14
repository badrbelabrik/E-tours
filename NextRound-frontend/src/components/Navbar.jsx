import {
    Search,
    Zap,
    LogIn,
} from 'lucide-react';
import { Link } from 'react-router-dom';

function Navbar() {
    return (
        <nav className="border-b border-white/10 bg-[#0B0F19]/95 backdrop-blur">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">

                {/* Logo */}
                <Link to="/" className="flex items-center gap-2">
                    <Zap
                        size={28}
                        className="fill-[#7C3AED] text-[#7C3AED]"
                    />

                    <span className="text-xl font-black tracking-tight text-white">
                        NextRound
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

                {/* Search + Auth */}
                <div className="flex items-center gap-5">

                    <div className="hidden items-center rounded-lg border border-white/15 bg-[#111827] px-3 py-2 lg:flex">
                        <Search size={16} className="mr-2 text-gray-500" />

                        <input
                            type="text"
                            placeholder="Search tournaments..."
                            className="w-44 bg-transparent text-sm text-white outline-none placeholder:text-gray-500"
                        />
                    </div>

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
                </div>
            </div>
        </nav>
    );
}

export default Navbar;