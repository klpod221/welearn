"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import useAuth from "@/hooks/useAuth";
import useScreenSize from "@/hooks/useScreenSize";

import { Menu, Drawer, Layout } from "antd";
import {
  DashboardOutlined,
  BookOutlined,
  TeamOutlined,
  SettingOutlined,
  UserOutlined,
  CodeOutlined,
} from "@ant-design/icons";

export default function Sidebar({ collapsed, setCollapsed }) {
  const { isMobile } = useScreenSize();
  const { isAdmin } = useAuth();
  const pathname = usePathname();

  const [selectedKeys, setSelectedKeys] = useState(["dashboard"]);

  useEffect(() => {
    if (isMobile) {
      setCollapsed(true);
    } else {
      setCollapsed(false);
    }
  }, [isMobile, setCollapsed]);

  useEffect(() => {
    // Extract the first segment of the path to determine the current section
    const pathSegment = pathname.split('/')[1] || 'dashboard';
    setSelectedKeys([pathSegment]);
  }, [pathname]);

  const menuItems = [
    {
      key: "dashboard",
      icon: <DashboardOutlined />,
      label: <Link href="/dashboard">Dashboard</Link>,
    },
    {
      key: "code-editor",
      icon: <CodeOutlined />,
      label: <Link href="/code-editor">Code Editor</Link>,
    },
    {
      key: "courses",
      icon: <BookOutlined />,
      label: <Link href="/courses">Courses</Link>,
    },
    {
      key: "profile",
      icon: <UserOutlined />,
      label: <Link href="/profile">Profile</Link>,
    },
  ];

  // Admin only menu items
  if (isAdmin) {
    menuItems.push(
      {
        key: "users",
        icon: <TeamOutlined />,
        label: <Link href="/users">Users</Link>,
      },
      {
        key: "settings",
        icon: <SettingOutlined />,
        label: <Link href="/settings">Settings</Link>,
      }
    );
  }

  const handleMenuClick = ({ key }) => {
    setSelectedKeys([key]);
  };

  const SidebarContent = () => (
    <Menu
      theme="light"
      mode="inline"
      className={`!border-none`}
      selectedKeys={selectedKeys}
      items={menuItems}
      onClick={handleMenuClick}
    />
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:block h-full bg-white overflow-y-auto">
        <Layout.Sider
          trigger={null}
          collapsible
          collapsed={isMobile ? false : collapsed}
        >
          <SidebarContent />
        </Layout.Sider>
      </div>

      {/* Mobile Drawer Sidebar */}
      <Drawer
        placement="left"
        onClose={() => setCollapsed(false)}
        open={isMobile && !collapsed}
        width={250}
        styles={{
          body: {
            padding: 0,
          },
          header: {
            display: "none",
          },
        }}
        mask={false}
        style={{
          position: "absolute",
          zIndex: 1000,
          top: 64, // Adjust this value based on your topbar height
          height: "calc(100vh - 64px)",
        }}
      >
        <div className="h-full">
          <SidebarContent />
        </div>
      </Drawer>
    </>
  );
}
