"use client";

import { useBlockDetail } from "../../_context/block-detail.context";
import Link from "next/link";
import { ExternalLink, Copy, Check } from "lucide-react";
import { useState } from "react";

export default function BlockTransactionsSection() {
  const { blockDetail } = useBlockDetail();
  const [copiedTx, setCopiedTx] = useState<string | null>(null);

  if (!blockDetail) return null;

  const copyToClipboard = (text: string, txHash: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTx(txHash);
    setTimeout(() => setCopiedTx(null), 2000);
  };

  const truncateHash = (hash: string, length: number = 12) => {
    if (hash.length <= length * 2) return hash;
    return `${hash.slice(0, length)}...${hash.slice(-length)}`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Block Transactions ({blockDetail.transactionCount})
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Hash
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Amount Transacted
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Tx Fee
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {blockDetail.transactions.map((tx, index) => (
              <tr
                key={index}
                className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Link
                      href={`/tx/${tx.hash}`}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-mono text-sm"
                    >
                      {truncateHash(tx.hash)}
                    </Link>
                    <button
                      onClick={() => copyToClipboard(tx.hash, tx.hash)}
                      className="ml-2 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                      title="해시 복사"
                    >
                      {copiedTx === tx.hash ? (
                        <Check className="h-3 w-3 text-green-500" />
                      ) : (
                        <Copy className="h-3 w-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                      )}
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 font-mono">
                  {tx.amount}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {tx.time}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 font-mono">
                  {tx.fee}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link
                    href={`/tx/${tx.hash}`}
                    className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                  >
                    View Details
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {blockDetail.transactions.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          이 블록에는 트랜잭션이 없습니다.
        </div>
      )}
    </div>
  );
}
