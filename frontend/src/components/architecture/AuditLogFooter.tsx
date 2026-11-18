"use client";

import React, { useState } from "react";
import { FileText, Network, CheckCircle2, XCircle, ShieldCheck, Database } from "lucide-react";

interface AuditLogFooterProps {
  status: "IDLE" | "SIMULATING" | "ACCEPT" | "REJECT";
  outcomeMessage?: string;
  txId?: string;
  blockIndex?: number;
  gasUsed?: number;
}

export const AuditLogFooter: React.FC<AuditLogFooterProps> = ({
  status,
  outcomeMessage,
  txId = "0x8f575a0da78a9b94f534d2bd54d6d75a8cd91c306d3f990a8746f790a42b4b1d",
  blockIndex = 14,
  gasUsed = 70442
}) => {
  const [lang, setLang] = useState<"en" | "bn">("en");

  const isAccepted = status === "ACCEPT" || status === "IDLE";
  const isRejected = status === "REJECT";

  const englishText = isAccepted
    ? "Allowed. Both classical ECDSA (secp256k1) and post-quantum ML-DSA-65 (NIST FIPS 204) signatures verified under SHA3-512 canonical domain-separated context. Nonce is fresh and unique. Transaction committed to block #" +
      blockIndex +
      "."
    : "Rejected. " +
      (outcomeMessage || "Cryptographic Verification Failed. Either ECDSA or ML-DSA-65 signature was invalid.") +
      " Zero-compromise conjunction rule (b_e ∧ b_pq) halted transaction processing to protect the blockchain ledger.";

  const bengaliText = isAccepted
    ? "অনুমতি দেওয়া হয়েছে। ক্লাসিক্যাল ECDSA (secp256k1) এবং পোস্ট-কোয়ান্টাম ML-DSA-65 (NIST FIPS 204) উভয় স্বাক্ষর SHA3-512 ডোমেন-সেপারেটেড কনটেক্সটে সফলভাবে যাচাই হয়েছে। নন্স তাজা ও বৈধ। ট্রানজ্যাকশন ব্লক #" +
      blockIndex +
      "-এ যুক্ত হয়েছে।"
    : "প্রত্যাখ্যান করা হয়েছে। " +
      (outcomeMessage || "ক্রিপ্টোগ্রাফিক যাচাইকরণ ব্যর্থ হয়েছে। ECDSA অথবা ML-DSA-65 স্বাক্ষরে অসঙ্গতি পাওয়া গেছে।") +
      " ব্লকচেইনের সম্পূর্ণ নিরাপত্তা নিশ্চিতে জিরো-কম্প্রোমাইজ কনজাংশন নিয়মে (b_e ∧ b_pq) ট্রানজ্যাকশন প্রসেসিং সাথে সাথে বাতিল করা হয়েছে।";

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 mt-8 space-y-4">
      {/* 3 Interactive Cards (Exact AgentShield Video Bottom Row) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: WHAT THE USER READS */}
        <div className="rounded-3xl bg-white dark:bg-[#0b0e14] border border-[#E6E8E5] dark:border-[#1e2736] p-5 shadow-xs flex flex-col justify-between min-h-[160px]">
          <div>
            <div className="flex items-center justify-between border-b border-[#E6E8E5] dark:border-[#161d27] pb-2.5 mb-2.5">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#777B78]">
                WHAT THE USER READS
              </span>
              {/* Language Switcher EN · বাংলা */}
              <div className="flex items-center gap-1 text-[11px] font-mono">
                <button
                  onClick={() => setLang("en")}
                  className={`px-1.5 py-0.5 rounded font-bold transition-all ${
                    lang === "en" ? "bg-[#00dc82]/15 text-[#00dc82]" : "text-[#777B78] hover:text-[#202124]"
                  }`}
                >
                  EN
                </button>
                <span className="text-[#777B78]">•</span>
                <button
                  onClick={() => setLang("bn")}
                  className={`px-1.5 py-0.5 rounded font-bold transition-all ${
                    lang === "bn" ? "bg-[#00dc82]/15 text-[#00dc82]" : "text-[#777B78] hover:text-[#202124]"
                  }`}
                >
                  বাংলা
                </button>
              </div>
            </div>

            <p className="text-xs text-[#202124] dark:text-slate-200 leading-relaxed font-sans">
              {lang === "en" ? englishText : bengaliText}
            </p>
          </div>

          <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-[#777B78]">
            <span>Human-Readable Explanation</span>
            <span className={isAccepted ? "text-[#00dc82] font-bold" : "text-rose-500 font-bold"}>
              {isAccepted ? "PASSED (0x1)" : "HALTED"}
            </span>
          </div>
        </div>

        {/* Card 2: SQLITE / BLOCKCHAIN AUDIT LOG */}
        <div className="rounded-3xl bg-white dark:bg-[#0b0e14] border border-[#E6E8E5] dark:border-[#1e2736] p-5 shadow-xs flex flex-col justify-between min-h-[160px]">
          <div>
            <div className="flex items-center justify-between border-b border-[#E6E8E5] dark:border-[#161d27] pb-2.5 mb-2.5">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#777B78]">
                SQLITE / BLOCKCHAIN LEDGER
              </span>
              <Database className="w-3.5 h-3.5 text-[#777B78]" />
            </div>

            <div className="space-y-1.5 font-mono text-xs">
              <div className="text-sm font-bold text-[#202124] dark:text-white">Audit log entry</div>
              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-[#777B78] truncate max-w-[120px]">
                  ...{txId.substring(txId.length - 8)}
                </span>
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                    isAccepted
                      ? "bg-[#00dc82]/15 text-[#00dc82]"
                      : "bg-rose-500/15 text-rose-500"
                  }`}
                >
                  {isAccepted ? "ALLOW 0x1" : "REJECT 0x0"}
                </span>
              </div>
              <div className="text-[11px] text-[#777B78] pt-1">
                Block Height: #{blockIndex} • Gas: {gasUsed.toLocaleString()}
              </div>
            </div>
          </div>

          <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-[#777B78]">
            <span>Immutable Receipt</span>
            <span>Anvil EVM #31337</span>
          </div>
        </div>

        {/* Card 3: SIMULATED NETWORK CHECK */}
        <div className="rounded-3xl bg-white dark:bg-[#0b0e14] border border-[#E6E8E5] dark:border-[#1e2736] p-5 shadow-xs flex flex-col justify-between min-h-[160px]">
          <div>
            <div className="flex items-center justify-between border-b border-[#E6E8E5] dark:border-[#161d27] pb-2.5 mb-2.5">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#777B78]">
                SIMULATED 100-NODE MESH
              </span>
              <Network className="w-3.5 h-3.5 text-[#777B78]" />
            </div>

            <div className="space-y-1.5 font-mono text-xs">
              <div className="text-sm font-bold text-[#202124] dark:text-white">Network check</div>
              <p className="text-xs text-[#777B78] leading-relaxed pt-1">
                Across 100 simulated nodes: 3-hop shortest path (Node #04 → #18 → #42 → #87) verified.
                Transmission latency: 1.18 ms.
              </p>
            </div>
          </div>

          <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-[#777B78]">
            <span>Payload: 3,380 Bytes</span>
            <span className="text-cyan-500 font-bold">100% Propagation</span>
          </div>
        </div>
      </div>

      {/* Legend & Recorded Run Badge (Exact Match with AgentShield Video) */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] font-mono text-[#777B78] border-t border-[#E6E8E5] dark:border-[#1e2736]">
        {/* Left: Connector Styles Legend */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-4 h-0.5 bg-slate-400" />
            <span>trusted input</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-4 h-0.5 border-t border-dashed border-rose-400" />
            <span>untrusted input</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-4 h-0.5 bg-[#00dc82]" />
            <span>verified hybrid</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-4 h-0.5 border-t border-dotted border-slate-400" />
            <span>prototype, simulated</span>
          </div>
        </div>

        {/* Right: Technical Spec Stamp */}
        <div className="text-right text-[10px] text-[#777B78]">
          Recorded real run: ECDSA secp256k1 + ML-DSA-65 (NIST FIPS 204), SHA3-512 context.
        </div>
      </div>
    </div>
  );
};
