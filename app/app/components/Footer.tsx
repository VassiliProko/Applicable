import Image from "next/image";
import { ArrowRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-24">
      {/* Main footer */}
      <div
        className="mx-4 mb-4 md:mx-8 md:mb-8 rounded-2xl bg-cover bg-center overflow-hidden relative"
        style={{ backgroundImage: "url('/images/background_image.webp')" }}
      >
        <div className="absolute inset-0 bg-black/75" />
        <div className="relative mx-auto max-w-[1280px] px-9 pt-16 pb-10">
          {/* Top: logo + motto + CTA */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-10 mb-14">
            <div className="flex flex-col gap-4">
              <Image
                src="/logo+text.svg"
                alt="Applicable"
                width={140}
                height={28}
                className="brightness-0 invert"
              />
              <p
                className="text-lg italic text-white/80"
                style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
              >
                Where skills take{" "}
                <span className="bg-gradient-to-r from-[#F0A030] via-[#E87A1A] to-[#D45A0C] bg-clip-text text-transparent">
                  flight
                </span>
              </p>
            </div>

            <a
              href="#projects"
              className="inline-flex w-fit items-center gap-2 rounded-[9px] bg-white/10 backdrop-blur-sm border border-white/20 px-5 py-3 text-sm font-medium text-white transition-all duration-200 hover:bg-white/20"
            >
              Discover Projects
              <ArrowRight size={16} />
            </a>
          </div>

          {/* Divider */}
          <div className="h-px bg-white/15 mb-10" />

          {/* Bottom: nav columns + copyright */}
          <div className="flex flex-col md:flex-row md:justify-between gap-8">
            <div className="flex gap-16">
              <nav aria-label="Footer navigation">
                <p className="text-xs font-semibold uppercase tracking-wider text-white/50 mb-3">
                  Navigate
                </p>
                <ul className="flex flex-col gap-2.5 text-sm">
                  <li>
                    <a
                      href="/"
                      className="text-white/70 transition-colors duration-100 hover:text-white"
                    >
                      Home
                    </a>
                  </li>
                  <li>
                    <a
                      href="/about"
                      className="text-white/70 transition-colors duration-100 hover:text-white"
                    >
                      About
                    </a>
                  </li>
                </ul>
              </nav>

              <nav aria-label="Legal">
                <p className="text-xs font-semibold uppercase tracking-wider text-white/50 mb-3">
                  Legal
                </p>
                <ul className="flex flex-col gap-2.5 text-sm">
                  <li>
                    <a
                      href="/legal#privacy"
                      className="text-white/70 transition-colors duration-100 hover:text-white"
                    >
                      Privacy Policy
                    </a>
                  </li>
                  <li>
                    <a
                      href="/legal#terms"
                      className="text-white/70 transition-colors duration-100 hover:text-white"
                    >
                      Terms of Service
                    </a>
                  </li>
                </ul>
              </nav>
            </div>

            <p className="text-sm text-white/40 md:self-end">
              &copy; {new Date().getFullYear()} Applicable. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
