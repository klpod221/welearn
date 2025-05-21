import "@/styles/globals.css";

import Providers from "@/providers/Providers";

export const metadata = {
  title: "We Learn - Learning Platform by klpod221",
  description: "Together we learn, together we grow.",
  keywords: "welearn, coding, programming, web development",
  openGraph: {
    title: "We Learn - Learning Platform by klpod221",
    description: "Together we learn, together we grow.",
    url: "https://welearn.klpod221.com",
    siteName: "We Learn",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  authors: [
    {
      name: "klpod221",
      url: "https://klpod221.com",
    },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-100">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
