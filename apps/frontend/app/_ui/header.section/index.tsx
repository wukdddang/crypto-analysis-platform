'use client';

import { Search, Moon, Sun } from 'lucide-react';
import { useState } from 'react';

export default function HeaderSection() {
  const [isDark, setIsDark] = useState(false);

  const handleThemeToggle = () => {
    setIsDark(!isDark);
  };

  return (
    <header className="w-full bg-white border-b border-gray-200 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* 로고 및 메인 타이틀 */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">B</span>
          </div>
          <h1 className="text-xl font-bold text-blue-600">BlockExplorer.one</h1>
        </div>

        {/* 네비게이션 메뉴 */}
        <nav className="hidden md:flex items-center space-x-6">
          <a href="#" className="text-gray-700 hover:text-blue-600 font-medium">Explore</a>
          <a href="#" className="text-gray-700 hover:text-blue-600 font-medium">Features</a>
          <a href="#" className="text-gray-700 hover:text-blue-600 font-medium">Market Data</a>
          <a href="#" className="text-gray-700 hover:text-blue-600 font-medium">News</a>
          <a href="#" className="text-gray-700 hover:text-blue-600 font-medium">APIs</a>
          <a href="#" className="text-gray-700 hover:text-blue-600 font-medium">About</a>
        </nav>

        {/* 검색바 및 기타 버튼 */}
        <div className="flex items-center space-x-4">
          <div className="relative hidden lg:block">
            <input
              type="text"
              placeholder="Enter an address, transaction hash, block hash or height..."
              className="w-80 px-4 py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          
          <button
            onClick={handleThemeToggle}
            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50"
          >
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
        </div>
      </div>
    </header>
  );
}
