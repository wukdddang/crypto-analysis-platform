"use client";

import { Search, Moon, Sun } from "lucide-react";
import { useTheme } from "../../_context/theme.context";

export default function HeaderSection() {
  const { isDark, 테마를_변경_한다, resolvedTheme, mounted } = useTheme();

  const handleThemeToggle = () => {
    console.log("헤더 토글 버튼 클릭됨");
    console.log("현재 헤더에서 보는 isDark:", isDark);
    console.log("resolvedTheme:", resolvedTheme);
    console.log("mounted:", mounted);
    테마를_변경_한다();
  };

  return (
    <header className="w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* 로고 및 메인 타이틀 */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">B</span>
          </div>
          <h1 className="text-xl font-bold text-blue-600 dark:text-blue-400">
            BlockExplorer.one
          </h1>
        </div>

        {/* 네비게이션 메뉴 */}
        <nav className="hidden md:flex items-center space-x-6">
          <a
            href="#"
            className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium"
          >
            Explore
          </a>
          <a
            href="#"
            className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium"
          >
            Features
          </a>
          <a
            href="#"
            className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium"
          >
            Market Data
          </a>
          <a
            href="#"
            className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium"
          >
            News
          </a>
          <a
            href="#"
            className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium"
          >
            APIs
          </a>
          <a
            href="#"
            className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium"
          >
            About
          </a>
        </nav>

        {/* 검색바 및 기타 버튼 */}
        <div className="flex items-center space-x-4">
          <div className="relative hidden lg:block">
            <input
              type="text"
              placeholder="Enter an address, transaction hash, block hash or height..."
              className="w-80 px-4 py-2 pl-10 pr-4 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 dark:text-gray-500" />
          </div>

          <button
            onClick={handleThemeToggle}
            className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
            title={
              mounted
                ? isDark
                  ? "라이트 모드로 전환"
                  : "다크 모드로 전환"
                : "테마 토글"
            }
            suppressHydrationWarning
          >
            {!mounted ? (
              <Moon className="h-5 w-5" />
            ) : isDark ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
