import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import ProfileContent from "@/app/components/ProfileContent";
import ProfileProjects from "@/app/components/ProfileProjects";

export default function ProfilePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        <ProfileContent />

        <div className="mx-auto max-w-7xl px-6">
          {/* Projects */}
          <ProfileProjects />
        </div>
      </main>

      <Footer />
    </div>
  );
}
