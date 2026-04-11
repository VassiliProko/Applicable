import { ArrowDown } from "lucide-react";
import DotGrid from "./DotGrid";

export default function Hero() {
  return (
    <section className="flex flex-col items-start px-9 pt-18 pb-18 relative overflow-hidden">
      <DotGrid />
      <div className="mx-auto w-full max-w-[1280px]">
        <h1 className="type-display max-w-3xl relative z-10">
          Where skills take{" "}
          <span className="italic bg-gradient-to-r from-[#F0A030] via-[#E87A1A] to-[#D45A0C] bg-clip-text text-transparent inline-block pr-1 pb-1">flight</span>
        </h1>
        <p className="type-body mt-3 max-w-xl text-text-secondary relative z-10 text-lg leading-7">
          Prove your abilities through real-world projects. No degree required.
          Build a verified track record that speaks for itself.
        </p>
        {/* <Image
          src="/images/landing_image.jpg"
          alt="Landing hero"
          width={600}
          height={400}
          className="mt-10 w-full max-w-3xl rounded-lg object-cover relative z-10"
          priority
        /> */}
        <div className="mt-8 flex items-stretch gap-3 relative z-10">
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
      {/* Bottom fade: grid effect dissolves into background */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 z-[1] pointer-events-none"
        style={{ background: "linear-gradient(to bottom, transparent, var(--background))" }}
      />
    </section>
  );
}
