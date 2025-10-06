import Image from "next/image"
import Link from "next/link"

export default function SuggestionsSidebar() {
    const suggestions = [
        {
            id: 1,
            title: "Let's fight 1 on 1",
            streamer: "Helen5109 Fast",
            viewers: "26,389M",
            image: "https://placehold.co/160x90/22c55e/ffffff?text=FPS",
            isLive: true,
            category: "FPS",
            url: "/watch?v=IDas",
            channel: "/channel/dsdsad"

        },
        {
            id: 2,
            title: "Serious fight with Lea",
            streamers: "MikeDanger, Eve031",
            viewers: "16,426M View now",
            image: "https://placehold.co/160x90/3b82f6/ffffff?text=Fantasy",
            isLive: true,
            category: "Fantasy",
            url: "/watch?v=ID",
            channel: "/channel/dsdsad"
        },
        {
            id: 3,
            title: "Meeting old friends",
            streamer: "Mr.Rick Tomson",
            viewers: "7,694M View now",
            image: "https://placehold.co/160x90/f97316/ffffff?text=Action",
            isLive: false,
            category: "Action",
            url: "/watch?v=ID",
            channel: "/channel/dsdsad"
        },
        {
            id: 4,
            title: "RitaCH gun community",
            streamers: "SabinaRay, Areg K71",
            viewers: "0.911M View now",
            image: "https://placehold.co/160x90/8b5cf6/ffffff?text=RPG",
            isLive: true,
            category: "RPG",
            url: "/watch?v=IDsdsd",
            channel: "/channel/dsdsad"
        },
        {
            id: 5,
            title: "Beauty meet with ELSA",
            streamers: "MikeDanger, Eve031",
            viewers: "6,765M View now",
            image: "https://placehold.co/160x90/ec4899/ffffff?text=Beauty",
            isLive: false,
            category: "Beauty",
            url: "/watch?v=ID",
            channel: "/channel/dsdsad"
        },
        {
            id: 6,
            title: "Travel party with Miki",
            streamer: "Miki Like",
            viewers: "6,765M View now",
            image: "https://placehold.co/160x90/10b981/ffffff?text=Travel",
            isLive: false,
            category: "Travel",
            url: "/watch?v=ID",
            channel: "/channel/dsdsad"
        }
    ]

    return (
        <div className="w-full lg:w-1/3">
            {/* <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">You may like</h3>
                <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
                    View all
                </a>
            </div> */}

            <div className="space-y-4">
                {suggestions.map(suggestion => (
                    <SuggestionCard key={suggestion.id} suggestion={suggestion} />
                ))}
            </div>
        </div>
    )
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function SuggestionCard({ suggestion }: { suggestion: any }) {
    return (
        <div className="flex gap-4 group cursor-pointer hover:bg-gray-800/50 p-2 rounded-lg transition-all">
            <div className="w-40 relative flex-shrink-0">
                <a href={suggestion?.url}>
                    <Image unoptimized
                        width={320}
                        height={180}
                        src={suggestion.image}
                        alt={suggestion.title}
                        className="rounded-lg w-full h-24 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                </a>

                {/* {suggestion.isLive && (
                    <span className="absolute top-2 left-2 bg-red-600 text-xs font-semibold px-2 py-1 rounded-md">
                        LIVE
                    </span>
                )} */}
            </div>

            <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm line-clamp-2  transition-colors">
                    <a href={suggestion?.url} className="hover:text-purple-400">
                        {suggestion.title}
                    </a>
                </h4>
                <p className="text-sm text-gray-400 mt-1">
                    <Link href={suggestion?.channel} className="hover:text-purple-400">
                        {suggestion.streamers || suggestion.streamer}
                    </Link>
                </p>
                {suggestion.viewers && (
                    <p className="text-sm text-gray-400">{suggestion.viewers}</p>
                )}
            </div>
        </div>
    )
}