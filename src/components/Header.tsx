"use client";
import Image from "next/image";
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
import { PlusIcon } from "lucide-react";
import SearchBar from "./SearchBar";

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
        <header className="flex flex-row md:flex-row justify-between items-center mb-8">
            <div className="flex items-center flex-start space-x-6">
                {/* Mobile menu button */}
                {/* <button
                    type="button"
                    className="md:hidden rounded-full text-gray-400 hover:text-purple-500 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500"
                    aria-label="Open menu"
                    onClick={() => alert('Mobile menu coming soon')}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button> */}
                {/* Logo */}
                <Link href="/" className="flex items-center group">
                    <Image
                        src="/logo.png"
                        alt="Logo"
                        width={60}
                        height={40}
                        className="rounded-lg shadow-md group-hover:scale-105 transition-transform"
                    />
                </Link>



                {/* Navigation */}
                <nav className="hidden md:flex items-center space-x-6 text-gray-400">
                    <a href="#" className="font-semibold text-white hover:text-purple-600 transition-colors text-xs">TOP STREAMING</a>
                    <a href="#" className="hover:text-white hover:text-purple-600 transition-colors text-xs">GAMES</a>
                    <a href="#" className="hover:text-white hover:text-purple-600 transition-colors text-xs">TEAMS</a>
                </nav>
            </div>

            <div className="flex items-center space-x-4 md:mt-0">
                {/* Uncomment SearchBar when ready */}
                <SearchBar />

                {/* Prevent layout shift during SSR/hydration */}
                {!isClient ? (
                    <div className="h-10 w-40" aria-hidden="true" />
                ) : isAuthenticated ? (
                    <>
                        {/* <NotificationButton /> */}
                        <Link
                            href="/upload"
                            className="mr-4 flex gap-1 items-center group border-2 border-purple-500 rounded-full p-1 hover:border-purple-700 transition-colors"
                            title="Upload Video"
                        >
                            <PlusIcon className="h-5 w-5 text-purple-500 group-hover:scale-110 transition-transform" />
                            <span className="text-sm text-purple-500 group-hover:text-purple-700 transition-colors hidden md:block pr-3">Upload</span>
                        </Link>
                        <UserProfile username={loginData?.username} />
                    </>
                ) : (
                    <>
                        <Link
                            href="/auth/login"
                            className="px-3 py-1.5 rounded-full text-sm bg-purple-600 text-white font-semibold hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                            Login
                        </Link>
                        <Link
                            href="/auth/signup"
                            className="px-3 py-1.5 rounded-full text-sm bg-gray-800 text-white font-semibold hover:bg-gray-900 transition-colors border border-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-700"
                        >
                            Signup
                        </Link>
                    </>
                )}
            </div>
        </header>
    );
}

// SearchBar Component (Unchanged)

// NotificationButton Component (Unchanged)
// function NotificationButton() {
//     /* ... SVG content ... */
//     return (
//         <button type="button" className="p-2 text-gray-400 hover:text-white transition-colors" aria-label="Notifications" title="Notifications" onClick={() => { alert('Implementing Soon') }} suppressHydrationWarning={true}>
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
//             </svg>
//         </button>
//     )
// }

// UserProfile Component (Simplified - no internal state needed)
function UserProfile({ username }: { username?: string }) {
    const dispatch = useDispatch();
    // The initial can be derived directly from props, no need for useState/useEffect
    const initial = (username?.[0] ?? 'U').toUpperCase();
    const handleLogout = async () => {
        const response = await api.post('/auth/logout');
        if (response.status === 200) {
            window.location.href = '/';
            dispatch(logout());
        }
    }
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    type="button"
                    aria-label="Open user menu"
                    // 1. Button: Simple, round, overflow hidden. KOI BORDER NAHI.
                    className="flex items-center justify-center w-[50] h-8 rounded-full bg-white overflow-hidden 
               focus:outline-none  focus:ring-purple-300 cursor-pointer"

                >
                    <Image
                        unoptimized
                        width={40}
                        height={40}
                        src={`https://placehold.co/40x40/7c3aed/ffffff?text=${initial}`}
                        alt="User avatar"
                        // 4. Image ko bas 'w-full h-full' se button ke andar faila do.
                        className="w-full h-full object-cover"
                    />
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
                <DropdownMenuLabel className="font-semibold">{(username || "User").toUpperCase()}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {/* <DropdownMenuItem asChild>
                    <Link href="/profile">Profile</Link>
                </DropdownMenuItem> */}
                <DropdownMenuSeparator />
                {/* <DropdownMenuItem onClick={() => { alert('Implementing Soon') }}>Settings</DropdownMenuItem> */}
                <DropdownMenuItem asChild>
                    <Link href="#" className="cursor-pointer" onClick={handleLogout}>Logout</Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}