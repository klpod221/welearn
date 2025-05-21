"use client";

import { useState } from "react";

import useAuth from "@/hooks/useAuth";

import Topbar from "@/components/layouts/private/Topbar";
import Sidebar from "@/components/layouts/private/Sidebar";

import { Spin } from "antd";

export default function PrivateLayout({ children }) {
  const { loading } = useAuth();

  const [collapsed, setCollapsed] = useState(false);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <Topbar collapsed={collapsed} setCollapsed={setCollapsed} />

      <div className="flex flex-1">
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

        <main className="flex-1 p-2 transition-all duration-300 bg-gray-50 h-[calc(100vh-72px)] overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
