"use client";
import Image from 'next/image';
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
                            <p className="font-semibold">Mike Fisher</p>
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
                        <LikeIcon />
                        <span className="text-xs ml-1 group-hover:text-white">{likes.toLocaleString()}</span>
                    </button>
                    <button
                        type='button'
                        onClick={handleDislike}
                        className="p-2 rounded-full hover:bg-gray-700 transition-colors group"
                        suppressHydrationWarning={true}
                    >
                        <DislikeIcon />
                        <span className="text-xs ml-1 group-hover:text-white">{dislikes.toLocaleString()}</span>
                    </button>
                </div>
            </div>
        </div>
    )
}

function LikeIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 18.734V6a2 2 0 012-2h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293h3.293a2 2 0 012 2v1z" />
        </svg>
    )
}

function DislikeIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.738 3h4.017c.163 0 .326.02.485.06L17 5.266V18a2 2 0 01-2 2h-2.586a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 009 16.586H6.707a2 2 0 01-2-2v-1z" />
        </svg>
    )
}