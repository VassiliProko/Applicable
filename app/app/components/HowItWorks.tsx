import {
  Search,
  Sparkles,
  Users,
  MessageCircle,
  Award,
  GraduationCap,
  Building2,
  ArrowRight,
} from "lucide-react";

const steps = [
  { icon: Search, label: "Discover" },
  { icon: Sparkles, label: "Express Interest" },
  { icon: Users, label: "Match" },
  { icon: MessageCircle, label: "Collaborate" },
  { icon: Award, label: "Complete" },
];

const learnerBenefits = [
  "Real-world experience",
  "Meaningful connections",
  "Portfolio-worthy projects",
  "Verified proof of work",
];

const businessBenefits = [
  "Fast access to motivated talent",
  "Quality work on real tasks",
  "Simple, lightweight process",
  "No long-term commitments",
];

export default function HowItWorks() {
  return (
    <section className="blueprint-frame px-9 py-18">
      <div className="mx-auto max-w-[1280px]">
        {/* Heading */}
        <div className="text-center">
          <h2 className="type-headline">How Applicable Works</h2>
          <p className="type-body mt-2 text-text-secondary max-w-lg mx-auto">
            A simple way to connect learners and businesses through real
            projects.
          </p>
        </div>

        {/* Flow Diagram – Desktop */}
        <div className="mt-12 hidden md:block">
          <div className="relative">
            <div
              className="absolute top-6 left-[10%] right-[10%] border-t border-dashed border-surface-3/50"
              aria-hidden="true"
            />
            <div className="relative flex">
              {steps.map((step) => (
                <div
                  key={step.label}
                  className="flex flex-col items-center text-center"
                  style={{ flex: "1 1 0" }}
                >
                  <div className="w-12 h-12 rounded-full bg-surface-1 border border-border flex items-center justify-center">
                    <step.icon size={20} className="text-primary" />
                  </div>
                  <span className="mt-3 type-caption text-text-primary font-medium">
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Flow Diagram – Mobile */}
        <div className="mt-10 md:hidden flex flex-col items-center">
          {steps.map((step, i) => (
            <div key={step.label} className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-surface-1 border border-border flex items-center justify-center">
                <step.icon size={18} className="text-primary" />
              </div>
              <span className="mt-1.5 type-caption text-text-primary font-medium">
                {step.label}
              </span>
              {i < steps.length - 1 && (
                <svg
                  width="2"
                  height="16"
                  className="my-1.5 text-surface-3/50"
                  aria-hidden="true"
                >
                  <line
                    x1="1"
                    y1="0"
                    x2="1"
                    y2="16"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeDasharray="3 3"
                  />
                </svg>
              )}
            </div>
          ))}
        </div>

        {/* Benefit Cards */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-[12px] bg-surface-1 border border-border p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-accent/15 flex items-center justify-center">
                <GraduationCap size={20} className="text-accent" />
              </div>
              <h3 className="type-subhead">For Learners</h3>
            </div>
            <ul className="space-y-2">
              {learnerBenefits.map((b) => (
                <li
                  key={b}
                  className="type-body text-text-secondary flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                  {b}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-[12px] bg-surface-1 border border-border p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-secondary/15 flex items-center justify-center">
                <Building2 size={20} className="text-secondary" />
              </div>
              <h3 className="type-subhead">For Businesses</h3>
            </div>
            <ul className="space-y-2">
              {businessBenefits.map((b) => (
                <li
                  key={b}
                  className="type-body text-text-secondary flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary shrink-0" />
                  {b}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
