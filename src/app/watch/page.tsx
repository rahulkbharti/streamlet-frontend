'use client'
import Header from '@/components/Header'
// import CommentsSection from '@/components/player/CommentSection'
import StreamInfo from '@/components/player/StreamInfo'
import SuggestionsSidebar from '@/components/player/SuggestionSidebar'
import HlsPlayer from '@/components/player/VideoControls'
import Sidebar from '@/components/Sidebar'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Suspense } from 'react';

function PlayerContent() {
    // const [hls, setHls] = useState('');
    const [videoId, setVideoId] = useState<string>('');
    const searchParams = useSearchParams();
    useEffect(() => {
        const videoId = searchParams.get('v');
        setVideoId(String(videoId));
    }, [searchParams]);

    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 main-content-bg p-10 md:p-10 bg-black text-gray-100">
                <Header />
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Main Video Content */}
                    <div className="w-full lg:w-2/3">
                        {/* Video Player */}
                        <div className="bg-black rounded-2xl aspect-video relative flex items-center justify-center overflow-hidden">
                            {/* Video Controls Overlay */}
                            <div className="absolute left-0 right-0 bottom-0 top-0  bg-black/30 rounded-lg backdrop-blur-sm">
                                <HlsPlayer videoId={videoId} />
                            </div>
                        </div>

                        {/* Stream Info */}
                        <StreamInfo videoId={videoId} />

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