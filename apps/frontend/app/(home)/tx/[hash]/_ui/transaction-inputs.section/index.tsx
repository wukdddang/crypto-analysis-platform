"use client";

import { useTransactionDetail } from "../../_context/transaction-detail.context";
import { Copy, Check } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export default function TransactionInputsSection() {
  const { transactionDetail } = useTransactionDetail();
  const [copiedField, setCopiedField] = useState<string | null>(null);

  if (!transactionDetail) return null;

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 mb-6">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Inputs ({transactionDetail.inputCount})
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
            {transactionDetail.inputs.map((input, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 font-mono">
                  {input.index}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100 font-mono">
                  {input.address === "N/A" ? (
                    <span className="text-gray-500 dark:text-gray-400">
                      N/A
                    </span>
                  ) : (
                    <div className="flex items-center">
                      <Link
                        href={`/tx/${input.address}`}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mr-2"
                      >
                        {input.address}
                      </Link>
                      <button
                        onClick={() =>
                          copyToClipboard(input.address, `address-${index}`)
                        }
                        className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        title="주소 복사"
                      >
                        {copiedField === `address-${index}` ? (
                          <Check className="h-3 w-3 text-green-500" />
                        ) : (
                          <Copy className="h-3 w-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                        )}
                      </button>
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100 font-mono">
                  {input.scriptSig === "N/A" ? (
                    <span className="text-gray-500 dark:text-gray-400">
                      N/A
                    </span>
                  ) : (
                    input.scriptSig
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100 font-mono">
                  {input.scriptSig === "N/A" ? (
                    <span className="text-gray-500 dark:text-gray-400">
                      N/A
                    </span>
                  ) : (
                    input.scriptSig
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {transactionDetail.inputs.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          이 트랜잭션에는 입력이 없습니다.
        </div>
      )}
    </div>
  );
}
