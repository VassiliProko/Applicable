import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

export const metadata = {
  title: "Privacy & Terms — Applicable",
  description: "Privacy policy and terms of service for Applicable.",
};

export default function LegalPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="px-9 pt-20 pb-16">
          <div className="mx-auto max-w-[800px]">
            <p className="text-sm font-semibold uppercase tracking-wider text-accent mb-4">
              Legal
            </p>
            <h1 className="type-display mb-6">Privacy & Terms</h1>
            <p className="type-body text-text-secondary text-lg leading-8 max-w-[680px]">
              We keep things simple and transparent. Below you&apos;ll find our
              privacy practices and the terms that govern your use of Applicable.
            </p>
            <p className="type-caption text-text-disabled mt-4">
              Last updated: April 14, 2026
            </p>
          </div>
        </section>

        {/* Privacy Policy */}
        <section id="privacy" className="px-9 py-16 bg-surface-1">
          <div className="mx-auto max-w-[800px]">
            <h2 className="type-headline mb-10">Privacy Policy</h2>

            <div className="space-y-10">
              <div>
                <h3 className="type-title mb-3">Information We Collect</h3>
                <div className="space-y-3 type-body text-text-secondary text-lg leading-8">
                  <p>
                    When you create an account, we collect your name, email
                    address, and password. When you use the platform, we may also
                    collect profile information you choose to provide, project
                    applications and submissions, and basic usage data such as
                    pages visited and features used.
                  </p>
                </div>
              </div>

              <div>
                <h3 className="type-title mb-3">How We Use Your Information</h3>
                <ul className="space-y-2.5 type-body text-text-secondary text-lg leading-8">
                  <li className="flex items-start gap-3">
                    <span className="mt-2.5 h-2 w-2 shrink-0 rounded-full bg-accent" />
                    To provide, maintain, and improve the platform
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-2.5 h-2 w-2 shrink-0 rounded-full bg-accent" />
                    To send notifications related to your projects and applications
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-2.5 h-2 w-2 shrink-0 rounded-full bg-accent" />
                    To connect project posters with applicants
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-2.5 h-2 w-2 shrink-0 rounded-full bg-accent" />
                    To build and display your verified track record
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="type-title mb-3">Data Sharing</h3>
                <p className="type-body text-text-secondary text-lg leading-8">
                  We do not sell your personal information. Your profile and
                  application details are shared only with the project posters
                  you apply to. We may share anonymized, aggregated data for
                  analytics purposes.
                </p>
              </div>

              <div>
                <h3 className="type-title mb-3">Data Security</h3>
                <p className="type-body text-text-secondary text-lg leading-8">
                  We use industry-standard measures to protect your data,
                  including encrypted passwords and secure connections. While no
                  system is completely secure, we take reasonable steps to
                  safeguard your information.
                </p>
              </div>

              <div>
                <h3 className="type-title mb-3">Cookies</h3>
                <p className="type-body text-text-secondary text-lg leading-8">
                  We use essential cookies to keep you logged in and remember
                  your preferences such as theme selection. We do not use
                  third-party tracking cookies.
                </p>
              </div>

              <div>
                <h3 className="type-title mb-3">Your Rights</h3>
                <p className="type-body text-text-secondary text-lg leading-8">
                  You can access, update, or delete your personal information at
                  any time through your profile settings. If you wish to delete
                  your account entirely, contact us and we will remove your data
                  within 30 days.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Terms of Service */}
        <section id="terms" className="px-9 py-16">
          <div className="mx-auto max-w-[800px]">
            <h2 className="type-headline mb-10">Terms of Service</h2>

            <div className="space-y-10">
              <div>
                <h3 className="type-title mb-3">Acceptance of Terms</h3>
                <p className="type-body text-text-secondary text-lg leading-8">
                  By creating an account or using Applicable, you agree to these
                  terms. If you do not agree, please do not use the platform.
                </p>
              </div>

              <div>
                <h3 className="type-title mb-3">Your Account</h3>
                <div className="space-y-3 type-body text-text-secondary text-lg leading-8">
                  <p>
                    You are responsible for maintaining the security of your
                    account and for all activity that occurs under it. You must
                    provide accurate information when registering and keep it up
                    to date.
                  </p>
                </div>
              </div>

              <div>
                <h3 className="type-title mb-3">Acceptable Use</h3>
                <p className="type-body text-text-secondary text-lg leading-8 mb-3">
                  When using Applicable, you agree not to:
                </p>
                <ul className="space-y-2.5 type-body text-text-secondary text-lg leading-8">
                  <li className="flex items-start gap-3">
                    <span className="mt-2.5 h-2 w-2 shrink-0 rounded-full bg-accent" />
                    Post misleading, fraudulent, or spam content
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-2.5 h-2 w-2 shrink-0 rounded-full bg-accent" />
                    Impersonate another person or entity
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-2.5 h-2 w-2 shrink-0 rounded-full bg-accent" />
                    Attempt to access other users&apos; accounts or data
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-2.5 h-2 w-2 shrink-0 rounded-full bg-accent" />
                    Use the platform for any unlawful purpose
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="type-title mb-3">Content & Projects</h3>
                <div className="space-y-3 type-body text-text-secondary text-lg leading-8">
                  <p>
                    You retain ownership of any content you post. By posting a
                    project or application, you grant Applicable a limited license
                    to display that content on the platform. We reserve the right
                    to remove content that violates these terms.
                  </p>
                  <p>
                    Applicable facilitates connections between project posters
                    and applicants. The actual work happens outside the platform,
                    and we are not a party to any agreements made between users.
                  </p>
                </div>
              </div>

              <div>
                <h3 className="type-title mb-3">Verified Track Record</h3>
                <p className="type-body text-text-secondary text-lg leading-8">
                  Completed projects may appear on your profile as part of your
                  verified track record. This information is based on
                  confirmation from project posters and reflects work completed
                  through the platform.
                </p>
              </div>

              <div>
                <h3 className="type-title mb-3">Limitation of Liability</h3>
                <p className="type-body text-text-secondary text-lg leading-8">
                  Applicable is provided &ldquo;as is&rdquo; without warranties
                  of any kind. We are not liable for any disputes between users,
                  the quality of work performed, or any damages arising from use
                  of the platform.
                </p>
              </div>

              <div>
                <h3 className="type-title mb-3">Changes to These Terms</h3>
                <p className="type-body text-text-secondary text-lg leading-8">
                  We may update these terms from time to time. If we make
                  significant changes, we will notify you through the platform.
                  Continued use after changes constitutes acceptance of the
                  updated terms.
                </p>
              </div>

              <div>
                <h3 className="type-title mb-3">Contact</h3>
                <p className="type-body text-text-secondary text-lg leading-8">
                  If you have questions about these terms or our privacy
                  practices, reach out to us through the platform.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
