"use client";

// UserProfile ke zaroori imports
import Image from "next/image";
import Link from "next/link";
import { useDispatch } from "react-redux";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import api from "@/apis/api";
import { logout } from "@/store/authSlice";

// UserProfile Component (Cleaned up)
export default function UserProfile({ username }: { username?: string }) {
    const dispatch = useDispatch();
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
                    // 100% round button
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-white overflow-hidden 
                               focus:outline-none 
                               ring-2 ring-purple-500 
                               focus:ring-4 focus:ring-purple-300 transition-all"
                >
                    _           <Image
                        unoptimized
                        width={40}
                        height={40}
                        src={`https://placehold.co/40x40/7c3aed/ffffff?text=${initial}`}
                        alt="User avatar"
                        // Image ko button ke andar faila do
                        className="w-full h-full object-cover"
                    />
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="bg-zinc-900 border-zinc-700 text-white">
                <DropdownMenuLabel className="font-semibold text-zinc-200">
                    {(username || "User").toUpperCase()}
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-zinc-700" />
                <DropdownMenuItem asChild className="focus:bg-purple-600 focus:text-white">
                    <Link href="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-zinc-700" />
                <DropdownMenuItem
                    className="focus:bg-purple-600 focus:text-white"
                    onClick={() => { alert('Implementing Soon') }}
                >
                    Settings
                </DropdownMenuItem>
                <DropdownMenuItem
                    asChild
                    className="focus:bg-red-600 focus:text-white"
                >
                    <button onClick={handleLogout} className="w-full text-left">
                        Logout
                    </button>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

