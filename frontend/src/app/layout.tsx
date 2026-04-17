import type { Metadata } from "next";

import "./globals.css";

const appName = process.env.NEXT_PUBLIC_APP_NAME ?? "Movie Recommender";

export const metadata: Metadata = {
  title: appName,
  description: "Frontend for semantic movie search and user recommendations."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
