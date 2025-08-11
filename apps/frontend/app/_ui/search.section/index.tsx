'use client';

export default function SearchSection() {
  return (
    <div className="w-full bg-gray-50 px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap items-center justify-center space-x-4 mb-6">
          <span className="text-sm text-gray-600">Blockchains</span>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md">Bitcoin</button>
            <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-200 rounded-md">Mainnet</button>
            <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-200 rounded-md">Blocks</button>
          </div>
          <div className="flex items-center space-x-2 ml-8">
            <button className="px-4 py-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600">Buy</button>
            <button className="px-4 py-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600">Exchange</button>
            <button className="px-4 py-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600">Gaming</button>
            <button className="px-4 py-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600">Start Crypto</button>
          </div>
        </div>
      </div>
    </div>
  );
}
