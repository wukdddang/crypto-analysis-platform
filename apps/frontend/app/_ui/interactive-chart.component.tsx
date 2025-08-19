"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { ChartData } from "@/types";
import { CHART } from "@/constants";
import { formatNumber } from "@/lib/utils";

interface InteractiveChartProps {
  data?: ChartData[];
  className?: string;
  onBarClick?: (data: ChartData, index: number) => void;
  ariaLabel?: string;
}

export default function InteractiveChart({
  data,
  className = "",
  onBarClick,
  ariaLabel = "블록 트랜잭션 차트",
}: InteractiveChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  // 차트 데이터 생성 (기본값 또는 props로 받은 데이터)
  const chartData = useMemo(() => {
    if (data) return data;

    return Array.from({ length: CHART.DEFAULT_BAR_COUNT }, (_, i) => ({
      height: Math.floor(
        Math.random() * (CHART.MAX_BAR_HEIGHT - CHART.MIN_BAR_HEIGHT) +
          CHART.MIN_BAR_HEIGHT
      ),
      blockNumber: `909${(518 + i).toString()}`,
      transactions: Math.floor(Math.random() * 4000 + 500),
    }));
  }, [data]);

  // 상대적 높이로 정규화된 데이터 계산
  const normalizedData = useMemo(() => {
    const maxHeight = Math.max(...chartData.map((item) => item.height));
    const minHeight = Math.min(...chartData.map((item) => item.height));

    return chartData.map((item) => {
      const ratio = (item.height - minHeight) / (maxHeight - minHeight);
      const heightPercent =
        minHeight === maxHeight
          ? CHART.DEFAULT_BAR_PERCENT
          : ratio * (CHART.MAX_BAR_PERCENT - CHART.MIN_BAR_PERCENT) +
            CHART.MIN_BAR_PERCENT;

      return {
        ...item,
        heightPercent,
      };
    });
  }, [chartData]);

  // 컴포넌트 언마운트 시 timeout 정리
  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [timeoutId]);

  // 마우스 이벤트 핸들러들
  const handleMouseEnter = useCallback(
    (index: number) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      setHoveredIndex(index);

      const newTimeoutId = setTimeout(() => {
        setShowTooltip(true);
      }, CHART.TOOLTIP_DELAY);

      setTimeoutId(newTimeoutId);
    },
    [timeoutId]
  );

  const handleMouseLeave = useCallback(() => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }

    setHoveredIndex(null);
    setShowTooltip(false);
  }, [timeoutId]);

  const handleBarClick = useCallback(
    (item: ChartData, index: number) => {
      onBarClick?.(item, index);
    },
    [onBarClick]
  );

  return (
    <div className={`relative ${className}`} role="img" aria-label={ariaLabel}>
      <div className="flex items-end justify-center space-x-2.5 h-28 w-full">
        {normalizedData.map((item, index) => (
          <div key={index} className="relative h-full flex items-end">
            {/* 배경 바 */}
            <div
              className="bg-gray-200 dark:bg-gray-600 relative rounded-sm"
              style={{
                height: `${CHART.CONTAINER_HEIGHT}px`,
                width: `${CHART.BAR_WIDTH}px`,
              }}
            >
              {/* 데이터 바 */}
              <button
                className="bg-orange-400 dark:bg-orange-500 cursor-pointer transition-all duration-200 hover:bg-orange-500 dark:hover:bg-orange-400 absolute bottom-0 left-0 right-0 rounded-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                style={{
                  height: `${item.heightPercent}%`,
                  minHeight: "8px",
                }}
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={handleMouseLeave}
                onClick={() => handleBarClick(item, index)}
                aria-label={`블록 ${item.blockNumber}: ${formatNumber(
                  item.transactions
                )}개 트랜잭션`}
              />
            </div>

            {/* 툴팁 */}
            {hoveredIndex === index && showTooltip && (
              <div
                className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 z-50"
                role="tooltip"
                aria-hidden="true"
              >
                <div className="bg-gray-800 dark:bg-gray-700 text-white text-xs px-2 py-1 rounded whitespace-nowrap shadow-lg">
                  <div className="font-semibold">
                    Block: #{item.blockNumber}
                  </div>
                  <div>Transactions: {formatNumber(item.transactions)}</div>
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
