"use client";
// Replaced with <img> for preview compatibility
// import Image from "next/image";
import { Star } from "lucide-react"; // Added an icon for featured channels

// --- Mock Data ---
// Using "channels" as requested
const channels = [
  {
    id: 1,
    name: "DevDude",
    image: "https://placehold.co/100x100/8b5cf6/ffffff?text=D",
    featured: true,
  },
  {
    id: 2,
    name: "NatureExplorer",
    image: "https://placehold.co/100x100/10b981/ffffff?text=N",
    featured: false,
  },
  {
    id: 3,
    name: "GamerX",
    image: "https://placehold.co/100x100/f43f5e/ffffff?text=G",
    featured: false,
  },
  {
    id: 4,
    name: "TechHead",
    image: "https://placehold.co/100x100/f59e0b/ffffff?text=T",
    featured: false,
  },
  {
    id: 5,
    name: "FoodieFinds",
    image: "https://placehold.co/100x100/ef4444/ffffff?text=F",
    featured: false,
  },
  {
    id: 6,
    name: "SoundWave",
    image: "https://placehold.co/100x100/6366f1/ffffff?text=S",
    featured: false,
  },
];

// --- Main Component ---
export default function ChannelsSection() {
  return (
    <section className="mb-12">
      <SectionHeader title="Top Channels" />
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-6">
        {channels.map((channel) => (
          <ChannelCard key={channel.id} channel={channel} />
        ))}
      </div>
    </section>
  );
}

// --- Type Definitions ---
type SectionHeaderProps = {
  title: string;
};

type Channel = {
  id: number;
  name: string;
  image: string;
  featured: boolean;
};

type ChannelCardProps = {
  channel: Channel;
};

// --- Child Components ---
function SectionHeader({ title }: SectionHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-6">
      <h3 className="text-2xl font-bold text-white">{title}</h3>
      {/* Replaced Link with <a> */}
      <a
        href="#"
        className="bg-zinc-800 hover:bg-zinc-700 text-sm text-zinc-200 px-4 py-2 rounded-full transition-colors"
      >
        View all
      </a>
    </div>
  );
}

function ChannelCard({ channel }: ChannelCardProps) {
  return (
    <div className="flex flex-col items-center text-center group">
      <div className="relative">
        {/* Replaced Image with <img> */}
        <img
          width={100}
          height={100}
          src={channel.image}
          alt={channel.name}
          className="w-24 h-24 rounded-full border-4 border-zinc-800 group-hover:border-purple-500 transition-all duration-300"
        />
        {channel.featured && (
          <div className="absolute -top-1 -right-1 bg-purple-600 p-1.5 rounded-full border-2 border-zinc-900">
            <Star className="w-4 h-4 text-white" fill="white" />
          </div>
        )}
      </div>
      <h4 className="font-semibold text-white mt-3 truncate w-full" title={channel.name}>
        {channel.name}
      </h4>
    </div>
  );
}
