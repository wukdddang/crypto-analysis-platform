"use client";

import { useMempool } from "../../_context/mempool.context";

export default function AgeDistributionSection() {
  const { ageDistribution, loading, error } = useMempool();

  if (loading || error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Age Distribution
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Shows the distribution of transaction waiting times in the mempool
            (in minutes)
          </p>
        </div>
        <div className="h-64 bg-gray-100 dark:bg-gray-700 rounded animate-pulse"></div>
      </div>
    );
  }

  if (!ageDistribution.length) {
    return null;
  }

  // 최대값 계산 (차트 높이 정규화용)
  const maxCount = Math.max(...ageDistribution.map((item) => item.count));

  // 연령에 따른 그라데이션 색상 (최신 -> 오래된 순서)
  const getAgeColor = (index: number, total: number) => {
    const hue = 240 - (index / (total - 1)) * 240; // 240(파란색)에서 0(빨간색)으로
    return `hsl(${hue}, 70%, 55%)`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Age Distribution
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Shows the distribution of transaction waiting times in the mempool (in
          minutes)
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
          {ageDistribution.map((item, index) => {
            // 높이 계산 수정: 전체 높이에서 실제 비율로 계산
            const height =
              maxCount > 0
                ? Math.max((item.count / maxCount) * 95, item.count > 0 ? 2 : 0)
                : 0;
            const color = getAgeColor(index, ageDistribution.length);

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
                      <div className="font-semibold">{item.age} minutes</div>
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

        {/* X축 라벨 - 선택적으로 표시 (5개씩) */}
        <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-4 pl-2">
          {ageDistribution.map((item, index) => (
            <div key={index} className="flex-1 text-center">
              {index % 8 === 0 ? `${item.age}m` : ""}
            </div>
          ))}
        </div>
      </div>

      {/* 통계 정보 */}
      <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4">
        <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">
          Age Values (minutes) - Continuous Distribution
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 text-sm max-h-48 overflow-y-auto">
          {ageDistribution.map((item, index) => {
            const color = getAgeColor(index, ageDistribution.length);
            return (
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded"
              >
                <div className="flex items-center space-x-2">
                  <div
                    className="w-2 h-2 rounded"
                    style={{ backgroundColor: color }}
                  ></div>
                  <span className="text-gray-700 dark:text-gray-300 font-medium text-xs">
                    {item.age}m
                  </span>
                </div>
                <div className="text-gray-600 dark:text-gray-400 text-xs">
                  {item.count.toLocaleString()}
                </div>
              </div>
            );
          })}
        </div>

        {/* 연령 범례 */}
        <div className="mt-4 flex items-center justify-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
          <span>Recent</span>
          <div className="flex space-x-1">
            {Array.from({ length: 40 }, (_, i) => (
              <div
                key={i}
                className="w-1.5 h-3 rounded-sm"
                style={{
                  backgroundColor: getAgeColor(i, 40),
                }}
              />
            ))}
          </div>
          <span>Old</span>
        </div>
      </div>
    </div>
  );
}
