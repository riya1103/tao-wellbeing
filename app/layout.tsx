import type { Metadata, Viewport } from "next";
import Nav from "@/components/Nav";
import ThemeToggle from "@/components/ThemeToggle";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tao — a quiet place to reflect",
  description:
    "A meditative space grounded in Taoism for reflection, breathing, and stillness.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Tao",
  },
};

export const viewport: Viewport = {
  themeColor: "#F4F1EA",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

const themeBootstrap = `
(function () {
  try {
    var t = localStorage.getItem("tao-theme");
    if (!t) {
      t = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    document.documentElement.setAttribute("data-theme", t);
  } catch (e) {
    document.documentElement.setAttribute("data-theme", "light");
  }
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootstrap }} />
      </head>
      <body>
        <ThemeToggle />
        {children}
        <Nav />
      </body>
    </html>
  );
}
