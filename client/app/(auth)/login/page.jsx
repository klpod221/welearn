import Logo from "@/components/Logo";
import LoginForm from "@/components/forms/LoginForm";

import { Card } from "antd";

export const metadata = {
  title: "Login | We Learn by klpod221",
  description: "Login to your We Learn account",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen">
      {/* Left side - decorative background */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 to-indigo-900 relative">
        <div className="absolute inset-0 bg-opacity-10 flex flex-col items-center justify-center p-12">
          <Logo size="default" />
          <div className="text-white text-xl text-center max-w-md">
              Together we learn, together we grow.
          </div>
        </div>
      </div>

      {/* Right side - login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-2 sm:p-8">
        <Card
          className="w-full max-w-md shadow-md rounded-xl border-0"
        >
          <div className="flex flex-col items-center mb-6">
            <div className="mb-2 lg:hidden">
              <Logo showText={false} size="medium" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Welcome back</h1>
            <p className="text-gray-500 text-sm mt-1">
              Please enter your details to sign in
            </p>
          </div>

          <LoginForm />
        </Card>
      </div>
    </div>
  );
}
