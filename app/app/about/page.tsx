import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

const values = [
  {
    label: "Clarity",
    description: "Posting a project should feel effortless, not exhausting.",
  },
  {
    label: "Quality",
    description:
      "Every opportunity should feel relevant, intentional, and worth someone's time.",
  },
  {
    label: "Connection",
    description:
      "The right match matters more than volume. One great fit beats a hundred applications.",
  },
  {
    label: "Simplicity",
    description:
      "Good design reduces friction. If it feels complicated, we haven't finished building it.",
  },
  {
    label: "Momentum",
    description:
      "Projects should feel like they can take off the moment they're posted.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="px-9 pt-20 pb-16">
          <div className="mx-auto max-w-[800px]">
            <p className="text-sm font-semibold uppercase tracking-wider text-accent mb-4">
              About
            </p>
            <h1 className="type-display mb-6">
              About{" "}
              <span className="italic bg-gradient-to-r from-[#F0A030] via-[#E87A1A] to-[#D45A0C] bg-clip-text text-transparent inline-block pr-1 pb-1">
                Applicable
              </span>
            </h1>
            <p className="type-body text-text-secondary text-lg leading-8 max-w-[680px]">
              Applicable is a simple way to post real-world projects, share them
              with the right people, and connect motivated talent with meaningful
              work — without the noise of traditional job boards.
            </p>
            <p className="type-body text-text-secondary text-lg leading-8 max-w-[680px] mt-4">
              It was built to make it easier for businesses, founders, creators,
              and teams to find help for short-term projects — and for learners
              to find opportunities that actually let them prove what they can
              do.
            </p>
          </div>
        </section>

        {/* Why Applicable Exists */}
        <section className="px-9 py-16 bg-surface-1">
          <div className="mx-auto max-w-[800px]">
            <h2 className="type-headline mb-6">Why Applicable Exists</h2>
            <div className="space-y-4 type-body text-text-secondary text-lg leading-8">
              <p>
                A lot of great projects never get posted because the process
                feels too heavy. A lot of talented people never get discovered
                because the right opportunities are hard to find.
              </p>
              <p>
                Traditional education is becoming financially inaccessible.
                Learning is more available than ever — but credibility is not.
                Millions of motivated individuals are undervalued because they
                lack proof, not ability.
              </p>
              <p>
                Applicable exists to make that connection feel lighter, clearer,
                and more human. Instead of long hiring workflows or noisy
                outreach, Applicable gives project posters a clean page to share
                and gives learners a simple way to express interest — and walk
                away with verified proof they can do the work.
              </p>
            </div>
          </div>
        </section>

        {/* Vision */}
        <section className="px-9 py-16">
          <div className="mx-auto max-w-[800px]">
            <h2 className="type-headline mb-6">Vision</h2>
            <p
              className="text-xl italic text-text-secondary leading-9"
              style={{
                fontFamily: "var(--font-playfair), Georgia, serif",
              }}
            >
              Imagine a world where anyone with a great idea can find the right
              person to help bring it to life — in minutes, not months. Where
              talent isn&apos;t hidden behind resumes and algorithms, and
              opportunities aren&apos;t buried in noise. Where merit matters
              more than credentials. That&apos;s the world we&apos;re building.
            </p>
          </div>
        </section>

        {/* Mission */}
        <section className="px-9 py-16 bg-surface-1">
          <div className="mx-auto max-w-[800px]">
            <h2 className="type-headline mb-6">Mission</h2>
            <p className="type-body text-text-secondary text-lg leading-8">
              Every day, Applicable helps people post projects in minutes, share
              them with a single link, and connect with the right talent — no
              lengthy hiring processes, no middlemen, no friction. Just real
              projects meeting real people, ready to work. We&apos;re building a
              credible and accessible system that enables self-taught individuals
              to prove real-world skills without relying on expensive
              traditional degrees.
            </p>
          </div>
        </section>

        {/* What Applicable Is */}
        <section className="px-9 py-16">
          <div className="mx-auto max-w-[800px]">
            <h2 className="type-headline mb-6">What Applicable Is</h2>
            <ul className="space-y-3 type-body text-text-secondary text-lg leading-8">
              <li className="flex items-start gap-3">
                <span className="mt-2.5 h-2 w-2 shrink-0 rounded-full bg-gradient-to-r from-[#F0A030] to-[#D45A0C]" />
                A project posting platform where real work gets shared
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-2.5 h-2 w-2 shrink-0 rounded-full bg-gradient-to-r from-[#F0A030] to-[#D45A0C]" />
                A lightweight application flow — no resumes, no cover letters
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-2.5 h-2 w-2 shrink-0 rounded-full bg-gradient-to-r from-[#F0A030] to-[#D45A0C]" />
                A shareable link for every opportunity
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-2.5 h-2 w-2 shrink-0 rounded-full bg-gradient-to-r from-[#F0A030] to-[#D45A0C]" />
                A verified track record that speaks louder than a degree
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-2.5 h-2 w-2 shrink-0 rounded-full bg-gradient-to-r from-[#F0A030] to-[#D45A0C]" />
                A growing community of people looking to help on real work
              </li>
            </ul>
            <p className="mt-6 type-body text-text-tertiary leading-8">
              It is not meant to be a full management tool or a complicated
              marketplace. The work happens outside the platform — Applicable is
              simply where the connection begins.
            </p>
          </div>
        </section>

        {/* How It Started */}
        <section className="px-9 py-16 bg-surface-1">
          <div className="mx-auto max-w-[800px]">
            <h2 className="type-headline mb-6">How It Started</h2>
            <div className="space-y-4 type-body text-text-secondary text-lg leading-8">
              <p>
                Applicable began as an idea inside the Studio School Human
                Centered Design x AI program by DFSG, where the focus was on
                building something useful, thoughtful, and real.
              </p>
              <p>
                What started as a concept about connecting learners to projects
                evolved into something broader: a cleaner way for businesses and
                creators to share small opportunities and find people who
                actually want to work on them — while giving those people a
                credible way to prove they can deliver.
              </p>
            </div>
          </div>
        </section>

        {/* What We Care About */}
        <section className="px-9 py-16">
          <div className="mx-auto max-w-[800px]">
            <h2 className="type-headline mb-8">What We Care About</h2>
            <div className="grid gap-4">
              {values.map((value) => (
                <div
                  key={value.label}
                  className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4 rounded-xl border border-border px-6 py-5"
                >
                  <span className="shrink-0 text-base font-semibold text-text-primary">
                    {value.label}
                  </span>
                  <span className="hidden sm:block text-text-disabled">—</span>
                  <span className="type-body text-text-secondary">
                    {value.description}
                  </span>
                </div>
              ))}
            </div>
            <p
              className="mt-10 text-center text-lg italic text-text-tertiary"
              style={{
                fontFamily: "var(--font-playfair), Georgia, serif",
              }}
            >
              Great projects should be easy to share, and great people should be
              easier to find.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
