import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import ProfileTabs from "@/app/components/ProfileTabs";

export default function ProfilePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        <ProfileTabs />
      </main>

      <Footer />
    </div>
  );
}
