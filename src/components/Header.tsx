"use client";
import Image from "next/image";
import Link from "next/link";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

// The main, cleaned-up Header component
export default function Header() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { isAuthenticated, loginData } = useSelector((state: any) => state.auth);

    const [isClient, setIsClient] = useState(false);

    // This effect runs only on the client, after the initial render
    useEffect(() => {
        setIsClient(true);
    }, []);

    return (
        <header className="flex flex-col md:flex-row justify-between items-center mb-10">
            <div className="flex items-center space-x-8">
                <Link href="/" className="flex items-center space-x-2">
                    <Image src={"/logo.png"} alt="Logo" width={100} height={40} />
                </Link>
                <nav className="hidden md:flex items-center space-x-6 text-gray-400">
                    <a href="#" className="font-semibold text-white">TOP STREAMING</a>
                    <a href="#" className="hover:text-white transition-colors">GAMES</a>
                    <a href="#" className="hover:text-white transition-colors">TEAMS</a>
                </nav>
            </div>

            <div className="flex items-center space-x-4 mt-4 md:mt-0">
                <SearchBar />

                {/* Render nothing on the server and initial client render */}
                {!isClient ? (
                    <div className="h-10 w-40" /> // A placeholder to prevent layout shift
                ) : isAuthenticated ? (
                    <>
                        <NotificationButton />
                        <UserProfile username={loginData?.username} />
                    </>
                ) : (
                    <>
                        <Link href="/auth/login" className="px-4 py-2 rounded-full bg-purple-600 text-white font-semibold hover:bg-purple-700 transition-colors">
                            Login
                        </Link>
                        <Link href="/auth/signup" className="px-4 py-2 rounded-full bg-gray-800 text-white font-semibold hover:bg-gray-900 transition-colors border border-gray-700">
                            Signup
                        </Link>
                    </>
                )}
            </div>
        </header>
    );
}

// SearchBar Component (Unchanged)
function SearchBar() {
    return (
        <div className="relative">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
                type="text"
                placeholder="Search [coming Soon]"
                className="bg-[#121212] rounded-full py-2 pl-10 pr-4 w-full md:w-auto focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
        </div>
    );
}

// NotificationButton Component (Unchanged)
function NotificationButton() {
    /* ... SVG content ... */
    return (
        <button type="button" className="p-2 text-gray-400 hover:text-white transition-colors" aria-label="Notifications" title="Notifications" onClick={() => { alert('Implementing Soon') }} suppressHydrationWarning={true}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
        </button>
    )
}

// UserProfile Component (Simplified - no internal state needed)
function UserProfile({ username }: { username?: string }) {
    // The initial can be derived directly from props, no need for useState/useEffect
    const initial = (username?.[0] ?? 'U').toUpperCase();

    return (
        <div className="flex items-center space-x-2" onClick={() => { alert('Implementing Soon') }}>
            <Image unoptimized
                width={40} height={40}
                src={`https://placehold.co/40x40/7c3aed/ffffff?text=${initial}`}
                alt="User avatar"
                className="rounded-full w-10 h-10 border-2 border-purple-500 cursor-pointer"

            />
            <span className="hidden md:block cursor-pointer">{username || "User"}</span>
        </div>
    );
}