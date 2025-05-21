"use client";

import { useState, useEffect } from "react";
import { Button, Modal } from "antd";
import {
  PlusCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";

import TestCaseForm from "@/components/forms/TestCaseForm";
import TestCaseItem from "@/components/ui/TestCaseItem";

export default function TestCasesPanel({
  testCases,
  testResults,
  onAddTestCase,
  onUpdateTestCase,
  onDeleteTestCase,
  onRunTestCase,
}) {
  const [addingTestCase, setAddingTestCase] = useState(false);
  const [editingTestCase, setEditingTestCase] = useState(null);
  const [newTestCase, setNewTestCase] = useState({
    input: "",
    expectedOutput: "",
    name: "",
  });

  const [testSummary, setTestSummary] = useState({});

  // Add a new test case
  const handleAddTestCase = () => {
    onAddTestCase(newTestCase);
    setNewTestCase({ input: "", expectedOutput: "", name: "" });
    setAddingTestCase(false);
  };

  // Update existing test case
  const handleUpdateTestCase = () => {
    if (!editingTestCase) return;
    onUpdateTestCase(editingTestCase);
    setEditingTestCase(null);
  };

  // Update test summary when test results change
  useEffect(() => {
    const passedTests = testResults.filter((result) => result.passed).length;
    const failedTests = testResults.filter((result) => !result.passed).length;

    setTestSummary({
      totalTests: testResults.length,
      passedTests,
      failedTests,
    });
  }, [testResults, testCases]);

  return (
    <div className="flex flex-col h-full">
      <div className="mb-2 flex justify-between items-center">
        <h3 className="text-md font-bold">Test cases</h3>
        <div>
          <Button
            icon={<PlusCircleOutlined />}
            size="small"
            onClick={() => setAddingTestCase(true)}
          >
            Add Test
          </Button>
        </div>
      </div>
      {/* Test Cases List */}
      <div className="h-full max-h-[calc(100vh-280px)] overflow-y-auto">
        {testCases.length === 0 ? (
          <div className="py-4 text-center text-gray-500">
            <p>No test cases defined</p>
            <Button type="link" onClick={() => setAddingTestCase(true)}>
              Create a test case
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {testCases.map((test, index) => (
              <TestCaseItem
                key={index}
                test={test}
                testResult={testResults[index]}
                onEdit={(test) => setEditingTestCase({ ...test })}
                onDelete={onDeleteTestCase}
                onRun={onRunTestCase}
              />
            ))}
          </div>
        )}
      </div>
      {Object.keys(testResults).length > 0 ? (
        <div className="mt-4">
          <div className="bg-gray-100 p-3 rounded">
            <div className="flex justify-between items-center">
              <div className="flex gap-4">
                <div className="flex items-center">
                  <CheckCircleOutlined className="!text-green-500 mr-2" />
                  <span className="text-green-500">
                    {testSummary.passedTests} passed
                  </span>
                </div>
                <div className="flex items-center">
                  <CloseCircleOutlined className="!text-red-500 mr-2" />
                  <span className="text-red-500">
                    {testSummary.failedTests} failed
                  </span>
                </div>
              </div>
              <div className="text-gray-700 font-semibold">
                {testSummary.totalTests}/{testCases.length} tests
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-4 text-center text-gray-500">
          <p>
            Click "Run" button at the top to run all test cases, or run
            individual tests using the buttons above.
          </p>
        </div>
      )}

      {/* Modal for adding a new test case */}
      <Modal
        title="Add Test Case"
        open={addingTestCase}
        onOk={handleAddTestCase}
        onCancel={() => setAddingTestCase(false)}
        okText="Add"
        cancelText="Cancel"
      >
        <TestCaseForm testCase={newTestCase} onChange={setNewTestCase} />
      </Modal>
      {/* Modal for editing an existing test case */}
      <Modal
        title="Edit Test Case"
        open={!!editingTestCase}
        onOk={handleUpdateTestCase}
        onCancel={() => setEditingTestCase(null)}
        okText="Update"
        cancelText="Cancel"
      >
        {editingTestCase && (
          <TestCaseForm
            testCase={editingTestCase}
            onChange={setEditingTestCase}
          />
        )}
      </Modal>
    </div>
  );
}
