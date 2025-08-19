"use client";

import { useMempool } from "../../_context/mempool.context";

export default function SizeDistributionSection() {
  const { sizeDistribution, loading, error } = useMempool();

  if (loading || error || !sizeDistribution.length) {
    return null;
  }

  // 최대값 계산 (차트 높이 정규화용)
  const maxCount = Math.max(...sizeDistribution.map((item) => item.count));

  // 색상 팔레트
  const colors = [
    "#ef4444",
    "#f97316",
    "#eab308",
    "#84cc16",
    "#22c55e",
    "#10b981",
    "#06b6d4",
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Size Distribution
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Shows the distribution of transaction sizes in the mempool
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
        <div className="flex items-end justify-between space-x-2 h-64 mb-4 border-l border-b border-gray-200 dark:border-gray-600 pl-2 pb-0">
          {sizeDistribution.map((item, index) => {
            // 높이 계산 수정: 전체 높이에서 실제 비율로 계산
            const height =
              maxCount > 0
                ? Math.max((item.count / maxCount) * 95, item.count > 0 ? 2 : 0)
                : 0;
            const color = colors[index % colors.length];

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
                      backgroundColor: color,
                      minHeight: item.count > 0 ? "2px" : "0px",
                    }}
                  ></div>

                  {/* 툴팁 */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                    <div className="bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg p-2 whitespace-nowrap shadow-lg">
                      <div className="font-semibold">
                        {item.sizeRange} bytes
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
          {sizeDistribution.map((item, index) => (
            <div key={index} className="flex-1 text-center">
              <div className="transform -rotate-45 origin-center">
                {item.sizeRange}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 통계 정보 */}
      <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4">
        <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">
          Size Range (bytes)
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
          {sizeDistribution.map((item, index) => {
            const color = colors[index % colors.length];
            return (
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded"
              >
                <div className="flex items-center space-x-2">
                  <div
                    className="w-3 h-3 rounded"
                    style={{ backgroundColor: color }}
                  ></div>
                  <span className="text-gray-700 dark:text-gray-300 font-medium">
                    {item.sizeRange}
                  </span>
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  {item.count.toLocaleString()} ({item.percentage}%)
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
