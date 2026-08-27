"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { 
    Home, 
    Flame, 
    Radio, 
    Tv, 
    Compass, 
    Clock, 
    ThumbsUp, 
    Film, 
    Upload, 
    ChevronLeft, 
    ChevronRight,
    Gamepad2,
    Sparkles,
    Layers
} from "lucide-react";

export default function Sidebar() {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);

    const mainNav = [
        { label: "Home", href: "/", icon: Home },
        { label: "Trending", href: "/#trending", icon: Flame },
        { label: "Live Streams", href: "/#live", icon: Radio },
        { label: "Explore", href: "/#explore", icon: Compass },
    ];

    const libraryNav = [
        { label: "My Channel", href: "/channel/manage", icon: Tv },
        { label: "Studio Upload", href: "/upload", icon: Upload },
        { label: "Liked Videos", href: "/#liked", icon: ThumbsUp },
        { label: "Watch Later", href: "/#watchlater", icon: Clock },
    ];

    const categoryNav = [
        { label: "Gaming", href: "/#gaming", icon: Gamepad2 },
        { label: "4K HDR", href: "/#4k", icon: Sparkles },
        { label: "Originals", href: "/#originals", icon: Layers },
    ];

    return (
        <aside
            className={`sticky top-0 h-screen transition-all duration-300 z-30 flex flex-col justify-between py-5 px-3 glass-panel border-r border-white/5 ${
                collapsed ? "w-20" : "w-64"
            }`}
        >
            {/* Top Section: Nav Links */}
            <div className="flex flex-col space-y-6 overflow-y-auto overflow-x-hidden">
                {/* Logo & Toggle */}
                <div className="flex items-center justify-between px-2 pb-2">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="w-9 h-9 rounded-xl brand-gradient flex items-center justify-center shadow-lg shadow-purple-500/20 group-hover:scale-105 transition-transform flex-shrink-0">
                            <Film className="w-5 h-5 text-white" />
                        </div>
                        {!collapsed && (
                            <span className="font-extrabold tracking-tight text-base brand-gradient-text">
                                STREAMLET
                            </span>
                        )}
                    </Link>

                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
                        title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
                    >
                        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                    </button>
                </div>

                {/* Discover Group */}
                <div className="space-y-1">
                    {!collapsed && (
                        <p className="px-3 text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-2">
                            Discover
                        </p>
                    )}
                    {mainNav.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.label}
                                href={item.href}
                                className={`flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                                    isActive
                                        ? "bg-purple-600/20 text-purple-400 border border-purple-500/30 shadow-sm"
                                        : "text-zinc-400 hover:text-white hover:bg-white/5"
                                }`}
                                title={collapsed ? item.label : undefined}
                            >
                                <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? "text-purple-400" : "text-zinc-400"}`} />
                                {!collapsed && <span className="truncate">{item.label}</span>}
                            </Link>
                        );
                    })}
                </div>

                {/* Library Group */}
                <div className="space-y-1 pt-2 border-t border-white/5">
                    {!collapsed && (
                        <p className="px-3 text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-2">
                            Creator & Library
                        </p>
                    )}
                    {libraryNav.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.label}
                                href={item.href}
                                className={`flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                                    isActive
                                        ? "bg-purple-600/20 text-purple-400 border border-purple-500/30 shadow-sm"
                                        : "text-zinc-400 hover:text-white hover:bg-white/5"
                                }`}
                                title={collapsed ? item.label : undefined}
                            >
                                <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? "text-purple-400" : "text-zinc-400"}`} />
                                {!collapsed && <span className="truncate">{item.label}</span>}
                            </Link>
                        );
                    })}
                </div>

                {/* Categories Group */}
                <div className="space-y-1 pt-2 border-t border-white/5">
                    {!collapsed && (
                        <p className="px-3 text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-2">
                            Categories
                        </p>
                    )}
                    {categoryNav.map((item) => {
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.label}
                                href={item.href}
                                className="flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white hover:bg-white/5 transition-all"
                                title={collapsed ? item.label : undefined}
                            >
                                <Icon className="w-5 h-5 flex-shrink-0 text-zinc-400" />
                                {!collapsed && <span className="truncate">{item.label}</span>}
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* Bottom Card for Creator Studio */}
            {!collapsed && (
                <div className="p-3.5 rounded-2xl brand-gradient relative overflow-hidden text-white shadow-xl shadow-purple-600/20 mt-4">
                    <div className="relative z-10">
                        <h4 className="font-bold text-xs">Ready to Stream?</h4>
                        <p className="text-[10px] text-purple-100 mt-1 opacity-90">Upload and transcode 4K HLS content in seconds.</p>
                        <Link
                            href="/upload"
                            className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/40 hover:bg-black/60 backdrop-blur-md text-[11px] font-semibold transition-colors"
                        >
                            <Upload className="w-3.5 h-3.5" />
                            Go to Studio
                        </Link>
                    </div>
                </div>
            )}
        </aside>
    );
}