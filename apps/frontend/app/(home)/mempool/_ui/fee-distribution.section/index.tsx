"use client";

import { useMempool } from "../../_context/mempool.context";

export default function FeeDistributionSection() {
  const { feeDistribution, loading, error } = useMempool();

  if (loading || error || !feeDistribution.length) {
    return null;
  }

  // 최대값 계산 (차트 높이 정규화용)
  const maxCount = Math.max(...feeDistribution.map((item) => item.count));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Fee Rate Distribution
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Shows the distribution of fee rates for transactions in the mempool
        </p>
      </div>

      <div className="relative pl-16">
        {/* Y축 라벨 */}
        <div className="absolute left-0 top-0 h-64 flex flex-col justify-between text-xs text-gray-600 dark:text-gray-400 text-right pr-2">
          <div>{maxCount.toLocaleString()}</div>
          <div>{Math.round(maxCount * 0.75).toLocaleString()}</div>
          <div>{Math.round(maxCount * 0.5).toLocaleString()}</div>
          <div>{Math.round(maxCount * 0.25).toLocaleString()}</div>
          <div>0</div>
        </div>

        {/* 차트 영역 */}
        <div className="flex items-end justify-between space-x-1 h-64 mb-4 border-l border-b border-gray-200 dark:border-gray-600 pl-2 pb-0">
          {feeDistribution.map((item, index) => {
            // 높이 계산 수정: 전체 높이에서 실제 비율로 계산
            const height =
              maxCount > 0
                ? Math.max((item.count / maxCount) * 95, item.count > 0 ? 2 : 0)
                : 0;
            return (
              <div
                key={index}
                className="flex-1 flex flex-col items-center h-full justify-end"
              >
                {/* 막대 */}
                <div className="w-full relative group cursor-pointer h-full flex items-end">
                  <div
                    className="w-full rounded-t transition-all duration-300 hover:opacity-80"
                    style={{
                      height: `${height}%`,
                      backgroundColor: item.color,
                      minHeight: item.count > 0 ? "2px" : "0px",
                    }}
                  ></div>

                  {/* 툴팁 */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                    <div className="bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg p-2 whitespace-nowrap shadow-lg">
                      <div className="font-semibold">
                        {item.feeRange} sat/vB
                      </div>
                      <div>Transactions: {item.count.toLocaleString()}</div>
                      <div>Percentage: {item.percentage}%</div>
                    </div>
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 dark:bg-gray-700 rotate-45"></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* X축 라벨 */}
        <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-4 pl-2">
          {feeDistribution.map((item, index) => (
            <div key={index} className="flex-1 text-center">
              {item.feeRange}
            </div>
          ))}
        </div>
      </div>

      {/* 상세 테이블 */}
      <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-2 px-3 text-gray-600 dark:text-gray-400 uppercase tracking-wide text-xs font-medium">
                  FEE RATE
                </th>
                <th className="text-center py-2 px-3 text-gray-600 dark:text-gray-400 uppercase tracking-wide text-xs font-medium">
                  N(TX)
                </th>
                <th className="text-center py-2 px-3 text-gray-600 dark:text-gray-400 uppercase tracking-wide text-xs font-medium">
                  N(BLOCKS)
                </th>
                <th className="text-center py-2 px-3 text-gray-600 dark:text-gray-400 uppercase tracking-wide text-xs font-medium">
                  ∑ FEES
                </th>
                <th className="text-center py-2 px-3 text-gray-600 dark:text-gray-400 uppercase tracking-wide text-xs font-medium">
                  AVG FEE
                </th>
                <th className="text-right py-2 px-3 text-gray-600 dark:text-gray-400 uppercase tracking-wide text-xs font-medium">
                  AVG FEE RATE <span className="text-xs">(sat/vB)</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {feeDistribution.map((item, index) => {
                // 모의 데이터 생성
                const blocks =
                  item.count > 0 ? Math.floor(Math.random() * 3) : 0;
                const totalFees =
                  item.count > 0 ? (Math.random() * 0.01).toFixed(4) : "-";
                const avgFee =
                  item.count > 0 ? (Math.random() * 0.001).toFixed(4) : "-";
                const avgFeeRate =
                  item.count > 0 ? (Math.random() * 50 + 10).toFixed(2) : "-";
                const randomSuffix =
                  item.count > 0 ? Math.floor(Math.random() * 9999) : "";

                return (
                  <tr
                    key={index}
                    className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  >
                    <td className="py-2 px-3">
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-3 h-3 rounded"
                          style={{ backgroundColor: item.color }}
                        ></div>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {item.feeRange}+
                        </span>
                      </div>
                    </td>
                    <td className="py-2 px-3 text-center text-gray-900 dark:text-white font-medium">
                      {item.count}
                    </td>
                    <td className="py-2 px-3 text-center text-gray-700 dark:text-gray-300">
                      {blocks}
                    </td>
                    <td className="py-2 px-3 text-center font-mono text-sm">
                      {totalFees !== "-" ? (
                        <>
                          <span className="text-gray-900 dark:text-white">
                            {totalFees}
                          </span>
                          <span className="text-gray-500 dark:text-gray-400 text-xs ml-1">
                            {randomSuffix}
                          </span>
                          <span className="text-gray-600 dark:text-gray-400 ml-1">
                            BTC
                          </span>
                        </>
                      ) : (
                        <span className="text-gray-500 dark:text-gray-400">
                          -
                        </span>
                      )}
                    </td>
                    <td className="py-2 px-3 text-center font-mono text-sm">
                      {avgFee !== "-" ? (
                        <>
                          <span className="text-gray-900 dark:text-white">
                            {avgFee}
                          </span>
                          <span className="text-gray-500 dark:text-gray-400 text-xs ml-1">
                            {randomSuffix}
                          </span>
                          <span className="text-gray-600 dark:text-gray-400 ml-1">
                            BTC
                          </span>
                        </>
                      ) : (
                        <span className="text-gray-500 dark:text-gray-400">
                          -
                        </span>
                      )}
                    </td>
                    <td className="py-2 px-3 text-right text-gray-900 dark:text-white font-medium">
                      {avgFeeRate}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
