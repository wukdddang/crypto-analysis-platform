import { MempoolProvider } from "./_context/mempool.context";
import HeaderSection from "../../_ui/header.section";
import MempoolSummarySection from "./_ui/mempool-summary.section";
import FeeDistributionSection from "./_ui/fee-distribution.section";
import SizeDistributionSection from "./_ui/size-distribution.section";
import AgeDistributionSection from "./_ui/age-distribution.section";
import TransactionListsSection from "./_ui/transaction-lists.section";
import FooterSection from "../../_ui/footer.section";

function PageContent() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
      <HeaderSection />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Mempool Summary
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Real-time Bitcoin mempool analysis and statistics
          </p>
        </div>

        <div className="space-y-8">
          <MempoolSummarySection />
          <FeeDistributionSection />
          <SizeDistributionSection />
          <AgeDistributionSection />
          <TransactionListsSection />
        </div>
      </div>

      <FooterSection />
    </div>
  );
}

export default function MempoolPage() {
  return (
    <MempoolProvider>
      <PageContent />
    </MempoolProvider>
  );
}
