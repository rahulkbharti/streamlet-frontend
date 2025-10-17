"use client";
import { useEffect, useRef, useState, useMemo } from 'react';
import 'plyr/dist/plyr.css';

type Hls = import('hls.js').default;
type Plyr = import('plyr').default;

const CONTENT_URL = process.env.NEXT_PUBLIC_CONTENT_URL;

export default function HlsPlayer({ videoId }: { videoId?: string }) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isLoaded, setLoaded] = useState(false);

    const options = useMemo(() => {
        // ✅ FIX: More robust quality switching logic
        const updateQuality = (newQuality: number) => {
            if (videoRef.current) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const hls = (videoRef.current as any).hls as Hls | undefined;
                if (!hls) {
                    console.warn('HLS instance not found on video element.');
                    return;
                }

                console.log(`User selected quality: ${newQuality}p`);

                // When the user selects "Auto" (value 0)
                if (newQuality === 0) {
                    // Setting currentLevel to -1 enables adaptive bitrate switching
                    hls.currentLevel = -1;
                    console.log('Switched to Auto quality (ABR enabled).');
                } else {
                    // When the user selects a specific quality
                    const levelIndex = hls.levels.findIndex(level => level.height === newQuality);
                    if (levelIndex !== -1) {
                        // Setting currentLevel to a specific index disables adaptive bitrate switching
                        hls.currentLevel = levelIndex;
                        console.log(`Locked to quality level ${levelIndex} (${newQuality}p).`);
                    } else {
                        console.warn(`Could not find a matching level for ${newQuality}p.`);
                    }
                }
            }
        };

        return {
            controls: ['play-large', 'play', 'progress', 'current-time', 'mute', 'volume', 'captions', 'settings', 'pip', 'airplay', 'fullscreen'],
            quality: {
                default: 0,
                options: [0],
                forced: true,
                onChange: updateQuality,
            },
            i18n: {
                qualityLabel: { 0: "Auto" },
            },
            previewThumbnails: {
                enabled: true,
                src: `${CONTENT_URL}/watch/${videoId}/thumbnails.vtt`
            }
        };
    }, [videoId]);

    useEffect(() => {
        let hls: Hls | null = null;
        let plyr: Plyr | null = null;
        const videoElement = videoRef.current;

        if (!videoElement || !videoId) {
            return;
        }

        Promise.all([import('hls.js'), import('plyr')]).then(([HlsModule, PlyrModule]) => {
            const Hls = HlsModule.default;
            const Plyr = PlyrModule.default;

            if (Hls.isSupported()) {
                hls = new Hls();
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (videoElement as any).hls = hls;

                hls.on(Hls.Events.MANIFEST_PARSED, () => {
                    const availableQualities = hls!.levels.map(l => l.height);
                    const newOptions = {
                        ...options,
                        quality: {
                            ...options.quality,
                            options: [0, ...availableQualities],
                        },
                    };
                    plyr = new Plyr(videoElement, newOptions);
                    setLoaded(true);
                });
                const URL = `${CONTENT_URL}/watch/${videoId}/master.m3u8`;
                // console.log(URL);
                hls.loadSource(URL);
                hls.attachMedia(videoElement);

            } else if (videoElement.canPlayType('application/vnd.apple.mpegurl')) {
                videoElement.src = videoId;
                plyr = new Plyr(videoElement, options);
                setLoaded(true);
            }
        });

        return () => {
            if (plyr) plyr.destroy();
            if (hls) hls.destroy();
        };
    }, [videoId, options]);

    return (
        <div
            className="w-full max-w-4xl mx-auto rounded-lg overflow-hidden aspect-video"
            style={{
                position: "relative",
                // Move the CSS variable here
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ['--plyr-color-main' as any]: '#18A5FE'
            }}
        >
            <video
                ref={videoRef}
                className="plyr-react plyr"
                playsInline
                controls
                autoPlay
                style={{
                    width: '100%',
                    height: '100%',
                    aspectRatio: '16/9',
                    opacity: isLoaded ? 1 : 0,
                    transition: 'opacity 0.3s ease-in-out',
                    backgroundColor: 'black'
                } as React.CSSProperties}
            />
        </div>
    );
}