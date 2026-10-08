import type { Metadata } from "next";
import Header from "@/components/marketing/header";
import Footer from "@/components/marketing/footer";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Bobby Washburn Parent Support collects, uses, and retains your information.",
  alternates: {
    canonical: "/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <div className="flex flex-1 flex-col">
      <Header />
      <main className="flex-1">
        <section>
          <div className="mx-auto max-w-3xl px-4 py-16 sm:px-8 lg:py-24">
            <h1 className="font-heading text-3xl font-medium tracking-tight sm:text-4xl">
              Privacy Policy
            </h1>

            <div className="mt-10 flex flex-col gap-10">
              <div>
                <h2 className="font-heading text-xl font-medium tracking-tight">
                  What we collect
                </h2>
                <p className="mt-3 text-base font-normal leading-relaxed text-muted-foreground">
                  When you use this site, create an account, or submit a form, we may collect: your
                  email address, your name or display name, your general role (parent or
                  professional), payment information processed by Stripe (we never store full card
                  numbers), and records of your activity within paid courses and the community
                  (posts, comments, progress).
                </p>
              </div>

              <div>
                <h2 className="font-heading text-xl font-medium tracking-tight">
                  How we use it
                </h2>
                <p className="mt-3 text-base font-normal leading-relaxed text-muted-foreground">
                  To deliver the services you signed up for, to send you notifications you
                  requested, to process payments, and to contact you if you submitted an inquiry
                  form.
                </p>
              </div>

              <div>
                <h2 className="font-heading text-xl font-medium tracking-tight">
                  Who has access
                </h2>
                <p className="mt-3 text-base font-normal leading-relaxed text-muted-foreground">
                  Bobby Washburn has access to account and inquiry data. Payment data is handled by
                  Stripe and governed by their privacy policy. We do not sell or share your data
                  with third parties for advertising purposes.
                </p>
              </div>

              <div>
                <h2 className="font-heading text-xl font-medium tracking-tight">
                  Data retention
                </h2>
                <p className="mt-3 text-base font-normal leading-relaxed text-muted-foreground">
                  Account data is retained while your account is active. You can request deletion
                  by emailing{" "}
                  <a
                    href="mailto:bobbywashburn0@gmail.com"
                    className="font-medium text-foreground underline underline-offset-2 hover:text-primary"
                  >
                    bobbywashburn0@gmail.com
                  </a>
                  .
                </p>
              </div>

              <div>
                <h2 className="font-heading text-xl font-medium tracking-tight">Questions</h2>
                <p className="mt-3 text-base font-normal leading-relaxed text-muted-foreground">
                  Contact{" "}
                  <a
                    href="mailto:bobbywashburn0@gmail.com"
                    className="font-medium text-foreground underline underline-offset-2 hover:text-primary"
                  >
                    bobbywashburn0@gmail.com
                  </a>
                  .
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
