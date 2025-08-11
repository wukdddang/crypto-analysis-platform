'use client';

export default function FooterSection() {
  return (
    <footer className="w-full bg-white border-t border-gray-200 px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center text-sm text-gray-600">
          <p className="mb-2">
            Data provided by Crypto APIs
          </p>
          <div className="flex justify-center space-x-6">
            <a href="#" className="hover:text-blue-600">FAQ</a>
            <a href="#" className="hover:text-blue-600">Release monitor</a>
            <a href="#" className="hover:text-blue-600">Terms and conditions</a>
            <a href="#" className="hover:text-blue-600">Privacy policy</a>
            <a href="#" className="hover:text-blue-600">Cookies policy</a>
          </div>
          <p className="mt-4 text-xs">
            BlockExplorer.one All Rights Reserved 2024
          </p>
        </div>
      </div>
    </footer>
  );
}
