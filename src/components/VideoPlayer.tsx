"use client";

// Import the CSS for the player's default theme
import "plyr-react/plyr.css";
import Plyr from "plyr-react";

// The actual video player component
export default function VideoPlayer() {
    // Define the video source and poster
    const videoSource = {
        type: "video" as const,
        sources: [
            {
                src: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
                type: "video/mp4",
            },
        ],
        poster: "https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-HD.jpg",
    };

    return (
        <div className="w-full max-w-4xl mx-auto rounded-lg overflow-hidden">
            <Plyr source={videoSource} />
        </div>
    );
}