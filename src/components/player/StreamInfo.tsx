"use client";
import { ThumbsDown, ThumbsUp } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import CommentsSection from './CommentSection';
import api from '@/apis/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { memo } from 'react';
import { useSelector } from 'react-redux';

// type Stream = {
//     id: string;
//     title: string;
//     description: string;
//     videoId: string;
//     uploadStatus: string;
//     visibility: string;
//     createdAt: string;
//     channelId: string;
//     channel: {
//         id: string;
//         channelName: string;
//         description: string;
//         profilePictureUrl: string;
//         createdAt: string;
//         userId: string;
//         _count: { subscribers: number };
//     };
//     engagements?: {
//         _id: string;
//         viewCount: number;
//         likeCount: number;
//         dislikeCount: number;
//         createdAt: string;
//         updatedAt: string;
//         __v: number;
//     };
//     userStatus: {
//         liked: boolean;
//         disliked: boolean;
//         subscribed: boolean;
//     };
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     comments?: any[]; // Add this line to fix the error
// };

const StreamInfo = memo(({ videoId }: { videoId?: string }) => {
    const queryClient = useQueryClient();
    const { isAuthenticated } = useSelector((state: any) => state.auth)

    /// Get Engagments
    const { data: stream, isLoading } = useQuery({
        queryKey: [videoId, "video"],
        queryFn: async () => {
            if (!videoId) return {};
            const responce = await api.get(`/videos/${videoId}`)
            return responce.data;
        }
    })
    // Engagement
    const { mutate: React } = useMutation({
        mutationFn: async (action: string) => {
            if (!isAuthenticated) {
                alert('You must be logged in to perform this action.');
                return;
            }
            const response = await api.post(
                `/videos/engag/${stream.id}`,
                { videoId, action, channelId: stream.channel.id },
            );
            return response.data;
        },
        onSuccess: (data) => {
            console.log(data);
            queryClient.invalidateQueries({ queryKey: [videoId, "video"] })
        },
        onError: (e) => {
            console.error(e);
            return <></>;
        }
    })

    if (isLoading) return (
        <div className="mt-6 animate-pulse" aria-busy="true" aria-label="Loading">
            <div className="flex justify-between items-start">
                <div className="flex-1">
                    <div className="h-6 bg-gray-700 rounded w-3/4 mb-4" />
                    <div className="flex items-center mt-4 space-x-4">
                        <div className="w-12 h-12 rounded-full bg-gray-700" />
                        <div className="flex flex-col flex-1">
                            <div className="h-4 bg-gray-700 rounded w-32 mb-2" />
                            <div className="h-3 bg-gray-700 rounded w-20" />
                        </div>
                        <div className="flex items-center space-x-3 justify-end">
                            <div className="h-9 bg-gray-700 rounded-full w-24" />
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gray-700 rounded-full" />
                                <div className="w-10 h-10 bg-gray-700 rounded-full" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col items-start mt-2 bg-gray-900 rounded-lg p-4 border border-gray-800 w-full">
                <div className="h-3 bg-gray-700 rounded w-1/4 mb-3" />
                <div className="space-y-2 w-full">
                    <div className="h-3 bg-gray-700 rounded w-full" />
                    <div className="h-3 bg-gray-700 rounded w-5/6" />
                    <div className="h-3 bg-gray-700 rounded w-4/6" />
                </div>
            </div>
        </div>
    )

    // console.log(stream);
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
                                onClick={() => React("subscribe")}
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
                                    onClick={() => React("like")}
                                    className="p-2 rounded-full hover:bg-gray-700 transition-colors group"
                                    suppressHydrationWarning={true}
                                >
                                    <ThumbsUp fill={stream.userStatus?.liked ? "currentColor" : "none"} />
                                    <span className="text-xs ml-1 group-hover:text-white">{stream.engagements?.likeCount.toLocaleString()}</span>
                                </button>
                                <button
                                    type='button'
                                    onClick={() => React("dislike")}
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
            <CommentsSection videoId={stream?.id} />
        </>
    )
});
StreamInfo.displayName = 'StreamInfo';
export default StreamInfo;
