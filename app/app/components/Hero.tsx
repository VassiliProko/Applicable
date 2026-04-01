import Image from "next/image";
import { ArrowDown } from "lucide-react";
import DotGrid from "./DotGrid";

export default function Hero() {
  return (
    <section className="blueprint-frame flex flex-col items-center justify-center px-9 pt-18 pb-18 text-center relative overflow-hidden">
      <DotGrid />
      <h1 className="type-display max-w-3xl relative z-10">
        Where skills take{" "}
        <span className="italic text-primary">flight</span>
      </h1>
      <p className="type-body mt-6 max-w-xl text-text-secondary relative z-10">
        Prove your abilities through real-world projects. No degree required.
        Build a verified track record that speaks for itself.
      </p>
      <Image
        src="/images/landing_image.jpg"
        alt="Landing hero"
        width={600}
        height={400}
        className="mt-10 w-full max-w-3xl rounded-lg object-cover relative z-10"
        priority
      />
      <div className="mt-8 rounded-[19px] bg-surface-1 p-2 relative z-10">
        <div className="flex items-stretch gap-1.5">
          <div className="btn-spin-wrapper">
            <a
              href="#projects"
              className="inline-flex h-12 items-center gap-2 rounded-[9px] bg-primary px-6 font-body text-base font-medium text-white active:bg-primary-active active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              style={{ fontFamily: "var(--font-source-sans), 'Helvetica Neue', Arial, sans-serif" }}
            >
              Discover Projects
              <ArrowDown size={20} />
            </a>
          </div>
          <a
            href="/create-project"
            className="inline-flex items-center gap-2 rounded-[9px] border-2 border-border bg-[#27272a] px-6 font-body text-base font-medium text-white transition-colors duration-100 hover:border-[#71717a] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            style={{ fontFamily: "var(--font-source-sans), 'Helvetica Neue', Arial, sans-serif" }}
          >
            Post a Project
          </a>
        </div>
      </div>
    </section>
  );
}
