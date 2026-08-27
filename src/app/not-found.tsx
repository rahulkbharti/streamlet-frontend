import Link from 'next/link';
import { Video, Home } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-[#090a0f] text-zinc-100 flex flex-col items-center justify-center p-6 text-center">
            {/* Ambient Background Glow */}
            <div className="absolute w-96 h-96 bg-purple-600/15 rounded-full blur-3xl -z-10 pointer-events-none" />

            <div className="w-16 h-16 rounded-2xl brand-gradient flex items-center justify-center mb-6 shadow-xl shadow-purple-500/20">
                <Video className="w-8 h-8 text-white" />
            </div>

            <h1 className="text-6xl sm:text-8xl font-black tracking-tight brand-gradient-text">
                404
            </h1>

            <h2 className="text-xl sm:text-2xl font-bold mt-4 text-white">
                Stream Not Found
            </h2>

            <p className="text-sm text-zinc-400 max-w-md mt-2 leading-relaxed">
                The stream, video, or page you are looking for has ended, been removed, or does not exist.
            </p>

            <div className="flex items-center gap-3 mt-8">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-bold text-white brand-gradient shadow-lg shadow-purple-500/25 hover:scale-105 transition-all"
                >
                    <Home className="w-4 h-4" />
                    Back to Streams
                </Link>
            </div>
        </div>
    );
}
