"use client";

import { kbToMb } from "@/utils/helpers";

import { Button } from "antd";
import {
  PlayCircleOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckCircleFilled,
  CloseCircleFilled,
  QuestionCircleFilled,
  ClockCircleOutlined,
  DatabaseOutlined,
} from "@ant-design/icons";

export default function TestCaseItem({
  test,
  testResult,
  onEdit,
  onDelete,
  onRun,
}) {
  // Determine status icon and color
  let StatusIcon = QuestionCircleFilled;
  let statusColor = "text-gray-400";
  let statusBg = "bg-gray-100";
  let statusText = "Not Run";

  if (testResult) {
    if (testResult.passed) {
      StatusIcon = CheckCircleFilled;
      statusColor = "text-green-600";
      statusBg = "bg-green-100";
      statusText = "Passed";
    } else {
      StatusIcon = CloseCircleFilled;
      statusColor = "text-red-600";
      statusBg = "bg-red-100";
      statusText = "Failed";
    }
  }

  return (
    <div className="border border-gray-200 rounded-md overflow-hidden text-sm">
      {/* Header with status badge */}
      <div
        className={`px-2 py-2 flex flex-col sm:flex-row sm:items-center sm:justify-between ${statusBg} border-b border-gray-200`}
      >
        {/* Left: Info */}
        <div className="flex flex-col flex-1 min-w-0">
          <span className="font-bold text-gray-800 text-sm truncate">
            {test.name}
          </span>
          <div className="flex items-center mt-1">
            <div
              className={`flex items-center px-1.5 py-0.5 rounded-full text-xs ${statusBg} ${statusColor}`}
            >
              <StatusIcon className="mr-1 text-xs" />
              <span>{statusText}</span>
            </div>
            {testResult && typeof testResult.executionTime === "number" && (
              <span className="ml-3 text-xs text-gray-500 whitespace-nowrap">
                <ClockCircleOutlined className="mr-1" />
                {testResult.executionTime} ms
              </span>
            )}
          </div>
        </div>
        {/* Right: Action buttons */}
        <div className="flex space-x-1 mt-2 sm:mt-0 sm:ml-2 justify-end">
          <Button
            type="text"
            icon={<PlayCircleOutlined />}
            className="flex items-center justify-center text-blue-600 hover:bg-blue-50 hover:text-blue-700 h-6 w-6 min-w-0 p-0"
            onClick={() => onRun && onRun(test.id)}
            title="Run test"
            size="small"
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            className="flex items-center justify-center text-gray-600 hover:bg-gray-50 hover:text-gray-700 h-6 w-6 min-w-0 p-0"
            onClick={() => onEdit && onEdit(test)}
            title="Edit test"
            size="small"
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            className="flex items-center justify-center hover:bg-red-50 h-6 w-6 min-w-0 p-0"
            onClick={() => onDelete && onDelete(test.id)}
            title="Delete test"
            size="small"
          />
        </div>
      </div>

      {/* Test details body - collapsed by default with option to expand */}
      <div className="p-2">
        <div className="grid grid-cols-1 gap-2">
          <div className="bg-gray-50 p-2 rounded-md border border-gray-200">
            <div className="text-xs uppercase text-gray-500 font-semibold mb-0.5">
              Input
            </div>
            <div className="font-mono text-xs text-gray-700 whitespace-pre-wrap max-h-24 overflow-auto">
              {test.input || (
                <span className="italic text-gray-400">(empty)</span>
              )}
            </div>
          </div>

          <div className="bg-gray-50 p-2 rounded-md border border-gray-200">
            <div className="text-xs uppercase text-gray-500 font-semibold mb-0.5">
              Expected Output
            </div>
            <div className="font-mono text-xs text-gray-700 whitespace-pre-wrap max-h-24 overflow-auto">
              {test.expectedOutput || (
                <span className="italic text-gray-400">(empty)</span>
              )}
            </div>
          </div>

          {testResult && testResult.output && testResult.passed === false && (
            <div className="p-2 rounded-md border bg-red-100 border-red-200">
              <div className="text-xs uppercase text-gray-500 font-semibold mb-0.5">
                Actual Output
              </div>
              <div className="font-mono text-xs text-gray-700 whitespace-pre-wrap max-h-24 overflow-auto">
                {testResult.output || (
                  <span className="italic text-gray-400">(empty)</span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer with memory usage */}
      {testResult && testResult.memoryUsage && (
        <div className="px-2 py-2 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center text-xs text-gray-500">
            <DatabaseOutlined className="mr-1" />
            Memory Usage: {kbToMb(testResult.memoryUsage)} MB
          </div>
        </div>
      )}
    </div>
  );
}
