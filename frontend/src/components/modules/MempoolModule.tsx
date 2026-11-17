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
      if (res) setActiveMerkleTree(res);
    } catch (e) {
      console.error(e);
    }
  };

  const handleGenerateBatch = async () => {
    setIsGenerating(true);
    try {
      await apiFetch<any>("/blockchain/generate-batch", { method: "POST" }, null);
      await loadMempoolAndBlocks();
    } catch {
      setMempoolInfo((prev: any) => ({
        ...prev,
        mempool_count: prev.mempool_count + 5,
        mempool_size_kb: (prev.mempool_count + 5) * 3.38
      }));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleMineBlock = async () => {
    setIsMining(true);
    try {
      await apiFetch<any>("/blockchain/mine", { method: "POST" }, null);
      await loadMempoolAndBlocks();
    } catch {
      // Mock mined block
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
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Mempool.space Style 3D Cubic Block Visualizer Header (Matching User Image 2) */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center">
              <Box className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide">
                Recent Mined Hybrid Blocks & Ingestion Pipeline
              </h3>
              <p className="text-xs text-slate-400">
                Each hybrid transaction encapsulates 3,380 bytes with SHA3-512 Merkle root binding
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleGenerateBatch}
              disabled={isGenerating}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-teal-300 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Generate 5 Tx</span>
            </button>
            <button
              onClick={handleMineBlock}
              disabled={isMining}
              className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-md shadow-teal-500/20 transition-all"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Mine Candidate Block</span>
            </button>
          </div>
        </div>

        {/* 3D Block Cubes Row (Inspired by Mempool.space) */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 pt-2">
          {blocks.slice(0, 6).map((b, idx) => (
            <div
              key={idx}
              className="relative rounded-xl p-3 bg-gradient-to-br from-slate-900 via-slate-900 to-[#101b2b] border border-slate-800 hover:border-teal-500/40 transition-all group shadow-md"
            >
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-2">
                <span className="text-teal-400 font-bold">#{b.index}</span>
                <span>{b.size_kb} KB</span>
              </div>
              <div className="w-full h-10 rounded bg-gradient-to-r from-cyan-600/30 via-teal-600/40 to-purple-600/30 border border-teal-500/30 flex items-center justify-center mb-2">
                <span className="text-[10px] font-bold text-white font-mono">
                  {b.tx_count} HYBRID TX
                </span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono truncate">
                Hash: {b.hash?.substring(0, 10)}...
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mempool Telemetry & Metrics Strip (Image 2 style) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
          <div className="text-[11px] text-slate-400 font-medium">Mempool Count</div>
          <div className="text-xl font-bold text-white font-mono">
            {mempoolInfo.mempool_count} Transactions
          </div>
          <div className="text-[10px] text-teal-400">Memory: {mempoolInfo.mempool_size_kb} KB</div>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
          <div className="text-[11px] text-slate-400 font-medium">Total Chain Height</div>
          <div className="text-xl font-bold text-white font-mono">
            {mempoolInfo.total_chain_blocks} Blocks
          </div>
          <div className="text-[10px] text-slate-400">Genesis + Mined Blocks</div>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
          <div className="text-[11px] text-slate-400 font-medium">Duplicate Protection</div>
          <div className="text-xl font-bold text-emerald-400 font-mono">ACTIVE</div>
          <div className="text-[10px] text-slate-400">
            Rejected: {mempoolInfo.rejected_duplicates} Duplicates
          </div>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
          <div className="text-[11px] text-slate-400 font-medium">Block Hash Function</div>
          <div className="text-xl font-bold text-purple-400 font-mono">SHA3-512</div>
          <div className="text-[10px] text-slate-400">512-bit Pre-image Hardness</div>
        </div>
      </div>

      {/* Interactive Merkle Tree Visualizer */}
      <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <GitCommit className="w-4 h-4 text-teal-400" />
            <h4 className="text-sm font-bold text-white">
              SHA3-512 Merkle Tree Structure (Candidate Block)
            </h4>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">
            Leaf-to-Root Verification
          </span>
        </div>

        {activeMerkleTree ? (
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
            {/* Merkle Root Highlight */}
            <div className="p-3 rounded-lg bg-teal-950/40 border border-teal-500/40 space-y-1">
              <div className="text-[10px] uppercase font-bold text-teal-400 tracking-wider">
                Merkle Root (Header Commitment)
              </div>
              <div className="text-xs font-mono text-teal-200 break-all">
                {activeMerkleTree.root}
              </div>
            </div>

            {/* Tree Nodes Display */}
            <div className="space-y-3">
              <div className="text-xs font-semibold text-slate-400">Tree Depth: {activeMerkleTree.depth} Levels</div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {activeMerkleTree.nodes.slice(0, 8).map((node: any, idx: number) => (
                  <div
                    key={idx}
                    className={`p-2.5 rounded-lg border text-[11px] font-mono space-y-1 ${
                      node.is_root
                        ? "bg-teal-950/40 border-teal-500/40 text-teal-200"
                        : node.is_leaf
                        ? "bg-slate-900 border-slate-800 text-slate-300"
                        : "bg-purple-950/30 border-purple-800/40 text-purple-200"
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span>L{node.level} Node #{node.index}</span>
                      <span>{node.is_leaf ? "Leaf" : node.is_root ? "Root" : "Branch"}</span>
                    </div>
                    <div className="text-slate-200 truncate">{node.short_hash}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="p-8 rounded-xl bg-slate-950/50 border border-slate-800/80 text-center text-xs text-slate-400">
            Mine a block or generate transactions above to render the live SHA3-512 Merkle tree.
          </div>
        )}
      </div>
    </div>
  );
};

