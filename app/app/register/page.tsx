import Navbar from "@/app/components/Navbar";
import RegisterForm from "./RegisterForm";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <RegisterForm />
    </div>
  );
}
