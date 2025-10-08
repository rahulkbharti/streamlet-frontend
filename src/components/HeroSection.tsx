export default function HeroSection() {
    return (
        <section className="flex flex-col lg:flex-row gap-8 mb-12">
            {/* Left Side: Text */}
            <div className="flex-1 flex flex-col justify-center">
                <h2 className="text-3xl md:text-6xl font-black tracking-tighter leading-none">
                    PLAY, COMPETE, FOLLOW POPULAR STREAMERS
                </h2>
                <p className="mt-6 text-gray-400 max-w-md">
                    The best streamers gather here to have a good time, be among us, join us!
                </p>
            </div>

            {/* Right Side: Video Preview */}
            <div className="flex-1">
                <VideoPreview />
            </div>
        </section>
    )
}

function VideoPreview() {
    return (
        <div
            className="bg-cover bg-center rounded-2xl p-6 flex flex-col justify-between h-80"
            style={{ backgroundImage: "url('feature1.png')" }}
        >
            <CountdownTimer />
            <VideoControls />
        </div>
    )
}

function CountdownTimer() {
    return (
        <div className="bg-black/50 text-center py-2 px-4 rounded-lg self-start">
            <p className="text-sm text-gray-300">Broadcast starts in</p>
            <p className="text-3xl font-bold tracking-widest">04:08</p>
        </div>
    )
}

function VideoControls() {
    return (
        <div className="text-center">
            <div className="flex items-center justify-between text-gray-300">
                <ControlButtons />
                <ProgressBar />
                <FullscreenButton />
            </div>
            <p className="text-sm mt-3">Battle for the castle with Franck Jourdan and Eva703</p>
        </div>
    )
}

function ControlButtons() {
    return (
        <div className="flex items-center space-x-4">
            <button
                type="button"
                className="hover:text-white"
                aria-label="Pause"
                title="Pause"
                suppressHydrationWarning={true}
            >
                <PauseIcon />
            </button>
            <button
                type="button"
                className="hover:text-white"
                aria-label="Play"
                title="Play"
                suppressHydrationWarning={true}
            >
                <PlayIcon />
            </button>
        </div>
    )
}

function ProgressBar() {
    return (
        <div className="flex items-center space-x-2 flex-1 mx-4">
            <span className="bg-purple-600 text-xs font-semibold px-2 py-1 rounded-md">COMING SOON</span>
            <div className="w-full bg-gray-600 rounded-full h-1.5">
                <div className="bg-purple-500 h-1.5 rounded-full"></div>
            </div>
            <span className="text-xs">00:00</span>
        </div>
    )
}

function FullscreenButton() {
    return (
        <div className="flex items-center space-x-2">
            <button type="button" className="hover:text-white" aria-label="Fullscreen" title="Fullscreen" suppressHydrationWarning={true} >
                <FullscreenIcon />
            </button>
        </div>
    )
}

// Icon Components
function PauseIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 16 16">
            <path d="M5.5 5.5A.5.5 0 0 1 6 6v4a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm4 0a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5z" />
        </svg>
    )
}

function PlayIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="currentColor" viewBox="0 0 16 16">
            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM6.79 5.093A.5.5 0 0 0 6 5.5v5a.5.5 0 0 0 .79.407l3.5-2.5a.5.5 0 0 0 0-.814l-3.5-2.5z" />
        </svg>
    )
}

function FullscreenIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
            <path d="M1.5 1a.5.5 0 0 0-.5.5v4a.5.5 0 0 1-1 0v-4A1.5 1.5 0 0 1 1.5 0h4a.5.5 0 0 1 0 1h-4zM10 .5a.5.5 0 0 1 .5-.5h4A1.5 1.5 0 0 1 16 1.5v4a.5.5 0 0 1-1 0v-4a.5.5 0 0 0-.5-.5h-4a.5.5 0 0 1-.5-.5zM.5 10a.5.5 0 0 1 .5.5v4a.5.5 0 0 0 .5.5h4a.5.5 0 0 1 0 1h-4A1.5 1.5 0 0 1 0 14.5v-4a.5.5 0 0 1 .5-.5zm15 0a.5.5 0 0 1 .5.5v4a1.5 1.5 0 0 1-1.5 1.5h-4a.5.5 0 0 1 0-1h4a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 1 .5-.5z" />
        </svg>
    )
}