import ChannelSection from "@/components/ChannelSection";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import Sidebar from "@/components/Sidebar";
import StreamsSection from "@/components/StreamSection";
import { Server, Activity, ShieldCheck, Heart } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen bg-[#090a0f] text-zinc-100 selection:bg-purple-500 selection:text-white">
      {/* Collapsible Pro Sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        <main className="flex-1 px-4 sm:px-6 lg:px-10 pb-16 max-w-7xl w-full mx-auto">
          <HeroSection />
          <StreamsSection />
          <ChannelSection />

          {/* Footer Section */}
          <footer className="mt-20 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-zinc-400 font-medium">All Microservices Operational</span>
            </div>

            <div className="flex items-center gap-6">
              <span className="flex items-center gap-1.5 hover:text-zinc-300 transition-colors">
                <Server className="w-3.5 h-3.5 text-purple-400" />
                Transcoder Service v1.0
              </span>
              <span className="flex items-center gap-1.5 hover:text-zinc-300 transition-colors">
                <Activity className="w-3.5 h-3.5 text-indigo-400" />
                Adaptive HLS
              </span>
              <span className="flex items-center gap-1.5 hover:text-zinc-300 transition-colors">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                BullMQ Orchestration
              </span>
            </div>

            <p className="flex items-center gap-1">
              Built with <Heart className="w-3.5 h-3.5 text-purple-400 fill-purple-400" /> for Next-Gen Video Streaming
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
}