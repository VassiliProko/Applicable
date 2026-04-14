import { Search, Rocket, Trophy, ChevronRight, ChevronDown } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Find a project that matches what you want to learn.",
    description:
      "Browse short-sprint projects from real organizations. Don't see one? Build your own and we'll help you scope it.",
  },
  {
    icon: Rocket,
    title: "Apply, get accepted, do the work.",
    description:
      "Submit your application, get matched, and ship the deliverable on your own timeline.",
  },
  {
    icon: Trophy,
    title: "Walk away with something real.",
    description:
      "Your finished project becomes part of your public profile. Send it to employers. Reference it in interviews. Use it as proof you can do the work.",
  },
];

export default function HowItWorks() {
  return (
    <section
      className="px-9 pt-18 pb-[max(2.25rem,calc((100%-1280px)/2))] mt-12 bg-cover bg-center rounded-2xl mx-4 md:mx-8"
      style={{ backgroundImage: "url('/images/background_image.webp')" }}
    >
      <div className="mx-auto max-w-[1280px]">
        <h2 className="type-headline text-white">How It Works</h2>

        {/* Desktop */}
        <div className="mt-8 hidden md:flex items-stretch">
          {steps.map((step, i) => (
            <div key={i} className="contents">
              <div className="flex-1 flex flex-col items-start text-left px-6 py-5 border border-border rounded-lg bg-background">
                <step.icon size={40} className="text-primary mb-5" />
                <h3 className="type-subhead font-semibold text-[21px] mb-2">
                  {step.title}
                </h3>
                <p className="type-body text-text-tertiary">
                  {step.description}
                </p>
              </div>
              {i < steps.length - 1 && (
                <div className="flex items-center shrink-0 px-2">
                  <ChevronRight size={20} className="text-text-disabled" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Mobile */}
        <div className="mt-8 flex flex-col gap-2 md:hidden">
          {steps.map((step, i) => (
            <div key={i} className="contents">
              <div className="flex flex-col items-start text-left px-5 py-4 border border-border rounded-lg bg-background">
                <step.icon size={36} className="text-primary mb-4" />
                <h3 className="type-subhead font-semibold text-[20px] mb-2">
                  {step.title}
                </h3>
                <p className="type-body text-text-tertiary">
                  {step.description}
                </p>
              </div>
              {i < steps.length - 1 && (
                <div className="flex justify-center py-1">
                  <ChevronDown size={20} className="text-text-disabled" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
