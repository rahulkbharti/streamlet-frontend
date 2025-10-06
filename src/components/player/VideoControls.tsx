// import HlsPlayer from "../HlsPlayer";

import HlsPlayer from "@/app/test2/player";

export default function VideoControls() {
    return (
        <div className="absolute left-0 right-0 bottom-0 top-0  bg-black/30 rounded-lg backdrop-blur-sm">
            <HlsPlayer />
        </div>
    )
}

