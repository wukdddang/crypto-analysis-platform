"use client";

import { useBlockDetail } from "../../_context/block-detail.context";
import { Copy, Check } from "lucide-react";
import { useState } from "react";

export default function BlockInfoSection() {
  const { blockDetail } = useBlockDetail();
  const [copiedField, setCopiedField] = useState<string | null>(null);

  if (!blockDetail) return null;

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const infoItems = [
    { label: "Block Height", value: blockDetail.height, copyable: false },
    { label: "Block Hash", value: blockDetail.hash, copyable: true },
    { label: "Received Time", value: blockDetail.timestamp, copyable: false },
    { label: "Block Size", value: blockDetail.size, copyable: false },
    { label: "Difficulty", value: blockDetail.difficulty, copyable: false },
    { label: "Nonce", value: blockDetail.nonce, copyable: true },
    {
      label: "Total Transactions",
      value: blockDetail.transactionCount,
      copyable: false,
    },
    { label: "Block Reward", value: blockDetail.blockReward, copyable: false },
    { label: "Total Fees", value: blockDetail.totalFees, copyable: false },
    { label: "Total Output", value: blockDetail.totalOutput, copyable: false },
    {
      label: "Previous Block Hash",
      value: blockDetail.previousBlockHash,
      copyable: true,
    },
    { label: "Merkle Root", value: blockDetail.merkleRoot, copyable: true },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 mb-6">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Block Information
        </h2>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 gap-4">
          {infoItems.map((item, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-gray-100 dark:border-gray-700 last:border-b-0"
            >
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1 sm:mb-0">
                {item.label}
              </dt>
              <dd className="text-sm text-gray-900 dark:text-gray-100 font-mono break-all sm:text-right flex items-center">
                <span className="mr-2">{item.value}</span>
                {item.copyable && (
                  <button
                    onClick={() => copyToClipboard(item.value, item.label)}
                    className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    title="복사"
                  >
                    {copiedField === item.label ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                    )}
                  </button>
                )}
              </dd>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
