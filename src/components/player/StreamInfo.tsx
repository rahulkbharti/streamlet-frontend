"use client";
import { ThumbsDown, ThumbsUp, Share2, CheckCircle2, Eye, Calendar } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import CommentsSection from './CommentSection';
import api from '@/apis/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { memo, useState } from 'react';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';

const StreamInfo = memo(({ videoId }: { videoId?: string }) => {
    const queryClient = useQueryClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { isAuthenticated } = useSelector((state: any) => state.auth);
    const [descExpanded, setDescExpanded] = useState(false);

    /// Get Video Details & Engagements
    const { data: stream, isLoading } = useQuery({
        queryKey: [videoId, "video"],
        queryFn: async () => {
            if (!videoId) return {};
            const response = await api.get(`/videos/${videoId}`);
            return response.data;
        }
    });

    // Engagement Mutation
    const { mutate: React } = useMutation({
        mutationFn: async (action: string) => {
            if (!isAuthenticated) {
                toast.error('You must be logged in to perform this action.');
                return;
            }
            const response = await api.post(
                `/videos/engag/${stream.id}`,
                { videoId, action, channelId: stream.channel.id },
            );
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [videoId, "video"] });
        },
        onError: (e) => {
            console.error(e);
        }
    });

    if (isLoading) {
        return (
            <div className="mt-6 glass-panel rounded-2xl p-6 animate-pulse space-y-4">
                <div className="h-6 bg-white/10 rounded-lg w-3/4" />
                <div className="flex justify-between items-center pt-2">
                    <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-full bg-white/10" />
                        <div className="space-y-1.5">
                            <div className="h-4 bg-white/10 rounded w-28" />
                            <div className="h-3 bg-white/10 rounded w-20" />
                        </div>
                    </div>
                    <div className="h-9 bg-white/10 rounded-full w-28" />
                </div>
            </div>
        );
    }

    if (!stream || !stream.title) return null;

    const channelName = stream.channel?.channelName || "Creator";
    const initial = channelName.charAt(0).toUpperCase();

    const timeAgo = (dateStr: string) => {
        if (!dateStr) return "recently";
        const diff = Date.now() - new Date(dateStr).getTime();
        const mins = Math.floor(diff / (1000 * 60));
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const months = Math.floor(diff / (1000 * 60 * 60 * 24 * 30));
        const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365));
        if (years > 0) return `${years}y ago`;
        if (months > 0) return `${months}mo ago`;
        if (days > 0) return `${days}d ago`;
        if (hours > 0) return `${hours}h ago`;
        if (mins > 0) return `${mins}m ago`;
        return "just now";
    };

    return (
        <div className="space-y-6">
            {/* Title & Actions Bar */}
            <div className="glass-panel rounded-3xl p-5 lg:p-6 border border-white/10 shadow-xl space-y-5">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white leading-tight">
                    {stream.title}
                </h1>

                {/* Creator Profile Row + Interactive Action Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-white/5">
                    {/* Left: Creator Avatar & Follow/Subscribe */}
                    <div className="flex items-center gap-3.5">
                        <Link href={stream.channel?.id ? `/channel/${stream.channel.id}` : "#"}>
                            <div className="w-12 h-12 rounded-full brand-gradient p-0.5 shadow-md hover:scale-105 transition-transform flex-shrink-0">
                                {stream.channel?.profilePictureUrl ? (
                                    <Image
                                        unoptimized
                                        width={48}
                                        height={48}
                                        src={stream.channel.profilePictureUrl}
                                        alt={channelName}
                                        className="w-full h-full rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full rounded-full bg-zinc-900 flex items-center justify-center font-bold text-sm text-purple-300">
                                        {initial}
                                    </div>
                                )}
                            </div>
                        </Link>

                        <div>
                            <Link href={stream.channel?.id ? `/channel/${stream.channel.id}` : "#"} className="flex items-center gap-1.5 group">
                                <h3 className="font-bold text-sm text-white group-hover:text-purple-300 transition-colors">
                                    {channelName}
                                </h3>
                                <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
                            </Link>
                            <p className="text-xs text-zinc-400">
                                {stream.channel?._count?.subscribers || 0} subscribers
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => {
                                if (!isAuthenticated) {
                                    toast.error('Please log in to subscribe.');
                                    return;
                                }
                                React("subscribe");
                            }}
                            className={`ml-2 px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                                stream.userStatus?.subscribed
                                    ? "bg-white/10 hover:bg-white/15 text-zinc-300 border border-white/10"
                                    : "brand-gradient text-white shadow-md shadow-purple-600/30 hover:scale-105 active:scale-95"
                            }`}
                        >
                            {stream.userStatus?.subscribed ? "Subscribed" : "Subscribe"}
                        </button>
                    </div>

                    {/* Right: Actions (Like / Dislike / Share) */}
                    <div className="flex items-center gap-2.5">
                        {/* Joined Like/Dislike Pill */}
                        <div className="inline-flex items-center bg-white/5 rounded-full border border-white/10 p-0.5">
                            <button
                                type="button"
                                onClick={() => {
                                    if (!isAuthenticated) {
                                        toast.error('Please log in to like this video.');
                                        return;
                                    }
                                    React("like");
                                }}
                                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-l-full text-xs font-semibold hover:bg-white/10 transition-colors ${
                                    stream.userStatus?.liked ? "text-purple-400" : "text-zinc-300"
                                }`}
                            >
                                <ThumbsUp className={`w-4 h-4 ${stream.userStatus?.liked ? "fill-purple-400" : ""}`} />
                                <span>{stream.engagements?.likeCount?.toLocaleString() || 0}</span>
                            </button>

                            <div className="w-[1px] h-4 bg-white/10" />

                            <button
                                type="button"
                                onClick={() => {
                                    if (!isAuthenticated) {
                                        toast.error('Please log in to dislike.');
                                        return;
                                    }
                                    React("dislike");
                                }}
                                className={`px-3 py-1.5 rounded-r-full text-xs font-semibold hover:bg-white/10 transition-colors ${
                                    stream.userStatus?.disliked ? "text-purple-400" : "text-zinc-400"
                                }`}
                            >
                                <ThumbsDown className={`w-4 h-4 ${stream.userStatus?.disliked ? "fill-purple-400" : ""}`} />
                            </button>
                        </div>

                        {/* Share Button */}
                        <button
                            type="button"
                            onClick={() => {
                                if (typeof navigator !== 'undefined') {
                                    navigator.clipboard.writeText(window.location.href);
                                    toast.success("Stream link copied to clipboard!");
                                }
                            }}
                            className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-zinc-300 transition-colors cursor-pointer"
                        >
                            <Share2 className="w-4 h-4" />
                            <span className="hidden sm:inline">Share</span>
                        </button>
                    </div>
                </div>

                {/* Description Box */}
                <div
                    onClick={() => setDescExpanded(!descExpanded)}
                    className="p-4 rounded-2xl bg-black/40 border border-white/5 hover:bg-black/60 transition-colors cursor-pointer"
                >
                    <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-zinc-300 mb-2">
                        <span className="flex items-center gap-1 text-purple-300">
                            <Eye className="w-3.5 h-3.5" />
                            {stream.engagements?.viewCount?.toLocaleString() || 0} views
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-zinc-400">
                            <Calendar className="w-3.5 h-3.5" />
                            {timeAgo(stream.createdAt)}
                        </span>
                    </div>

                    <p className={`text-xs sm:text-sm text-zinc-300 whitespace-pre-line leading-relaxed ${
                        descExpanded ? "" : "line-clamp-2"
                    }`}>
                        {stream.description || "No description provided for this stream."}
                    </p>

                    <button
                        type="button"
                        className="text-[11px] font-bold text-purple-400 mt-2 hover:underline block"
                    >
                        {descExpanded ? "Show less" : "...more"}
                    </button>
                </div>
            </div>

            {/* Comments Section */}
            <CommentsSection videoId={stream?.id} />
        </div>
    );
});

StreamInfo.displayName = 'StreamInfo';
export default StreamInfo;

