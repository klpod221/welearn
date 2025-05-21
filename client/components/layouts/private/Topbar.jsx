"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import useAuth from "@/hooks/useAuth";
import { logout } from "@/services/authService";

import Logo from "@/components/ui/Logo";

import { Avatar, Dropdown, Button } from "antd";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
} from "@ant-design/icons";

export default function Topbar({ collapsed, setCollapsed }) {
  const { user } = useAuth();
  const router = useRouter();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const userMenuItems = [
    {
      key: "profile",
      label: <Link href="/profile">Profile</Link>,
      icon: <UserOutlined />,
    },
    {
      key: "settings",
      label: <Link href="/settings">Settings</Link>,
      icon: <SettingOutlined />,
    },
    {
      key: "divider",
      type: "divider",
    },
    {
      key: "logout",
      label: <a onClick={handleLogout}>Logout</a>,
      icon: <LogoutOutlined />,
      danger: true,
    },
  ];

  if (!mounted) return null;

  return (
    <header className="flex items-center justify-between px-4 py-2 bg-white shadow-md h-16">
      <div className="flex items-center">
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed(!collapsed)}
          className="mr-4 md:hidden"
        />

        <Link href="/dashboard">
          <Logo size="small" />
        </Link>
      </div>

      <div className="flex items-center">
        <Dropdown
          menu={{ items: userMenuItems }}
          trigger={["click"]}
          placement="bottomRight"
        >
          <div className="flex items-center cursor-pointer hover:bg-gray-50 px-3 py-1.5 rounded-md transition-colors">
            <span className="mr-3 hidden sm:inline text-right">
              <span className="block text-sm font-bold text-gray-700">
                {user?.name || "User"}
              </span>
              <span className="block text-xs text-gray-500">
                {user?.role || "User Role"}
              </span>
            </span>
            <Avatar
              size="default"
              icon={<UserOutlined />}
              className="bg-blue-500"
            />
          </div>
        </Dropdown>
      </div>
    </header>
  );
}
