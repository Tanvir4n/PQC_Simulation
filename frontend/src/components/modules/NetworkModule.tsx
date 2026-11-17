"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  Node,
  Edge,
  MarkerType
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import {
  Network,
  Radio,
  Send,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  Layers,
  Sliders,
  RefreshCw,
  Eye
} from "lucide-react";
import { apiFetch } from "@/lib/api";

interface NetworkModuleProps {
  isLiveMode: boolean;
}

export const NetworkModule: React.FC<NetworkModuleProps> = ({ isLiveMode }) => {
  const [viewMode, setViewMode] = useState<"realtime" | "simulation">("simulation");
  const [nodesData, setNodesData] = useState<any[]>([]);
  const [edgesData, setEdgesData] = useState<any[]>([]);
  const [composition, setComposition] = useState({ classical: 50, hybrid: 50, pqc: 0 });
  const [selectedNode, setSelectedNode] = useState<any | null>(null);

  // Routing test state
  const [senderId, setSenderId] = useState<number>(0);
  const [receiverId, setReceiverId] = useState<number>(50);
  const [txType, setTxType] = useState<string>("hybrid");
  const [routingResult, setRoutingResult] = useState<any | null>(null);
  const [isRouting, setIsRouting] = useState<boolean>(false);

  // Ratios sliders
  const [classicalRatio, setClassicalRatio] = useState<number>(50);
  const [hybridRatio, setHybridRatio] = useState<number>(50);
  const [pqcRatio, setPqcRatio] = useState<number>(0);

  // Fetch initial topology
  useEffect(() => {
    loadTopology();
  }, []);

  const loadTopology = async () => {
    try {
      const data = await apiFetch<any>("/network/topology", {}, null);
      if (data) {
        setNodesData(data.nodes);
        setEdgesData(data.edges);
        setComposition(data.composition);
        setSelectedNode(data.nodes[0] || null);
      } else {
        generateFallbackTopology(50, 50, 0);
      }
    } catch {
      generateFallbackTopology(50, 50, 0);
    }
  };

  const generateFallbackTopology = (c: number, h: number, p: number) => {
    const total = 100;
    const cCount = Math.round((c / 100) * total);
    const hCount = Math.round((h / 100) * total);
    const pCount = total - cCount - hCount;

    const nodes: any[] = [];
    const edges: any[] = [];

    for (let i = 0; i < total; i++) {
      let type = "classical";
      if (i >= cCount && i < cCount + hCount) type = "hybrid";
      else if (i >= cCount + hCount) type = "pqc";

      // Arrange in concentric spiral or circular mesh
      const angle = (i / total) * 2 * Math.PI * 3;
      const radius = 120 + (i / total) * 350;
      const x = 500 + radius * Math.cos(angle);
      const y = 400 + radius * Math.sin(angle);

      nodes.push({
        id: `node-${i}`,
        numeric_id: i,
        type,
        x,
        y,
        ip: `10.240.${Math.floor(i / 254)}.${(i % 254) + 1}`,
        address: `0x${i.toString(16).padStart(4, "0")}...${(i * 37).toString(16).padStart(4, "0")}`,
        processed_tx: 100 + (i % 20) * 15,
        rejected_tx: type === "classical" ? 42 : 0,
        peers: [(i + 1) % total, (i + 5) % total, (i + 13) % total]
      });

      if (i > 0) {
        edges.push({
          id: `edge-${i - 1}-${i}`,
          source: `node-${i - 1}`,
          target: `node-${i}`
        });
      }
      if (i % 5 === 0 && i >= 5) {
        edges.push({
          id: `edge-${i - 5}-${i}`,
          source: `node-${i - 5}`,
          target: `node-${i}`
        });
      }
    }

    setNodesData(nodes);
    setEdgesData(edges);
    setComposition({ classical: cCount, hybrid: hCount, pqc: pCount });
    setSelectedNode(nodes[0]);
  };

  const handleUpdateRatios = async () => {
    try {
      const res = await apiFetch<any>(
        "/network/regenerate",
        {
          method: "POST",
          body: JSON.stringify({
            classical_pct: classicalRatio / 100,
            hybrid_pct: hybridRatio / 100,
            pqc_pct: pqcRatio / 100
          })
        },
        null
      );
      if (res) {
        setNodesData(res.nodes);
        setEdgesData(res.edges);
        setComposition(res.composition);
      } else {
        generateFallbackTopology(classicalRatio, hybridRatio, pqcRatio);
      }
    } catch {
      generateFallbackTopology(classicalRatio, hybridRatio, pqcRatio);
    }
  };

  const handleExecuteRoute = async () => {
    setIsRouting(true);
    setRoutingResult(null);

    try {
      const res = await apiFetch<any>(
        "/network/route",
        {
          method: "POST",
          body: JSON.stringify({
            sender_id: senderId,
            receiver_id: receiverId,
            tx_type: txType
          })
        },
        null
      );

      if (res) {
        setRoutingResult(res);
      } else {
        // Fallback simulation calculation
        const sender = nodesData.find((n) => n.numeric_id === senderId);
        const receiver = nodesData.find((n) => n.numeric_id === receiverId);
        const isFail = txType === "hybrid" && receiver?.type === "classical";

        setRoutingResult({
          success: !isFail,
          sender,
          receiver,
          path: [`node-${senderId}`, `node-${receiverId}`],
          numeric_path: [senderId, receiverId],
          total_latency_ms: 2.45,
          hops: [
            {
              from: senderId,
              to: receiverId,
              status: isFail ? "REJECTED" : "ACCEPTED",
              latency_ms: 2.45,
              reason: isFail
                ? `Classical receiver Node #${receiverId} cannot parse ML-DSA-65 in Hybrid transaction.`
                : null
            }
          ],
          rejection_reason: isFail
            ? `Asymmetric Incompatibility: Receiver Node #${receiverId} is Classical (ECDSA only) and rejected the 3,380B Hybrid envelope.`
            : null
        });
      }
    } catch {
      // Fallback
    } finally {
      setIsRouting(false);
    }
  };

  // React Flow elements mapping
  const flowNodes: Node[] = useMemo(() => {
    return nodesData.map((n) => {
      const isSelected = selectedNode?.id === n.id;
      const isPath = routingResult?.path?.includes(n.id);

      let dotColor = "text-cyan-400";
      let bg = "bg-cyan-950/80 border-cyan-500/40";
      if (n.type === "hybrid") {
        dotColor = "text-[#00dc82]";
        bg = "bg-emerald-950/80 border-emerald-500/40";
      } else if (n.type === "pqc") {
        dotColor = "text-purple-400";
        bg = "bg-purple-950/80 border-purple-500/40";
      }

      return {
        id: n.id,
        position: { x: n.x, y: n.y },
        data: {
          label: `#${n.numeric_id < 10 ? "0" + n.numeric_id : n.numeric_id}`
        },
        style: {
          width: 34,
          height: 34,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderWidth: isSelected ? 3 : 1.5,
          borderColor: isSelected ? "#00dc82" : isPath ? "#f59e0b" : undefined,
          boxShadow: isSelected
            ? "0 0 16px rgba(0,220,130,0.8)"
            : isPath
            ? "0 0 14px rgba(245,158,11,0.8)"
            : undefined,
          cursor: "pointer",
          fontSize: "9px",
          fontWeight: 600
        },
        className: `${bg} ${dotColor} transition-all`
      };
    });
  }, [nodesData, selectedNode, routingResult]);

  const flowEdges: Edge[] = useMemo(() => {
    return edgesData.slice(0, 150).map((e) => {
      const isPathEdge =
        routingResult?.numeric_path?.includes(parseInt(e.source.replace("node-", ""))) &&
        routingResult?.numeric_path?.includes(parseInt(e.target.replace("node-", "")));

      return {
        id: e.id,
        source: e.source,
        target: e.target,
        animated: isPathEdge || viewMode === "realtime",
        style: {
          stroke: isPathEdge ? "#f59e0b" : "#334155",
          strokeWidth: isPathEdge ? 2.5 : 1,
          opacity: isPathEdge ? 1 : 0.4
        }
      };
    });
  }, [edgesData, routingResult, viewMode]);

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6 max-w-7xl mx-auto transition-colors">
      {/* Top Controls Bar (Bento-Matched Card) */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl dark:bg-[#0b0e14] bg-white dark:border-[#161d27] border-slate-200 border shadow-sm transition-all">
        {/* Toggle: Real time vs Simulation */}
        <div className="flex items-center gap-1 p-1 dark:bg-[#07090d] bg-slate-100 rounded-xl dark:border-[#161d27] border-slate-200 border font-mono">
          <button
            onClick={() => setViewMode("realtime")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              viewMode === "realtime"
                ? "dark:bg-[#00dc82]/10 bg-emerald-500/10 dark:text-[#00dc82] text-emerald-700 dark:border-[#00dc82]/30 border-emerald-500/30 border shadow-xs"
                : "dark:text-slate-400 text-slate-500 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Radio className={`w-3.5 h-3.5 ${viewMode === "realtime" ? "animate-pulse" : ""}`} />
            <span>Real time</span>
          </button>
          <button
            onClick={() => setViewMode("simulation")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              viewMode === "simulation"
                ? "dark:bg-[#00dc82]/10 bg-emerald-500/10 dark:text-[#00dc82] text-emerald-700 dark:border-[#00dc82]/30 border-emerald-500/30 border shadow-xs"
                : "dark:text-slate-400 text-slate-500 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Simulation</span>
          </button>
        </div>

        {/* Legend / Composition */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-xs shadow-cyan-400/50" />
            <span className="dark:text-slate-300 text-slate-700">Classical: {composition.classical}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full dark:bg-[#00dc82] bg-emerald-500 shadow-xs shadow-emerald-500/50" />
            <span className="dark:text-slate-300 text-slate-700 font-bold">Hybrid: {composition.hybrid}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-400 shadow-xs shadow-purple-400/50" />
            <span className="dark:text-slate-300 text-slate-700">PQC: {composition.pqc}</span>
          </div>
          <div className="dark:text-slate-500 text-slate-400 pl-2 border-l dark:border-[#161d27] border-slate-200">
            Total: 100 Nodes
          </div>
        </div>
      </div>

      {/* Main Grid: Network Canvas & Inspector Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* React Flow 100-Node Canvas */}
        <div className="lg:col-span-3 h-[600px] rounded-2xl dark:bg-[#07090d] bg-slate-50 dark:border-[#161d27] border-slate-200 border shadow-sm relative overflow-hidden transition-colors">
          <ReactFlow
            nodes={flowNodes}
            edges={flowEdges}
            onNodeClick={(_, node) => {
              const fullData = nodesData.find((n) => n.id === node.id);
              if (fullData) setSelectedNode(fullData);
            }}
            fitView
            minZoom={0.3}
            maxZoom={2}
          >
            <Background color="#1e293b" gap={20} size={1} />
            <Controls />
          </ReactFlow>

          {/* Floating Canvas Tag */}
          <div className="absolute top-4 left-4 pointer-events-none dark:bg-[#0b0e14]/90 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-xl dark:border-[#161d27] border-slate-200 border text-[11px] font-mono dark:text-slate-400 text-slate-600 flex items-center gap-2 shadow-sm">
            <Network className="w-3.5 h-3.5 dark:text-[#00dc82] text-emerald-600" />
            <span>Interactive P2P Mesh Topology (Click node to inspect)</span>
          </div>
        </div>

        {/* Sidebar Inspector & Route Controller */}
        <div className="space-y-6">
          {/* Node Inspector Drawer */}
          <div className="rounded-2xl dark:bg-[#0b0e14] bg-white dark:border-[#161d27] border-slate-200 border p-5 space-y-3 shadow-sm transition-all">
            <div className="flex items-center justify-between border-b dark:border-[#161d27] border-slate-200 pb-2.5">
              <span className="text-xs font-bold uppercase tracking-wider dark:text-slate-400 text-slate-600 flex items-center gap-1.5 font-mono">
                <Eye className="w-3.5 h-3.5 dark:text-[#00dc82] text-emerald-600" />
                <span>Node Inspector</span>
              </span>
              {selectedNode && (
                <span
                  className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-lg border ${
                    selectedNode.type === "hybrid"
                      ? "dark:bg-[#00dc82]/10 bg-emerald-500/10 dark:text-[#00dc82] text-emerald-700 dark:border-[#00dc82]/30 border-emerald-500/30"
                      : selectedNode.type === "classical"
                      ? "bg-cyan-500/10 text-cyan-600 border-cyan-500/30"
                      : "bg-purple-500/10 text-purple-600 border-purple-500/30"
                  }`}
                >
                  {selectedNode.type}
                </span>
              )}
            </div>

            {selectedNode ? (
              <div className="space-y-2.5 text-xs font-mono">
                <div>
                  <div className="text-[10px] dark:text-slate-500 text-slate-400">Node Identifier</div>
                  <div className="font-bold dark:text-white text-slate-900 text-sm">
                    Node #{selectedNode.numeric_id < 10 ? "0" + selectedNode.numeric_id : selectedNode.numeric_id}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] dark:text-slate-500 text-slate-400">IP Address</div>
                  <div className="dark:text-slate-300 text-slate-700 font-mono text-[11px]">{selectedNode.ip}</div>
                </div>
                <div>
                  <div className="text-[10px] dark:text-slate-500 text-slate-400">Derived Address (SHA-256 bound)</div>
                  <div className="font-mono text-[11px] dark:text-[#00dc82] text-emerald-700 truncate font-semibold">
                    {selectedNode.address}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div className="p-2.5 rounded-xl dark:bg-[#07090d] bg-slate-50 dark:border-[#141a24] border-slate-200 border">
                    <div className="text-[10px] dark:text-slate-500 text-slate-400">Accepted Tx</div>
                    <div className="text-sm font-bold dark:text-[#00dc82] text-emerald-600 font-mono">
                      {selectedNode.processed_tx}
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl dark:bg-[#07090d] bg-slate-50 dark:border-[#141a24] border-slate-200 border">
                    <div className="text-[10px] dark:text-slate-500 text-slate-400">Rejected Tx</div>
                    <div className="text-sm font-bold text-rose-500 font-mono">
                      {selectedNode.rejected_tx}
                    </div>
                  </div>
                </div>
                <div>
                  <div className="text-[10px] dark:text-slate-500 text-slate-400">Active Peer Connections</div>
                  <div className="text-[11px] font-mono dark:text-slate-400 text-slate-500 mt-0.5">
                    {selectedNode.peers?.map((p: number) => `#${p}`).join(", ")}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs dark:text-slate-400 text-slate-500 font-mono">
                Select a node on the canvas to inspect.
              </p>
            )}
          </div>

          {/* Directed Routing Experiment */}
          <div className="rounded-2xl dark:bg-[#0b0e14] bg-white dark:border-[#161d27] border-slate-200 border p-5 space-y-3 shadow-sm transition-all">
            <h3 className="text-xs font-bold uppercase tracking-wider dark:text-slate-400 text-slate-600 flex items-center gap-1.5 font-mono">
              <Send className="w-3.5 h-3.5 dark:text-[#00dc82] text-emerald-600" />
              <span>Directed Routing Test</span>
            </h3>

            <div className="space-y-2.5 text-xs font-mono">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] dark:text-slate-500 text-slate-400">Sender Node ID</label>
                  <input
                    type="number"
                    min={0}
                    max={99}
                    value={senderId}
                    onChange={(e) => setSenderId(parseInt(e.target.value) || 0)}
                    className="w-full mt-1 dark:bg-[#07090d] bg-slate-50 dark:border-[#161d27] border-slate-300 rounded-xl px-2.5 py-1.5 dark:text-white text-slate-900 text-xs font-mono outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] dark:text-slate-500 text-slate-400">Receiver Node ID</label>
                  <input
                    type="number"
                    min={0}
                    max={99}
                    value={receiverId}
                    onChange={(e) => setReceiverId(parseInt(e.target.value) || 0)}
                    className="w-full mt-1 dark:bg-[#07090d] bg-slate-50 dark:border-[#161d27] border-slate-300 rounded-xl px-2.5 py-1.5 dark:text-white text-slate-900 text-xs font-mono outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] dark:text-slate-500 text-slate-400">Transaction Format</label>
                <select
                  value={txType}
                  onChange={(e) => setTxType(e.target.value)}
                  className="w-full mt-1 dark:bg-[#07090d] bg-slate-50 dark:border-[#161d27] border-slate-300 rounded-xl px-2.5 py-1.5 dark:text-white text-slate-900 text-xs font-mono outline-none"
                >
                  <option value="hybrid">Hybrid (ECDSA + ML-DSA-65)</option>
                  <option value="classical">Classical (ECDSA only)</option>
                  <option value="pqc">Post-Quantum (ML-DSA-65 only)</option>
                </select>
              </div>

              <button
                onClick={handleExecuteRoute}
                disabled={isRouting}
                className="w-full py-2.5 px-3 rounded-xl dark:bg-[#00dc82] bg-emerald-600 hover:bg-emerald-500 dark:hover:bg-[#00c574] text-white dark:text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-md dark:shadow-[#00dc82]/20"
              >
                {isRouting ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Send className="w-3.5 h-3.5" />
                )}
                <span>Simulate Route & Policy</span>
              </button>
            </div>

            {/* Routing Result Box */}
            {routingResult && (
              <div
                className={`mt-3 p-3.5 rounded-xl border text-xs space-y-1.5 font-mono ${
                  routingResult.success
                    ? "dark:bg-[#00dc82]/10 bg-emerald-500/10 dark:border-[#00dc82]/30 border-emerald-500/30 dark:text-[#00dc82] text-emerald-700"
                    : "dark:bg-rose-950/30 bg-rose-50 border-rose-500/30 text-rose-600"
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold">
                  {routingResult.success ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-500" />
                  )}
                  <span>{routingResult.success ? "ACCEPTED BY RECEIVER" : "REJECTED BY RECEIVER"}</span>
                </div>
                <div className="text-[11px] dark:text-slate-300 text-slate-700">
                  Latency: {routingResult.total_latency_ms} ms | Path: {routingResult.numeric_path?.join(" → ")}
                </div>
                {routingResult.rejection_reason && (
                  <div className="text-[10px] text-rose-500 dark:bg-rose-950/50 bg-rose-100 p-2 rounded-lg border border-rose-200 dark:border-rose-900/50">
                    {routingResult.rejection_reason}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
