"use client";

import { useState, useMemo, useEffect } from "react";

interface ChartData {
  height: number;
  blockNumber: string;
  transactions: number;
}

interface InteractiveChartProps {
  data?: ChartData[];
  className?: string;
}

export default function InteractiveChart({
  data,
  className = "",
}: InteractiveChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  // 작은 막대 그래프용 데이터 (15개 막대)
  const chartData = useMemo(() => {
    if (data) return data;

    return Array.from({ length: 15 }, (_, i) => ({
      height: Math.floor(Math.random() * 80 + 20), // 20-100px 높이
      blockNumber: `909${(518 + i).toString()}`,
      transactions: Math.floor(Math.random() * 4000 + 500), // 500-4500 트랜잭션
    }));
  }, [data]);

  // 상대적 높이로 정규화 (컨테이너의 80%를 최대로 설정)
  const maxHeight = Math.max(...chartData.map((item) => item.height));
  const minHeight = Math.min(...chartData.map((item) => item.height));
  const normalizedData = chartData.map((item) => {
    const ratio = (item.height - minHeight) / (maxHeight - minHeight);
    // 최소 10%, 최대 80%의 컨테이너 높이 사용
    const heightPercent = minHeight === maxHeight ? 50 : ratio * 70 + 10;
    return {
      ...item,
      heightPercent,
    };
  });

  // 컴포넌트 언마운트 시 timeout 정리
  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [timeoutId]);

  const handleMouseEnter = (index: number) => {
    // 기존 timeout 클리어
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    setHoveredIndex(index);

    // 300ms 후에 툴팁 표시
    const newTimeoutId = setTimeout(() => {
      setShowTooltip(true);
    }, 300);

    setTimeoutId(newTimeoutId);
  };

  const handleMouseLeave = () => {
    // timeout 클리어
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }

    setHoveredIndex(null);
    setShowTooltip(false);
  };

  return (
    <div className={`relative ${className}`}>
      {/* 더 큰 막대 차트 */}
      <div className="flex items-end justify-center space-x-2.5 h-28 w-full">
        {normalizedData.map((item, index) => (
          <div key={index} className="relative h-full flex items-end">
            {/* 회색 배경 바 (최대 높이) */}
            <div
              className="bg-gray-200 dark:bg-gray-600 relative rounded-sm"
              style={{
                height: "110px", // 고정 높이 110px
                width: "8px",
              }}
            >
              {/* 주황색 실제 데이터 바 */}
              <div
                className="bg-orange-400 dark:bg-orange-500 cursor-pointer transition-all duration-200 hover:bg-orange-500 dark:hover:bg-orange-400 absolute bottom-0 left-0 right-0 rounded-sm"
                style={{
                  height: `${item.heightPercent}%`,
                  minHeight: "8px",
                }}
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={handleMouseLeave}
              />
            </div>

            {/* 툴팁 */}
            {hoveredIndex === index && showTooltip && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 z-50">
                <div className="bg-gray-800 dark:bg-gray-700 text-white text-xs px-2 py-1 rounded whitespace-nowrap shadow-lg">
                  <div className="font-semibold">
                    Block: #{item.blockNumber}
                  </div>
                  <div>Transactions: {item.transactions.toLocaleString()}</div>
                </div>
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-gray-800 dark:border-t-gray-700" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
