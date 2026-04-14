import Image from "next/image";
import Link from "next/link";
import { User } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import NotificationBell from "./NotificationBell";
import { auth } from "@/app/lib/auth";

export default async function Navbar() {
  const session = await auth();

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
        {session?.user && (
          <>
            <NotificationBell />
            <Link
              href="/profile"
              aria-label="Account"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-text-primary text-background transition-all duration-100 hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              <User size={20} />
            </Link>
          </>
        )}
        {!session?.user && (
          <Link
            href="/login"
            className="inline-flex h-10 items-center gap-2 rounded-full bg-text-primary pl-3 pr-4 text-background transition-all duration-100 hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-background/20">
              <User size={16} />
            </div>
            <span className="font-body text-sm font-medium">Log In / Sign Up</span>
          </Link>
        )}
      </div>
    </nav>
  );
}
