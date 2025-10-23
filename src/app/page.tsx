import ChannelSection from "@/components/ChannelSection";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
// import Sidebar from "@/components/Sidebar";
import StreamsSection from "@/components/StreamSection";

export default function Home() {
  return (
    <div className="flex min-h-screen">
      <main className="flex-1 main-content-bg p-10 md:p-10 bg-black text-gray-100">
        <Header />
        <HeroSection />
        <StreamsSection />
        <ChannelSection />
      </main>
    </div>
  )
}