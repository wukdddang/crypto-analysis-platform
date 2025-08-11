"use client";

export default function FooterSection() {
  return (
    <footer className="w-full bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 px-4 py-8 transition-colors">
      <div className="max-w-7xl mx-auto">
        <div className="text-center text-sm text-gray-600 dark:text-gray-400">
          <p className="mb-2">Data provided by Crypto APIs</p>
          <div className="flex justify-center space-x-6">
            <a
              href="#"
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              FAQ
            </a>
            <a
              href="#"
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Release monitor
            </a>
            <a
              href="#"
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Terms and conditions
            </a>
            <a
              href="#"
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Privacy policy
            </a>
            <a
              href="#"
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Cookies policy
            </a>
          </div>
          <p className="mt-4 text-xs text-gray-500 dark:text-gray-500">
            BlockExplorer.one All Rights Reserved 2024
          </p>
        </div>
      </div>
    </footer>
  );
}
