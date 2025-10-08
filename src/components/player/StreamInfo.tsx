"use client";
import { ThumbsDown, ThumbsUp } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import CommentsSection from './CommentSection';

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
        _count: { subscribers: number };
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
    userStatus: {
        liked: boolean;
        disliked: boolean;
        subscribed: boolean;
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    comments?: any[]; // Add this line to fix the error
};
const API_URL = process.env.NEXT_PUBLIC_API_URL;
export default function StreamInfo({ videoId }: { videoId?: string }) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const loginData = useSelector((state: any) => state.auth.loginData);
    // console.log('Login data from Redux:', loginData);
    // console.log('StreamInfo received videoId:', videoId);
    const [stream, setStream] = useState({} as Stream);

    useEffect(() => {
        const fetchData = async () => {
            // Any additional data fetching can be done here
            const responce = await fetch(`${API_URL}/videos/${videoId}`, {
                headers: {
                    "Authorization": `Bearer ${loginData?.accessToken}`,
                    "Content-Type": "application/json"
                }, cache: 'no-store'
            });
            const data = await responce.json();
            console.log('Fetched video data:', data);
            setStream(data);
        };
        fetchData();
        // Extract videoId from URL query parameters
    }, [videoId, loginData?.accessToken]);

    const EngageVideo = async (action: "like" | "dislike" | "subscribe") => {
        const responce = await fetch(`${API_URL}/engag/${stream.id}`, {
            headers: {
                "Authorization": `Bearer ${loginData?.accessToken}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ videoId, action, channelId: stream.channel.id }),
            method: "POST"
        });
        return await responce.json();
    }
    const handleLike = async () => {
        const res = await EngageVideo("like");
        console.log(res);
        setStream((pre) => ({
            ...pre,
            engagements: {
                ...pre.engagements,
                likeCount: res.engagement.likeCount,
                _id: pre.engagements?._id ?? "",
                viewCount: pre.engagements?.viewCount ?? 0,
                dislikeCount: res.engagement.dislikeCount,
                createdAt: pre.engagements?.createdAt ?? "",
                updatedAt: pre.engagements?.updatedAt ?? "",
                __v: pre.engagements?.__v ?? 0,
            },
            userStatus: { ...pre.userStatus, liked: res.message === "Video liked" ? true : false, disliked: res.message === "Like removed" && false }
        }));
    }
    const handleDislike = async () => {
        const res = await EngageVideo("dislike");
        setStream((pre) => ({
            ...pre,
            engagements: {
                ...pre.engagements,
                likeCount: res.engagement.likeCount,
                _id: pre.engagements?._id ?? "",
                viewCount: pre.engagements?.viewCount ?? 0,
                dislikeCount: res.engagement.dislikeCount,
                createdAt: pre.engagements?.createdAt ?? "",
                updatedAt: pre.engagements?.updatedAt ?? "",
                __v: pre.engagements?.__v ?? 0,
            },
            userStatus: { ...pre.userStatus, disliked: res.message === "Video disliked" ? true : false, liked: res.message === "Dislike removed" && false }
        }));
    }
    const handleSubscribe = async () => {
        const res = await EngageVideo("subscribe");
        console.log(res);
        setStream((pre) => ({
            ...pre,
            userStatus: { ...pre.userStatus, subscribed: res.message === "Subscribed successfully" ? true : false },
            channel: {
                ...pre.channel,
                _count: {
                    ...pre.channel._count,
                    subscribers:
                        res.message === "Subscribed successfully"
                            ? pre.channel._count.subscribers + 1
                            : res.message === "Unsubscribed successfully"
                                ? pre.channel._count.subscribers - 1
                                : pre.channel._count.subscribers,
                },
            },
        }))
    }

    return (
        <>
            <div className="mt-6">
                <div className="flex justify-between items-start">
                    <div className="flex-1">
                        <h2 className="text-xl font-bold">{stream.title}</h2>
                        <div className="flex items-center mt-4 space-x-4">
                            <Image unoptimized
                                width={48}
                                height={48}
                                src="https://placehold.co/48x48/3b82f6/ffffff?text=MF"
                                alt="Mike Fisher"
                                className="w-12 h-12 rounded-full"
                            />
                            <div className="flex flex-col">
                                <p className="font-semibold"><Link href="#">{stream.channel?.channelName}</Link></p>
                                <p className="text-sm text-gray-400">{stream.channel?._count.subscribers} subscribers</p>
                            </div>
                            <button
                                type='button'
                                onClick={handleSubscribe}
                                className={`px-6 py-2 rounded-full text-sm font-semibold transition-colors ${stream.userStatus?.subscribed
                                    ? 'bg-gray-600 hover:bg-gray-700'
                                    : 'bg-red-600 hover:bg-red-700'
                                    }`}
                                suppressHydrationWarning={true}
                            >
                                {stream.userStatus?.subscribed ? 'Subscribed' : 'Subscribe'}
                            </button>
                            <div className="flex items-center space-x-3 text-gray-400 justify-end flex-1">
                                <button
                                    type='button'
                                    onClick={handleLike}
                                    className="p-2 rounded-full hover:bg-gray-700 transition-colors group"
                                    suppressHydrationWarning={true}
                                >
                                    <ThumbsUp fill={stream.userStatus?.liked ? "currentColor" : "none"} />
                                    <span className="text-xs ml-1 group-hover:text-white">{stream.engagements?.likeCount.toLocaleString()}</span>
                                </button>
                                <button
                                    type='button'
                                    onClick={handleDislike}
                                    className="p-2 rounded-full hover:bg-gray-700 transition-colors group"
                                    suppressHydrationWarning={true}
                                >
                                    <ThumbsDown fill={stream.userStatus?.disliked ? "currentColor" : "none"} />
                                    <span className="text-xs ml-1 group-hover:text-white">{stream.engagements?.dislikeCount.toLocaleString()}</span>
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
                <div className="flex flex-col items-start mt-2 bg-gray-900 rounded-lg p-4 border border-gray-800">
                    <div className="text-sm text-gray-400 mb-2">
                        {stream.engagements?.viewCount?.toLocaleString()} views • {stream.createdAt
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
                    </div>
                    <div className="text-base text-gray-200 mt-2 break-words">
                        {stream.description}
                    </div>
                </div>
            </div>
            <CommentsSection comments={stream.comments || []} />
        </>
    )
}

