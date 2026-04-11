import Image from "next/image";
import Link from "next/link";
import { User } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import NotificationBell from "./NotificationBell";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between bg-background px-9 py-4 border-b border-border">
      <Link href="/">
        <Image
          src="/logo+text.svg"
          alt="Applicable"
          width={160}
          height={32}
          className="logo-invert"
          priority
        />
      </Link>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <NotificationBell />
        <Link
          href="/profile"
          aria-label="Account"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-text-primary text-background transition-all duration-100 hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          <User size={20} />
        </Link>
      </div>
    </nav>
  );
}
