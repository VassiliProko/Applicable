import Navbar from "@/app/components/Navbar";
import Hero from "@/app/components/Hero";
import ProjectGallery from "@/app/components/ProjectGallery";
import Footer from "@/app/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <Hero />
      <ProjectGallery />
      <Footer />
    </div>
  );
}
