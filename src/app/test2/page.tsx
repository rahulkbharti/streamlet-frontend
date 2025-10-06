"use client";

import dynamic from "next/dynamic";

const Player = dynamic(() => import("./player"), { ssr: false });

export default function HomePage() {
    return (
        <main className="flex min-h-screen flex-col items-center p-8 sm:p-24 bg-gray-900 text-white">
            <div className="w-full text-center">
                <h1 className="text-3xl sm:text-5xl font-extrabold mb-8">
                    Video Player Page
                </h1>
                <Player />
            </div>
        </main>
    );
}
