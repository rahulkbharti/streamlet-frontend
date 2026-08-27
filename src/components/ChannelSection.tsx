"use client";
import Link from "next/link";
import { Star, Sparkles, CheckCircle2, Users } from "lucide-react";
import { useState } from "react";

const channels = [
  {
    id: "1",
    name: "DevStream Studio",
    tag: "@devstudio",
    subscribers: "128K",
    color: "from-purple-600 to-indigo-600",
    initial: "D",
    featured: true,
  },
  {
    id: "2",
    name: "PixelCraft Gaming",
    tag: "@pixelcraft",
    subscribers: "94K",
    color: "from-fuchsia-600 to-pink-600",
    initial: "P",
    featured: true,
  },
  {
    id: "3",
    name: "Cloud Architect",
    tag: "@cloudarch",
    subscribers: "45K",
    color: "from-blue-600 to-cyan-600",
    initial: "C",
    featured: false,
  },
  {
    id: "4",
    name: "SoundWave HQ",
    tag: "@soundwave",
    subscribers: "210K",
    color: "from-violet-600 to-purple-800",
    initial: "S",
    featured: true,
  },
  {
    id: "5",
    name: "CyberNode",
    tag: "@cybernode",
    subscribers: "67K",
    color: "from-emerald-600 to-teal-600",
    initial: "C",
    featured: false,
  },
  {
    id: "6",
    name: "VFX & Cinema Lab",
    tag: "@vfxlab",
    subscribers: "88K",
    color: "from-amber-600 to-orange-600",
    initial: "V",
    featured: false,
  },
];

export default function ChannelsSection() {
  return (
    <section className="mb-14" id="channels">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Featured Creators</h2>
            <p className="text-xs text-zinc-400">Top followed channels and verified streamers</p>
          </div>
        </div>
        <Link
          href="/#channels"
          className="text-xs font-semibold text-purple-400 hover:text-purple-300 transition-colors"
        >
          Explore All
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
        {channels.map((channel) => (
          <ChannelCard key={channel.id} channel={channel} />
        ))}
      </div>
    </section>
  );
}

type Channel = {
  id: string;
  name: string;
  tag: string;
  subscribers: string;
  color: string;
  initial: string;
  featured: boolean;
};

function ChannelCard({ channel }: { channel: Channel }) {
  const [following, setFollowing] = useState(false);

  return (
    <div className="glass-card rounded-2xl p-4 flex flex-col items-center text-center group relative overflow-hidden">
      {/* Glow highlight */}
      <div className="absolute top-0 inset-x-0 h-1 brand-gradient opacity-0 group-hover:opacity-100 transition-opacity" />

      {/* Avatar Container */}
      <div className="relative mt-1 mb-3">
        <div className="w-20 h-20 rounded-full brand-gradient p-0.5 shadow-lg group-hover:scale-105 transition-transform">
          <div className={`w-full h-full rounded-full bg-gradient-to-tr ${channel.color} flex items-center justify-center text-white text-xl font-extrabold shadow-inner`}>
            {channel.initial}
          </div>
        </div>

        {channel.featured && (
          <div className="absolute -top-1 -right-1 bg-purple-600 p-1 rounded-full border-2 border-zinc-950 shadow-md">
            <Star className="w-3.5 h-3.5 text-white fill-white" />
          </div>
        )}
      </div>

      {/* Name & Tag */}
      <div className="flex items-center gap-1 justify-center max-w-full">
        <h4 className="font-bold text-xs text-white truncate group-hover:text-purple-300 transition-colors">
          {channel.name}
        </h4>
        <CheckCircle2 className="w-3 h-3 text-purple-400 flex-shrink-0" />
      </div>

      <p className="text-[11px] text-zinc-400 mt-0.5">{channel.tag}</p>

      {/* Subscriber Count */}
      <div className="flex items-center gap-1 mt-2 text-[11px] text-zinc-400">
        <Users className="w-3 h-3 text-purple-400" />
        <span>{channel.subscribers}</span>
      </div>

      {/* Follow Button */}
      <button
        onClick={() => setFollowing(!following)}
        className={`w-full mt-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
          following
            ? "bg-white/10 text-zinc-300 hover:bg-white/15"
            : "brand-gradient text-white shadow-sm hover:scale-102 active:scale-98"
        }`}
      >
        {following ? "Following" : "Follow"}
      </button>
    </div>
  );
}

