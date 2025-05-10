"use client";

import { useState } from "react";

import useAuth from "@/hooks/useAuth";

import Topbar from "@/layouts/private/Topbar";
import Sidebar from "@/layouts/private/Sidebar";

import { Spin } from "antd";

export default function PrivateLayout({ children }) {
  const { loading } = useAuth();

  const [collapsed, setCollapsed] = useState(false);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spin size="large" tip="Loading..." />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <Topbar collapsed={collapsed} setCollapsed={setCollapsed} />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

        <main
          className={`flex-1 overflow-auto p-4 transition-all duration-300 bg-gray-50`}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
