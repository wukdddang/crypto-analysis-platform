"use client";

import { useTransactionDetail } from "../../_context/transaction-detail.context";
import { Copy, Check } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export default function TransactionDetailsSection() {
  const { transactionDetail } = useTransactionDetail();
  const [copiedField, setCopiedField] = useState<string | null>(null);

  if (!transactionDetail) return null;

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const detailItems = [
    { label: "Status", value: transactionDetail.status, copyable: false },
    { label: "Size in Bytes", value: transactionDetail.size, copyable: false },
    {
      label: "Date / Time",
      value: transactionDetail.timestamp,
      copyable: false,
    },
    {
      label: "Included in block",
      value: transactionDetail.blockHeight.toString(),
      copyable: false,
      link: `/block/${transactionDetail.blockHeight}`,
    },
    {
      label: "Confirmations",
      value: transactionDetail.confirmations.toString(),
      copyable: false,
    },
    {
      label: "Total Input",
      value: transactionDetail.totalInput,
      copyable: false,
    },
    {
      label: "Total Output",
      value: transactionDetail.totalOutput,
      copyable: false,
    },
    {
      label: "Fee per Byte",
      value: transactionDetail.feeRate,
      copyable: false,
    },
    {
      label: "Value when transacted",
      value: transactionDetail.fee,
      copyable: false,
    },
    {
      label: "Block Hash",
      value: transactionDetail.blockHash,
      copyable: true,
      link: `/block/${transactionDetail.blockHash}`,
    },
    {
      label: "Version",
      value: transactionDetail.version.toString(),
      copyable: false,
    },
    {
      label: "Lock Time",
      value: transactionDetail.lockTime.toString(),
      copyable: false,
    },
    {
      label: "Weight",
      value: `${transactionDetail.weight} WU`,
      copyable: false,
    },
    {
      label: "Virtual Size",
      value: `${transactionDetail.virtualSize} vBytes`,
      copyable: false,
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 mb-6">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Details
        </h2>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 gap-4">
          {detailItems.map((item, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-gray-100 dark:border-gray-700 last:border-b-0"
            >
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1 sm:mb-0">
                {item.label}
              </dt>
              <dd className="text-sm text-gray-900 dark:text-gray-100 font-mono break-all sm:text-right flex items-center">
                {item.link ? (
                  <Link
                    href={item.link}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline mr-2"
                  >
                    {item.value}
                  </Link>
                ) : (
                  <span className="mr-2">{item.value}</span>
                )}
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
