"use client";
import { ThumbsDown, ThumbsUp } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react'

export default function StreamInfo() {
    const [isSubscribed, setIsSubscribed] = useState(false)
    const [likes, setLikes] = useState(12543)
    const [dislikes, setDislikes] = useState(234)

    const handleSubscribe = () => {
        setIsSubscribed(!isSubscribed)
    }

    const handleLike = () => {
        setLikes(likes + 1)
    }

    const handleDislike = () => {
        setDislikes(dislikes + 1)
    }

    return (
        <div className="mt-6">
            <div className="flex justify-between items-start">
                <div className="flex-1">
                    <h2 className="text-xl font-bold">1000 miles of Sebring with Golden Mike - 2022</h2>
                    <div className="flex items-center mt-4 space-x-4">
                        <Image unoptimized
                            width={48}
                            height={48}
                            src="https://placehold.co/48x48/3b82f6/ffffff?text=MF"
                            alt="Mike Fisher"
                            className="w-12 h-12 rounded-full"
                        />
                        <div className="flex-1">
                            <p className="font-semibold"><Link href="#">Mike Fisher</Link></p>
                            <p className="text-sm text-gray-400">5,158,223 subscribers</p>
                        </div>
                        <button
                            type='button'
                            onClick={handleSubscribe}
                            className={`px-6 py-2 rounded-full text-sm font-semibold transition-colors ${isSubscribed
                                ? 'bg-gray-600 hover:bg-gray-700'
                                : 'bg-purple-600 hover:bg-purple-700'
                                }`}
                            suppressHydrationWarning={true}
                        >
                            {isSubscribed ? 'Subscribed' : 'Subscribe'}
                        </button>
                    </div>
                </div>

                <div className="flex items-center space-x-3 text-gray-400">
                    <button
                        type='button'
                        onClick={handleLike}
                        className="p-2 rounded-full hover:bg-gray-700 transition-colors group"
                        suppressHydrationWarning={true}
                    >
                        <ThumbsUp />
                        <span className="text-xs ml-1 group-hover:text-white">{likes.toLocaleString()}</span>
                    </button>
                    <button
                        type='button'
                        onClick={handleDislike}
                        className="p-2 rounded-full hover:bg-gray-700 transition-colors group"
                        suppressHydrationWarning={true}
                    >
                        <ThumbsDown />
                        <span className="text-xs ml-1 group-hover:text-white">{dislikes.toLocaleString()}</span>
                    </button>
                </div>
            </div>
        </div>
    )
}

