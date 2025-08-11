"use client";

import { useBitcoinExplorer } from "../../_context/bitcoin-explorer.context";
import InteractiveChart from "../../../_ui/interactive-chart.component";

export default function BitcoinInfoSection() {
  const { bitcoinData, loading, error } = useBitcoinExplorer();

  if (loading) {
    return (
      <div className="w-full px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!bitcoinData) return null;

  return (
    <div className="w-full px-4 py-8 transition-colors">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 비트코인 정보 */}
          <div className="lg:col-span-1">
            <div className="mb-6">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Mainnet
                </span>
                <span className="text-sm text-gray-400 dark:text-gray-500">
                  testnet
                </span>
              </div>

              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">₿</span>
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      Bitcoin
                    </h2>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      BTC
                    </span>
                  </div>
                  <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    {bitcoinData.price.toLocaleString()} {bitcoinData.currency}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600 dark:text-gray-400">
                    Difficulty:
                  </span>
                  <div className="font-mono text-gray-900 dark:text-gray-100">
                    {bitcoinData.difficulty}
                  </div>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">
                    Block Height:
                  </span>
                  <div className="font-mono text-gray-900 dark:text-gray-100">
                    {bitcoinData.blockHeight.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            {/* 추천 수수료 */}
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg transition-colors">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                  RECOMMENDED FEES PER BYTE
                </h3>
                <a
                  href="#"
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                  API for this data
                </a>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 dark:text-gray-300 font-medium">
                    Slow :
                  </span>
                  <div className="text-right">
                    <div className="text-gray-900 dark:text-gray-100">
                      0.00000001 BTC{" "}
                      <span className="text-gray-500 dark:text-gray-400">
                        $0.001089
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 dark:text-gray-300 font-medium">
                    Standard :
                  </span>
                  <div className="text-right">
                    <div className="text-gray-900 dark:text-gray-100">
                      0.00000001 BTC{" "}
                      <span className="text-gray-500 dark:text-gray-400">
                        $0.001089
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 dark:text-gray-300 font-medium">
                    Fast :
                  </span>
                  <div className="text-right">
                    <div className="text-gray-900 dark:text-gray-100">
                      0.00000002 BTC{" "}
                      <span className="text-gray-500 dark:text-gray-400">
                        $0.002179
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 차트 영역 */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 transition-colors">
              <div className="h-64">
                <InteractiveChart />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
