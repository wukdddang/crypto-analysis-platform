"use client";

import { useTransactionDetail } from "../../_context/transaction-detail.context";
import { Copy, Check } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export default function TransactionOutputsSection() {
  const { transactionDetail } = useTransactionDetail();
  const [copiedField, setCopiedField] = useState<string | null>(null);

  if (!transactionDetail) return null;

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const truncateHash = (hash: string, length: number = 12) => {
    if (hash === "N/A" || hash.length <= length * 2) return hash;
    return `${hash.slice(0, length)}...${hash.slice(-length)}`;
  };

  const getOutputTypeColor = (type: string) => {
    switch (type) {
      case "P2PKH":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      case "P2SH":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "P2WPKH":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400";
      case "P2WSH":
        return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400";
      case "OP_RETURN":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Outputs ({transactionDetail.outputCount})
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Index
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Address
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Sigscript ASM
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Sigscript HEX
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {transactionDetail.outputs.map((output, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 font-mono">
                  {output.index}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100 font-mono">
                  {output.address === "N/A" ? (
                    <span className="text-gray-500 dark:text-gray-400">
                      N/A
                    </span>
                  ) : (
                    <div className="flex items-center">
                      <Link
                        href={`/tx/${output.address}`}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mr-2"
                      >
                        {output.address}
                      </Link>
                      <button
                        onClick={() =>
                          copyToClipboard(
                            output.address,
                            `out-address-${index}`
                          )
                        }
                        className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        title="주소 복사"
                      >
                        {copiedField === `out-address-${index}` ? (
                          <Check className="h-3 w-3 text-green-500" />
                        ) : (
                          <Copy className="h-3 w-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                        )}
                      </button>
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100 font-mono">
                  {output.scriptPubKey === "N/A" ? (
                    <span className="text-gray-500 dark:text-gray-400">
                      N/A
                    </span>
                  ) : (
                    output.scriptPubKey
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100 font-mono">
                  {output.scriptPubKey === "N/A" ? (
                    <span className="text-gray-500 dark:text-gray-400">
                      N/A
                    </span>
                  ) : (
                    output.scriptPubKey
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {transactionDetail.outputs.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          이 트랜잭션에는 출력이 없습니다.
        </div>
      )}
    </div>
  );
}
