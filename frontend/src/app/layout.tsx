import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="en" className="dark h-full antialiased">
      <body className="min-h-full bg-[#080b11] text-slate-100 flex flex-col font-sans selection:bg-teal-500/30 selection:text-teal-200">
        {children}
      </body>
    </html>
  );
}
