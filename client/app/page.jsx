import Logo from "@/components/ui/Logo";
import Link from "next/link";

import { Button } from "antd";
import { LoginOutlined, GithubOutlined } from "@ant-design/icons";

export default function Home() {
  return (
    <main className="container mx-auto p-2 flex flex-col items-center justify-center min-h-screen">
      <Logo />

      <h2 className="text-2xl lg:text-4xl font-bold">
        Learning platform for development
      </h2>
      <p className="text-sm lg:text-lg mt-2">
        Together we learn, together we grow.
      </p>

      <div className="flex items-center justify-center gap-4 mt-4">
        <Link href="/login">
          <Button
            type="primary"
            size="large"
            icon={<LoginOutlined />}
          >
            Login
          </Button>
        </Link>

        <Link href="https://github.com/klpod221/welearn" target="_blank">
          <Button type="default" size="large" icon={<GithubOutlined />}>
            Source
          </Button>
        </Link>
      </div>
    </main>
  );
}
