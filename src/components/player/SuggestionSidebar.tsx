"use client";
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react";

type Stream = {
    id: string;
    title: string;
    description: string;
    videoId: string;
    uploadStatus: string;
    visibility: string;
    createdAt: string;
    channelId: string;
    channel: {
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
        createdAt: string;
        updatedAt: string;
        __v: number;
    };
};
const API_URL = process.env.NEXT_PUBLIC_API_URL;
const CONTENT_URL = process.env.NEXT_PUBLIC_CONTENT_URL;

export default function SuggestionsSidebar() {
    const [streams, setStreams] = useState<Stream[]>([]);
    useEffect(() => {
        // This will run only on the client side
        const FetchData = async () => {
            const res = await fetch(`${API_URL}/videos`, { cache: 'no-store' });
            const streams: Stream[] = await res.json();
            setStreams(streams);
        }
        FetchData();
    }, []);
    return (
        <div className="w-full lg:w-1/3">
            {/* <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">You may like</h3>
                <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
                    View all
                </a>
            </div> */}

            <div className="space-y-4">
                {streams.map(stream => (
                    <SuggestionCard key={stream.id} suggestion={stream} />
                ))}
            </div>
        </div>
    )
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function SuggestionCard({ suggestion }: { suggestion: any }) {
    return (
        <div className="flex gap-4 group cursor-pointer hover:bg-gray-800/50 p-2 rounded-lg transition-all">
            <div className="w-40 relative flex-shrink-0">
                <a href={`/watch?v=${suggestion.videoId}`}>
                    <Image unoptimized
                        width={320}
                        height={180}
                        src={`${CONTENT_URL}/watch/${suggestion.videoId}/main.png`}
                        alt={suggestion.title}
                        className="rounded-lg w-full h-24 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                </a>

            </div>

            <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm line-clamp-2  transition-colors">
                    <a href={`/watch?v=${suggestion.videoId}`} className="hover:text-purple-400">
                        {suggestion.title}
                    </a>
                </h4>
                <p className="text-sm text-gray-400 mt-1">
                    <Link href={`/channel/${suggestion.channel.id}`} className="hover:text-purple-400">
                        {suggestion.channel.channelName}
                    </Link>
                </p>
                <div className="flex justify-between items-center mt-2 text-xs text-gray-400">
                    <span>
                        {suggestion.engagements ? `${suggestion.engagements.viewCount} viewers` : '0 viewers'}
                    </span>
                    <span>
                        {suggestion.createdAt
                            ? (() => {
                                const diff = Date.now() - new Date(suggestion.createdAt).getTime();
                                const mins = Math.floor(diff / (1000 * 60));
                                const hours = Math.floor(diff / (1000 * 60 * 60));
                                const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                                const months = Math.floor(diff / (1000 * 60 * 60 * 24 * 30));
                                const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365));
                                if (years > 0) return `${years} year${years > 1 ? 's' : ''} ago`;
                                if (months > 0) return `${months} month${months > 1 ? 's' : ''} ago`;
                                if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
                                if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
                                if (mins > 0) return `${mins} minute${mins > 1 ? 's' : ''} ago`;
                                return 'just now';
                            })()
                            : '2 days ago'}
                    </span>
                </div>
            </div>
        </div>
    )
}