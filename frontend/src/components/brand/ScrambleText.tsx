"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

export interface ScrambleSegment {
  text: string;
  className?: string;
}

interface ScrambleTextProps {
  /** Segments to decode in a single continuous left-to-right sweep. */
  segments: ScrambleSegment[];
  /** Total decode animation duration in milliseconds. */
  durationMs?: number;
  /** Cryptographic glyph alphabet cycled before each character locks in. */
  charset?: string;
  /** Replay the decode animation smoothly on hover. */
  replayOnHover?: boolean;
  className?: string;
  as?: "h1" | "h2" | "p" | "span";
}

const DEFAULT_CHARSET = "0123456789abcdefxzqkmnpvw";

/**
 * Cryptographic left-to-right text-scramble (decode) reveal component.
 * Preserves whitespace/punctuation to prevent line-wrap jitter during decode,
 * renders clean static text during SSR for zero hydration mismatch, and
 * honors `prefers-reduced-motion`.
 */
export const ScrambleText: React.FC<ScrambleTextProps> = ({
  segments,
  durationMs = 900,
  charset = DEFAULT_CHARSET,
  replayOnHover = true,
  className = "",
  as: Tag = "h2",
}) => {
  const fullText = useMemo(() => segments.map((s) => s.text).join(""), [segments]);
  const [rendered, setRendered] = useState<string>(fullText);
  const rafRef = useRef<number | null>(null);
  const lastStepRef = useRef<number>(0);
  const runningRef = useRef<boolean>(false);

  const stop = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    runningRef.current = false;
  }, []);

  const startDecode = useCallback(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setRendered(fullText);
      return;
    }

    stop();
    runningRef.current = true;
    const start = performance.now();
    lastStepRef.current = 0;

    const tick = (now: number) => {
      const elapsed = now - start;
      const rawProgress = Math.min(1, elapsed / durationMs);
      const eased = 1 - Math.pow(1 - rawProgress, 1.45);
      const lockIndex = Math.floor(eased * fullText.length);

      if (rawProgress >= 1) {
        setRendered(fullText);
        runningRef.current = false;
        rafRef.current = null;
        return;
      }

      if (now - lastStepRef.current >= 32) {
        lastStepRef.current = now;
        const waveWindow = 10;
        let next = "";
        for (let i = 0; i < fullText.length; i++) {
          const ch = fullText[i];
          if (i < lockIndex) {
            next += ch;
          } else if (ch === " " || ch === "-" || ch === "'" || ch === "’") {
            next += ch;
          } else if (i < lockIndex + waveWindow) {
            next += charset[Math.floor(Math.random() * charset.length)];
          } else {
            next += charset[(i * 7 + Math.floor(elapsed / 90)) % charset.length];
          }
        }
        setRendered(next);
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
  }, [charset, durationMs, fullText, stop]);

  useEffect(() => {
    startDecode();
    return stop;
  }, [startDecode, stop]);

  const handleHover = () => {
    if (replayOnHover && !runningRef.current) {
      startDecode();
    }
  };

  let offset = 0;
  const slicedSegments = segments.map((seg) => {
    const chunk = rendered.slice(offset, offset + seg.text.length);
    offset += seg.text.length;
    return { chunk, className: seg.className };
  });

  return (
    <Tag
      className={className}
      aria-label={fullText}
      onMouseEnter={handleHover}
    >
      {slicedSegments.map((seg, idx) => (
        <span key={idx} className={seg.className}>
          {seg.chunk}
        </span>
      ))}
    </Tag>
  );
};
