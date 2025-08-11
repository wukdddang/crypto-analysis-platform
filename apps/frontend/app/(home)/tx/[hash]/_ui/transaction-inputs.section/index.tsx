"use client";

import { useTransactionDetail } from "../../_context/transaction-detail.context";
import { Copy, Check, ExternalLink } from "lucide-react";
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

  const truncateHash = (hash: string, length: number = 12) => {
    if (hash === "N/A - Block Reward" || hash.length <= length * 2) return hash;
    return `${hash.slice(0, length)}...${hash.slice(-length)}`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 mb-6">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Inputs ({transactionDetail.inputCount})
        </h2>
      </div>

      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {transactionDetail.inputs.map((input, index) => (
          <div key={index} className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-3">
                <div>
                  <dt className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                    Index
                  </dt>
                  <dd className="text-sm text-gray-900 dark:text-gray-100 font-mono">
                    {input.index}
                  </dd>
                </div>

                <div>
                  <dt className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                    Address
                  </dt>
                  <dd className="text-sm text-gray-900 dark:text-gray-100 font-mono break-all">
                    {input.address === "N/A" ? (
                      <span className="text-gray-500 dark:text-gray-400">
                        N/A
                      </span>
                    ) : (
                      <div className="flex items-center">
                        <span className="mr-2">
                          {truncateHash(input.address)}
                        </span>
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
                  </dd>
                </div>

                <div>
                  <dt className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                    Signature ASM
                  </dt>
                  <dd className="text-sm text-gray-900 dark:text-gray-100 font-mono break-all">
                    {input.scriptSig === "N/A" ? (
                      <span className="text-gray-500 dark:text-gray-400">
                        N/A
                      </span>
                    ) : (
                      input.scriptSig
                    )}
                  </dd>
                </div>

                <div>
                  <dt className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                    Signature HEX
                  </dt>
                  <dd className="text-sm text-gray-900 dark:text-gray-100 font-mono break-all">
                    {input.scriptSig === "N/A" ? (
                      <span className="text-gray-500 dark:text-gray-400">
                        N/A
                      </span>
                    ) : (
                      input.scriptSig
                    )}
                  </dd>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-3">
                <div>
                  <dt className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                    Previous Transaction Hash
                  </dt>
                  <dd className="text-sm text-gray-900 dark:text-gray-100 font-mono break-all">
                    {input.previousTxHash === "N/A - Block Reward" ? (
                      <span className="text-gray-500 dark:text-gray-400">
                        N/A - Block Reward
                      </span>
                    ) : (
                      <div className="flex items-center">
                        <Link
                          href={`/tx/${input.previousTxHash}`}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mr-2"
                        >
                          {truncateHash(input.previousTxHash)}
                        </Link>
                        <ExternalLink className="h-3 w-3 text-gray-400" />
                        <button
                          onClick={() =>
                            copyToClipboard(
                              input.previousTxHash,
                              `prevtx-${index}`
                            )
                          }
                          className="ml-2 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          title="해시 복사"
                        >
                          {copiedField === `prevtx-${index}` ? (
                            <Check className="h-3 w-3 text-green-500" />
                          ) : (
                            <Copy className="h-3 w-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                          )}
                        </button>
                      </div>
                    )}
                  </dd>
                </div>

                <div>
                  <dt className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                    Output Index
                  </dt>
                  <dd className="text-sm text-gray-900 dark:text-gray-100 font-mono">
                    {input.outputIndex === "N/A" ? (
                      <span className="text-gray-500 dark:text-gray-400">
                        N/A
                      </span>
                    ) : (
                      input.outputIndex
                    )}
                  </dd>
                </div>

                <div>
                  <dt className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                    Sequence
                  </dt>
                  <dd className="text-sm text-gray-900 dark:text-gray-100 font-mono">
                    {input.sequence === "N/A" ? (
                      <span className="text-gray-500 dark:text-gray-400">
                        N/A
                      </span>
                    ) : (
                      input.sequence
                    )}
                  </dd>
                </div>

                <div>
                  <dt className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                    Value
                  </dt>
                  <dd className="text-sm text-gray-900 dark:text-gray-100 font-mono font-bold">
                    {input.value === "N/A" ? (
                      <span className="text-gray-500 dark:text-gray-400">
                        N/A
                      </span>
                    ) : (
                      input.value
                    )}
                  </dd>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {transactionDetail.inputs.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          이 트랜잭션에는 입력이 없습니다.
        </div>
      )}
    </div>
  );
}
