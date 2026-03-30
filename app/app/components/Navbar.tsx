import Image from "next/image";
import Link from "next/link";
import { User } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between bg-background px-9 py-4 border-b border-[var(--blueprint-line)]">
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
        <Link
          href="/profile"
          aria-label="Account"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-2 text-text-secondary transition-all duration-100 hover:bg-surface-3 hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          <User size={20} />
        </Link>
      </div>
    </nav>
  );
}
