import Image from "next/image";

export default function Footer() {
  return (
    <footer className="border-t border-[var(--blueprint-line)] bg-surface-1">
      <div className="px-9 pt-40 pb-16">
        <div className="flex flex-col gap-6">
          <Image
            src="/logo+text.svg"
            alt="Applicable"
            width={120}
            height={24}
            className="logo-invert"
          />
          <nav aria-label="Footer">
            <ul className="flex flex-col gap-3 text-sm">
              <li>
                <a
                  href="/"
                  className="text-text-secondary transition-colors duration-100 hover:text-text-primary"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/about"
                  className="text-text-secondary transition-colors duration-100 hover:text-text-primary"
                >
                  About
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      <div className="border-t border-[var(--blueprint-line)] px-9 py-4">
        <span className="text-sm text-text-tertiary">
          &copy; {new Date().getFullYear()} Applicable
        </span>
      </div>
    </footer>
  );
}
