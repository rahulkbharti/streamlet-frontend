'use client'
import Header from '@/components/Header'
import StreamInfo from '@/components/player/StreamInfo'
import SuggestionsSidebar from '@/components/player/SuggestionSidebar'
import HlsPlayer from '@/components/player/VideoControls'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Suspense } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';

function PlayerContent() {
    const [videoId, setVideoId] = useState<string>('');
    const searchParams = useSearchParams();

    useEffect(() => {
        const v = searchParams.get('v');
        if (v) setVideoId(v);
    }, [searchParams]);

    return (
        <div className="min-h-screen bg-[#090a0f] text-zinc-100 selection:bg-purple-500 selection:text-white">
            <Header />

            <main className="px-4 sm:px-6 lg:px-8 pb-16 max-w-[1600px] mx-auto">
                <div className="flex flex-col xl:flex-row gap-8 items-start">
                    {/* Main Video Cinema Section */}
                    <div className="flex-1 min-w-0 w-full space-y-6">
                        {/* Player Container with Ambient Glow */}
                        <div className="relative rounded-3xl overflow-hidden glass-panel border border-white/10 shadow-2xl p-1 sm:p-2 bg-zinc-950">
                            {/* Ambient Light Halo */}
                            <div className="absolute -inset-10 bg-gradient-to-r from-purple-600/20 via-indigo-600/10 to-pink-600/20 rounded-3xl blur-3xl -z-10 pointer-events-none" />

                            <div className="rounded-2xl overflow-hidden aspect-video relative bg-black flex items-center justify-center">
                                {videoId ? (
                                    <HlsPlayer videoId={videoId} />
                                ) : (
                                    <div className="flex flex-col items-center justify-center p-8 text-center text-zinc-400">
                                        <Sparkles className="w-8 h-8 text-purple-400 mb-2 animate-bounce" />
                                        <p className="text-sm font-semibold">Select a stream to begin watching</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Stream Info & Discussion */}
                        <StreamInfo videoId={videoId} />
                    </div>

                    {/* Suggestions & Up Next Sidebar */}
                    <div className="w-full xl:w-[420px] lg:w-[380px] flex-shrink-0">
                        <SuggestionsSidebar />
                    </div>
                </div>
            </main>
        </div>
    );
}

export default function Player() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#090a0f] flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
            </div>
        }>
            <PlayerContent />
        </Suspense>
    );
}
