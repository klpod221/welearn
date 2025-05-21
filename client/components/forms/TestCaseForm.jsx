import { Form, Input } from "antd";

export default function TestCaseForm({ testCase, onChange }) {
  return (
    <Form layout="vertical">
      <Form.Item
        label="Test Name"
        required
        tooltip="A descriptive name for this test case"
      >
        <Input
          value={testCase.name}
          onChange={(e) =>
            onChange({
              ...testCase,
              name: e.target.value,
            })
          }
          placeholder="e.g., 'Test with empty input'"
        />
      </Form.Item>
      <Form.Item label="Input">
        <Input.TextArea
          value={testCase.input}
          onChange={(e) =>
            onChange({
              ...testCase,
              input: e.target.value,
            })
          }
          placeholder="Input for your code"
          rows={3}
        />
      </Form.Item>
      <Form.Item label="Expected Output">
        <Input.TextArea
          value={testCase.expectedOutput}
          onChange={(e) =>
            onChange({
              ...testCase,
              expectedOutput: e.target.value,
            })
          }
          placeholder="Expected output from your code"
          rows={3}
        />
      </Form.Item>
    </Form>
  );
}