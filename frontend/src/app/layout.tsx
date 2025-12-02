import type { Metadata } from "next";
import "./globals.css";
import { QueryProvider } from "@/components/providers";

export const metadata: Metadata = {
  title: "PhysioMind CDSS - Clinical Decision Support System",
  description: "AI-powered Clinical Decision Support System for Physiotherapists. Generate evidence-based diagnostic reports and treatment plans.",
  keywords: ["physiotherapy", "clinical decision support", "CDSS", "AI diagnosis", "treatment planning"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
