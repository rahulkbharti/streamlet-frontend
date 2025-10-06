import AuthorsSection from "@/components/AuthorSection";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import Sidebar from "@/components/Sidebar";
import StreamsSection from "@/components/StreamSection";

export default function Home() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 main-content-bg rounded-l-3xl p-6 md:p-10">
        <Header />
        <HeroSection />
        <StreamsSection />
        <AuthorsSection />
      </main>
    </div>
  )
}