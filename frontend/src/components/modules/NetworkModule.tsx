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
        if (data.nodes.length > 0 && !selectedNode) {
          setSelectedNode(data.nodes[0]);
        }
      } else {
        // Generate fallback 100 nodes locally if backend is offline
        generateFallbackTopology(classicalRatio, hybridRatio, pqcRatio);
      }
    } catch {
      generateFallbackTopology(classicalRatio, hybridRatio, pqcRatio);
    }
  };

  const generateFallbackTopology = (cPct: number, hPct: number, pPct: number) => {
    const total = cPct + hPct + pPct || 100;
    const nC = Math.round(100 * (cPct / total));
    const nH = Math.round(100 * (hPct / total));
    const nP = 100 - (nC + nH);

    const types = [
      ...Array(nC).fill("classical"),
      ...Array(nH).fill("hybrid"),
      ...Array(nP).fill("pqc")
    ];

    const fallbackNodes: any[] = [];
    const fallbackEdges: any[] = [];

    const clusters = [
      { cx: 300, cy: 300 },
      { cx: 700, cy: 300 },
      { cx: 500, cy: 600 },
      { cx: 250, cy: 750 },
      { cx: 750, cy: 750 }
    ];

    for (let i = 0; i < 100; i++) {
      const c = clusters[i % 5];
      const r = 60 + Math.floor(i / 5) * 14;
      const angle = i * 137.5 * (Math.PI / 180.0);
      const x = c.cx + r * Math.cos(angle);
      const y = c.cy + r * Math.sin(angle);

      fallbackNodes.push({
        id: `node-${i}`,
        numeric_id: i,
        label: `Node #${i < 10 ? "0" + i : i} (${types[i].toUpperCase()})`,
        type: types[i],
        position: { x: Math.round(x), y: Math.round(y) },
        ip: `192.168.${Math.floor(i / 25) + 1}.${(i % 25) + 10}`,
        address: `0x7a${(i * 1234567).toString(16).padStart(38, "0")}`,
        peers: [(i + 1) % 100, (i + 5) % 100],
        processed_tx: Math.floor(Math.random() * 120),
        rejected_tx: types[i] === "classical" ? Math.floor(Math.random() * 18) : 0
      });

      if (i < 99) {
        fallbackEdges.push({
          id: `e${i}-${i + 1}`,
          source: `node-${i}`,
          target: `node-${i + 1}`,
          delay_ms: 2.1
        });
      }
    }

    setNodesData(fallbackNodes);
    setEdgesData(fallbackEdges);
    setComposition({ classical: nC, hybrid: nH, pqc: nP });
    setSelectedNode(fallbackNodes[0]);
  };

  const handleUpdateRatios = async () => {
    try {
      const res = await apiFetch<any>(
        "/network/update-ratios",
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
          total_latency_ms: 2.45,
          rejection_reason: isFail
            ? `Incompatible: Classical receiver Node #${receiverId} cannot parse ML-DSA-65.`
            : null
        });
      }
    } catch (e: any) {
      console.error(e);
    } finally {
      setIsRouting(false);
    }
  };

  // Convert nodes to React Flow format
  const flowNodes: Node[] = useMemo(() => {
    return nodesData.map((n) => {
      let bg = "bg-cyan-950/80 border-cyan-400 text-cyan-200 shadow-cyan-500/20";
      let dotColor = "bg-cyan-400";
      if (n.type === "hybrid") {
        bg = "bg-teal-950/80 border-teal-400 text-teal-200 shadow-teal-500/20";
        dotColor = "bg-teal-400";
      } else if (n.type === "pqc") {
        bg = "bg-purple-950/80 border-purple-400 text-purple-200 shadow-purple-500/20";
        dotColor = "bg-purple-400";
      }

      const isSelected = selectedNode?.numeric_id === n.numeric_id;
      const isPath = routingResult?.numeric_path?.includes(n.numeric_id);

      return {
        id: n.id,
        position: n.position,
        data: { label: n.label },
        style: {
          width: 32,
          height: 32,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderWidth: isSelected ? 3 : 1.5,
          borderColor: isSelected ? "#ffffff" : isPath ? "#f59e0b" : undefined,
          boxShadow: isSelected
            ? "0 0 16px rgba(255,255,255,0.8)"
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
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Controls Bar (Matching User Image 1 Style) */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/90 border border-slate-800 shadow-lg">
        {/* Toggle: Real time vs Simulation */}
        <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-lg border border-slate-800">
          <button
            onClick={() => setViewMode("realtime")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              viewMode === "realtime"
                ? "bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Radio className={`w-3.5 h-3.5 ${viewMode === "realtime" ? "animate-pulse" : ""}`} />
            <span>Real time</span>
          </button>
          <button
            onClick={() => setViewMode("simulation")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              viewMode === "simulation"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Simulation</span>
          </button>
        </div>

        {/* Legend / Composition */}
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400/50" />
            <span className="text-slate-300">Classical: {composition.classical}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-teal-400 shadow-sm shadow-teal-400/50" />
            <span className="text-slate-300">Hybrid: {composition.hybrid}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-purple-400 shadow-sm shadow-purple-400/50" />
            <span className="text-slate-300">PQC: {composition.pqc}</span>
          </div>
          <div className="text-slate-400 pl-2 border-l border-slate-700">Total: 100 Nodes</div>
        </div>
      </div>

      {/* Main Grid: Network Canvas & Inspector Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* React Flow 100-Node Canvas */}
        <div className="lg:col-span-3 h-[620px] rounded-2xl bg-[#080b11] border border-slate-800 shadow-2xl relative overflow-hidden">
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
          <div className="absolute top-4 left-4 pointer-events-none bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
            <Network className="w-3.5 h-3.5 text-teal-400" />
            <span>Interactive P2P Mesh Topology (Click any node to inspect)</span>
          </div>
        </div>

        {/* Sidebar Inspector & Route Controller */}
        <div className="space-y-6">
          {/* Node Inspector Drawer */}
          <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-teal-400" />
                <span>Node Inspector</span>
              </span>
              {selectedNode && (
                <span
                  className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                    selectedNode.type === "hybrid"
                      ? "bg-teal-500/20 text-teal-300 border border-teal-500/30"
                      : selectedNode.type === "classical"
                      ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                      : "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                  }`}
                >
                  {selectedNode.type}
                </span>
              )}
            </div>

            {selectedNode ? (
              <div className="space-y-2 text-xs">
                <div>
                  <div className="text-[10px] text-slate-400">Node Identifier</div>
                  <div className="font-bold text-white text-sm">
                    Node #{selectedNode.numeric_id < 10 ? "0" + selectedNode.numeric_id : selectedNode.numeric_id}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">IP Address</div>
                  <div className="font-mono text-slate-300">{selectedNode.ip}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">Derived Address (SHA-256 bound)</div>
                  <div className="font-mono text-[11px] text-teal-300 truncate">
                    {selectedNode.address}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div className="p-2 rounded bg-slate-950/60 border border-slate-800">
                    <div className="text-[10px] text-slate-400">Accepted Tx</div>
                    <div className="text-sm font-bold text-emerald-400 font-mono">
                      {selectedNode.processed_tx}
                    </div>
                  </div>
                  <div className="p-2 rounded bg-slate-950/60 border border-slate-800">
                    <div className="text-[10px] text-slate-400">Rejected Tx</div>
                    <div className="text-sm font-bold text-rose-400 font-mono">
                      {selectedNode.rejected_tx}
                    </div>
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">Active Peer Connections</div>
                  <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                    {selectedNode.peers?.map((p: number) => `#${p}`).join(", ")}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400">Select a node on the canvas to inspect.</p>
            )}
          </div>

          {/* Directed Routing Experiment */}
          <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-4 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Send className="w-3.5 h-3.5 text-cyan-400" />
              <span>Directed Routing Test</span>
            </h3>

            <div className="space-y-2 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-slate-400">Sender Node ID</label>
                  <input
                    type="number"
                    min={0}
                    max={99}
                    value={senderId}
                    onChange={(e) => setSenderId(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-white text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400">Receiver Node ID</label>
                  <input
                    type="number"
                    min={0}
                    max={99}
                    value={receiverId}
                    onChange={(e) => setReceiverId(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-white text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-slate-400">Transaction Format</label>
                <select
                  value={txType}
                  onChange={(e) => setTxType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1.5 text-white text-xs"
                >
                  <option value="hybrid">Hybrid (ECDSA + ML-DSA-65)</option>
                  <option value="classical">Classical (ECDSA only)</option>
                  <option value="pqc">Post-Quantum (ML-DSA-65 only)</option>
                </select>
              </div>

              <button
                onClick={handleExecuteRoute}
                disabled={isRouting}
                className="w-full py-2 px-3 rounded-lg bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-teal-500/20"
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
                className={`mt-3 p-3 rounded-lg border text-xs space-y-1.5 ${
                  routingResult.success
                    ? "bg-emerald-950/30 border-emerald-500/40 text-emerald-200"
                    : "bg-rose-950/30 border-rose-500/40 text-rose-200"
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold">
                  {routingResult.success ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-400" />
                  )}
                  <span>{routingResult.success ? "ACCEPTED BY RECEIVER" : "REJECTED BY RECEIVER"}</span>
                </div>
                <div className="text-[11px] font-mono text-slate-300">
                  Latency: {routingResult.total_latency_ms} ms | Path: {routingResult.numeric_path?.join(" → ")}
                </div>
                {routingResult.rejection_reason && (
                  <div className="text-[11px] text-rose-300 bg-rose-950/40 p-1.5 rounded border border-rose-800/40">
                    {routingResult.rejection_reason}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Node Distribution Slider Controls */}
          {isLiveMode && (
            <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-4 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-teal-400" />
                <span>Custom Composition (Live)</span>
              </h3>
              <div className="space-y-2 text-xs">
                <div>
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>Classical %</span>
                    <span className="font-mono text-cyan-400">{classicalRatio}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={classicalRatio}
                    onChange={(e) => setClassicalRatio(parseInt(e.target.value))}
                    className="w-full accent-cyan-400 h-1 bg-slate-800 rounded"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>Hybrid %</span>
                    <span className="font-mono text-teal-400">{hybridRatio}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={hybridRatio}
                    onChange={(e) => setHybridRatio(parseInt(e.target.value))}
                    className="w-full accent-teal-400 h-1 bg-slate-800 rounded"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>PQC %</span>
                    <span className="font-mono text-purple-400">{pqcRatio}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={pqcRatio}
                    onChange={(e) => setPqcRatio(parseInt(e.target.value))}
                    className="w-full accent-purple-400 h-1 bg-slate-800 rounded"
                  />
                </div>
                <button
                  onClick={handleUpdateRatios}
                  className="w-full mt-2 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium transition-colors"
                >
                  Regenerate Topology
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

