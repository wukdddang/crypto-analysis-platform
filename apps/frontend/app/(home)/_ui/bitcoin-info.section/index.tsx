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
    <div className="w-full px-4 py-6 transition-colors">
      <div className="max-w-7xl mx-auto">
        {/* 일렬 배치 레이아웃 */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 transition-colors">
          <div className="flex items-start justify-between h-[120px]">
            {/* 좌측: 비트코인 정보 */}
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">₿</span>
              </div>
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    Bitcoin
                  </h1>
                  <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                    BTC
                  </span>
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  {bitcoinData.price.toLocaleString()}{" "}
                  <span className="text-lg text-gray-600 dark:text-gray-400 ml-1">
                    {bitcoinData.currency}
                  </span>
                </div>
                <div className="flex space-x-6 text-sm">
                  <div>
                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                      Difficulty
                    </span>{" "}
                    <span className="text-gray-600 dark:text-gray-400">
                      {bitcoinData.difficulty}
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                      Block Height
                    </span>{" "}
                    <span className="text-gray-600 dark:text-gray-400">
                      {bitcoinData.blockHeight.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 가운데: 차트 */}
            <div className="flex-1 flex justify-center items-center px-4">
              <div className="w-full max-w-md">
                <InteractiveChart />
              </div>
            </div>

            {/* 우측: 추천 수수료 */}
            <div className="flex-shrink-0 h-full flex flex-col justify-start">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  RECOMMENDED FEES PER BYTE
                </h3>
                <a
                  href="#"
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                >
                  API for this data
                </a>
              </div>
              <div className="space-y-2 flex-1 flex flex-col justify-center">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 dark:text-gray-300 font-medium text-sm">
                    Slow
                  </span>
                  <div className="text-right">
                    <div className="text-gray-900 dark:text-gray-100 font-mono text-sm">
                      0.00000001 BTC{" "}
                      <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                        $0.001089
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 dark:text-gray-300 font-medium text-sm">
                    Standard
                  </span>
                  <div className="text-right">
                    <div className="text-gray-900 dark:text-gray-100 font-mono text-sm">
                      0.00000001 BTC{" "}
                      <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                        $0.001089
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 dark:text-gray-300 font-medium text-sm">
                    Fast
                  </span>
                  <div className="text-right">
                    <div className="text-gray-900 dark:text-gray-100 font-mono text-sm">
                      0.00000002 BTC{" "}
                      <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                        $0.002179
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
