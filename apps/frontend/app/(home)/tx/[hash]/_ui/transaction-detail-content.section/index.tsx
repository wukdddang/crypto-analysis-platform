"use client";

import { useTransactionDetail } from "../../_context/transaction-detail.context";
import TransactionSummarySection from "../transaction-summary.section";
import TransactionDetailsSection from "../transaction-details.section";
import TransactionInputsSection from "../transaction-inputs.section";
import TransactionOutputsSection from "../transaction-outputs.section";

export default function TransactionDetailContent() {
  const { transactionDetail, loading, error } = useTransactionDetail();

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-6 w-2/3"></div>
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
            <div className="space-y-4">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="flex justify-between">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                트랜잭션 정보를 불러올 수 없습니다
              </h3>
              <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                {error}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!transactionDetail) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center text-gray-500 dark:text-gray-400">
          트랜잭션 정보를 찾을 수 없습니다.
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* 페이지 제목 */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Transaction Details
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 font-mono break-all">
          {transactionDetail.hash}
        </p>
      </div>

      {/* 트랜잭션 요약 정보 */}
      <TransactionSummarySection />

      {/* 트랜잭션 상세 정보 */}
      <TransactionDetailsSection />

      {/* Inputs 섹션 */}
      <TransactionInputsSection />

      {/* Outputs 섹션 */}
      <TransactionOutputsSection />
    </div>
  );
}
