'use client'
import Header from '@/components/Header'
import CommentsSection from '@/components/player/CommentSection'
import StreamInfo from '@/components/player/StreamInfo'
import SuggestionsSidebar from '@/components/player/SuggestionSidebar'
import HlsPlayer from '@/components/player/VideoControls'
import Sidebar from '@/components/Sidebar'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Suspense } from 'react';

function PlayerContent() {
    const [hls, setHls] = useState('');
    const searchParams = useSearchParams();
    useEffect(() => {
        const videoId = searchParams.get('v');
        if (videoId == "ID") {
            // In a real application, you might fetch the HLS URL based on the videoId
            // For this example, we'll just simulate it
            setHls(`https://m3u8-backend-server.onrender.com/watch/LMYdMsiJyYP/master.m3u8`);
        } else {
            setHls(`https://m3u8-backend-server.onrender.com/watch/o7iMTRAQJNd/master.m3u8`);
        }
    }, [searchParams]);

    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 main-content-bg rounded-l-3xl p-6 md:p-10">
                <Header />
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Main Video Content */}
                    <div className="w-full lg:w-2/3">
                        {/* Video Player */}
                        <div className="bg-black rounded-2xl aspect-video relative flex items-center justify-center overflow-hidden">
                            {/* Video Placeholder */}
                            {/* <Image unoptimized
                                width={320}
                                height={180}
                                src="https://placehold.co/1280x720/1e293b/ffffff?text=LOADING+VIDEO..."
                                alt="Live Stream"
                                className="rounded-2xl w-full h-full object-cover"
                            /> */}

                            {/* Video Controls Overlay */}
                            <div className="absolute left-0 right-0 bottom-0 top-0  bg-black/30 rounded-lg backdrop-blur-sm">
                                <HlsPlayer hlsSource={hls} />
                            </div>
                        </div>

                        {/* Stream Info */}
                        <StreamInfo />

                        {/* Comments Section */}
                        <CommentsSection />
                    </div>

                    {/* Suggestions Sidebar */}
                    <SuggestionsSidebar />
                </div>
            </main>
        </div>
    );
}

export default function Player() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <PlayerContent />
        </Suspense>
    );
}