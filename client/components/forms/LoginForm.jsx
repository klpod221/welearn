"use client";

import { useState } from "react";
import Link from "next/link";

import { useRouter } from "next/navigation";
import useNotify from "@/hooks/useNotify";

import { login } from "@/services/authService";
import { Button, Form, Input, Divider } from "antd";
import {
  UserOutlined,
  LockOutlined,
  LoginOutlined,
  GoogleOutlined,
  FacebookOutlined,
} from "@ant-design/icons";

export default function LoginForm() {
  const router = useRouter();
  const notify = useNotify();

  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    try {
      setLoading(true);
      await login(values);
      notify.success("Login successful");
      router.push("/dashboard");
    } catch (error) {
      notify.error(error.message || "Login failed");
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      name="login_form"
      onFinish={onFinish}
      layout="vertical"
      className="w-full max-w-md"
    >
      <Form.Item
        name="email"
        label="Email"
        rules={[
          {
            required: true,
            message: "Please input your Email!",
          },
          {
            type: "email",
            message: "The input is not valid E-mail!",
          },
        ]}
      >
        <Input prefix={<UserOutlined />} placeholder="Email" size="large" />
      </Form.Item>
      <Form.Item
        name="password"
        label="Password"
        rules={[{ required: true, message: "Please input your Password!" }]}
      >
        <Input.Password
          prefix={<LockOutlined />}
          type="password"
          placeholder="Password"
          size="large"
        />
      </Form.Item>
      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          className="w-full"
          size="large"
          icon={<LoginOutlined />}
          loading={loading}
        >
          Login
        </Button>
      </Form.Item>
      <Divider className="my-6">
        <span className="text-gray-400 text-xs px-4">OR CONTINUE WITH</span>
      </Divider>

      <div className="grid grid-cols-2 gap-4">
        <Button icon={<GoogleOutlined />}>Google</Button>
        <Button icon={<FacebookOutlined />}>Facebook</Button>
      </div>

      <div className="text-center mt-6 text-sm">
        <span className="text-gray-600 mr-1">Don't have an account?</span>
        <Link href="/register">Sign up</Link>
      </div>
    </Form>
  );
}
