import { Suspense } from "react";
import { BitcoinExplorerProvider } from "@/app/(home)/_context/bitcoin-explorer.context";
import TransactionDetailProvider from "@/app/(home)/tx/[hash]/_context/transaction-detail.context";
import TransactionDetailContent from "@/app/(home)/tx/[hash]/_ui/transaction-detail-content.section";
import HeaderSection from "@/app/_ui/header.section";
import FooterSection from "@/app/_ui/footer.section";

interface TransactionPageProps {
  params: {
    hash: string;
  };
}

// 로딩 컴포넌트
function TransactionDetailLoading() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-6 w-1/2"></div>
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
            <div className="space-y-4">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="flex justify-between">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TransactionDetailPage({
  params,
}: TransactionPageProps) {
  return (
    <BitcoinExplorerProvider>
      <TransactionDetailProvider transactionHash={params.hash}>
        <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
          <HeaderSection />
          <Suspense fallback={<TransactionDetailLoading />}>
            <TransactionDetailContent />
          </Suspense>
          <FooterSection />
        </div>
      </TransactionDetailProvider>
    </BitcoinExplorerProvider>
  );
}

// 메타데이터 생성
export async function generateMetadata({ params }: TransactionPageProps) {
  return {
    title: `Transaction ${params.hash.slice(0, 8)}... - BlockExplorer.one`,
    description: `Bitcoin transaction ${params.hash} details including inputs, outputs, and confirmation status.`,
  };
}
