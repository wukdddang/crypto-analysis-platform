"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface ThemeContextType {
  isDark: boolean;
  테마를_변경_한다: () => void;
  다크모드로_설정_한다: () => void;
  라이트모드로_설정_한다: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [isDark, setIsDark] = useState(false);

  // 로컬 스토리지에서 테마 설정 불러오기 (클라이언트 사이드에서만)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme) {
        setIsDark(savedTheme === "dark");
      } else {
        // 시스템 설정을 초기값으로만 사용
        const systemPrefersDark = window.matchMedia(
          "(prefers-color-scheme: dark)"
        ).matches;
        setIsDark(systemPrefersDark);
        // 초기값을 로컬 스토리지에 저장
        localStorage.setItem("theme", systemPrefersDark ? "dark" : "light");
      }
    }
  }, []);

  // 테마 변경 시 DOM과 로컬 스토리지 업데이트 (클라이언트 사이드에서만)
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (isDark) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
    }
  }, [isDark]);

  // 액션 함수들
  const 테마를_변경_한다 = () => {
    setIsDark(!isDark);
  };

  const 다크모드로_설정_한다 = () => {
    setIsDark(true);
  };

  const 라이트모드로_설정_한다 = () => {
    setIsDark(false);
  };

  const contextValue: ThemeContextType = {
    isDark,
    테마를_변경_한다,
    다크모드로_설정_한다,
    라이트모드로_설정_한다,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

// 커스텀 훅
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
