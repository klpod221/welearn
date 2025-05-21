import { useState } from "react";
import debounce from "lodash.debounce";

import { Form, Input, InputNumber, Switch, Select } from "antd";

const valueTypes = ["string", "boolean", "integer", "float"];

export default function SettingForm({ setting, onChange }) {
  const [form] = Form.useForm();
  const [snakeCaseKey, setSnakeCaseKey] = useState("");
  const [valueType, setValueType] = useState(setting?.type || "string");

  const debouncedHandleKeyChange = debounce((inputValue) => {
    const snakeCase = inputValue
      .replace(/\s+/g, "_")
      .toLowerCase();
    setSnakeCaseKey(snakeCase);
    onChange({ ...setting, key: snakeCase });
  }, 300);

  const handleKeyChange = (e) => {
    debouncedHandleKeyChange(e.target.value);
  };

  const handleTypeChange = (value) => {
    setValueType(value);
    onChange({ ...setting, type: value });
  };

  const renderValueField = () => {
    switch (valueType) {
      case "boolean":
        return (
          <Switch
            checked={setting?.value}
            onChange={(checked) => onChange({ ...setting, value: checked })}
          />
        );
      case "integer":
        return (
          <InputNumber
            defaultValue={setting?.value}
            onChange={(value) => onChange({ ...setting, value })}
          />
        );
      case "float":
        return (
          <InputNumber
            defaultValue={setting?.value}
            step={0.01}
            onChange={(value) => onChange({ ...setting, value })}
          />
        );
      default:
        return (
          <Input
            defaultValue={setting?.value}
            onChange={(e) => onChange({ ...setting, value: e.target.value })}
          />
        );
    }
  };

  return (
    <Form form={form} layout="vertical">
      <Form.Item label="Key" rules={[{ required: true, message: 'Key is required' }]}>
        <Input defaultValue={setting?.key} onChange={handleKeyChange} />
        <div style={{ marginTop: 4, color: "#888" }}>{snakeCaseKey}</div>
      </Form.Item>

      <Form.Item label="Type" rules={[{ required: true, message: 'Type is required' }]}>
        <Select onChange={handleTypeChange} value={valueType}>
          {valueTypes.map((type) => (
            <Select.Option key={type} value={type}>
              {type}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item label="Value" rules={[{ required: true, message: 'Value is required' }]}>
        {renderValueField()}
      </Form.Item>

      <Form.Item label="Autoload" valuePropName="checked" rules={[{ required: true, message: 'Autoload is required' }]}>
        <Switch
          checked={setting?.autoload}
          onChange={(checked) => onChange({ ...setting, autoload: checked })}
        />
      </Form.Item>
    </Form>
  );
}
