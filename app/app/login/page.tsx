import Navbar from "@/app/components/Navbar";
import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <LoginForm />
    </div>
  );
}
