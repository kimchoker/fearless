import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "밴픽 & 피어리스 시뮬레이터",
  description: "리그 오브 레전드 밴픽 시뮬레이터 및 피어리스 밴픽 체크 이미지 생성",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
