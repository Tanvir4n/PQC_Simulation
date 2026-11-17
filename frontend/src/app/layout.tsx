import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/lib/theme";

export const metadata: Metadata = {
  title: "QuantumResist | Hybrid Blockchain Research Simulator",
  description:
    "Interactive Blockchain Simulation & Research Visualization Platform for ECDSA + ML-DSA-65 Hybrid Cryptography, 7-Phase Migration, and EVM Integration. Based on research by Md. Tanvir Hasan (Daffodil International University).",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full flex flex-col font-sans selection:bg-[#00dc82]/30 selection:text-[#00dc82]">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
