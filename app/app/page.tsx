import Navbar from "@/app/components/Navbar";
import Hero from "@/app/components/Hero";
import ProjectGallery from "@/app/components/ProjectGallery";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <ProjectGallery />
    </div>
  );
}
