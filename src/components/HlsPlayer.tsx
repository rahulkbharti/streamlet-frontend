'use client';

import React, { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import 'plyr-react/plyr.css';
// import './player.css';
import Hls from 'hls.js';

// Dynamically import Plyr to avoid SSR
const Plyr = dynamic(() => import('plyr-react'), {
    ssr: false,
    loading: () => <div className="w-full h-96 bg-gray-200 animate-pulse rounded-lg" />
});

interface HlsPlayerProps {
    src: string;
}

const HlsPlayer: React.FC<HlsPlayerProps> = ({ src }) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const playerRef = useRef<any>(null);
    const hlsInstance = useRef<Hls | null>(null);

    useEffect(() => {
        if (!src) return;

        const initializePlayer = async () => {
            // Ensure we're in the browser
            if (typeof document === 'undefined') return;

            const video = document.querySelector('video');
            if (!video) return;

            if (Hls.isSupported()) {
                // Destroy previous instance
                if (hlsInstance.current) {
                    hlsInstance.current.destroy();
                }

                const hls = new Hls({
                    enableWorker: false,
                    debug: false
                });

                hlsInstance.current = hls;

                try {
                    hls.loadSource(src);
                    hls.attachMedia(video);

                    hls.on(Hls.Events.MANIFEST_PARSED, () => {
                        console.log('Video can be played');
                    });

                } catch (error) {
                    console.error('Error loading HLS stream:', error);
                }

            } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                // Safari native HLS
                video.src = src;
            }
        };

        // Small delay to ensure Plyr is initialized
        const timer = setTimeout(initializePlayer, 100);

        return () => {
            clearTimeout(timer);
            if (hlsInstance.current) {
                hlsInstance.current.destroy();
            }
        };
    }, [src]);

    const plyrProps = {
        source: {
            type: 'video' as const,
            sources: [
                {
                    src: src,
                    type: 'application/x-mpegURL' as const,
                },
            ],
        },
        options: {
            controls: [
                'play-large',
                'play',
                'progress',
                'current-time',
                'duration',
                'mute',
                'volume',
                'captions',
                'settings',
                'fullscreen',
            ],
        },
    };

    return (
        <div className="hls-player-container">
            <Plyr
                {...plyrProps}
                ref={playerRef}
                className='plyr'
            />
        </div>
    );
};

export default HlsPlayer;