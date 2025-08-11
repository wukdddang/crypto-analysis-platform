import { Suspense } from "react";
import { BitcoinExplorerProvider } from "../../_context/bitcoin-explorer.context";
import HeaderSection from "@/app/_ui/header.section";
import FooterSection from "@/app/_ui/footer.section";
import BlockDetailProvider from "./_context/block-detail.context";
import BlockDetailContent from "./_ui/block-detail-content.section";

interface BlockPageProps {
  params: {
    id: string;
  };
}

// 로딩 컴포넌트
function BlockDetailLoading() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-6 w-1/3"></div>
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
            <div className="space-y-4">
              {[...Array(8)].map((_, i) => (
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

export default function BlockDetailPage({ params }: BlockPageProps) {
  return (
    <BitcoinExplorerProvider>
      <BlockDetailProvider blockId={params.id}>
        <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
          <HeaderSection />
          <Suspense fallback={<BlockDetailLoading />}>
            <BlockDetailContent />
          </Suspense>
          <FooterSection />
        </div>
      </BlockDetailProvider>
    </BitcoinExplorerProvider>
  );
}

// 메타데이터 생성
export async function generateMetadata({ params }: BlockPageProps) {
  return {
    title: `Block ${params.id} - BlockExplorer.one`,
    description: `Bitcoin block ${params.id} details including transactions, size, and timestamp information.`,
  };
}
