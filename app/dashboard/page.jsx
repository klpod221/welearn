"use client";

import { useRouter } from "next/navigation";
import useNotify from "@/hooks/useNotify";
import { logout } from "@/services/authService";

export default function DashboardPage() {
  const router = useRouter();
  const notify = useNotify();

  const handleLogout = async () => {
    try {
      await logout();
      notify.success("Logout successful!");
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <main className="container mx-auto p-4 flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl lg:text-4xl font-bold">Dashboard</h1>
      <p className="text-sm lg:text-lg mt-2">Welcome to your dashboard!</p>

      <button
        onClick={handleLogout}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Logout
      </button>
    </main>
  );
}
