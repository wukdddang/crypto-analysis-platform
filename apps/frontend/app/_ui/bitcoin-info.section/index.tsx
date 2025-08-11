'use client';

import { useBitcoinExplorer } from '../../_context/bitcoin-explorer.context';

export default function BitcoinInfoSection() {
  const { bitcoinData, loading, error } = useBitcoinExplorer();

  if (loading) {
    return (
      <div className="w-full px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!bitcoinData) return null;

  return (
    <div className="w-full px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 비트코인 정보 */}
          <div className="lg:col-span-1">
            <div className="mb-6">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-sm text-gray-600">Mainnet</span>
                <span className="text-sm text-gray-400">testnet</span>
              </div>
              
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">₿</span>
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h2 className="text-2xl font-bold">Bitcoin</h2>
                    <span className="text-sm text-gray-500">BTC</span>
                  </div>
                  <div className="text-3xl font-bold text-gray-900">
                    {bitcoinData.price.toLocaleString()} {bitcoinData.currency}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Difficulty:</span>
                  <div className="font-mono">{bitcoinData.difficulty}</div>
                </div>
                <div>
                  <span className="text-gray-600">Block Height:</span>
                  <div className="font-mono">{bitcoinData.blockHeight.toLocaleString()}</div>
                </div>
              </div>
            </div>

            {/* 추천 수수료 */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-3">RECOMMENDED FEES PER BYTE</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Slow</span>
                  <span>0.00000001 BTC 80.00/Byte</span>
                </div>
                <div className="flex justify-between">
                  <span>Standard</span>
                  <span>0.00000001 BTC 90.00/Byte</span>
                </div>
                <div className="flex justify-between">
                  <span>Fast</span>
                  <span>0.00000001 BTC 100.00/Byte</span>
                </div>
              </div>
            </div>
          </div>

          {/* 차트 영역 */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
                {/* 차트 플레이스홀더 */}
                <div className="w-full h-full bg-gradient-to-r from-orange-100 to-orange-200 rounded flex items-end justify-center space-x-1 p-4">
                  {[...Array(20)].map((_, i) => (
                    <div 
                      key={i} 
                      className="bg-orange-400 w-4 rounded-t" 
                      style={{ height: `${Math.random() * 80 + 20}%` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
