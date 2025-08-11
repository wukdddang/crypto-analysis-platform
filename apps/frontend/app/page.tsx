import { BitcoinExplorerProvider } from "./_context/bitcoin-explorer.context";
import HeaderSection from "./_ui/header.section";
import SearchSection from "./_ui/search.section";
import BitcoinInfoSection from "./_ui/bitcoin-info.section";
import MarketDataSection from "./_ui/market-data.section";
import LatestBlocksPanel from "./_ui/latest-blocks.panel";
import FooterSection from "./_ui/footer.section";

function PageContent() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
      <HeaderSection />
      <SearchSection />
      <BitcoinInfoSection />
      <MarketDataSection />
      <LatestBlocksPanel />
      <FooterSection />
    </div>
  );
}

export default function Home() {
  return (
    <BitcoinExplorerProvider>
      <PageContent />
    </BitcoinExplorerProvider>
  );
}
