import Image from "next/image";
import Link from "next/link";

export default function StreamsSection() {
    const streams = [
        {
            id: 1,
            title: "Serious fight night with Rick",
            streamer: "Mr.Rick Tomson",
            image: "https://placehold.co/400x225/3b82f6/ffffff?text=Game+1",
            avatar: "https://placehold.co/24x24/4ade80/ffffff?text=RT",
            isLive: true,
            url: "/watch?v=ID",
            channel: "/channel/dsdsad",
            videoId: '8JFoxuWgBld'
        },
        {
            id: 2,
            title: "Pumpkin Party in Orizona",
            streamer: "Milena Foster",
            image: "https://placehold.co/400x225/f97316/ffffff?text=Game+2",
            avatar: "https://placehold.co/24x24/f43f5e/ffffff?text=MF",
            isLive: true,
            url: "/watch?v=ID",
            channel: "/channel/dsdsad",
            videoId: "yil992qDQyY"
        },
        {
            id: 3,
            title: "Serious fight night with Rick",
            streamer: "Mr.Rick Tomson",
            image: "https://placehold.co/400x225/8b5cf6/ffffff?text=Game+3",
            avatar: "https://placehold.co/24x24/4ade80/ffffff?text=RT",
            isLive: true,
            url: "/watch?v=ID",
            channel: "/channel/dsdsad",
            videoId: "dG4gbgaG4HC"
        },
        {
            id: 4,
            title: "Serious fight night with Rick",
            streamer: "Bob Game450",
            image: "https://placehold.co/400x225/14b8a6/ffffff?text=Game+4",
            avatar: "https://placehold.co/24x24/3b82f6/ffffff?text=BG",
            isLive: false,
            url: "/watch?v=ID",
            channel: "/channel/dsdsad",
            videoId: "dG4gbgaG4HC"
        },
        {
            id: 5,
            title: "Serious fight night with Rick",
            streamer: "Bob Game450",
            image: "https://placehold.co/400x225/14b8a6/ffffff?text=Game+4",
            avatar: "https://placehold.co/24x24/3b82f6/ffffff?text=BG",
            isLive: false,
            url: "/watch?v=ID",
            channel: "/channel/dsdsad",
            videoId: "dG4gbgaG4HC"
        },
        {
            id: 6,
            title: "Serious fight night with Rick",
            streamer: "Bob Game450",
            image: "https://placehold.co/400x225/14b8a6/ffffff?text=Game+4",
            avatar: "https://placehold.co/24x24/3b82f6/ffffff?text=BG",
            isLive: false,
            url: "/watch?v=ID",
            channel: "/channel/dsdsad",
            videoId: "dG4gbgaG4HC"
        }
    ]

    return (
        <section className="mb-12">
            <SectionHeader title="Streams of the day" />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {streams.map(stream => (
                    <StreamCard key={stream.id} stream={stream} />
                ))}
            </div>
        </section>
    )
}

function SectionHeader({ title }: { title: string }) {
    return (
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-bold">{title}</h3>
            <a href="#" className="bg-gray-800 hover:bg-gray-700 text-sm px-4 py-2 rounded-full transition-colors">
                View all
            </a>
        </div>
    )
}

type Stream = {
    id: number;
    title: string;
    streamer: string;
    image: string;
    avatar: string;
    isLive: boolean;
    url: string;
    channel: string;
    videoId: string;
};

function StreamCard({ stream }: { stream: Stream }) {

    try {
        const responce = fetch("http://localhost:5000/dsdasds/main.png");
        console.log(responce);
    }
    catch (e) {
        console.log(e)
    }

    console.log("fetching the adtra")
    return (
        <div className="bg-[#121212] rounded-xl overflow-hidden group">
            <div className="relative">
                <a href={stream?.url}>
                    <Image unoptimized
                        width={320}
                        height={180}
                        // src={stream.image}
                        src={`http://localhost:5000/watch/${stream.videoId}/main.png`}
                        alt={stream.title}
                        className="w-full group-hover:scale-105 transition-transform duration-300"
                    />
                </a>

                {/* {stream.isLive && (
                    <span className="absolute top-3 left-3 bg-red-600 text-xs font-semibold px-2 py-1 rounded-md">
                        LIVE
                    </span>
                )} */}
            </div>
            <div className="p-4">
                <a href={stream?.url}>
                    <h4 className="font-bold truncate">{stream.title}</h4>
                </a>
                {/* <div className="flex items-center mt-2 text-sm text-gray-400"> */}
                <Link href={stream?.channel} className="flex items-center mt-2 text-sm text-gray-400">
                    <Image unoptimized
                        width={320}
                        height={180}
                        src={stream.avatar}
                        alt={stream.streamer}
                        className="w-6 h-6 rounded-full mr-2"
                    />
                    <span>{stream.streamer}</span>
                </Link>
                {/* </div> */}
            </div>
        </div>
    )
}

function async() {
    throw new Error("Function not implemented.");
}
