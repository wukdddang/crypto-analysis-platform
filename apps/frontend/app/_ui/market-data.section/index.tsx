"use client";

import { useBitcoinExplorer } from "../../_context/bitcoin-explorer.context";

export default function MarketDataSection() {
  const { marketData, loading, error } = useBitcoinExplorer();

  if (loading) {
    return (
      <div className="w-full px-4 py-8 bg-gray-50 dark:bg-gray-800 transition-colors">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 dark:bg-gray-600 rounded w-1/4 mb-4"></div>
            <div className="bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 p-6 transition-colors">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i}>
                    <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
                    <div className="h-5 bg-gray-200 dark:bg-gray-600 rounded w-full"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full px-4 py-8 bg-gray-50 dark:bg-gray-800 transition-colors">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 transition-colors">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!marketData) return null;

  return (
    <div className="w-full px-4 py-8 bg-gray-50 dark:bg-gray-800 transition-colors">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 transition-colors">
            MARKET DATA
          </h2>
          <div className="bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 p-6 transition-colors">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1 transition-colors">
                  Market Cap
                </div>
                <div className="text-lg font-semibold text-gray-900 dark:text-gray-100 transition-colors">
                  {marketData.marketCap.toLocaleString()} USD
                </div>
              </div>

              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1 transition-colors">
                  Supply
                </div>
                <div className="text-lg font-semibold text-gray-900 dark:text-gray-100 transition-colors">
                  {marketData.supply.toLocaleString()}
                </div>
              </div>

              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1 transition-colors">
                  Max Supply
                </div>
                <div className="text-lg font-semibold text-gray-900 dark:text-gray-100 transition-colors">
                  {marketData.maxSupply.toLocaleString()}
                </div>
              </div>

              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1 transition-colors">
                  Change (1H)
                </div>
                <div
                  className={`text-lg font-semibold transition-colors ${
                    marketData.change1h >= 0
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {marketData.change1h > 0 ? "+" : ""}
                  {marketData.change1h}%
                </div>
              </div>

              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1 transition-colors">
                  Change (1 day)
                </div>
                <div
                  className={`text-lg font-semibold transition-colors ${
                    marketData.change1d >= 0
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {marketData.change1d > 0 ? "+" : ""}
                  {marketData.change1d}%
                </div>
              </div>

              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1 transition-colors">
                  Change (1 week)
                </div>
                <div
                  className={`text-lg font-semibold transition-colors ${
                    marketData.change1w >= 0
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {marketData.change1w > 0 ? "+" : ""}
                  {marketData.change1w}%
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
