"use client";

import React from "react";
import { X, ExternalLink, Shield, KeyRound, Cpu, Layers, Zap, Info, CheckCircle2, Lock } from "lucide-react";
import { ArchitectureNodeDetail } from "@/lib/architectureData";

interface NodeInspectorDrawerProps {
  node: ArchitectureNodeDetail | null;
  onClose: () => void;
}

export const NodeInspectorDrawer: React.FC<NodeInspectorDrawerProps> = ({ node, onClose }) => {
  if (!node) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white dark:bg-[#0b0e14] border-l border-[#E6E8E5] dark:border-[#1e2736] shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="p-5 border-b border-[#E6E8E5] dark:border-[#161d27] flex items-center justify-between shrink-0 bg-[#F8F8F5]/80 dark:bg-[#121721]/80 backdrop-blur-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#00dc82]/10 border border-[#00dc82]/25 flex items-center justify-center text-[#00dc82]">
            <Info className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] font-mono uppercase text-[#777B78] font-bold">
              {node.category.toUpperCase().replace("_", " ")}
            </div>
            <h3 className="text-base font-extrabold text-[#202124] dark:text-white leading-tight">
              {node.name}
            </h3>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-[#1f2937] text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs font-mono">
        {/* Standard & Citation Banner */}
        <div className="p-3.5 rounded-2xl bg-[#F8F8F5] dark:bg-[#121721] border border-[#E6E8E5] dark:border-[#1e2736] flex items-center justify-between">
          <div>
            <span className="text-[10px] text-[#777B78] block">STANDARD / SPECIFICATION</span>
            <span className="text-xs font-bold text-[#00dc82]">{node.standard || "Protocol Native"}</span>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-[#777B78] block">PAPER CITATION</span>
            <span className="text-xs font-bold text-[#202124] dark:text-white">{node.paperSection}</span>
          </div>
        </div>

        {/* Mathematical Formulation (if applicable) */}
        {node.mathematicalFormula && (
          <div className="space-y-1.5">
            <div className="text-[11px] font-bold text-[#777B78] uppercase">MATHEMATICAL SPECIFICATION</div>
            <div className="p-3.5 rounded-2xl bg-slate-900 text-[#00dc82] border border-slate-800 font-mono text-xs overflow-x-auto shadow-inner">
              {node.mathematicalFormula}
            </div>
          </div>
        )}

        {/* Purpose */}
        <div className="space-y-1.5">
          <div className="text-[11px] font-bold text-[#777B78] uppercase">PURPOSE & SYSTEM ROLE</div>
          <p className="text-slate-700 dark:text-slate-300 font-sans leading-relaxed text-xs">
            {node.purpose}
          </p>
        </div>

        {/* Inputs & Outputs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3 rounded-2xl bg-[#F8F8F5] dark:bg-[#121721] border border-[#E6E8E5] dark:border-[#1e2736] space-y-1.5">
            <span className="text-[10px] font-bold text-[#777B78] uppercase block">INPUT PARAMETERS</span>
            <ul className="space-y-1">
              {node.inputs.map((inp, idx) => (
                <li key={idx} className="text-[11px] text-slate-800 dark:text-slate-300 flex items-start gap-1">
                  <span className="text-cyan-500 font-bold">•</span>
                  <span>{inp}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-3 rounded-2xl bg-[#F8F8F5] dark:bg-[#121721] border border-[#E6E8E5] dark:border-[#1e2736] space-y-1.5">
            <span className="text-[10px] font-bold text-[#777B78] uppercase block">GENERATED OUTPUTS</span>
            <ul className="space-y-1">
              {node.outputs.map((out, idx) => (
                <li key={idx} className="text-[11px] text-slate-800 dark:text-slate-300 flex items-start gap-1">
                  <span className="text-emerald-500 font-bold">•</span>
                  <span>{out}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Processing Steps */}
        <div className="space-y-2">
          <div className="text-[11px] font-bold text-[#777B78] uppercase">INTERNAL PROCESSING PIPELINE</div>
          <div className="space-y-1.5">
            {node.processing.map((step, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-xl bg-white dark:bg-[#07090d] border border-[#E6E8E5] dark:border-[#161d27] flex items-start gap-2"
              >
                <span className="w-4 h-4 rounded-full bg-[#00dc82]/15 text-[#00dc82] text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="text-[11px] text-slate-700 dark:text-slate-300 leading-snug">
                  {step}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Security Relevance */}
        <div className="p-3.5 rounded-2xl bg-amber-500/10 dark:bg-amber-500/5 border border-amber-500/25 space-y-1">
          <div className="flex items-center gap-1.5 text-amber-700 dark:text-amber-400 font-bold text-xs">
            <Shield className="w-3.5 h-3.5" />
            <span>SECURITY RELEVANCE</span>
          </div>
          <p className="text-[11px] text-slate-700 dark:text-slate-300 font-sans leading-relaxed">
            {node.securityRelevance}
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-[#E6E8E5] dark:border-[#161d27] bg-[#F8F8F5] dark:bg-[#07090d] flex items-center justify-between text-[11px] text-[#777B78] shrink-0 font-mono">
        <span>Md. Tanvir Hasan</span>
        <span>Daffodil International University</span>
      </div>
    </div>
  );
};

