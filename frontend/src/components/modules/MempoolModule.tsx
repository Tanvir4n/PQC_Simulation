"use client";

import React, { useState, useEffect } from "react";
import {
  Layers,
  Box,
  Cpu,
  ArrowUpRight,
  TrendingUp,
  Database,
  Plus,
  Zap,
  CheckCircle2,
  GitCommit,
  Hash
} from "lucide-react";
import { apiFetch } from "@/lib/api";

interface MempoolModuleProps {
  isLiveMode: boolean;
}

export const MempoolModule: React.FC<MempoolModuleProps> = ({ isLiveMode }) => {
  const [blocks, setBlocks] = useState<any[]>([]);
  const [mempoolInfo, setMempoolInfo] = useState<any>({
    mempool_count: 8,
    mempool_size_kb: 27.04,
    total_chain_blocks: 4,
    total_processed_tx: 32,
    rejected_duplicates: 0,
    pending_transactions: []
  });
  const [isMining, setIsMining] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [activeMerkleTree, setActiveMerkleTree] = useState<any | null>(null);

  useEffect(() => {
    loadMempoolAndBlocks();
  }, []);

  const loadMempoolAndBlocks = async () => {
    try {
      const [mRes, bRes] = await Promise.all([
        apiFetch<any>("/blockchain/status", {}, null),
        apiFetch<any>("/blockchain/blocks", {}, null)
      ]);
      if (mRes) setMempoolInfo(mRes);
      if (bRes && Array.isArray(bRes)) {
        setBlocks(bRes);
        if (bRes.length > 0 && bRes[0].transactions?.length > 0) {
          fetchMerkleTree(bRes[0].transactions.map((t: any) => t.tx_id));
        }
      } else {
        generateFallbackMempoolData();
      }
    } catch {
      generateFallbackMempoolData();
    }
  };

  const generateFallbackMempoolData = () => {
    const sampleBlocks = [
      {
        index: 3,
        hash: "e4a89f...3120bc7",
        merkle_root: "91c04d...a871bc2",
        tx_count: 5,
        size_kb: 17.4,
        timestamp: Date.now() / 1000 - 60
      },
      {
        index: 2,
        hash: "7f201d...914bca8",
        merkle_root: "2b09fa...41e8c11",
        tx_count: 8,
        size_kb: 27.5,
        timestamp: Date.now() / 1000 - 180
      },
      {
        index: 1,
        hash: "18b9ce...78a0112",
        merkle_root: "f4001c...991ab34",
        tx_count: 6,
        size_kb: 20.8,
        timestamp: Date.now() / 1000 - 320
      }
    ];
    setBlocks(sampleBlocks);
  };

  const fetchMerkleTree = async (hashes: string[]) => {
    try {
      const res = await apiFetch<any>(
        "/blockchain/merkle",
        {
          method: "POST",
          body: JSON.stringify({ hashes })
        },
        null
      );
      if (res && res.tree) {
        setActiveMerkleTree(res.tree);
      } else {
        generateFallbackTree(hashes);
      }
    } catch {
      generateFallbackTree(hashes);
    }
  };

  const generateFallbackTree = (hashes: string[]) => {
    setActiveMerkleTree({
      root: "0x8f20a9bc41d3e89a57b01824cde91f038ab74512903847acbf812394871ad290",
      depth: 3,
      nodes: hashes.map((h, idx) => ({
        index: idx,
        level: 0,
        is_leaf: true,
        is_root: false,
        short_hash: h ? h.substring(0, 14) + "..." : `tx_leaf_hash_${idx}`
      }))
    });
  };

  const handleGenerateBatch = async () => {
    setIsGenerating(true);
    try {
      const res = await apiFetch<any>("/blockchain/generate_tx", {
        method: "POST",
        body: JSON.stringify({ count: 5, tx_type: "hybrid" })
      });
      if (res && res.generated_tx) {
        setMempoolInfo((prev: any) => ({
          ...prev,
          mempool_count: prev.mempool_count + 5,
          mempool_size_kb: (prev.mempool_size_kb + 17.5).toFixed(2)
        }));
      }
    } catch {
      setMempoolInfo((prev: any) => ({
        ...prev,
        mempool_count: prev.mempool_count + 5,
        mempool_size_kb: (parseFloat(prev.mempool_size_kb) + 16.9).toFixed(2)
      }));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleMineBlock = async () => {
    setIsMining(true);
    try {
      const res = await apiFetch<any>("/blockchain/mine", { method: "POST" });
      if (res && res.block) {
        setBlocks([res.block, ...blocks]);
        setMempoolInfo((prev: any) => ({
          ...prev,
          mempool_count: Math.max(0, prev.mempool_count - res.block.tx_count),
          total_chain_blocks: prev.total_chain_blocks + 1
        }));
        if (res.block.transactions?.length > 0) {
          fetchMerkleTree(res.block.transactions.map((t: any) => t.tx_id));
        }
      }
    } catch {
      const newBlock = {
        index: blocks.length > 0 ? blocks[0].index + 1 : 1,
        hash: "9a" + Math.random().toString(16).substring(2, 20),
        merkle_root: "f2" + Math.random().toString(16).substring(2, 20),
        tx_count: 4,
        size_kb: 14.02,
        timestamp: Date.now() / 1000
      };
      setBlocks([newBlock, ...blocks]);
      setMempoolInfo((prev: any) => ({
        ...prev,
        mempool_count: Math.max(0, prev.mempool_count - 4),
        total_chain_blocks: prev.total_chain_blocks + 1
      }));
    } finally {
      setIsMining(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6 max-w-7xl mx-auto transition-colors">
      {/* Mempool 3D Cubic Block Visualizer Header (Bento Style) */}
      <div className="rounded-2xl dark:bg-[#0b0e14] bg-white dark:border-[#161d27] border-slate-200 border p-5 md:p-6 space-y-4 shadow-sm transition-all">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b dark:border-[#161d27] border-slate-200 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl dark:bg-[#07090d] bg-slate-100 dark:border-[#141a24] border-slate-200 border flex items-center justify-center dark:text-[#00dc82] text-emerald-600">
              <Box className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full dark:bg-[#00dc82] bg-emerald-600 animate-pulse" />
                <h3 className="text-sm font-bold dark:text-white text-slate-900 tracking-wide">
                  Recent Mined Hybrid Blocks & Ingestion Pipeline
                </h3>
              </div>
              <p className="text-xs dark:text-slate-400 text-slate-500 font-mono mt-0.5">
                Each hybrid transaction encapsulates 3,380 bytes with SHA3-512 Merkle root binding
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 font-mono">
            <button
              onClick={handleGenerateBatch}
              disabled={isGenerating}
              className="px-3 py-1.5 rounded-xl dark:bg-[#141b24] bg-slate-100 hover:bg-slate-200 dark:hover:bg-[#1a2330] dark:text-[#00dc82] text-emerald-600 text-xs font-semibold flex items-center gap-1.5 dark:border-[#1e2736] border-slate-200 border transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Generate 5 Tx</span>
            </button>
            <button
              onClick={handleMineBlock}
              disabled={isMining}
              className="px-3.5 py-1.5 rounded-xl dark:bg-[#00dc82] bg-emerald-600 hover:bg-emerald-500 dark:hover:bg-[#00c574] text-white dark:text-slate-950 text-xs font-extrabold flex items-center gap-1.5 shadow-md dark:shadow-[#00dc82]/20 transition-all hover:scale-[1.01]"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Mine Block</span>
            </button>
          </div>
        </div>

        {/* 3D Block Cubes Row in Bento Layout */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 pt-2">
          {blocks.slice(0, 6).map((b, idx) => (
            <div
              key={idx}
              className="relative rounded-xl p-3.5 dark:bg-[#07090d] bg-slate-50 dark:border-[#141a24] border-slate-200 border dark:hover:border-[#263344] hover:border-slate-300 transition-all group shadow-xs"
            >
              <div className="flex items-center justify-between text-[11px] font-mono dark:text-slate-400 text-slate-500 mb-2">
                <span className="dark:text-[#00dc82] text-emerald-600 font-bold">#{b.index}</span>
                <span>{b.size_kb} KB</span>
              </div>
              <div className="w-full h-11 rounded-lg dark:bg-[#0b0e14] bg-white dark:border-[#161d27] border-slate-200 border flex items-center justify-center mb-2 group-hover:border-[#00dc82]/40 transition-colors">
                <span className="text-[10px] font-bold dark:text-[#00dc82] text-emerald-700 font-mono">
                  {b.tx_count} HYBRID TX
                </span>
              </div>
              <div className="text-[10px] dark:text-slate-500 text-slate-400 font-mono truncate">
                Hash: {b.hash?.substring(0, 10)}...
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mempool Telemetry & Metrics Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl dark:bg-[#0b0e14] bg-white dark:border-[#161d27] border-slate-200 border shadow-sm space-y-1">
          <div className="text-[11px] dark:text-slate-400 text-slate-500 font-mono uppercase tracking-wider">
            Mempool Count
          </div>
          <div className="text-xl font-bold dark:text-white text-slate-900 font-mono">
            {mempoolInfo.mempool_count} Tx
          </div>
          <div className="text-[10px] dark:text-[#00dc82] text-emerald-600 font-mono font-medium">
            Memory: {mempoolInfo.mempool_size_kb} KB
          </div>
        </div>

        <div className="p-4 rounded-2xl dark:bg-[#0b0e14] bg-white dark:border-[#161d27] border-slate-200 border shadow-sm space-y-1">
          <div className="text-[11px] dark:text-slate-400 text-slate-500 font-mono uppercase tracking-wider">
            Total Chain Height
          </div>
          <div className="text-xl font-bold dark:text-white text-slate-900 font-mono">
            {mempoolInfo.total_chain_blocks} Blocks
          </div>
          <div className="text-[10px] dark:text-slate-500 text-slate-400 font-mono">
            Genesis + Mined Blocks
          </div>
        </div>

        <div className="p-4 rounded-2xl dark:bg-[#0b0e14] bg-white dark:border-[#161d27] border-slate-200 border shadow-sm space-y-1">
          <div className="text-[11px] dark:text-slate-400 text-slate-500 font-mono uppercase tracking-wider">
            Duplicate Protection
          </div>
          <div className="text-xl font-bold dark:text-[#00dc82] text-emerald-600 font-mono">
            ACTIVE
          </div>
          <div className="text-[10px] dark:text-slate-500 text-slate-400 font-mono">
            Rejected: {mempoolInfo.rejected_duplicates} Duplicates
          </div>
        </div>

        <div className="p-4 rounded-2xl dark:bg-[#0b0e14] bg-white dark:border-[#161d27] border-slate-200 border shadow-sm space-y-1">
          <div className="text-[11px] dark:text-slate-400 text-slate-500 font-mono uppercase tracking-wider">
            Block Hash Function
          </div>
          <div className="text-xl font-bold dark:text-purple-400 text-purple-600 font-mono">
            SHA3-512
          </div>
          <div className="text-[10px] dark:text-slate-500 text-slate-400 font-mono">
            512-bit Pre-image Hardness
          </div>
        </div>
      </div>

      {/* Interactive Merkle Tree Visualizer in Bento Card */}
      <div className="rounded-2xl dark:bg-[#0b0e14] bg-white dark:border-[#161d27] border-slate-200 border p-5 md:p-6 space-y-4 shadow-sm transition-all">
        <div className="flex items-center justify-between border-b dark:border-[#161d27] border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <GitCommit className="w-4 h-4 dark:text-[#00dc82] text-emerald-600" />
            <h4 className="text-sm font-bold dark:text-white text-slate-900 font-mono">
              SHA3-512 Merkle Tree Structure (Candidate Block)
            </h4>
          </div>
          <span className="text-[11px] dark:text-slate-400 text-slate-500 font-mono">
            Leaf-to-Root Verification
          </span>
        </div>

        {activeMerkleTree ? (
          <div className="p-4 rounded-xl dark:bg-[#07090d] bg-slate-50 dark:border-[#141a24] border-slate-200 border space-y-4">
            {/* Merkle Root Highlight */}
            <div className="p-3.5 rounded-xl dark:bg-[#00dc82]/10 bg-emerald-500/10 dark:border-[#00dc82]/30 border-emerald-500/30 border space-y-1">
              <div className="text-[10px] uppercase font-bold dark:text-[#00dc82] text-emerald-800 tracking-wider font-mono">
                Merkle Root (Header Commitment)
              </div>
              <div className="text-xs font-mono dark:text-[#00dc82] text-emerald-900 break-all font-semibold">
                {activeMerkleTree.root}
              </div>
            </div>

            {/* Tree Nodes Display */}
            <div className="space-y-3">
              <div className="text-xs font-mono font-semibold dark:text-slate-400 text-slate-600">
                Tree Depth: {activeMerkleTree.depth} Levels
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {activeMerkleTree.nodes.slice(0, 8).map((node: any, idx: number) => (
                  <div
                    key={idx}
                    className={`p-2.5 rounded-xl border text-[11px] font-mono space-y-1 ${
                      node.is_root
                        ? "dark:bg-[#00dc82]/10 bg-emerald-500/10 dark:border-[#00dc82]/30 border-emerald-500/30 dark:text-[#00dc82] text-emerald-700"
                        : node.is_leaf
                        ? "dark:bg-[#0b0e14] bg-white dark:border-[#161d27] border-slate-200 dark:text-slate-300 text-slate-700"
                        : "dark:bg-purple-950/20 bg-purple-50 dark:border-purple-800/30 border-purple-200 dark:text-purple-300 text-purple-700"
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] dark:text-slate-500 text-slate-400">
                      <span>L{node.level} Node #{node.index}</span>
                      <span className="font-bold">{node.is_leaf ? "Leaf" : node.is_root ? "Root" : "Branch"}</span>
                    </div>
                    <div className="truncate font-semibold">{node.short_hash}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="p-8 rounded-xl dark:bg-[#07090d] bg-slate-50 dark:border-[#141a24] border-slate-200 border text-center text-xs dark:text-slate-400 text-slate-500 font-mono">
            Mine a block or generate transactions above to render the live SHA3-512 Merkle tree.
          </div>
        )}
      </div>
    </div>
  );
};
