import type { Metadata } from "next";
import Header from "@/components/marketing/header";
import Footer from "@/components/marketing/footer";
import { PageContainer } from "@/components/layout/page-container";

export const metadata: Metadata = {
  title: "Community Guidelines",
  robots: { index: false },
};

/**
 * BLOCKED-ON-BOBBY: The guidelines text below is a placeholder structure.
 * Bobby must review and approve every item before this page is linked live.
 */
export default function CommunityGuidelinesPage() {
  return (
    <div className="flex flex-1 flex-col">
      <Header />
      <main className="flex-1">
        <PageContainer className="py-12 max-w-3xl">
          <div className="mb-6 rounded-lg border border-yellow-200 bg-yellow-50 px-5 py-3 text-sm font-medium text-yellow-800">
            Draft — awaiting Bobby&apos;s review and approval before this page is linked live.
          </div>

          <h1 className="font-heading text-3xl font-medium tracking-tight mb-6">
            Community Guidelines
          </h1>

          <div className="prose prose-sm max-w-none">
            <p>
              This is a peer support community for parents and professionals. It is not a crisis
              service. If you or someone you know is in immediate danger, call 911. For mental
              health crisis support, call or text{" "}
              <strong>988</strong> (Suicide and Crisis Lifeline).
            </p>

            <h2>Be supportive, not clinical</h2>
            <p>[PLACEHOLDER — Bobby to draft]</p>

            <h2>Protect privacy</h2>
            <p>[PLACEHOLDER — Bobby to draft]</p>

            <h2>No spam or self-promotion</h2>
            <p>[PLACEHOLDER — Bobby to draft]</p>

            <h2>What happens when guidelines are broken</h2>
            <p>[PLACEHOLDER — Bobby to draft]</p>

            <h2>Questions or concerns</h2>
            <p>[PLACEHOLDER — Bobby to draft]</p>
          </div>
        </PageContainer>
      </main>
      <Footer />
    </div>
  );
}
