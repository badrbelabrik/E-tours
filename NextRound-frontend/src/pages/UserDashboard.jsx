import {
    CalendarDays,
    Gamepad2,
    Trophy,
    Users,
    ArrowRight,
} from 'lucide-react';

import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

function UserDashboard() {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-[#0B0F19] text-white">
            <Navbar />

            <main className="mx-auto max-w-7xl px-6 py-12">

                {/* Header */}
                <div className="mb-10">
                    <p className="text-sm font-semibold uppercase tracking-widest text-[#8B5CF6]">
                        Dashboard
                    </p>

                    <h1 className="mt-2 text-3xl font-black md:text-4xl">
                        Welcome back{user?.name ? `, ${user.name}` : ''} 👋
                    </h1>

                    <p className="mt-2 text-gray-400">
                        Here's what's happening with your tournaments.
                    </p>
                </div>

                {/* Stats */}
                <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

                    <StatCard
                        icon={Trophy}
                        label="Tournaments"
                        value="4"
                    />

                    <StatCard
                        icon={Gamepad2}
                        label="Matches"
                        value="8"
                    />

                    <StatCard
                        icon={Trophy}
                        label="Victories"
                        value="6"
                    />

                    <StatCard
                        icon={Users}
                        label="Points"
                        value="540"
                    />

                </section>

                {/* My tournaments */}
                <section className="mt-12">

                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-black">
                                My Tournaments
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                                Tournaments you organize.
                            </p>
                        </div>

                        <button className="hidden items-center gap-2 text-sm font-semibold text-[#A78BFA] transition hover:text-[#C4B5FD] sm:flex">
                            View all
                            <ArrowRight size={16} />
                        </button>
                    </div>

                    <div className="overflow-hidden rounded-xl border border-white/10 bg-[#111827]">

                        <TournamentRow
                            title="Summer Championship"
                            game="Valorant"
                            players="12 / 16"
                            status="Open"
                        />

                        <TournamentRow
                            title="CS2 Pro League"
                            game="Counter-Strike 2"
                            players="8 / 16"
                            status="In Progress"
                        />

                    </div>
                </section>

                {/* Upcoming matches */}
                <section className="mt-12">

                    <div className="mb-6">
                        <h2 className="text-2xl font-black">
                            Upcoming Matches
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            Your scheduled matches.
                        </p>
                    </div>

                    <div className="grid gap-5 md:grid-cols-2">

                        <MatchCard
                            round="Quarter Final"
                            player1="Badr"
                            player2="Ahmed"
                            date="Sep 20"
                            time="18:00"
                        />

                        <MatchCard
                            round="Semi Final"
                            player1="Badr"
                            player2="Karim"
                            date="Sep 22"
                            time="20:00"
                        />

                    </div>
                </section>

            </main>
        </div>
    );
}

function StatCard({ icon: Icon, label, value }) {
    return (
        <div className="rounded-xl border border-white/10 bg-[#111827] p-5 transition hover:border-[#7C3AED]/40">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-500">
                        {label}
                    </p>

                    <p className="mt-2 text-3xl font-black">
                        {value}
                    </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#7C3AED]/10">
                    <Icon
                        size={21}
                        className="text-[#A78BFA]"
                    />
                </div>
            </div>
        </div>
    );
}

function TournamentRow({
                           title,
                           game,
                           players,
                           status,
                       }) {
    const statusStyles = {
        Open: 'bg-green-500/10 text-green-400',
        'In Progress': 'bg-blue-500/10 text-blue-400',
    };

    return (
        <div className="flex flex-col gap-4 border-b border-white/5 p-5 last:border-b-0 sm:flex-row sm:items-center sm:justify-between">

            <div>
                <p className="font-semibold text-white">
                    {title}
                </p>

                <p className="mt-1 text-sm text-gray-500">
                    {game}
                </p>
            </div>

            <div className="flex items-center gap-6">

                <div className="text-sm text-gray-400">
                    <Users size={15} className="mr-1 inline" />
                    {players}
                </div>

                <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[status]}`}
                >
                    {status}
                </span>

                <button className="text-gray-500 transition hover:text-white">
                    <ArrowRight size={18} />
                </button>

            </div>
        </div>
    );
}

function MatchCard({
                       round,
                       player1,
                       player2,
                       date,
                       time,
                   }) {
    return (
        <div className="rounded-xl border border-white/10 bg-[#111827] p-5 transition hover:border-[#7C3AED]/40">

            <div className="flex items-center justify-between">

                <span className="text-xs font-semibold uppercase tracking-wider text-[#8B5CF6]">
                    {round}
                </span>

                <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-400">
                    Scheduled
                </span>

            </div>

            <div className="mt-6 flex items-center justify-between">

                <div>
                    <p className="font-bold">
                        {player1}
                    </p>

                    <p className="mt-2 text-gray-500">
                        vs
                    </p>

                    <p className="mt-2 font-bold">
                        {player2}
                    </p>
                </div>

                <div className="text-right text-sm text-gray-400">
                    <div className="flex items-center gap-2">
                        <CalendarDays size={15} />
                        {date}
                    </div>

                    <p className="mt-2">
                        {time}
                    </p>
                </div>

            </div>
        </div>
    );
}

export default UserDashboard;