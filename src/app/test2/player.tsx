"use client";
import { useEffect, useRef } from 'react';
import 'plyr/dist/plyr.css';

// Types for HLS.js and Plyr
interface Hls {
    loadSource(src: string): void;
    attachMedia(element: HTMLVideoElement): void;
    on(event: string, callback: () => void): void;
    destroy(): void;
}

// interface Plyr {
//     new(element: HTMLVideoElement, options?: PlyrOptions): Plyr;
//     destroy(): void;
// }

interface PlyrOptions {
    captions?: {
        active: boolean;
        update: boolean;
        language: string;
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any; // For other optional Plyr properties
}

// 1. Custom Hook that manages both HLS.js and Plyr
const useHlsPlyr = (src: string, options?: PlyrOptions) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        let hls: Hls | null = null;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let plyr: any | null = null;

        // Dynamically import libraries
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        Promise.all([import('hls.js'), import('plyr')]).then(([HlsModule, PlyrModule]: [any, any]) => {
            const Hls = HlsModule.default;
            const Plyr = PlyrModule.default;
            const videoElement = videoRef.current;

            if (!videoElement) return;

            // Check for HLS support
            if (Hls.isSupported()) {
                console.log("HLS is supported. Initializing hls.js...");
                hls = new Hls();
                if (!hls) return;
                hls.loadSource(src);
                hls.attachMedia(videoElement);

                // Optional: Listen for HLS events
                hls.on(Hls.Events.MANIFEST_PARSED, () => {
                    console.log("HLS manifest parsed");
                });

            } else if (videoElement.canPlayType('application/vnd.apple.mpegurl')) {
                // For browsers with native HLS support (like Safari)
                console.log("Native HLS support found.");
                videoElement.src = src;
            }

            // Initialize Plyr
            plyr = new Plyr(videoElement, options);
        });
        // Cleanup function
        return () => {
            if (plyr) {
                plyr.destroy();
                console.log("Plyr instance destroyed.");
            }
            if (hls) {
                hls.destroy();
                console.log("HLS instance destroyed.");
            }
            if (videoRef.current) {
                videoRef.current.src = "";
            }
        };

    }, [src, options]); // Re-run if src or options change

    return videoRef;
};

// 2. HLS Video Player Component
export default function HlsPlayer() {
    const hlsSource = "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8";
    const videoRef = useHlsPlyr(hlsSource, {
        captions: { active: true, update: true, language: 'en' },
    });

    return (
        <div className="w-full max-w-4xl mx-auto rounded-lg overflow-hidden" style={{ height: '100%', position: "relative" }}>
            <video
                ref={videoRef}
                className="plyr-react plyr video-fullsize"
                playsInline
                controls
            />
        </div>
    );
}