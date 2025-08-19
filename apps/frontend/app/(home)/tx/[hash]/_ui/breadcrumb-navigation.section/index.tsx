"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function BreadcrumbNavigation() {
  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
      <Link
        href="/"
        className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
      >
        Blockchains
      </Link>
      <ChevronRight className="h-4 w-4" />
      <Link
        href="/"
        className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
      >
        Bitcoin
      </Link>
      <ChevronRight className="h-4 w-4" />
      <Link
        href="/"
        className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
      >
        Mainnet
      </Link>
      <ChevronRight className="h-4 w-4" />
      <Link
        href="/"
        className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
      >
        Transactions
      </Link>
      <ChevronRight className="h-4 w-4" />
      <span className="text-gray-900 dark:text-gray-100">
        Bitcoin Mainnet Transaction Details
      </span>
    </nav>
  );
}
