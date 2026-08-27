"use client";
import api from "@/apis/api";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Play, Sparkles, CheckCircle2, Eye, Flame } from "lucide-react";

type Stream = {
    id: string;
    title: string;
    description: string;
    videoId: string;
    uploadStatus: string;
    visibility: string;
    createdAt: string;
    channelId: string;
    channel?: {
        id: string;
        channelName: string;
        description: string;
        profilePictureUrl: string;
        createdAt: string;
        userId: string;
    };
    engagements?: {
        _id: string;
        viewCount: number;
        likeCount: number;
        dislikeCount: number;
    };
};

export default function SuggestionsSidebar() {
    const [filter, setFilter] = useState("All");
    const filters = ["All", "Related", "From Creator", "Live"];

    const { data: streams = [], isLoading } = useQuery<Stream[]>({
        queryKey: ['suggestedStreams'],
        queryFn: async () => {
            try {
                const response = await api.get(`/videos`);
                return response.data as Stream[];
            } catch (e) {
                console.error("Error loading suggestions:", e);
                return [];
            }
        }
    });

    if (isLoading) {
        return (
            <div className="w-full glass-panel rounded-2xl p-4 space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-white/5">
                    <div className="h-5 bg-white/10 rounded w-28 animate-pulse" />
                    <div className="h-4 bg-white/10 rounded w-16 animate-pulse" />
                </div>
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="flex gap-3 p-1.5 rounded-xl animate-pulse">
                        <div className="w-36 h-20 bg-white/10 rounded-xl flex-shrink-0" />
                        <div className="flex-1 space-y-2 py-1">
                            <div className="h-3.5 bg-white/10 rounded w-full" />
                            <div className="h-3 bg-white/10 rounded w-2/3" />
                            <div className="h-2.5 bg-white/10 rounded w-1/2" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <aside className="w-full glass-panel rounded-3xl p-4 lg:p-5 border border-white/10 shadow-xl">
            {/* Header & Title */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Flame className="w-4 h-4 text-purple-400" />
                    <h3 className="font-bold text-sm sm:text-base text-white tracking-tight">Up Next & Recommended</h3>
                </div>
                <span className="text-xs text-zinc-400 font-medium">
                    {streams.length} streams
                </span>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-3 border-b border-white/5 scrollbar-none">
                {filters.map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                            filter === f
                                ? "bg-purple-600 text-white shadow-sm shadow-purple-600/30"
                                : "bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10"
                        }`}
                    >
                        {f}
                    </button>
                ))}
            </div>

            {/* Suggestions Stream List */}
            <div className="space-y-3">
                {streams.length === 0 ? (
                    <div className="text-center py-8 text-zinc-500 text-xs">
                        <Sparkles className="w-6 h-6 text-purple-400/50 mx-auto mb-2" />
                        No additional recommendations found
                    </div>
                ) : (
                    streams.map((stream) => (
                        <SuggestionCard key={stream.id || stream.videoId} suggestion={stream} />
                    ))
                )}
            </div>
        </aside>
    );
}

function SuggestionCard({ suggestion }: { suggestion: Stream }) {
    const [imgError, setImgError] = useState(false);
    const CONTENT_URL = process.env.NEXT_PUBLIC_CONTENT_URL || "http://localhost:8002";
    const channelName = suggestion.channel?.channelName || "Creator";
    const initial = channelName.charAt(0).toUpperCase();

    // Helper for relative time
    const timeAgo = (dateStr: string) => {
        if (!dateStr) return "recently";
        const diff = Date.now() - new Date(dateStr).getTime();
        const mins = Math.floor(diff / (1000 * 60));
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const months = Math.floor(diff / (1000 * 60 * 60 * 24 * 30));
        if (months > 0) return `${months}mo ago`;
        if (days > 0) return `${days}d ago`;
        if (hours > 0) return `${hours}h ago`;
        if (mins > 0) return `${mins}m ago`;
        return "just now";
    };

    return (
        <div className="group flex gap-3 p-2 rounded-2xl hover:bg-white/[0.06] border border-transparent hover:border-white/5 transition-all">
            {/* Thumbnail Left Container */}
            <div className="w-36 sm:w-40 aspect-[16/9] relative flex-shrink-0 rounded-xl overflow-hidden bg-zinc-950 shadow-md">
                <Link href={`/watch?v=${suggestion.videoId}`} className="block w-full h-full relative">
                    {!imgError ? (
                        <Image
                            unoptimized
                            width={240}
                            height={135}
                            src={`${CONTENT_URL}/watch/${suggestion.videoId}/main.png`}
                            alt={suggestion.title}
                            onError={() => setImgError(true)}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-tr from-purple-950 to-zinc-900 flex items-center justify-center">
                            <span className="text-xs font-bold text-purple-300">{initial}</span>
                        </div>
                    )}

                    {/* Play Hover Overlay */}
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[1px]">
                        <div className="w-8 h-8 rounded-full brand-gradient flex items-center justify-center shadow-md">
                            <Play className="w-3.5 h-3.5 text-white fill-white ml-0.5" />
                        </div>
                    </div>

                    {/* Duration Badge */}
                    <div className="absolute bottom-1.5 right-1.5 bg-black/80 backdrop-blur-sm text-[10px] font-medium text-white px-1.5 py-0.5 rounded">
                        10:24
                    </div>
                </Link>
            </div>

            {/* Info Right */}
            <div className="flex-1 min-w-0 flex flex-col justify-center">
                <Link href={`/watch?v=${suggestion.videoId}`}>
                    <h4 className="font-semibold text-xs text-zinc-100 line-clamp-2 leading-snug group-hover:text-purple-300 transition-colors">
                        {suggestion.title}
                    </h4>
                </Link>

                <div className="flex items-center gap-1 mt-1 text-[11px] text-zinc-400">
                    <Link
                        href={suggestion.channel?.id ? `/channel/${suggestion.channel.id}` : "#"}
                        className="truncate hover:text-zinc-200 transition-colors"
                    >
                        {channelName}
                    </Link>
                    <CheckCircle2 className="w-3 h-3 text-purple-400 flex-shrink-0" />
                </div>

                <div className="flex items-center gap-1.5 mt-1 text-[10px] text-zinc-500">
                    <span className="flex items-center gap-0.5">
                        <Eye className="w-2.5 h-2.5" />
                        {suggestion.engagements?.viewCount ? `${suggestion.engagements.viewCount.toLocaleString()}` : '0'} views
                    </span>
                    <span>•</span>
                    <span>{timeAgo(suggestion.createdAt)}</span>
                </div>
            </div>
        </div>
    );
}

