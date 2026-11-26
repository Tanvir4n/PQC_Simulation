"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  Handle,
  Position,
  Node,
  Edge,
  NodeProps,
  ReactFlowInstance,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import {
  Network,
  Radio,
  Send,
  CheckCircle2,
  XCircle,
  Clock,
  RefreshCw,
  Eye,
  Maximize2,
  ArrowRight,
  ShieldAlert,
  SlidersHorizontal,
} from "lucide-react";
import { apiFetch } from "@/lib/api";
import { useTheme } from "@/lib/theme";

interface NetworkModuleProps {
  isLiveMode: boolean;
}

interface P2PNodeData extends Record<string, unknown> {
  label: string;
  nodeType: "classical" | "hybrid" | "pqc";
  isSelected: boolean;
  isSender: boolean;
  isReceiver: boolean;
  isPath: boolean;
  isRejectedDest: boolean;
  dimmed: boolean;
}

/**
 * Custom circular P2P node with invisible centered handles so edges connect smoothly
 * without visual clutter, plus role badges (SRC / DST) and status halos.
 */
const P2PNode: React.FC<NodeProps> = ({ data }) => {
  const d = data as unknown as P2PNodeData;

  const palette =
    d.nodeType === "hybrid"
      ? {
          ring: "border-[#2e7d4f] dark:border-[#5fca8c]",
          bg: "bg-[#eef7f1] dark:bg-[#0f2217]",
          text: "text-[#1f5e3b] dark:text-[#7de0a5]",
          glow: "shadow-[0_0_16px_rgba(46,125,79,0.45)] dark:shadow-[0_0_16px_rgba(95,202,140,0.45)]",
        }
      : d.nodeType === "pqc"
      ? {
          ring: "border-[#6b5ce7] dark:border-[#a78bfa]",
          bg: "bg-[#f2effd] dark:bg-[#19142c]",
          text: "text-[#4c3ec4] dark:text-[#c4b5fd]",
          glow: "shadow-[0_0_16px_rgba(107,92,231,0.45)] dark:shadow-[0_0_16px_rgba(167,139,250,0.45)]",
        }
      : {
          ring: "border-[#0284c7] dark:border-[#38bdf8]",
          bg: "bg-[#e9f4fd] dark:bg-[#0c1c2a]",
          text: "text-[#0369a1] dark:text-[#7dd3fc]",
          glow: "shadow-[0_0_16px_rgba(2,132,199,0.4)] dark:shadow-[0_0_16px_rgba(56,189,248,0.4)]",
        };

  const highlightRing = d.isRejectedDest
    ? "ring-3 ring-rose-500 border-rose-500 shadow-[0_0_18px_rgba(244,63,94,0.65)] scale-115 z-20"
    : d.isSender || d.isReceiver
    ? "ring-3 ring-[#4a59cc] dark:ring-[#8c9bff] scale-115 z-20"
    : d.isPath
    ? "ring-2 ring-amber-500 scale-110 z-10"
    : d.isSelected
    ? `ring-2 ring-offset-2 ring-offset-[#fbfaf6] dark:ring-offset-[#0f110e] ${palette.glow} scale-110 z-10`
    : "hover:scale-110";

  return (
    <div
      className={`relative w-[34px] h-[34px] rounded-full border-[1.75px] flex items-center justify-center font-mono text-[9.5px] font-bold select-none transition-all duration-200 cursor-pointer ${
        palette.bg
      } ${palette.ring} ${palette.text} ${highlightRing} ${
        d.dimmed ? "opacity-20 grayscale" : "opacity-100"
      }`}
    >
      <Handle
        type="target"
        position={Position.Top}
        style={{
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          opacity: 0,
          pointerEvents: "none",
        }}
      />
      <span>{d.label}</span>
      {(d.isSender || d.isReceiver) && (
        <span
          className={`absolute -top-2.5 px-1 py-[1px] rounded text-[7px] font-extrabold tracking-wider uppercase shadow-xs ${
            d.isRejectedDest
              ? "bg-rose-600 text-white"
              : d.isSender
              ? "bg-[#4a59cc] text-white"
              : "bg-[#2e7d4f] text-white"
          }`}
        >
          {d.isSender ? "SRC" : "DST"}
        </span>
      )}
      <Handle
        type="source"
        position={Position.Bottom}
        style={{
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          opacity: 0,
          pointerEvents: "none",
        }}
      />
    </div>
  );
};

// Module-level registration prevents React Flow warning #002
const nodeTypes = { p2p: P2PNode };

const PRESETS = [
  { id: "p1", label: "P1 · Classical", c: 100, h: 0, p: 0 },
  { id: "p3", label: "P3 · 50/50 Parity", c: 50, h: 50, p: 0 },
  { id: "p5", label: "P5 · Quorum", c: 10, h: 70, p: 20 },
  { id: "p7", label: "P7 · Full PQC", c: 0, h: 20, p: 80 },
];

export const NetworkModule: React.FC<NetworkModuleProps> = ({ isLiveMode }) => {
  const { isDark } = useTheme();
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null);
  const [viewMode, setViewMode] = useState<"realtime" | "simulation">("simulation");
  const [nodesData, setNodesData] = useState<any[]>([]);
  const [edgesData, setEdgesData] = useState<any[]>([]);
  const [composition, setComposition] = useState({ classical: 50, hybrid: 50, pqc: 0 });
  const [selectedNode, setSelectedNode] = useState<any | null>(null);
  const [filterType, setFilterType] = useState<"all" | "classical" | "hybrid" | "pqc">("all");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Routing test state
  const [senderId, setSenderId] = useState<number>(0);
  const [receiverId, setReceiverId] = useState<number>(50);
  const [txType, setTxType] = useState<string>("hybrid");
  const [routingResult, setRoutingResult] = useState<any | null>(null);
  const [isRouting, setIsRouting] = useState<boolean>(false);

  // Composition ratios
  const [activePreset, setActivePreset] = useState<string>("p3");

  const generateFallbackTopology = useCallback((c: number, h: number, p: number) => {
    const total = 100;
    const sum = c + h + p || 100;
    const cCount = Math.round((c / sum) * total);
    const hCount = Math.round((h / sum) * total);
    const pCount = total - cCount - hCount;

    const types: ("classical" | "hybrid" | "pqc")[] = [
      ...Array(cCount).fill("classical"),
      ...Array(hCount).fill("hybrid"),
      ...Array(pCount).fill("pqc"),
    ];
    // Deterministic interleave so clusters stay visually mixed
    const mixedTypes = types.map((_, idx) => types[(idx * 37) % total]);

    const numClusters = 5;
    const clusterCenters = Array.from({ length: numClusters }, (_, idx) => ({
      cx: 480 + 360 * Math.cos((2 * Math.PI * idx) / numClusters),
      cy: 380 + 360 * Math.sin((2 * Math.PI * idx) / numClusters),
    }));

    const nodes: any[] = [];
    const edges: any[] = [];

    for (let i = 0; i < total; i++) {
      const cluster = clusterCenters[i % numClusters];
      const radius = 58 + Math.floor(i / numClusters) * 16;
      const angle = ((i * 137.5) * Math.PI) / 180;
      const x = Math.round((cluster.cx + radius * Math.cos(angle)) * 10) / 10;
      const y = Math.round((cluster.cy + radius * Math.sin(angle)) * 10) / 10;
      const type = mixedTypes[i];

      nodes.push({
        id: `node-${i}`,
        numeric_id: i,
        type,
        position: { x, y },
        ip: `192.168.${Math.floor(i / 25) + 1}.${(i % 25) + 10}`,
        address: `0x${(i + 10).toString(16).padStart(4, "0")}b9${(i * 97 + 13)
          .toString(16)
          .padStart(6, "0")}e4a21`,
        processed_tx: 48 + (i % 15) * 7,
        rejected_tx: type === "classical" ? 12 + (i % 5) : 0,
        peers: [(i + 1) % total, (i + 5) % total, (i + 17) % total],
      });

      const candidates = [(i + 1) % total, (i + 5) % total, (i + 17) % total];
      for (const target of candidates) {
        if (target > i) {
          edges.push({
            id: `e${i}-${target}`,
            source: `node-${i}`,
            target: `node-${target}`,
            delay_ms: 1.4 + ((i + target) % 9) * 0.35,
          });
        }
      }
    }

    setNodesData(nodes);
    setEdgesData(edges);
    setComposition({ classical: cCount, hybrid: hCount, pqc: pCount });
    setSelectedNode(nodes[0] || null);
    setIsLoading(false);
  }, []);

  const loadTopology = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await apiFetch<any>("/network/topology", {}, null);
      if (data?.nodes?.length) {
        setNodesData(data.nodes);
        setEdgesData(data.edges || []);
        setComposition(data.composition || { classical: 50, hybrid: 50, pqc: 0 });
        setSelectedNode(data.nodes[0] || null);
        setIsLoading(false);
      } else {
        generateFallbackTopology(50, 50, 0);
      }
    } catch {
      generateFallbackTopology(50, 50, 0);
    }
  }, [generateFallbackTopology]);

  useEffect(() => {
    loadTopology();
  }, [loadTopology]);

  // Refit view cleanly whenever node list updates
  useEffect(() => {
    if (rfInstance && nodesData.length > 0) {
      const timer = window.setTimeout(() => {
        rfInstance.fitView({ padding: 0.14, duration: 350 });
      }, 60);
      return () => window.clearTimeout(timer);
    }
  }, [rfInstance, nodesData]);

  const handleApplyPreset = async (presetId: string, c: number, h: number, p: number) => {
    setActivePreset(presetId);
    setRoutingResult(null);
    setFilterType("all");
    try {
      const res = await apiFetch<any>(
        "/network/update-ratios",
        {
          method: "POST",
          body: JSON.stringify({
            classical_pct: c / 100,
            hybrid_pct: h / 100,
            pqc_pct: p / 100,
          }),
        },
        null
      );
      if (res?.nodes?.length) {
        setNodesData(res.nodes);
        setEdgesData(res.edges || []);
        setComposition(res.composition);
        setSelectedNode(res.nodes[0] || null);
      } else {
        generateFallbackTopology(c, h, p);
      }
    } catch {
      generateFallbackTopology(c, h, p);
    }
  };

  const executeRoute = async (sId: number, rId: number, fmt: string) => {
    setIsRouting(true);
    setRoutingResult(null);

    try {
      const res = await apiFetch<any>(
        "/network/route",
        {
          method: "POST",
          body: JSON.stringify({
            sender_id: sId,
            receiver_id: rId,
            tx_type: fmt,
          }),
        },
        null
      );

      if (res && Array.isArray(res.path)) {
        setRoutingResult(res);
      } else {
        // BFS shortest path locally as fallback
        const adj = new Map<number, number[]>();
        nodesData.forEach((n) => adj.set(n.numeric_id, n.peers || []));
        const queue: number[][] = [[sId]];
        const visited = new Set<number>([sId]);
        let path: number[] = [sId, rId];

        while (queue.length > 0) {
          const cur = queue.shift()!;
          const tail = cur[cur.length - 1];
          if (tail === rId) {
            path = cur;
            break;
          }
          for (const nb of adj.get(tail) || []) {
            if (!visited.has(nb)) {
              visited.add(nb);
              queue.push([...cur, nb]);
            }
          }
        }

        const hops: any[] = [];
        let ok = true;
        let reason: string | null = null;
        for (let i = 0; i < path.length - 1; i++) {
          const dst = nodesData.find((n) => n.numeric_id === path[i + 1]);
          if ((fmt === "hybrid" || fmt === "pqc") && dst?.type === "classical") {
            ok = false;
            reason = `Asymmetric Policy Reject: Classical node #${dst.numeric_id} cannot parse ML-DSA-65 signature.`;
            hops.push({ from: path[i], to: path[i + 1], status: "REJECTED", reason });
            break;
          }
          hops.push({
            from: path[i],
            to: path[i + 1],
            status: "ACCEPTED",
            latency_ms: 1.42 + (i % 3) * 0.35,
          });
        }

        setRoutingResult({
          success: ok,
          path: path.map((id) => `node-${id}`),
          numeric_path: path,
          hops,
          total_hops: Math.max(1, path.length - 1),
          total_latency_ms: Number(
            hops.reduce((acc, h) => acc + (h.latency_ms || 1.2), 0).toFixed(2)
          ),
          rejection_reason: reason,
        });
      }
    } catch {
      // ignore
    } finally {
      setIsRouting(false);
    }
  };

  const runQuickScenario = (srcType: string, dstType: string, fmt: string) => {
    const src = nodesData.find((n) => n.type === srcType) ?? nodesData[0];
    const dst =
      nodesData.find((n) => n.type === dstType && n.numeric_id !== src?.numeric_id) ??
      nodesData[nodesData.length - 1];
    if (!src || !dst) return;
    setSenderId(src.numeric_id);
    setReceiverId(dst.numeric_id);
    setTxType(fmt);
    setSelectedNode(dst);
    executeRoute(src.numeric_id, dst.numeric_id, fmt);
  };

  // React Flow Nodes & Edges
  const flowNodes: Node[] = useMemo(() => {
    const pathArr: string[] = routingResult?.path || [];
    const routeSender = pathArr[0];
    const routeReceiver = routingResult ? pathArr[pathArr.length - 1] : undefined;
    const isRejected = routingResult && !routingResult.success;

    return nodesData.map((n) => {
      // Support both backend (`position: { x, y }`) and legacy (`x, y`) shapes cleanly
      const x = typeof n.position?.x === "number" ? n.position.x : Number(n.x ?? 0);
      const y = typeof n.position?.y === "number" ? n.position.y : Number(n.y ?? 0);

      const isSelected = selectedNode?.id === n.id;
      const isPath = pathArr.includes(n.id);
      const isSender = routeSender === n.id;
      const isReceiver = routeReceiver === n.id;
      const isRejectedDest = Boolean(isRejected && isReceiver);
      const dimmed = filterType !== "all" && n.type !== filterType && !isPath && !isSelected;

      return {
        id: n.id,
        type: "p2p",
        position: { x, y },
        draggable: false,
        data: {
          label: `#${n.numeric_id < 10 ? "0" + n.numeric_id : n.numeric_id}`,
          nodeType: n.type,
          isSelected,
          isSender,
          isReceiver,
          isPath,
          isRejectedDest,
          dimmed,
        } satisfies P2PNodeData,
      };
    });
  }, [nodesData, selectedNode, routingResult, filterType]);

  const flowEdges: Edge[] = useMemo(() => {
    const pathNumeric: number[] = routingResult?.numeric_path || [];
    const pathPairs = new Map<string, "accepted" | "rejected">();

    if (routingResult?.hops) {
      for (const h of routingResult.hops) {
        const key1 = `node-${h.from}|node-${h.to}`;
        const key2 = `node-${h.to}|node-${h.from}`;
        const state = h.status === "REJECTED" ? "rejected" : "accepted";
        pathPairs.set(key1, state);
        pathPairs.set(key2, state);
      }
    } else if (pathNumeric.length > 1) {
      for (let i = 0; i < pathNumeric.length - 1; i++) {
        const key1 = `node-${pathNumeric[i]}|node-${pathNumeric[i + 1]}`;
        const key2 = `node-${pathNumeric[i + 1]}|node-${pathNumeric[i]}`;
        pathPairs.set(key1, routingResult?.success ? "accepted" : "rejected");
        pathPairs.set(key2, routingResult?.success ? "accepted" : "rejected");
      }
    }

    const idleStroke = isDark ? "#2d3328" : "#d8d4c7";

    return edgesData.slice(0, 180).map((e) => {
      const pairState = pathPairs.get(`${e.source}|${e.target}`);
      const isRejectedEdge = pairState === "rejected";
      const isAcceptedEdge = pairState === "accepted";
      const isActiveEdge = isRejectedEdge || isAcceptedEdge;

      return {
        id: e.id,
        source: e.source,
        target: e.target,
        animated: isActiveEdge || viewMode === "realtime",
        zIndex: isActiveEdge ? 10 : 0,
        style: {
          stroke: isRejectedEdge
            ? "#e11d48"
            : isAcceptedEdge
            ? isDark
              ? "#5fca8c"
              : "#2e7d4f"
            : idleStroke,
          strokeWidth: isActiveEdge ? 2.6 : 1,
          strokeDasharray: isRejectedEdge ? "5 4" : undefined,
          opacity: isActiveEdge ? 1 : filterType === "all" ? (isDark ? 0.55 : 0.7) : 0.18,
        },
      };
    });
  }, [edgesData, routingResult, viewMode, isDark, filterType]);

  return (
    <div className="p-2 sm:p-4 space-y-4 max-w-7xl mx-auto transition-colors">
      {/* 1. Top Controls & Interactive Composition Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 px-4 rounded-2xl dark:bg-[#141712] bg-[#fdfdfa] dark:border-[#23271f] border-[#e6e4da] border shadow-xs">
        {/* Left: Real time vs Simulation Toggle */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center gap-1 p-1 dark:bg-[#0f110e] bg-[#f6f5ef] rounded-full dark:border-[#23271f] border-[#e6e4da] border font-mono">
            <button
              onClick={() => setViewMode("realtime")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all ${
                viewMode === "realtime"
                  ? "bg-[#eef7f1] dark:bg-[#5fca8c]/15 text-[#2e7d4f] dark:text-[#5fca8c] border border-[#a9cfb2] dark:border-[#5fca8c]/30 font-semibold"
                  : "dark:text-[#6f6d64] text-[#9a978c] hover:text-[#1d1d1a] dark:hover:text-[#ecebe4]"
              }`}
            >
              <Radio className={`w-3 h-3 ${viewMode === "realtime" ? "animate-pulse" : ""}`} />
              <span>Live Mesh</span>
            </button>
            <button
              onClick={() => setViewMode("simulation")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all ${
                viewMode === "simulation"
                  ? "bg-[#fdfdfa] dark:bg-[#1c2019] text-[#1d1d1a] dark:text-[#ecebe4] border dark:border-[#30352b] border-[#d9d6ca] font-semibold shadow-xs"
                  : "dark:text-[#6f6d64] text-[#9a978c] hover:text-[#1d1d1a] dark:hover:text-[#ecebe4]"
              }`}
            >
              <Clock className="w-3 h-3" />
              <span>Policy Lab</span>
            </button>
          </div>

          {/* Migration Phase Presets */}
          <div className="hidden xl:flex items-center gap-1 pl-2 border-l dark:border-[#23271f] border-[#e6e4da]">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#9a978c] mr-1" />
            {PRESETS.map((pr) => (
              <button
                key={pr.id}
                onClick={() => handleApplyPreset(pr.id, pr.c, pr.h, pr.p)}
                className={`px-2.5 py-1 rounded-full text-[11px] font-mono transition-all border ${
                  activePreset === pr.id
                    ? "bg-[#4a59cc] text-white border-[#4a59cc] font-bold shadow-xs"
                    : "dark:bg-[#12140f] bg-[#f6f5ef] dark:border-[#23271f] border-[#e6e4da] text-[#5c5a53] dark:text-[#b2b0a6] hover:border-[#d9d6ca]"
                }`}
              >
                {pr.label}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Clickable Legend / Spotlight Filter */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          {(
            [
              { key: "classical", label: `Classical: ${composition.classical}`, dot: "bg-sky-500" },
              { key: "hybrid", label: `Hybrid: ${composition.hybrid}`, dot: "bg-[#2e7d4f] dark:bg-[#5fca8c]" },
              { key: "pqc", label: `PQC: ${composition.pqc}`, dot: "bg-[#6b5ce7] dark:bg-[#a78bfa]" },
            ] as const
          ).map((item) => {
            const active = filterType === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setFilterType(active ? "all" : item.key)}
                title="Click to highlight this node tier"
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border transition-all ${
                  active
                    ? "dark:bg-[#1c2019] bg-[#efeee7] border-[#4a59cc] font-bold"
                    : "dark:bg-[#12140f] bg-[#f6f5ef] dark:border-[#23271f] border-[#e6e4da] hover:border-[#d9d6ca]"
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${item.dot}`} />
                <span className="dark:text-[#ecebe4] text-[#1d1d1a]">{item.label}</span>
              </button>
            );
          })}
          <span className="dark:text-[#6f6d64] text-[#9a978c] pl-1 text-[11px]">
            · 100 Nodes
          </span>
        </div>
      </div>

      {/* 2. Main Grid: React Flow P2P Canvas & Right Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        {/* Left Canvas (Span 8) */}
        <div className="lg:col-span-8 h-[610px] rounded-3xl dark:bg-[#12140f] bg-[#f6f5ef] dark:border-[#23271f] border-[#e6e4da] border shadow-xs relative overflow-hidden transition-colors">
          {!isLoading && flowNodes.length > 0 ? (
            <ReactFlow
              nodes={flowNodes}
              edges={flowEdges}
              nodeTypes={nodeTypes}
              onInit={(inst) => {
                setRfInstance(inst);
                inst.fitView({ padding: 0.14 });
              }}
              onNodeClick={(_, node) => {
                const fullData = nodesData.find((n) => n.id === node.id);
                if (fullData) setSelectedNode(fullData);
              }}
              fitView
              fitViewOptions={{ padding: 0.14 }}
              minZoom={0.25}
              maxZoom={2.2}
              proOptions={{ hideAttribution: true }}
            >
              <Background
                variant={BackgroundVariant.Dots}
                color={isDark ? "#282e24" : "#d6d2c4"}
                gap={20}
                size={1.2}
              />
              <Controls showInteractive={false} />
              <MiniMap
                pannable
                zoomable
                nodeColor={(n) => {
                  const t = (n.data as P2PNodeData | undefined)?.nodeType;
                  if (t === "hybrid") return isDark ? "#5fca8c" : "#2e7d4f";
                  if (t === "pqc") return isDark ? "#a78bfa" : "#6b5ce7";
                  return isDark ? "#38bdf8" : "#0284c7";
                }}
                maskColor={isDark ? "rgba(15, 17, 14, 0.72)" : "rgba(251, 250, 246, 0.72)"}
              />
            </ReactFlow>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xs font-mono text-[#9a978c]">
              <RefreshCw className="w-4 h-4 animate-spin mr-2 text-[#2e7d4f]" />
              Initializing 100-node clustered mesh...
            </div>
          )}

          {/* Top-Left Canvas Badge */}
          <div className="absolute top-3.5 left-3.5 z-10 pointer-events-none dark:bg-[#141712]/90 bg-[#fdfdfa]/95 backdrop-blur-md px-3.5 py-1.5 rounded-full dark:border-[#23271f] border-[#e6e4da] border text-[11px] font-mono dark:text-[#b2b0a6] text-[#5c5a53] flex items-center gap-2 shadow-xs">
            <Network className="w-3.5 h-3.5 text-[#2e7d4f] dark:text-[#5fca8c]" />
            <span>5-Cluster Small-World Mesh · Click node to inspect</span>
          </div>

          {/* Top-Right Fit View Button */}
          <button
            onClick={() => rfInstance?.fitView({ padding: 0.14, duration: 350 })}
            title="Fit all 100 nodes to view"
            className="absolute top-3.5 right-3.5 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full dark:bg-[#141712]/90 bg-[#fdfdfa]/95 backdrop-blur-md border dark:border-[#23271f] border-[#e6e4da] text-[11px] font-mono font-semibold text-[#5c5a53] dark:text-[#b2b0a6] hover:text-[#1d1d1a] dark:hover:text-[#ecebe4] shadow-xs transition-all"
          >
            <Maximize2 className="w-3 h-3" />
            <span>Fit Mesh</span>
          </button>
        </div>

        {/* Right Sidebar: Node Inspector & Directed Routing Test (Span 4) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          {/* Node Inspector Card */}
          <div className="rounded-3xl dark:bg-[#141712] bg-[#fdfdfa] dark:border-[#23271f] border-[#e6e4da] border p-5 space-y-3 shadow-xs">
            <div className="flex items-center justify-between border-b dark:border-[#23271f] border-[#e6e4da] pb-2.5">
              <span className="text-[11px] font-bold uppercase tracking-wider dark:text-[#b2b0a6] text-[#5c5a53] flex items-center gap-1.5 font-mono">
                <Eye className="w-3.5 h-3.5 text-[#2e7d4f] dark:text-[#5fca8c]" />
                <span>Node Inspector</span>
              </span>
              {selectedNode && (
                <span
                  className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full border ${
                    selectedNode.type === "hybrid"
                      ? "bg-[#f2f7f0] dark:bg-[#5fca8c]/10 text-[#2e7d4f] dark:text-[#5fca8c] border-[#a9cfb2] dark:border-[#5fca8c]/30"
                      : selectedNode.type === "classical"
                      ? "bg-[#e9f4fd] dark:bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-300 dark:border-sky-500/30"
                      : "bg-[#f2effd] dark:bg-violet-500/10 text-violet-700 dark:text-violet-300 border-violet-300 dark:border-violet-500/30"
                  }`}
                >
                  {selectedNode.type}
                </span>
              )}
            </div>

            {selectedNode ? (
              <div className="space-y-2.5 text-xs font-mono">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[10px] dark:text-[#6f6d64] text-[#9a978c]">Node Identifier</div>
                    <div className="font-extrabold dark:text-[#ecebe4] text-[#1d1d1a] text-sm">
                      Node #{selectedNode.numeric_id < 10 ? "0" + selectedNode.numeric_id : selectedNode.numeric_id}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] dark:text-[#6f6d64] text-[#9a978c]">IP Endpoint</div>
                    <div className="dark:text-[#b2b0a6] text-[#5c5a53] text-[11px]">{selectedNode.ip}</div>
                  </div>
                </div>

                <div>
                  <div className="text-[10px] dark:text-[#6f6d64] text-[#9a978c]">Derived Address (SHA-256)</div>
                  <div className="text-[11px] text-[#2e7d4f] dark:text-[#5fca8c] truncate font-semibold">
                    {selectedNode.address}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-0.5">
                  <div className="p-2.5 rounded-2xl dark:bg-[#12140f] bg-[#f6f5ef] dark:border-[#23271f] border-[#e6e4da] border">
                    <div className="text-[10px] dark:text-[#6f6d64] text-[#9a978c]">Accepted Tx</div>
                    <div className="text-sm font-bold text-[#2e7d4f] dark:text-[#5fca8c]">
                      {selectedNode.processed_tx}
                    </div>
                  </div>
                  <div className="p-2.5 rounded-2xl dark:bg-[#12140f] bg-[#f6f5ef] dark:border-[#23271f] border-[#e6e4da] border">
                    <div className="text-[10px] dark:text-[#6f6d64] text-[#9a978c]">Rejected Tx</div>
                    <div className="text-sm font-bold text-[#c0432f] dark:text-[#ef7a63]">
                      {selectedNode.rejected_tx}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 pt-1">
                  <button
                    onClick={() => setSenderId(selectedNode.numeric_id)}
                    className="flex-1 py-1.5 rounded-xl dark:bg-[#12140f] bg-[#f6f5ef] hover:bg-[#efeee7] dark:hover:bg-[#1c2019] border dark:border-[#23271f] border-[#e6e4da] text-[10px] font-bold text-[#4a59cc] dark:text-[#8c9bff] transition-colors"
                  >
                    Set as Sender
                  </button>
                  <button
                    onClick={() => setReceiverId(selectedNode.numeric_id)}
                    className="flex-1 py-1.5 rounded-xl dark:bg-[#12140f] bg-[#f6f5ef] hover:bg-[#efeee7] dark:hover:bg-[#1c2019] border dark:border-[#23271f] border-[#e6e4da] text-[10px] font-bold text-[#2e7d4f] dark:text-[#5fca8c] transition-colors"
                  >
                    Set as Receiver
                  </button>
                </div>
              </div>
            ) : null}
          </div>

          {/* Directed Routing Policy Test Card */}
          <div className="flex-1 rounded-3xl dark:bg-[#141712] bg-[#fdfdfa] dark:border-[#23271f] border-[#e6e4da] border p-5 space-y-3 shadow-xs flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b dark:border-[#23271f] border-[#e6e4da] pb-2.5">
                <h3 className="text-[11px] font-bold uppercase tracking-wider dark:text-[#b2b0a6] text-[#5c5a53] flex items-center gap-1.5 font-mono">
                  <Send className="w-3.5 h-3.5 text-[#4a59cc] dark:text-[#8c9bff]" />
                  <span>Directed Routing Test</span>
                </h3>
                <span className="text-[10px] font-mono text-[#9a978c]">BFS Shortest Path</span>
              </div>

              {/* One-Click Policy Test Presets */}
              <div className="grid grid-cols-3 gap-1.5 text-[10px] font-mono">
                <button
                  onClick={() => runQuickScenario("classical", "hybrid", "classical")}
                  className="py-1.5 px-2 rounded-xl bg-[#f2f7f0] dark:bg-[#5fca8c]/10 border border-[#a9cfb2] dark:border-[#5fca8c]/25 text-[#2e7d4f] dark:text-[#5fca8c] font-bold hover:opacity-90 transition-opacity"
                >
                  C → H ✓
                </button>
                <button
                  onClick={() => runQuickScenario("hybrid", "classical", "hybrid")}
                  className="py-1.5 px-2 rounded-xl bg-[#fbf1ed] dark:bg-[#ef7a63]/10 border border-[#e7b4a8] dark:border-[#ef7a63]/25 text-[#c0432f] dark:text-[#ef7a63] font-bold hover:opacity-90 transition-opacity"
                >
                  H → C ✕
                </button>
                <button
                  onClick={() => runQuickScenario("hybrid", "hybrid", "hybrid")}
                  className="py-1.5 px-2 rounded-xl bg-[#f2f7f0] dark:bg-[#5fca8c]/10 border border-[#a9cfb2] dark:border-[#5fca8c]/25 text-[#2e7d4f] dark:text-[#5fca8c] font-bold hover:opacity-90 transition-opacity"
                >
                  H → H ✓
                </button>
              </div>

              <div className="space-y-2.5 text-xs font-mono">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] dark:text-[#6f6d64] text-[#9a978c]">Sender Node</label>
                    <input
                      type="number"
                      min={0}
                      max={99}
                      value={senderId}
                      onChange={(e) => setSenderId(Math.min(99, Math.max(0, parseInt(e.target.value) || 0)))}
                      className="w-full mt-1 dark:bg-[#12140f] bg-[#f6f5ef] border dark:border-[#23271f] border-[#e6e4da] rounded-xl px-2.5 py-1.5 dark:text-[#ecebe4] text-[#1d1d1a] text-xs outline-none focus:border-[#4a59cc]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] dark:text-[#6f6d64] text-[#9a978c]">Receiver Node</label>
                    <input
                      type="number"
                      min={0}
                      max={99}
                      value={receiverId}
                      onChange={(e) => setReceiverId(Math.min(99, Math.max(0, parseInt(e.target.value) || 0)))}
                      className="w-full mt-1 dark:bg-[#12140f] bg-[#f6f5ef] border dark:border-[#23271f] border-[#e6e4da] rounded-xl px-2.5 py-1.5 dark:text-[#ecebe4] text-[#1d1d1a] text-xs outline-none focus:border-[#4a59cc]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] dark:text-[#6f6d64] text-[#9a978c]">Transaction Envelope</label>
                  <select
                    value={txType}
                    onChange={(e) => setTxType(e.target.value)}
                    className="w-full mt-1 dark:bg-[#12140f] bg-[#f6f5ef] border dark:border-[#23271f] border-[#e6e4da] rounded-xl px-2.5 py-1.5 dark:text-[#ecebe4] text-[#1d1d1a] text-xs outline-none focus:border-[#4a59cc]"
                  >
                    <option value="hybrid">Hybrid (ECDSA + ML-DSA-65 · 3,380 B)</option>
                    <option value="classical">Classical (ECDSA secp256k1 · ~70 B)</option>
                    <option value="pqc">Post-Quantum (ML-DSA-65 · 3,309 B)</option>
                  </select>
                </div>

                <button
                  onClick={() => executeRoute(senderId, receiverId, txType)}
                  disabled={isRouting}
                  className="w-full py-2.5 px-4 rounded-full bg-gradient-to-b from-[#5b6be1] via-[#4a59cc] to-[#3c4ab5] hover:from-[#5060d6] hover:to-[#323fa6] dark:from-[#8c9bff] dark:via-[#7485f5] dark:to-[#5e70e6] text-[#fdfdfa] dark:text-[#0b0e24] border border-[#333f9e]/40 dark:border-[#a6b3ff]/40 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-xs"
                >
                  {isRouting ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Send className="w-3.5 h-3.5" />
                  )}
                  <span>Simulate Route & Policy</span>
                </button>
              </div>
            </div>

            {/* Routing Result Box */}
            {routingResult ? (
              <div
                className={`p-3.5 rounded-2xl border text-xs space-y-2 font-mono ${
                  routingResult.success
                    ? "bg-[#f2f7f0] dark:bg-[#5fca8c]/10 border-[#a9cfb2] dark:border-[#5fca8c]/30 text-[#2e7d4f] dark:text-[#5fca8c]"
                    : "bg-[#fbf1ed] dark:bg-[#ef7a63]/10 border-[#e7b4a8] dark:border-[#ef7a63]/30 text-[#c0432f] dark:text-[#ef7a63]"
                }`}
              >
                <div className="flex items-center justify-between font-bold">
                  <span className="flex items-center gap-1.5">
                    {routingResult.success ? (
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 shrink-0" />
                    )}
                    <span>{routingResult.success ? "ACCEPTED BY MESH" : "POLICY REJECTED"}</span>
                  </span>
                  <span className="text-[10px] opacity-85">{routingResult.total_latency_ms} ms</span>
                </div>

                {/* Visual Hop Path */}
                <div className="flex flex-wrap items-center gap-1 text-[10px] dark:text-[#ecebe4] text-[#1d1d1a]">
                  {routingResult.numeric_path?.map((id: number, idx: number) => (
                    <React.Fragment key={`${id}-${idx}`}>
                      <span className="px-1.5 py-0.5 rounded dark:bg-[#141712] bg-[#fdfdfa] border dark:border-[#23271f] border-[#e6e4da] font-bold">
                        #{id < 10 ? "0" + id : id}
                      </span>
                      {idx < routingResult.numeric_path.length - 1 && (
                        <ArrowRight className="w-2.5 h-2.5 text-[#9a978c]" />
                      )}
                    </React.Fragment>
                  ))}
                </div>

                {routingResult.rejection_reason && (
                  <div className="text-[10px] leading-snug flex items-start gap-1.5 pt-1 border-t border-[#e7b4a8]/60 dark:border-[#ef7a63]/20">
                    <ShieldAlert className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    <span>{routingResult.rejection_reason}</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-3 rounded-2xl dark:bg-[#12140f] bg-[#f6f5ef] border dark:border-[#23271f] border-[#e6e4da] text-[10px] font-mono text-[#9a978c] dark:text-[#6f6d64]">
                Rule: Hybrid (3,380 B) is accepted by Hybrid/PQC nodes and rejected by Classical-only receivers.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
