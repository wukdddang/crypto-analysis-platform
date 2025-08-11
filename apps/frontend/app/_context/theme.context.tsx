"use client";

import React, { useEffect, useState } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useTheme as useNextTheme } from "next-themes";

export interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={true}
      storageKey="blockexplorer-theme"
      themes={["light", "dark", "system"]}
      disableTransitionOnChange={false}
    >
      {children}
    </NextThemesProvider>
  );
};

// next-themes의 useTheme을 래핑하여 기존 인터페이스와 호환성 유지
export const useTheme = () => {
  const { theme, setTheme, resolvedTheme, systemTheme } = useNextTheme();
  const [mounted, setMounted] = useState(false);

  // 클라이언트에서만 실행되도록 보장
  useEffect(() => {
    setMounted(true);
  }, []);

  // mounted가 false이면 기본값 반환 (hydration 이슈 방지)
  if (!mounted) {
    return {
      isDark: false,
      테마를_변경_한다: () => {},
      다크모드로_설정_한다: () => {},
      라이트모드로_설정_한다: () => {},
      theme: "light",
      setTheme: () => {},
      resolvedTheme: "light",
      mounted: false,
    };
  }

  const isDark = resolvedTheme === "dark";

  const 테마를_변경_한다 = () => {
    console.log("테마 변경 버튼 클릭됨. 현재 상태:", resolvedTheme);
    console.log("현재 theme:", theme);
    console.log("systemTheme:", systemTheme);
    setTheme(isDark ? "light" : "dark");
  };

  const 다크모드로_설정_한다 = () => {
    console.log("다크모드로 강제 설정");
    setTheme("dark");
  };

  const 라이트모드로_설정_한다 = () => {
    console.log("라이트모드로 강제 설정");
    setTheme("light");
  };

  return {
    isDark,
    테마를_변경_한다,
    다크모드로_설정_한다,
    라이트모드로_설정_한다,
    // next-themes의 원본 기능들도 제공
    theme,
    setTheme,
    resolvedTheme,
    mounted,
  };
};
