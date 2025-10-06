

'use client'

import Header from '@/components/Header'
import CommentsSection from '@/components/player/CommentSection'
import StreamInfo from '@/components/player/StreamInfo'
import SuggestionsSidebar from '@/components/player/SuggestionSidebar'
import VideoControls from '@/components/player/VideoControls'
import Sidebar from '@/components/Sidebar'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { Suspense } from 'react';


function PlayerContent() {
    const searchParams = useSearchParams();
    useEffect(() => {
        const videoId = searchParams.get('v');
        console.log('The video ID has changed to:', videoId);
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
                            <Image unoptimized
                                width={320}
                                height={180}
                                src="https://placehold.co/1280x720/1e293b/ffffff?text=Live+Stream"
                                alt="Live Stream"
                                className="rounded-2xl w-full h-full object-cover"
                            />

                            {/* Video Controls Overlay */}

                            <VideoControls
                            // isPlaying={isPlaying}
                            // currentTime={currentTime}
                            // volume={volume}
                            // onPlayPause={handlePlayPause}
                            // onSeek={handleSeek}
                            // onVolumeChange={handleVolumeChange}
                            />
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