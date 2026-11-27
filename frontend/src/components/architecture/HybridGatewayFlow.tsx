"use client";

import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import {
  Wallet,
  FileText,
  Radio,
  Signature,
  ShieldCheck,
  Check,
  Ban,
  Pause,
  Play,
  RotateCcw,
} from "lucide-react";
import { SCENARIOS, ScenarioItem } from "@/components/navigation/ScenarioBar";

/* ──────────────────────────────────────────────────────────────────────────
   Scenario model: what each test case does to the envelope and to each check
   ────────────────────────────────────────────────────────────────────────── */

type CheckStatus = "pass" | "fail" | "skip";
type Tamper = "none" | "version" | "ecdsa" | "mldsa" | "payload" | "replay";

interface CheckResult {
  status: CheckStatus;
  note: string;
}

interface FlowScenario {
  id: string;
  tab: string;
  dot: string;
  inputs: { wallet: boolean; tx: boolean; peer: boolean };
  tamper: Tamper;
  checks: [CheckResult, CheckResult, CheckResult, CheckResult];
  decisionWhy: string;
  timing: string;
  reason: string; // shown in the footer when rejected
}

const FLOW_CSS = `/* ─── Hybrid gateway flow diagram (warm paper palette) ─── */
.qr-flow {
  --f-bg: #fbfaf6;
  --f-card: #fdfdfa;
  --f-card-2: #f6f5ef;
  --f-chip: #efeee7;
  --f-line: #e6e4da;
  --f-line-strong: #d9d6ca;
  --f-ink: #1d1d1a;
  --f-ink-2: #5c5a53;
  --f-muted: #9a978c;
  --f-trust: #2e7d4f;
  --f-trust-bg: #f2f7f0;
  --f-trust-line: #a9cfb2;
  --f-risk: #c0432f;
  --f-risk-bg: #fbf1ed;
  --f-risk-line: #e7b4a8;
  --f-warn: #a8701f;
  --f-flow: #7cc046;
  --f-flow-bg: #f6faef;
  --f-flow-line: #bfe09d;
  --f-edge: #77756d;
  --f-edge-idle: #dcd9ce;
  --f-glow: rgba(185, 225, 140, 0.28);
}
.dark .qr-flow {
  --f-bg: #0f110e;
  --f-card: #141712;
  --f-card-2: #12140f;
  --f-chip: #1c2019;
  --f-line: #23271f;
  --f-line-strong: #30352b;
  --f-ink: #ecebe4;
  --f-ink-2: #b2b0a6;
  --f-muted: #6f6d64;
  --f-trust: #5fca8c;
  --f-trust-bg: rgba(95, 202, 140, 0.07);
  --f-trust-line: rgba(95, 202, 140, 0.35);
  --f-risk: #ef7a63;
  --f-risk-bg: rgba(239, 122, 99, 0.07);
  --f-risk-line: rgba(239, 122, 99, 0.35);
  --f-warn: #e0a54c;
  --f-flow: #9be05a;
  --f-flow-bg: rgba(155, 224, 90, 0.05);
  --f-flow-line: rgba(155, 224, 90, 0.35);
  --f-edge: #8c8a81;
  --f-edge-idle: #2b2f27;
  --f-glow: rgba(155, 224, 90, 0.06);
}
.qr-dash { animation: qr-dash 0.6s linear infinite; }
@keyframes qr-dash { to { stroke-dashoffset: -13; } }
.qr-pulse { animation: qr-pulse 0.9s ease-in-out infinite; }
@keyframes qr-pulse {
  0%, 100% { box-shadow: 0 0 0 0 var(--f-flow-line); }
  50% { box-shadow: 0 0 0 4px var(--f-flow-line); }
}
.qr-hatch {
  background: repeating-linear-gradient(-45deg, var(--f-risk-bg), var(--f-risk-bg) 4px, var(--f-risk-line) 4px, var(--f-risk-line) 5px);
}
@media (prefers-reduced-motion: reduce) {
  .qr-dash, .qr-pulse { animation: none; }
}`;

const HYBRID_VERIFY = "0.52 ms hybrid verify · mean of 1,000 runs";

const FLOW: FlowScenario[] = [
  {
    id: "normal",
    tab: "Honest hybrid transfer",
    dot: "var(--f-trust)",
    inputs: { wallet: true, tx: true, peer: false },
    tamper: "none",
    checks: [
      { status: "pass", note: "Version 0x01 is on the allow-list and the lengths add up to 3,380 B." },
      { status: "pass", note: "σ_e verifies against pk_e over the SHA3-512 digest d." },
      { status: "pass", note: "σ_pq verifies against pk_pq and the norm bound holds." },
      { status: "pass", note: "Nonce 14 is fresh and the transaction hash is new." },
    ],
    decisionWhy: "every check passed · there is no classical-only fallback",
    timing: HYBRID_VERIFY,
    reason: "",
  },
  {
    id: "ecdsa_invalid",
    tab: "Forged ECDSA",
    dot: "var(--f-risk)",
    inputs: { wallet: false, tx: true, peer: true },
    tamper: "ecdsa",
    checks: [
      { status: "pass", note: "The envelope is well-formed." },
      { status: "fail", note: "σ_e was forged by an attacker who recovered sk_e with Shor's algorithm." },
      { status: "pass", note: "σ_pq still verifies, but one valid half never carries a transaction." },
      { status: "skip", note: "Not checked: the signature gate already failed." },
    ],
    decisionWhy: "a valid ML-DSA half is not enough · strict AND rejects",
    timing: HYBRID_VERIFY,
    reason: "The ECDSA signature was forged, so the classical half failed even though ML-DSA-65 held.",
  },
  {
    id: "mldsa_invalid",
    tab: "Corrupted ML-DSA",
    dot: "var(--f-risk)",
    inputs: { wallet: false, tx: true, peer: true },
    tamper: "mldsa",
    checks: [
      { status: "pass", note: "The envelope is well-formed." },
      { status: "pass", note: "The classical half verifies." },
      { status: "fail", note: "σ_pq coefficients were altered, so the FIPS 204 norm check fails." },
      { status: "skip", note: "Not checked: the signature gate already failed." },
    ],
    decisionWhy: "a valid ECDSA half is not enough · strict AND rejects",
    timing: HYBRID_VERIFY,
    reason: "The ML-DSA-65 signature was corrupted and failed the FIPS 204 check.",
  },
  {
    id: "replay_nonce",
    tab: "Replayed nonce",
    dot: "var(--f-warn)",
    inputs: { wallet: false, tx: false, peer: true },
    tamper: "replay",
    checks: [
      { status: "pass", note: "The envelope is well-formed." },
      { status: "pass", note: "Genuine signature, copied from a transaction already in block #13." },
      { status: "pass", note: "Genuine signature, copied along with σ_e." },
      { status: "fail", note: "Nonce 13 was already consumed in block #13." },
    ],
    decisionWhy: "valid signatures, stale nonce · the replay is rejected",
    timing: HYBRID_VERIFY,
    reason: "The nonce was already used in block #13, so this is a replay of an old transaction.",
  },
  {
    id: "payload_modified",
    tab: "Amount changed in flight",
    dot: "var(--f-risk)",
    inputs: { wallet: false, tx: true, peer: true },
    tamper: "payload",
    checks: [
      { status: "pass", note: "The envelope is well-formed; the change is inside the amount." },
      { status: "fail", note: "The amount changed, so digest d no longer matches σ_e." },
      { status: "fail", note: "Both signatures cover the same digest d, so σ_pq fails too." },
      { status: "skip", note: "Not checked: the signature gate already failed." },
    ],
    decisionWhy: "one digest binds both signatures · both fail together",
    timing: HYBRID_VERIFY,
    reason: "The amount was changed in transit, so the SHA3-512 digest no longer matches either signature.",
  },
  {
    id: "version_unsupported",
    tab: "Version downgrade",
    dot: "var(--f-risk)",
    inputs: { wallet: false, tx: false, peer: true },
    tamper: "version",
    checks: [
      { status: "fail", note: "Version byte 0x99 is not on the allow-list {0x01}." },
      { status: "skip", note: "Not run: the parser stopped first." },
      { status: "skip", note: "Not run: the parser stopped first." },
      { status: "skip", note: "Not run: the parser stopped first." },
    ],
    decisionWhy: "unknown versions never fall back to a classical-only path",
    timing: "stopped at the parser · no signature was verified",
    reason: "The envelope version 0x99 is not allowed, so the parser stopped before any signature was checked.",
  },
];

const CHECKS = [
  { title: "Envelope parser", tag: "allow-list {0x01}" },
  { title: "ECDSA verify", tag: "secp256k1 · 0.40 ms" },
  { title: "ML-DSA-65 verify", tag: "FIPS 204 · 0.06 ms" },
  { title: "Nonce & duplicate guard", tag: "mempool state" },
];

/* Timeline (ms) — stage n starts at STAGE_AT[n] */
const STAGE_AT = [0, 0, 450, 900, 1300, 1700, 2100, 2500, 2950, 3400, 3800];
const DURATION = 7800;

/* ──────────────────────────────────────────────────────────────────────────
   Connector geometry
   ────────────────────────────────────────────────────────────────────────── */

type Pt = { x: number; y: number };

function elbow(a: Pt, b: Pt, midX?: number): string {
  const mx = midX ?? a.x + (b.x - a.x) / 2;
  const dy = b.y - a.y;
  if (Math.abs(dy) < 1) return `M${a.x} ${a.y} H${b.x}`;
  const dir = dy > 0 ? 1 : -1;
  const r = Math.min(12, Math.abs(dy) / 2, Math.abs(mx - a.x), Math.abs(b.x - mx));
  return [
    `M${a.x} ${a.y}`,
    `H${mx - r}`,
    `Q${mx} ${a.y} ${mx} ${a.y + dir * r}`,
    `V${b.y - dir * r}`,
    `Q${mx} ${b.y} ${mx + r} ${b.y}`,
    `H${b.x}`,
  ].join(" ");
}

type EdgeTone = "idle" | "idle-dashed" | "ink" | "flow" | "trust" | "risk";

interface Edge {
  id: string;
  d: string;
  from: Pt;
  to: Pt;
  tone: EdgeTone;
  moving?: boolean;
}

const EDGE_COLOR: Record<EdgeTone, string> = {
  idle: "var(--f-edge-idle)",
  "idle-dashed": "var(--f-edge-idle)",
  ink: "var(--f-edge)",
  flow: "var(--f-flow)",
  trust: "var(--f-trust)",
  risk: "var(--f-risk)",
};

/* ──────────────────────────────────────────────────────────────────────────
   Component
   ────────────────────────────────────────────────────────────────────────── */

interface HybridGatewayFlowProps {
  runSignal?: number;
  onScenarioChange?: (sc: ScenarioItem) => void;
  onRunStart?: () => void;
  onSettled?: (accepted: boolean, reason: string) => void;
}

export const HybridGatewayFlow: React.FC<HybridGatewayFlowProps> = ({
  runSignal = 0,
  onScenarioChange,
  onRunStart,
  onSettled,
}) => {
  const [index, setIndex] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [runId, setRunId] = useState(0);

  const sc = FLOW[index];
  const accepted = sc.checks.every((c) => c.status === "pass");

  const stage = useMemo(() => {
    let s = 1;
    for (let i = 1; i < STAGE_AT.length; i++) if (elapsed >= STAGE_AT[i]) s = i;
    return s;
  }, [elapsed]);

  const select = useCallback(
    (i: number) => {
      setIndex(i);
      setElapsed(0);
      setRunId((r) => r + 1);
      const item = SCENARIOS.find((s) => s.id === FLOW[i].id);
      if (item) onScenarioChange?.(item);
    },
    [onScenarioChange]
  );

  /* Clock: each tick advances time, then autoplays to the next scenario */
  const tick = useRef<() => void>(() => {});
  useEffect(() => {
    tick.current = () => {
      if (elapsed + 50 >= DURATION) select((index + 1) % FLOW.length);
      else setElapsed(elapsed + 50);
    };
  });
  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => tick.current(), 50);
    return () => window.clearInterval(id);
  }, [playing]);

  /* External "run" trigger (header CTA) */
  const firstSignal = useRef(runSignal);
  useEffect(() => {
    if (runSignal === firstSignal.current) return;
    setElapsed(0);
    setRunId((r) => r + 1);
    setPlaying(true);
  }, [runSignal]);

  /* Report to parent */
  useEffect(() => {
    onRunStart?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [runId]);
  const settledFor = useRef(-1);
  useEffect(() => {
    if (stage >= 8 && settledFor.current !== runId) {
      settledFor.current = runId;
      onSettled?.(accepted, sc.reason);
    }
  }, [stage, runId, accepted, sc.reason, onSettled]);

  /* ── Layout measurement for connectors ── */
  const wrap = useRef<HTMLDivElement>(null);
  type Box = { l: number; r: number; t: number; b: number; cx: number; cy: number };
  const [boxes, setBoxes] = useState<Record<string, Box> | null>(null);

  useLayoutEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const measure = () => {
      const base = el.getBoundingClientRect();
      const next: Record<string, Box> = {};
      el.querySelectorAll<HTMLElement>("[data-anchor]").forEach((n) => {
        const k = n.dataset.anchor as string;
        const r = n.getBoundingClientRect();
        next[k] = {
          l: r.left - base.left,
          r: r.right - base.left,
          t: r.top - base.top,
          b: r.bottom - base.top,
          cx: r.left - base.left + r.width / 2,
          cy: r.top - base.top + r.height / 2,
        };
      });
      setBoxes(next);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    el.querySelectorAll("[data-anchor]").forEach((n) => ro.observe(n));
    return () => ro.disconnect();
  }, []);

  const decided = stage >= 9;
  const edges: Edge[] = useMemo(() => {
    if (!boxes?.env || !boxes.gw) return [];
    const e = boxes.env;
    const list: Edge[] = [];
    const inputEdge = (k: "wallet" | "tx" | "peer", on: boolean, dashedIdle: boolean, tone: EdgeTone) => {
      const b = boxes[k];
      if (!b) return;
      const from = { x: b.r, y: b.cy };
      const to = { x: e.l, y: e.cy + (k === "wallet" ? -14 : k === "peer" ? 14 : 0) };
      list.push({
        id: k,
        d: elbow(from, to),
        from,
        to,
        tone: on ? tone : dashedIdle ? "idle-dashed" : "idle",
      });
    };
    inputEdge("wallet", sc.inputs.wallet, false, "ink");
    inputEdge("tx", sc.inputs.tx, false, "ink");
    inputEdge("peer", sc.inputs.peer, true, "risk");

    const g = boxes.gw;
    const gy = Math.min(Math.max(e.cy, g.t + 40), g.b - 40);
    const envFrom = { x: e.r, y: e.cy };
    const envTo = { x: g.l, y: gy };
    list.push({
      id: "env-gw",
      d: elbow(envFrom, envTo),
      from: envFrom,
      to: envTo,
      tone: stage >= 3 ? (stage >= 8 ? (accepted ? "flow" : "risk") : "flow") : "idle",
      moving: stage >= 3 && stage < 8,
    });

    const d = boxes.decision;
    for (const k of ["accept", "reject"] as const) {
      const o = boxes[k];
      if (!d || !o) continue;
      const from = { x: d.r, y: d.cy };
      const to = { x: o.l, y: o.cy };
      const chosen = decided && (k === "accept") === accepted;
      list.push({
        id: k,
        d: elbow(from, to, g.r + (o.l - g.r) / 2),
        from,
        to,
        tone: chosen ? (accepted ? "trust" : "risk") : "idle",
      });
    }

    const l = boxes.ledger;
    if (l) {
      const from = { x: g.cx, y: g.b };
      const to = { x: g.cx, y: l.t };
      list.push({
        id: "ledger",
        d: `M${from.x} ${from.y} V${to.y}`,
        from,
        to,
        tone: stage >= 10 && accepted ? "trust" : "idle-dashed",
      });
    }
    return list;
  }, [boxes, sc, stage, accepted, decided]);

  /* ── Derived display state ── */
  const checkState = (i: number): CheckStatus | "idle" | "checking" => {
    if (stage >= 4 + i) return sc.checks[i].status;
    if (stage === 3 + i) return "checking";
    return "idle";
  };
  const gwLabel = stage < 3 ? "waiting" : stage < 8 ? "verifying…" : "decided";
  const bits = sc.checks.map((c) => (c.status === "pass" ? "1" : c.status === "fail" ? "0" : "–"));

  return (
    <div className="qr-flow w-full rounded-[28px] border border-[var(--f-line)] bg-[var(--f-bg)] text-[var(--f-ink)] shadow-[0_1px_0_rgba(0,0,0,0.02),0_20px_60px_-30px_rgba(60,50,20,0.25)] overflow-hidden">
      <style>{FLOW_CSS}</style>
      {/* ── Scenario tabs + controls ── */}
      <div className="flex items-start justify-between gap-4 px-5 sm:px-8 pt-6 sm:pt-8">
        <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="Test scenarios">
          {FLOW.map((f, i) => {
            const active = i === index;
            return (
              <button
                key={f.id}
                role="tab"
                aria-selected={active}
                onClick={() => select(i)}
                className={`relative flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-[13.5px] transition-colors ${
                  active
                    ? "bg-[var(--f-chip)] border border-[var(--f-line-strong)] font-semibold text-[var(--f-ink)]"
                    : "border border-transparent text-[var(--f-ink-2)] hover:text-[var(--f-ink)] hover:bg-[var(--f-chip)]/60"
                }`}
              >
                <span className="w-2 h-2 rounded-full shrink-0" style={{ background: f.dot }} />
                <span className="whitespace-nowrap">{f.tab}</span>
                {active && (
                  <span className="absolute left-3.5 right-3.5 bottom-1 h-[2px] rounded-full bg-[var(--f-line)] overflow-hidden">
                    <span
                      className="block h-full rounded-full"
                      style={{
                        width: `${Math.min(100, (elapsed / DURATION) * 100)}%`,
                        background: f.dot,
                        transition: "width 50ms linear",
                      }}
                    />
                  </span>
                )}
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <IconButton label={playing ? "Pause" : "Play"} onClick={() => setPlaying((p) => !p)}>
            {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </IconButton>
          <IconButton
            label="Replay this scenario"
            onClick={() => {
              setElapsed(0);
              setRunId((r) => r + 1);
              setPlaying(true);
            }}
          >
            <RotateCcw className="w-4 h-4" />
          </IconButton>
        </div>
      </div>

      {/* ── Diagram ── */}
      <div
        ref={wrap}
        className="relative px-4 sm:px-6 pt-7 pb-7"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 40% 50% at 38% 45%, var(--f-glow), transparent 70%)",
        }}
      >
        <svg className="absolute inset-0 w-full h-full pointer-events-none hidden lg:block" aria-hidden>
          {edges.map((e) => (
            <g key={e.id}>
              <path
                d={e.d}
                fill="none"
                stroke={EDGE_COLOR[e.tone]}
                strokeWidth={e.tone === "idle" || e.tone === "idle-dashed" ? 1.25 : 2}
                strokeDasharray={e.tone === "idle-dashed" ? "4 5" : e.moving ? "7 6" : undefined}
                strokeLinecap="round"
                className={e.moving ? "qr-dash" : undefined}
                style={{ transition: "stroke 300ms ease" }}
              />
              <circle cx={e.from.x} cy={e.from.y} r={3} fill={EDGE_COLOR[e.tone]} />
              <circle
                cx={e.to.x}
                cy={e.to.y}
                r={3}
                fill="var(--f-bg)"
                stroke={EDGE_COLOR[e.tone]}
                strokeWidth={1.25}
              />
            </g>
          ))}
        </svg>

        <div className="relative grid grid-cols-1 lg:grid-cols-[minmax(160px,195px)_minmax(170px,205px)_minmax(0,1fr)_minmax(155px,188px)] gap-5 lg:gap-x-8 xl:gap-x-11 items-center">
          {/* Column 1: inputs */}
          <div className="flex flex-col gap-4 min-w-0">
            <InputCard
              data-anchor="wallet"
              tone="trust"
              kicker="Trusted"
              title="Sender wallet"
              sub="pk_e + pk_pq, bound to one address"
              icon={<Wallet className="w-4 h-4" />}
              active={stage >= 1 && sc.inputs.wallet}
            />
            <InputCard
              data-anchor="tx"
              tone="trust"
              kicker="Trusted"
              title="Transaction"
              sub="To, amount, nonce, timestamp"
              icon={<FileText className="w-4 h-4" />}
              active={stage >= 1 && sc.inputs.tx}
            />
            <InputCard
              data-anchor="peer"
              tone="risk"
              kicker="Untrusted"
              title="Network peer"
              sub="Anything relayed to your node"
              icon={<Radio className="w-4 h-4" />}
              active={stage >= 1 && sc.inputs.peer}
            />
          </div>

          {/* Column 2: hybrid envelope */}
          <div
            data-anchor="env"
            className={`min-w-0 rounded-2xl border p-4 transition-all duration-300 ${
              stage >= 2
                ? "border-[var(--f-flow-line)] bg-[var(--f-flow-bg)]"
                : "border-[var(--f-line)] bg-[var(--f-card)]"
            }`}
          >
            <div className="flex items-center justify-between">
              <Kicker>Signed transaction</Kicker>
              <Signature className="w-4 h-4 text-[var(--f-ink-2)]" />
            </div>
            <div className="mt-2 text-[19px] font-semibold tracking-tight">Hybrid envelope</div>
            <p className="mt-1 text-[13.5px] leading-snug text-[var(--f-ink-2)]">
              ECDSA and ML-DSA-65 both sign one SHA3-512 context.
            </p>
            <EnvelopeBar tamper={sc.tamper} visible={stage >= 2} />
            <TxFields tamper={sc.tamper} visible={stage >= 2} />
          </div>

          {/* Column 3: verification gateway */}
          <div
            data-anchor="gw"
            className="min-w-0 rounded-[22px] border border-[var(--f-line-strong)] bg-[var(--f-card)] p-4 sm:p-5"
          >
            <div className="flex items-center justify-between px-1 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[var(--f-trust)]" />
                <span className="font-mono text-[11.5px] tracking-[0.18em] uppercase text-[var(--f-ink-2)]">
                  Hybrid verification gateway
                </span>
              </div>
              <span
                className={`font-mono text-[12px] ${
                  gwLabel === "decided" ? "text-[var(--f-trust)]" : "text-[var(--f-muted)]"
                }`}
              >
                {gwLabel}
              </span>
            </div>

            <div className="flex flex-col gap-2.5">
              {CHECKS.map((c, i) => (
                <CheckRow
                  key={c.title}
                  n={i + 1}
                  title={c.title}
                  tag={c.tag}
                  state={checkState(i)}
                  note={sc.checks[i].note}
                />
              ))}

              <div
                data-anchor="decision"
                className={`rounded-xl border p-3.5 transition-all duration-300 ${
                  stage >= 8
                    ? accepted
                      ? "border-[var(--f-trust-line)] bg-[var(--f-trust-bg)]"
                      : "border-[var(--f-risk-line)] bg-[var(--f-risk-bg)]"
                    : "border-[var(--f-line)] bg-[var(--f-card-2)]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11.5px] tracking-[0.16em] uppercase text-[var(--f-ink-2)]">
                    Decision
                  </span>
                  {stage >= 8 ? (
                    <span
                      className={`font-mono text-[13px] font-bold tracking-wider px-2.5 py-0.5 rounded-lg border-2 ${
                        accepted
                          ? "text-[var(--f-trust)] border-[var(--f-trust)]"
                          : "text-[var(--f-risk)] border-[var(--f-risk)]"
                      }`}
                    >
                      {accepted ? "ACCEPT" : "REJECT"}
                    </span>
                  ) : (
                    <span className="font-mono text-[12px] text-[var(--f-muted)]">pending</span>
                  )}
                </div>
                <div className="mt-2 font-mono text-[12.5px] leading-[1.7] text-[var(--f-ink-2)]">
                  <div>b_final = parse ∧ b_e ∧ b_pq ∧ fresh</div>
                  <div className={`pl-[8ch] ${stage >= 8 ? "" : "opacity-0"}`}>
                    = {bits.join(" ∧ ")} ={" "}
                    <b className={accepted ? "text-[var(--f-trust)]" : "text-[var(--f-risk)]"}>
                      {accepted ? 1 : 0}
                    </b>
                  </div>
                  <div className={stage >= 8 ? "" : "opacity-0"}>{sc.decisionWhy}</div>
                  <div className={`text-[var(--f-muted)] ${stage >= 8 ? "" : "opacity-0"}`}>{sc.timing}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Column 4: outcomes */}
          <div className="flex flex-col gap-20 lg:py-8 min-w-0">
            <OutcomeCard
              data-anchor="accept"
              tone="trust"
              kicker="Accept"
              title="Committed"
              sub="Enters the mempool, then block #14."
              icon={<Check className="w-4 h-4" />}
              state={!decided ? "idle" : accepted ? "chosen" : "muted"}
            />
            <OutcomeCard
              data-anchor="reject"
              tone="risk"
              kicker="Reject"
              title="Dropped"
              sub="Nothing is written. The sender gets the reason."
              icon={<Ban className="w-4 h-4" />}
              state={!decided ? "idle" : !accepted ? "chosen" : "muted"}
            />
          </div>
        </div>

        {/* Ledger lane */}
        <div
          data-anchor="ledger"
          className={`relative mt-10 rounded-2xl border px-4 py-3.5 transition-all duration-500 ${
            stage >= 10 && accepted
              ? "border-[var(--f-trust-line)] bg-[var(--f-trust-bg)]"
              : "border-dashed border-[var(--f-line-strong)] bg-transparent"
          }`}
        >
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <Kicker>Ledger</Kicker>
            {[
              ["Mempool", "admitted"],
              ["Block #14", "SHA3-512 header"],
              ["Merkle root", "SHA3-512 tree"],
              ["HybridAuth.sol", "70,442 gas · Anvil 31337"],
            ].map(([t, s], i, arr) => (
              <React.Fragment key={t}>
                <span
                  className={`flex items-baseline gap-2 rounded-lg border px-2.5 py-1.5 transition-opacity duration-500 ${
                    stage >= 10 && accepted
                      ? "border-[var(--f-trust-line)] bg-[var(--f-card)] opacity-100"
                      : "border-[var(--f-line)] opacity-50"
                  }`}
                  style={{ transitionDelay: stage >= 10 && accepted ? `${i * 120}ms` : "0ms" }}
                >
                  <span className="text-[13.5px] font-semibold">{t}</span>
                  <span className="font-mono text-[11px] text-[var(--f-muted)]">{s}</span>
                </span>
                {i < arr.length - 1 && <span className="text-[var(--f-muted)]">→</span>}
              </React.Fragment>
            ))}
            <span className="ml-auto font-mono text-[11.5px] text-[var(--f-muted)]">
              {stage >= 10 ? (accepted ? "written to the chain" : "nothing reaches the ledger") : "waiting for a decision"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ──────────────────────────────────────────────────────────────────────────
   Pieces
   ────────────────────────────────────────────────────────────────────────── */

const Kicker: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
  <span className={`font-mono text-[11px] tracking-[0.18em] uppercase text-[var(--f-ink-2)] ${className}`}>
    {children}
  </span>
);

const IconButton: React.FC<{ label: string; onClick: () => void; children: React.ReactNode }> = ({
  label,
  onClick,
  children,
}) => (
  <button
    aria-label={label}
    title={label}
    onClick={onClick}
    className="w-12 h-12 rounded-2xl border border-[var(--f-line-strong)] bg-[var(--f-card)] text-[var(--f-ink)] flex items-center justify-center hover:bg-[var(--f-chip)] active:scale-95 transition-all"
  >
    {children}
  </button>
);

type Tone = "trust" | "risk";

const TONE = {
  trust: {
    text: "text-[var(--f-trust)]",
    activeCard: "border-[var(--f-trust-line)] bg-[var(--f-trust-bg)]",
    chosenCard:
      "border-[var(--f-trust)] bg-[var(--f-trust-bg)] shadow-[0_10px_30px_-12px_var(--f-trust-line)] scale-[1.02]",
  },
  risk: {
    text: "text-[var(--f-risk)]",
    activeCard: "border-[var(--f-risk-line)] bg-[var(--f-risk-bg)]",
    chosenCard:
      "border-[var(--f-risk)] bg-[var(--f-risk-bg)] shadow-[0_10px_30px_-12px_var(--f-risk-line)] scale-[1.02]",
  },
} as const;

const InputCard: React.FC<
  { "data-anchor"?: string } & { tone: Tone; kicker: string; title: string; sub: string; icon: React.ReactNode; active: boolean }
> = ({ tone, kicker, title, sub, icon, active, "data-anchor": anchor }) => (
  <div
    data-anchor={anchor}
    className={`rounded-2xl border p-4 transition-all duration-300 ${
      active ? TONE[tone].activeCard : "border-[var(--f-line)] bg-[var(--f-card)] opacity-[0.45]"
    }`}
  >
    <div className="flex items-center justify-between">
      <span className={`font-mono text-[11px] tracking-[0.18em] uppercase ${TONE[tone].text}`}>{kicker}</span>
      <span className="text-[var(--f-ink-2)]">{icon}</span>
    </div>
    <div className="mt-1.5 text-[18px] font-semibold tracking-tight">{title}</div>
    <div className="mt-0.5 text-[13.5px] leading-snug text-[var(--f-ink-2)]">{sub}</div>
  </div>
);

const OutcomeCard: React.FC<
  { "data-anchor"?: string } & {
    tone: Tone;
    kicker: string;
    title: string;
    sub: string;
    icon: React.ReactNode;
    state: "idle" | "chosen" | "muted";
  }
> = ({ tone, kicker, title, sub, icon, state, "data-anchor": anchor }) => (
  <div
    data-anchor={anchor}
    className={`rounded-2xl border p-4 transition-all duration-300 ${
      state === "chosen"
        ? TONE[tone].chosenCard
        : state === "muted"
          ? "border-[var(--f-line)] bg-[var(--f-card)] opacity-40"
          : "border-[var(--f-line)] bg-[var(--f-card)] opacity-70"
    }`}
  >
    <div className="flex items-center justify-between">
      <span className={`font-mono text-[11px] tracking-[0.18em] uppercase ${TONE[tone].text}`}>{kicker}</span>
      <span className={state === "chosen" ? TONE[tone].text : "text-[var(--f-muted)]"}>{icon}</span>
    </div>
    <div className="mt-1.5 text-[18px] font-semibold tracking-tight">{title}</div>
    <div className="mt-0.5 text-[13.5px] leading-snug text-[var(--f-ink-2)]">{sub}</div>
  </div>
);

const CheckRow: React.FC<{
  n: number;
  title: string;
  tag: string;
  state: CheckStatus | "idle" | "checking";
  note: string;
}> = ({ n, title, tag, state, note }) => {
  const shell =
    state === "pass"
      ? "border-[var(--f-trust-line)] bg-[var(--f-trust-bg)]"
      : state === "fail"
        ? "border-[var(--f-risk-line)] bg-[var(--f-risk-bg)]"
        : state === "checking"
          ? "border-[var(--f-flow-line)] bg-[var(--f-card)] qr-pulse"
          : "border-[var(--f-line)] bg-[var(--f-card-2)]";
  const value =
    state === "pass" ? "1" : state === "fail" ? "0" : state === "skip" ? "skip" : state === "checking" ? "…" : "";
  const valueColor =
    state === "pass" ? "text-[var(--f-trust)]" : state === "fail" ? "text-[var(--f-risk)]" : "text-[var(--f-muted)]";
  const resolved = state === "pass" || state === "fail" || state === "skip";

  return (
    <div className={`rounded-xl border px-3.5 py-3 min-h-[76px] transition-all duration-300 ${shell}`}>
      <div className="flex items-baseline gap-2 min-w-0">
        <span className="font-mono text-[12px] text-[var(--f-muted)] shrink-0">{String(n).padStart(2, "0")}</span>
        <span className="text-[15px] font-semibold tracking-tight whitespace-nowrap">{title}</span>
        <span className="font-mono text-[11px] text-[var(--f-muted)] truncate min-w-0">{tag}</span>
        <span className={`ml-auto font-mono text-[13.5px] font-bold shrink-0 ${valueColor}`}>{value}</span>
      </div>
      <p
        className={`mt-1 text-[13.5px] leading-snug text-[var(--f-ink-2)] transition-opacity duration-300 ${
          resolved ? "opacity-100" : "opacity-0"
        }`}
      >
        {note}
      </p>
    </div>
  );
};

const EnvelopeBar: React.FC<{ tamper: Tamper; visible: boolean }> = ({ tamper, visible }) => {
  const segs: { k: string; label: string; size: string; w: string; bad: boolean }[] = [
    { k: "v", label: "v", size: "1 B", w: "16%", bad: tamper === "version" },
    { k: "e", label: "σ_e", size: "70 B", w: "22%", bad: tamper === "ecdsa" || tamper === "payload" },
    { k: "pq", label: "σ_pq", size: "3,309 B", w: "62%", bad: tamper === "mldsa" || tamper === "payload" },
  ];
  return (
    <div className={`mt-3.5 transition-opacity duration-300 ${visible ? "opacity-100" : "opacity-40"}`}>
      <div className="flex h-7 rounded-lg overflow-hidden border border-[var(--f-line-strong)] font-mono text-[11px]">
        {segs.map((s, i) => (
          <div
            key={s.k}
            style={{ width: s.w }}
            className={`flex items-center justify-center ${i > 0 ? "border-l border-[var(--f-line-strong)]" : ""} ${
              visible && s.bad ? "qr-hatch text-[var(--f-risk)] font-bold" : "text-[var(--f-ink-2)] bg-[var(--f-card)]"
            }`}
          >
            {s.label}
          </div>
        ))}
      </div>
      <div className="flex font-mono text-[10.5px] text-[var(--f-muted)] mt-1">
        {segs.map((s) => (
          <div key={s.k} style={{ width: s.w }} className="text-center">
            {s.k === "v" && tamper === "version" && visible ? (
              <span className="text-[var(--f-risk)]">0x99</span>
            ) : (
              s.size
            )}
          </div>
        ))}
      </div>
      <div className="mt-1 font-mono text-[11px] text-[var(--f-ink-2)]">= 3,380 B on the wire</div>
    </div>
  );
};

const TxFields: React.FC<{ tamper: Tamper; visible: boolean }> = ({ tamper, visible }) => (
  <div
    className={`mt-3 pt-3 border-t border-[var(--f-line)] grid grid-cols-2 gap-y-1 font-mono text-[11.5px] transition-opacity duration-300 ${
      visible ? "opacity-100" : "opacity-40"
    }`}
  >
    <span className="text-[var(--f-muted)]">amount</span>
    <span className="text-right">
      {tamper === "payload" && visible ? (
        <>
          <s className="text-[var(--f-muted)]">2.5</s> <b className="text-[var(--f-risk)]">25.0</b>
        </>
      ) : (
        "2.5"
      )}
    </span>
    <span className="text-[var(--f-muted)]">nonce</span>
    <span className="text-right">
      {tamper === "replay" && visible ? <b className="text-[var(--f-warn)]">13 · used</b> : "14"}
    </span>
  </div>
);
