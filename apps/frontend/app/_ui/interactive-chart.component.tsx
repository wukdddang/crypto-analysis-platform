"use client";

import { useState, useMemo } from "react";

interface ChartData {
  height: number;
  blockNumber: string;
  transactions: number;
  timestamp: string;
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
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  // Mock 데이터를 useMemo로 고정 (리렌더링 시에도 동일한 데이터 유지)
  const chartData = useMemo(() => {
    if (data) return data;

    return Array.from({ length: 24 }, (_, i) => ({
      height: Math.floor(Math.sin(i * 0.5) * 30 + 50 + Math.cos(i * 0.3) * 20), // 더 자연스러운 패턴
      blockNumber: `90951${String(24 - i).padStart(2, "0")}`,
      transactions: Math.floor(
        Math.sin(i * 0.4) * 1000 + 2500 + Math.cos(i * 0.2) * 500
      ),
      timestamp: `${String(16 - Math.floor(i / 4)).padStart(2, "0")}:${String(
        (i % 4) * 15
      ).padStart(2, "0")}`,
    }));
  }, [data]);

  const handleMouseEnter = (index: number, event: React.MouseEvent) => {
    setHoveredIndex(index);
    const rect = event.currentTarget.getBoundingClientRect();
    setTooltipPosition({
      x: rect.left + rect.width / 2,
      y: rect.top - 10,
    });
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  return (
    <div className={`relative w-full h-full ${className}`}>
      {/* 차트 영역 */}
      <div className="w-full h-full bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-lg flex items-end justify-center space-x-1 p-6">
        {chartData.map((item, index) => (
          <div
            key={index}
            className={`relative bg-orange-400 dark:bg-orange-500 rounded-t-sm cursor-pointer transition-all duration-200 ${
              hoveredIndex === index
                ? "bg-orange-500 dark:bg-orange-400 scale-105 shadow-lg"
                : "hover:bg-orange-500 dark:hover:bg-orange-400"
            }`}
            style={{
              height: `${item.height}%`,
              width: `${Math.max(100 / chartData.length - 2, 8)}%`,
              minWidth: "8px",
            }}
            onMouseEnter={(e) => handleMouseEnter(index, e)}
            onMouseLeave={handleMouseLeave}
          />
        ))}
      </div>

      {/* 툴팁 */}
      {hoveredIndex !== null && (
        <div
          className="fixed z-50 bg-gray-800 dark:bg-gray-700 text-white text-sm px-3 py-2 rounded-lg shadow-lg pointer-events-none transform -translate-x-1/2 -translate-y-full"
          style={{
            left: tooltipPosition.x,
            top: tooltipPosition.y,
          }}
        >
          <div className="text-center">
            <div className="font-semibold text-orange-300">
              블록: #{chartData[hoveredIndex].blockNumber}
            </div>
            <div className="text-xs text-gray-300 mt-1">
              Block: #{chartData[hoveredIndex].blockNumber}
            </div>
            <div className="text-xs text-gray-300">
              Transactions: {chartData[hoveredIndex].transactions}
            </div>
          </div>
          {/* 툴팁 화살표 */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800 dark:border-t-gray-700" />
        </div>
      )}
    </div>
  );
}
