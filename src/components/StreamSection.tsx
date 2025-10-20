"use client";
import api from "@/apis/api";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";

export default function StreamsSection() {
    const { data: streams, isLoading } = useQuery({
        queryKey: ["videos-index"],
        queryFn: async () => {
            try {
                const responce = await api.get("/videos");
                console.log(responce)
                return responce.data;
            } catch (e) {
                console.error(e);
            }
        }
    })
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, idx) => (
                    <div key={idx} className="bg-[#121212] rounded-xl overflow-hidden animate-pulse">
                        <div className="h-40 w-full bg-gray-800 rounded-lg mb-4" />
                        <div className="p-4">
                            <div className="h-6 bg-gray-700 rounded w-3/4 mb-2" />
                            <div className="flex items-center mt-2">
                                <div className="w-6 h-6 bg-gray-700 rounded-full mr-2" />
                                <div className="h-4 bg-gray-700 rounded w-1/3" />
                            </div>
                            <div className="flex justify-between items-center mt-2">
                                <div className="h-3 bg-gray-700 rounded w-1/4" />
                                <div className="h-3 bg-gray-700 rounded w-1/4" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )
    }
    console.log(streams)
    return (
        <section className="mb-12">
            {/* <SectionHeader title="Streams of the day" /> */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {streams.map((stream: any) => (
                    <StreamCard key={stream.id} stream={stream} />
                ))}
            </div>
        </section>
    );

}


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

function StreamCard({ stream }: { stream: Stream }) {
    const CONTENT_URL = process.env.NEXT_PUBLIC_CONTENT_URL;
    return (
        <div className="bg-[#121212] rounded-xl overflow-hidden group">
            <div className="relative flex-shrink-0">
                <a href={`/watch?v=${stream.videoId}`}>
                    <div className="w-full aspect-[16/9]">
                        <Image
                            unoptimized
                            width={320}
                            height={180}
                            src={`${CONTENT_URL}/watch/${stream.videoId}/main.png`}
                            alt={stream.title}
                            className="object-cover group-hover:scale-105 transition-transform duration-300 w-full h-full"
                        />
                    </div>
                </a>

                {/* {stream.isLive && (
                    <span className="absolute top-3 left-3 bg-red-600 text-xs font-semibold px-2 py-1 rounded-md">
                        LIVE
                    </span>
                )} */}
            </div>
            <div className="p-4">
                <a href={`/watch?v=${stream.videoId}`}>
                    <h4 className="font-bold truncate">{stream.title}</h4>
                </a>
                {/* <div className="flex items-center mt-2 text-sm text-gray-400"> */}
                <Link href={`/channel/${stream.channel.id}`} className="flex items-center mt-2 text-sm text-gray-400">
                    <Image unoptimized
                        width={320}
                        height={180}
                        src={`https://placehold.co/100x100/6366f1/ffffff?text=${stream.channel.channelName.charAt(0)}`}
                        alt={stream.title}
                        className="w-6 h-6 rounded-full mr-2"
                    />
                    <span>{(stream.channel as unknown as { channelName: string })?.channelName}</span>
                </Link>
                <div className="flex justify-between items-center mt-2 text-xs text-gray-400">
                    <span>
                        {stream.engagements ? `${stream.engagements.viewCount} viewers` : '0 viewers'}
                    </span>
                    <span>
                        {stream.createdAt
                            ? (() => {
                                const diff = Date.now() - new Date(stream.createdAt).getTime();
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
