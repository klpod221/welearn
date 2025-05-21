import { Input, Button } from "antd";
import { ClearOutlined } from "@ant-design/icons";

export default function InputOutputPanel({
  input,
  setInput,
  output = {},
  setOutput,
}) {
  const clearIO = () => {
    setInput("");
    setOutput({});
  };

  return (
    <div className="flex flex-col h-full">
      <div className="mb-2 flex justify-between items-center">
        <h3 className="text-md font-bold">Input</h3>
        <Button
          icon={<ClearOutlined />}
          size="small"
          onClick={clearIO}
          title="Clear input and output"
        >
          Clear
        </Button>
      </div>
      <Input.TextArea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter input for your program here..."
        className="mb-4 resize-none"
        rows={6}
      />

      <h3 className="text-md font-bold mt-1 mb-2">Output</h3>
      <div
        className={`mb-4 resize-none p-2 border border-gray-300 rounded whitespace-pre-wrap overflow-auto ${
          output.status === false && "text-red-500"
        }`}
      >
        {output.message || " "}
      </div>
    </div>
  );
}
