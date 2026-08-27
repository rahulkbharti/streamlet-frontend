"use client";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import api from "@/apis/api";
import { logout } from "@/store/authSlice";
import { Plus, Video, Radio, Flame, Sparkles, LogOut, User } from "lucide-react";
import SearchBar from "./SearchBar";

export default function Header() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { isAuthenticated, loginData } = useSelector((state: any) => state.auth);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    return (
        <header className="sticky top-0 z-40 glass-header px-4 lg:px-8 py-3 mb-6 flex items-center justify-between transition-all duration-300">
            {/* Left: Brand & Navigation */}
            <div className="flex items-center space-x-6">
                <Link href="/" className="flex items-center gap-2.5 group">
                    <div className="relative flex items-center justify-center w-10 h-10 rounded-xl brand-gradient p-0.5 shadow-lg shadow-purple-500/20 group-hover:scale-105 transition-transform">
                        <div className="w-full h-full bg-[#0d0e15] rounded-[10px] flex items-center justify-center">
                            <Video className="w-5 h-5 text-purple-400 group-hover:text-purple-300 transition-colors" />
                        </div>
                        <span className="absolute -top-1 -right-1 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500"></span>
                        </span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-lg font-black tracking-tight brand-gradient-text">STREAMLET</span>
                        <span className="text-[10px] font-semibold tracking-wider text-purple-400/80 -mt-1 hidden sm:block">VOD & LIVE</span>
                    </div>
                </Link>

                <nav className="hidden lg:flex items-center space-x-1">
                    <Link
                        href="/"
                        className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-white bg-white/10 hover:bg-white/15 transition-colors flex items-center gap-1.5"
                    >
                        <Flame className="w-3.5 h-3.5 text-purple-400" />
                        Explore
                    </Link>
                    <Link
                        href="/#trending"
                        className="px-3.5 py-1.5 rounded-full text-xs font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition-colors flex items-center gap-1.5"
                    >
                        <Radio className="w-3.5 h-3.5 text-red-400" />
                        Live
                    </Link>
                    <Link
                        href="/#channels"
                        className="px-3.5 py-1.5 rounded-full text-xs font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition-colors flex items-center gap-1.5"
                    >
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        Top Channels
                    </Link>
                </nav>
            </div>

            {/* Middle: Enhanced SearchBar */}
            <div className="flex-1 max-w-md mx-4 hidden sm:block">
                <SearchBar />
            </div>

            {/* Right: Actions / Auth */}
            <div className="flex items-center space-x-3">
                {!isClient ? (
                    <div className="h-9 w-32 bg-white/5 rounded-full animate-pulse" />
                ) : isAuthenticated ? (
                    <>
                        <Link
                            href="/upload"
                            className="relative group inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold text-white brand-gradient hover:opacity-95 shadow-md shadow-purple-500/25 transition-all hover:scale-105 active:scale-95"
                            title="Upload Video"
                        >
                            <Plus className="w-4 h-4 stroke-[2.5]" />
                            <span className="hidden md:inline">Studio Upload</span>
                        </Link>

                        <UserProfile username={loginData?.username} />
                    </>
                ) : (
                    <div className="flex items-center space-x-2">
                        <Link
                            href="/auth/login"
                            className="px-4 py-2 rounded-full text-xs font-semibold text-zinc-300 hover:text-white hover:bg-white/10 transition-colors"
                        >
                            Sign In
                        </Link>
                        <Link
                            href="/auth/signup"
                            className="px-4 py-2 rounded-full text-xs font-semibold text-white brand-gradient shadow-md shadow-purple-500/20 hover:scale-105 transition-all"
                        >
                            Get Started
                        </Link>
                    </div>
                )}
            </div>
        </header>
    );
}

function UserProfile({ username }: { username?: string }) {
    const dispatch = useDispatch();
    const initial = (username?.[0] ?? 'U').toUpperCase();

    const handleLogout = async () => {
        try {
            await api.post('/auth/logout');
        } catch {
            // ignore
        } finally {
            dispatch(logout());
            window.location.href = '/';
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    type="button"
                    aria-label="Open user menu"
                    className="flex items-center justify-center w-9 h-9 rounded-full ring-2 ring-purple-500/50 hover:ring-purple-400 transition-all p-0.5 focus:outline-none cursor-pointer"
                >
                    <div className="w-full h-full rounded-full brand-gradient flex items-center justify-center text-white font-bold text-xs shadow-inner">
                        {initial}
                    </div>
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56 glass-panel border border-white/10 text-zinc-100 p-2 rounded-xl">
                <DropdownMenuLabel className="font-medium text-xs text-zinc-400 px-2 py-1.5">
                    Signed in as <span className="text-white font-semibold block text-sm truncate">{username || "User"}</span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/10 my-1" />
                <DropdownMenuItem asChild>
                    <Link href="/channel/manage" className="flex items-center gap-2 text-xs px-2 py-2 rounded-lg hover:bg-white/10 cursor-pointer">
                        <User className="w-4 h-4 text-purple-400" />
                        My Channel
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href="/upload" className="flex items-center gap-2 text-xs px-2 py-2 rounded-lg hover:bg-white/10 cursor-pointer">
                        <Video className="w-4 h-4 text-indigo-400" />
                        Creator Studio
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/10 my-1" />
                <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2 text-xs px-2 py-2 rounded-lg text-red-400 hover:bg-red-500/10 cursor-pointer">
                    <LogOut className="w-4 h-4" />
                    Sign Out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}