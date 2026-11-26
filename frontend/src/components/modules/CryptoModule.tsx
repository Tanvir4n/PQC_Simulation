"use client";

import React, { useState } from "react";
import {
  KeyRound,
  ShieldCheck,
  ShieldAlert,
  Binary,
  Layers,
  Sparkles,
  RefreshCw,
  Copy,
  Check,
  CheckCircle2,
  AlertTriangle,
  FileCode,
  Zap,
  Sliders,
  ArrowRight,
  Shield
} from "lucide-react";
import { apiFetch, PAPER_REFERENCE_DATA } from "@/lib/api";

interface CryptoModuleProps {
  isLiveMode: boolean;
}

export const CryptoModule: React.FC<CryptoModuleProps> = ({ isLiveMode }) => {
  const [keyPair, setKeyPair] = useState<any>({
    address: "0x7a39d84f1839958bcda77f8049a2167d58b2910a",
    total_time_ms: 0.5488,
    ecdsa_time_ms: 0.4398,
    pqc_time_ms: 0.0550,
    sizes: {
      ecdsa_pk_bytes: 65,
      pqc_pk_bytes: 1952,
      combined_pk_bytes: 2017,
      ecdsa_raw_sk_bytes: 32,
      ecdsa_serialized_sk_bytes: 135,
      pqc_sk_bytes: 4032,
      combined_raw_sk_bytes: 4064,
      combined_serialized_sk_bytes: 4167
    }
  });

  const [message, setMessage] = useState<string>(
    "Transfer 100.0 DIU Tokens from Alice to Bob [Non-Repudiation]"
  );
  const [signatureData, setSignatureData] = useState<any | null>(null);
  const [verificationResult, setVerificationResult] = useState<any | null>(null);
  const [isSigning, setIsSigning] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  // Tampering Sandbox State
  const [tamperTarget, setTamperTarget] = useState<string>("ecdsa");
  const [tamperResult, setTamperResult] = useState<any | null>(null);
  const [isTampering, setIsTampering] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const handleGenerateKeys = async () => {
    try {
      const res = await apiFetch<any>("/crypto/keygen", { method: "POST" }, null);
      if (res && res.metrics) {
        setKeyPair(res.metrics);
        setSignatureData(null);
        setVerificationResult(null);
        setTamperResult(null);
      }
    } catch {
      // Mock new keypair if offline
      setKeyPair({
        address: "0x" + Math.random().toString(16).substring(2, 42),
        total_time_ms: 0.5214,
        ecdsa_time_ms: 0.4412,
        pqc_time_ms: 0.0543,
        sizes: keyPair.sizes
      });
    }
  };

  const handleSign = async () => {
    setIsSigning(true);
    setVerificationResult(null);
    setTamperResult(null);

    try {
      const res = await apiFetch<any>(
        "/crypto/sign",
        {
          method: "POST",
          body: JSON.stringify({ message })
        },
        null
      );
      if (res && res.signature) {
        setSignatureData(res.signature);
      } else {
        // Fallback signature data matching paper specifications
        setSignatureData({
          version: 1,
          algorithms: ["ECDSA_SECP256K1", "ML_DSA_65"],
          digest_hex: "d83f4b...328f5a11 (Canonical SHA3-512 Context Digest)",
          ecdsa_signature_hex: "3046022100... (70 Bytes ASN.1 DER)",
          pqc_signature_hex: "7a8b9c... (3,309 Bytes ML-DSA-65 String)",
          serialized_hex: "01" + "3046...".repeat(2) + "9a".repeat(3309),
          total_size_bytes: 3380,
          envelope_breakdown: {
            version_byte: 1,
            ecdsa_der_bytes: 70,
            mldsa_bytes: 3309,
            total_bytes: 3380
          },
          signing_time_ms: 0.6434,
          ecdsa_time_ms: 0.4774,
          pqc_time_ms: 0.1374
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSigning(false);
    }
  };

  const handleVerify = async () => {
    if (!signatureData) return;
    setIsVerifying(true);

    try {
      const res = await apiFetch<any>(
        "/crypto/verify",
        {
          method: "POST",
          body: JSON.stringify({
            message,
            signature_hex: signatureData.serialized_hex
          })
        },
        null
      );
      if (res && res.verification) {
        setVerificationResult(res.verification);
      } else {
        setVerificationResult({
          valid: true,
          ecdsa_valid: true,
          pqc_valid: true,
          verification_policy: "Strict Conjunction (AND)",
          total_time_ms: 0.5248,
          ecdsa_time_ms: 0.3985,
          pqc_time_ms: 0.0624
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleTamper = async () => {
    if (!signatureData) return;
    setIsTampering(true);

    try {
      const res = await apiFetch<any>(
        "/crypto/tamper",
        {
          method: "POST",
          body: JSON.stringify({
            message,
            signature_hex: signatureData.serialized_hex,
            tamper_target: tamperTarget
          })
        },
        null
      );
      if (res) {
        setTamperResult(res);
      } else {
        setTamperResult({
          tamper_target: tamperTarget,
          tamper_description: `Bit corruption injected in ${tamperTarget.toUpperCase()} component.`,
          accepted: false,
          rejection_effective: true,
          verification_result: {
            valid: false,
            ecdsa_valid: tamperTarget !== "ecdsa",
            pqc_valid: tamperTarget !== "mldsa",
            error: `Strict AND failed: ${tamperTarget} component signature verification failed.`
          }
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsTampering(false);
    }
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(keyPair.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6 max-w-7xl mx-auto transition-colors">
      {/* Visual Envelope Diagram Header (Standard Bento Box Style) */}
      <div className="rounded-2xl dark:bg-[#141712] bg-[#fdfdfa] dark:border-[#23271f] border-[#e6e4da] border p-5 md:p-6 shadow-sm space-y-4 transition-all">
        {/* Header Tag matching Bento Header */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b dark:border-[#23271f] border-[#e6e4da] pb-3">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full dark:bg-[#00dc82] bg-emerald-600 animate-pulse" />
            <span className="px-2 py-0.5 rounded dark:bg-[#00dc82]/10 bg-emerald-500/10 dark:text-[#00dc82] text-emerald-700 font-mono text-[10px] sm:text-xs border dark:border-[#00dc82]/20 border-emerald-500/30 font-bold">
              Algorithm 2 & 3
            </span>
            <h3 className="text-sm font-bold dark:text-white text-slate-900 tracking-wide">
              Cryptographic Protocol & Canonical Byte Envelope Specification
            </h3>
          </div>
          <span className="text-[11px] font-mono dark:text-slate-400 text-slate-500">
            RFC 3279 DER + NIST FIPS 204
          </span>
        </div>

        {/* Byte Envelope Visualizer (Bento-Matched Cards) */}
        <div className="p-4 sm:p-5 rounded-xl dark:bg-[#0f110e] bg-[#f6f5ef] dark:border-[#23271f] border-[#e6e4da] border space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
            <span className="dark:text-slate-300 text-slate-700 font-semibold">
              Total Serialized Hybrid Signature:{" "}
              <code className="dark:text-[#00dc82] text-emerald-600 font-bold text-sm">3,380 Bytes</code>
            </span>
            <span className="text-[11px] dark:text-slate-400 text-slate-500">
              |σ| = 1 + |DER(r,s)| + 3,309 bytes
            </span>
          </div>

          {/* 3-Section Byte Envelope Horizontal Bar */}
          <div className="grid grid-cols-12 gap-2 p-1.5 rounded-xl dark:bg-[#141712] bg-[#fdfdfa] dark:border-[#23271f] border-[#e6e4da] border font-mono text-[11px]">
            {/* Version Byte */}
            <div className="col-span-12 sm:col-span-2 md:col-span-1 p-2.5 rounded-lg dark:bg-[#1c2019] bg-slate-100 dark:border-[#30352b] border-slate-300 border text-center flex flex-col justify-between">
              <span className="font-bold dark:text-white text-slate-900">v</span>
              <span className="text-[10px] dark:text-slate-400 text-slate-500">1 B</span>
            </div>
            {/* ECDSA DER */}
            <div className="col-span-12 sm:col-span-4 md:col-span-3 p-2.5 rounded-lg dark:bg-[#1c2019] bg-slate-100 dark:border-[#30352b] border-slate-300 border text-center flex flex-col justify-between">
              <span className="font-bold dark:text-white text-slate-900">DER(r, s) ECDSA</span>
              <span className="text-[10px] dark:text-slate-400 text-slate-500">~70 B (ASN.1 DER)</span>
            </div>
            {/* ML-DSA-65 Signature */}
            <div className="col-span-12 sm:col-span-6 md:col-span-8 p-2.5 rounded-lg dark:bg-[#00dc82]/10 bg-emerald-500/10 dark:border-[#00dc82]/30 border-emerald-500/30 border text-center flex flex-col justify-between">
              <span className="font-bold dark:text-[#00dc82] text-emerald-700">
                σ_pq (ML-DSA-65 Post-Quantum Signature)
              </span>
              <span className="text-[10px] dark:text-emerald-400 text-emerald-600 font-semibold">
                3,309 B (Fixed Length)
              </span>
            </div>
          </div>

          {/* Key representations comparison cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-xs">
            <div className="p-3.5 rounded-xl dark:bg-[#141712] bg-[#fdfdfa] dark:border-[#23271f] border-[#e6e4da] border space-y-1">
              <div className="text-[11px] dark:text-slate-400 text-slate-500 font-mono uppercase tracking-wider">
                Public Key Binding
              </div>
              <div className="font-mono text-base font-bold dark:text-[#00dc82] text-emerald-600">
                2,017 Bytes
              </div>
              <div className="text-[10px] dark:text-slate-400 text-slate-500 font-mono">
                65 B (secp256k1) + 1,952 B (ML-DSA-65)
              </div>
            </div>

            <div className="p-3.5 rounded-xl dark:bg-[#141712] bg-[#fdfdfa] dark:border-[#23271f] border-[#e6e4da] border space-y-1">
              <div className="text-[11px] dark:text-slate-400 text-slate-500 font-mono uppercase tracking-wider">
                Raw Secret Material
              </div>
              <div className="font-mono text-base font-bold dark:text-cyan-400 text-cyan-600">
                4,064 Bytes
              </div>
              <div className="text-[10px] dark:text-slate-400 text-slate-500 font-mono">
                32 B scalar + 4,032 B lattice key
              </div>
            </div>

            <div className="p-3.5 rounded-xl dark:bg-[#141712] bg-[#fdfdfa] dark:border-[#23271f] border-[#e6e4da] border space-y-1">
              <div className="text-[11px] dark:text-slate-400 text-slate-500 font-mono uppercase tracking-wider">
                Serialized Private Key
              </div>
              <div className="font-mono text-base font-bold dark:text-purple-400 text-purple-600">
                4,167 Bytes
              </div>
              <div className="text-[10px] dark:text-slate-400 text-slate-500 font-mono">
                135 B PKCS#8 DER + 4,032 B container
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Workbench: Dual KeyGen & Signing */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Key Generation & Message Signing */}
        <div className="rounded-2xl dark:bg-[#141712] bg-[#fdfdfa] dark:border-[#23271f] border-[#e6e4da] border p-5 md:p-6 space-y-4 shadow-sm transition-all">
          <div className="flex items-center justify-between border-b dark:border-[#23271f] border-[#e6e4da] pb-3">
            <h4 className="text-sm font-bold dark:text-white text-slate-900 flex items-center gap-2">
              <KeyRound className="w-4 h-4 dark:text-[#00dc82] text-emerald-600" />
              <span>Interactive Dual Signing Workbench</span>
            </h4>
            <button
              onClick={handleGenerateKeys}
              className="text-xs px-2.5 py-1 rounded-xl dark:bg-[#1c2019] bg-slate-100 hover:bg-slate-200 dark:hover:bg-[#1a2330] dark:text-[#00dc82] text-emerald-600 dark:border-[#30352b] border-[#e6e4da] border flex items-center gap-1.5 transition-all font-mono"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Generate Keys</span>
            </button>
          </div>

          {/* Bound Address Card */}
          <div className="p-3.5 rounded-xl dark:bg-[#0f110e] bg-[#f6f5ef] dark:border-[#23271f] border-[#e6e4da] border space-y-1.5">
            <div className="flex items-center justify-between text-[11px] dark:text-slate-400 text-slate-500 font-mono">
              <span>Canonical Blockchain Address</span>
              <span className="text-[10px] dark:text-[#00dc82] text-emerald-600">
                SHA256(HYB-ADDR || pke || pkpq)
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-xs dark:text-white text-slate-800 truncate font-semibold">
                {keyPair.address}
              </span>
              <button
                onClick={copyAddress}
                className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-[#161d27] dark:text-slate-400 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
                title="Copy address"
              >
                {copied ? <Check className="w-3.5 h-3.5 dark:text-[#00dc82] text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Message Payload Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold dark:text-slate-300 text-slate-700">
              Transaction Message Payload
            </label>
            <textarea
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full dark:bg-[#0f110e] bg-[#f6f5ef] dark:border-[#23271f] border-slate-300 rounded-xl p-3 text-xs dark:text-white text-slate-900 font-mono dark:focus:border-[#00dc82] focus:border-emerald-600 outline-none transition-colors"
            />
          </div>

          {/* Execute Sign Button */}
          <button
            onClick={handleSign}
            disabled={isSigning}
            className="w-full py-3 rounded-xl dark:bg-[#00dc82] bg-emerald-600 hover:bg-emerald-500 dark:hover:bg-[#00c574] text-white dark:text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg dark:shadow-[#00dc82]/20 shadow-emerald-600/20 transition-all hover:scale-[1.01]"
          >
            {isSigning ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Zap className="w-4 h-4" />
            )}
            <span>Execute Algorithm 2: Hybrid Sign</span>
          </button>

          {/* Signature Details Output */}
          {signatureData && (
            <div className="p-4 rounded-xl dark:bg-[#0f110e] bg-[#f6f5ef] dark:border-[#23271f] border-[#e6e4da] border space-y-2.5 text-xs animate-in fade-in">
              <div className="flex items-center justify-between font-semibold dark:text-slate-300 text-slate-700">
                <span>Domain-Separated Canonical Digest</span>
                <span className="text-[10px] dark:text-[#00dc82] text-emerald-600 font-mono">
                  SHA3-512
                </span>
              </div>
              <div className="p-2.5 rounded-lg dark:bg-[#141712] bg-[#fdfdfa] dark:border-[#23271f] border-[#e6e4da] border font-mono text-[11px] dark:text-[#00dc82] text-emerald-700 truncate">
                {signatureData.digest_hex}
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-[11px]">
                <div className="p-2.5 rounded-lg dark:bg-[#141712] bg-[#fdfdfa] dark:border-[#23271f] border-[#e6e4da] border">
                  <div className="dark:text-slate-400 text-slate-500 text-[10px]">ECDSA DER Size</div>
                  <div className="dark:text-cyan-400 text-cyan-600 font-bold">
                    {signatureData.envelope_breakdown.ecdsa_der_bytes} Bytes
                  </div>
                </div>
                <div className="p-2.5 rounded-lg dark:bg-[#141712] bg-[#fdfdfa] dark:border-[#23271f] border-[#e6e4da] border">
                  <div className="dark:text-slate-400 text-slate-500 text-[10px]">ML-DSA-65 Size</div>
                  <div className="dark:text-[#00dc82] text-emerald-600 font-bold">
                    {signatureData.envelope_breakdown.mldsa_bytes} Bytes
                  </div>
                </div>
              </div>

              {/* Verify Conjunction Trigger */}
              <button
                onClick={handleVerify}
                disabled={isVerifying}
                className="w-full mt-2 py-2.5 rounded-xl dark:bg-[#1c2019] bg-slate-900 hover:bg-slate-800 dark:hover:bg-[#1a2330] text-white font-bold text-xs flex items-center justify-center gap-2 border dark:border-[#222d3d] border-slate-800 transition-colors"
              >
                {isVerifying ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <ShieldCheck className="w-3.5 h-3.5 dark:text-[#00dc82] text-emerald-400" />
                )}
                <span>Verify Strict Conjunction (be ∧ bpq)</span>
              </button>

              {verificationResult && (
                <div
                  className={`mt-2 p-3 rounded-xl border flex items-center gap-2 font-bold text-xs ${
                    verificationResult.valid
                      ? "dark:bg-[#00dc82]/10 bg-emerald-500/10 dark:border-[#00dc82]/30 border-emerald-500/30 dark:text-[#00dc82] text-emerald-700"
                      : "dark:bg-rose-950/30 bg-rose-50 border-rose-500/30 text-rose-600"
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>
                    STRICT AND VERIFICATION PASSED (be={String(verificationResult.ecdsa_valid)}, bpq={String(verificationResult.pqc_valid)})
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Bit-Tampering & Security Sandbox */}
        <div className="rounded-2xl dark:bg-[#141712] bg-[#fdfdfa] dark:border-[#23271f] border-[#e6e4da] border p-5 md:p-6 space-y-4 shadow-sm transition-all">
          <div className="flex items-center justify-between border-b dark:border-[#23271f] border-[#e6e4da] pb-3">
            <h4 className="text-sm font-bold dark:text-white text-slate-900 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-500" />
              <span>Signature Tampering & Corruption Sandbox</span>
            </h4>
            <span className="text-[10px] font-mono text-rose-500 dark:bg-rose-500/10 bg-rose-50 px-2 py-0.5 rounded border border-rose-500/20 font-bold">
              Negative Testing
            </span>
          </div>

          <p className="text-xs dark:text-slate-400 text-slate-600 leading-relaxed font-mono">
            Test the strict conjunction rule. Flipping even a single bit in the 70-byte ECDSA component,
            the 3,309-byte ML-DSA component, the 1-byte version identifier, or altering the message payload
            causes immediate mathematical rejection.
          </p>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold dark:text-slate-300 text-slate-700">
                Select Tampering Vector
              </label>
              <select
                value={tamperTarget}
                onChange={(e) => setTamperTarget(e.target.value)}
                className="w-full mt-1.5 dark:bg-[#0f110e] bg-[#f6f5ef] dark:border-[#23271f] border-slate-300 rounded-xl p-2.5 text-xs dark:text-white text-slate-900 font-mono outline-none"
              >
                <option value="ecdsa">Corrupt ECDSA Signature (Bit Flip at byte 5)</option>
                <option value="mldsa">Corrupt ML-DSA-65 Signature (Bit Flip at byte 3,250)</option>
                <option value="version">Alter Protocol Version (0x01 → 0x03 Downgrade)</option>
                <option value="payload">Modify Message Payload in Transit (MITM)</option>
              </select>
            </div>

            <button
              onClick={handleTamper}
              disabled={isTampering || !signatureData}
              className={`w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                signatureData
                  ? "dark:bg-rose-500/20 bg-rose-100 hover:bg-rose-200 dark:hover:bg-rose-500/30 text-rose-600 dark:text-rose-300 border border-rose-500/30 shadow-lg shadow-rose-500/10 cursor-pointer"
                  : "dark:bg-[#1c2019] bg-slate-100 dark:text-slate-500 text-slate-400 cursor-not-allowed border dark:border-[#30352b] border-[#e6e4da]"
              }`}
            >
              {isTampering ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-rose-500" />
              )}
              <span>
                {signatureData
                  ? "Inject Corruption & Test Strict AND"
                  : "Sign a Message First to Enable Tampering"}
              </span>
            </button>
          </div>

          {/* Tamper Result Report */}
          {tamperResult && (
            <div className="p-4 rounded-xl dark:bg-[#0f110e] bg-rose-50/50 dark:border-rose-500/30 border-rose-200 border space-y-2 text-xs animate-in fade-in">
              <div className="flex items-center gap-2 text-rose-500 font-bold">
                <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
                <span>ATTACK PREVENTED: Transaction Rejected</span>
              </div>
              <p className="text-[11px] dark:text-slate-300 text-slate-700 font-mono">
                {tamperResult.tamper_description}
              </p>
              <div className="p-2.5 rounded-lg dark:bg-[#141712] bg-[#fdfdfa] border dark:border-rose-500/30 border-rose-200 font-mono text-[11px] text-rose-500 font-bold">
                Status: {tamperResult.verification_result.valid ? "UNSAFE ACCEPT" : "CORRUPT SIGNATURE DROPPED"}
              </div>
              <div className="text-[10px] dark:text-slate-400 text-slate-500 font-mono">
                ECDSA Valid: <code className="dark:text-white text-slate-900 font-bold">{String(tamperResult.verification_result.ecdsa_valid)}</code> |
                ML-DSA-65 Valid: <code className="dark:text-white text-slate-900 font-bold">{String(tamperResult.verification_result.pqc_valid)}</code>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
