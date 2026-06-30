"use client";

// ════════════════════════════════════════════════════════════════════════
// Geteilte Animations-Primitiven für die Konzept-Routen (/d, /e, /f).
//
// Designprinzip: ALLE Primitiven sind IntersectionObserver-/JS-getrieben mit
// Inline-Transitions. Der Ruhezustand ist IMMER sichtbar (opacity bleibt 1,
// sobald sichtbar) — Inhalte können nie "unsichtbar hängenbleiben" wie bei
// dem fragilen `animation-timeline … both`-Muster. prefers-reduced-motion
// springt sofort auf den Endzustand.
//
// Animiert werden ELEMENTE, nicht nur Text:
//   · CountUp     — KPI-Zahlen zählen hoch (de-DE-Formatierung beibehalten)
//   · ClipReveal  — Bilder enthüllen per clip-path-Wipe (+ optional Parallax)
//   · Stagger     — Kinder treten gestaffelt ein (translate + scale + opacity)
//   · Rise        — einzelnes Element steigt ein
// ════════════════════════════════════════════════════════════════════════

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** IntersectionObserver-Hook: true sobald (einmalig) im Viewport. */
function useInView<T extends HTMLElement>(
  options: IntersectionObserverInit = { threshold: 0.2, rootMargin: "0px 0px -12% 0px" },
) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion() || !("IntersectionObserver" in window)) {
      setInView(true);
      return;
    }
    const obs = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          setInView(true);
          obs.unobserve(entry.target);
        }
      }
    }, options);
    obs.observe(el);
    return () => obs.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { ref, inView };
}

// ── KPI-Zahl parsen (de-DE: "1.250", "50.000 kg", "44 %", "−125 kg") ──────
type ParsedNumber = {
  num: number;
  prefix: string;
  suffix: string;
  decimals: number;
};

function parseNumeric(raw: string): ParsedNumber | null {
  const match = raw.match(/\d[\d.,\s]*\d|\d/);
  if (!match || match.index === undefined) return null;
  const token = match[0];
  const prefix = raw.slice(0, match.index);
  const suffix = raw.slice(match.index + token.length);

  let normalized = token.replace(/\s/g, "");
  let decimals = 0;
  if (normalized.includes(",")) {
    // Komma = Dezimaltrenner, Punkt = Tausender
    normalized = normalized.replace(/\./g, "").replace(",", ".");
    decimals = (normalized.split(".")[1] ?? "").length;
  } else {
    // nur Punkte: deutsche Tausendertrennung → entfernen
    normalized = normalized.replace(/\./g, "");
  }
  const num = Number.parseFloat(normalized);
  if (Number.isNaN(num)) return null;
  return { num, prefix, suffix, decimals };
}

const deFormat = (n: number, decimals: number) =>
  new Intl.NumberFormat("de-DE", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(n);

// Die Referenz-Daten sind uneinheitlich: mal steckt die Zahl im Feld `value`,
// mal im Feld `label` (Supabase vs. statisches JSON). Hier robust den
// numerischen Teil bestimmen, damit der Count-up immer die Zahl groß zeigt.
export function splitKpi(stat: { value: string; label: string }): {
  number: string;
  caption: string;
} {
  const valueHasDigit = /\d/.test(stat.value);
  const labelHasDigit = /\d/.test(stat.label);
  if (labelHasDigit && !valueHasDigit) {
    return { number: stat.label, caption: stat.value };
  }
  return { number: stat.value, caption: stat.label };
}

type CountUpProps = {
  value: string;
  className?: string;
  durationMs?: number;
};

/** Zählt eine KPI-Zahl von 0 auf den Zielwert, sobald sichtbar. */
export function CountUp({ value, className = "", durationMs = 1400 }: CountUpProps) {
  const parsed = parseNumeric(value);
  const { ref, inView } = useInView<HTMLSpanElement>({ threshold: 0.4 });
  const [display, setDisplay] = useState<string>(parsed ? `${parsed.prefix}0${parsed.suffix}` : value);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!parsed) return;
    if (!inView) return;
    if (prefersReducedMotion()) {
      setDisplay(`${parsed.prefix}${deFormat(parsed.num, parsed.decimals)}${parsed.suffix}`);
      return;
    }
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      const eased = 1 - Math.pow(1 - t, 3);
      const current = parsed.num * eased;
      setDisplay(`${parsed.prefix}${deFormat(current, parsed.decimals)}${parsed.suffix}`);
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  // Nicht-numerische Werte: unverändert ausgeben.
  if (!parsed) {
    return <span className={className}>{value}</span>;
  }

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}

// ── ClipReveal: Bild enthüllt per clip-path-Wipe (+ optional Parallax) ────
type ClipDirection = "left" | "right" | "up" | "down" | "scale";

const CLIP_FROM: Record<ClipDirection, string> = {
  left: "inset(0 100% 0 0)",
  right: "inset(0 0 0 100%)",
  up: "inset(100% 0 0 0)",
  down: "inset(0 0 100% 0)",
  scale: "inset(8% 8% 8% 8%)",
};

type ClipRevealProps = {
  children: ReactNode;
  className?: string;
  direction?: ClipDirection;
  delay?: number;
  durationMs?: number;
  parallax?: number; // px Drift über die Sichtbarkeit (0 = aus)
};

/** Wrapper, der sein Kind per clip-path enthüllt; Bild bleibt danach sichtbar. */
export function ClipReveal({
  children,
  className = "",
  direction = "scale",
  delay = 0,
  durationMs = 1100,
  parallax = 0,
}: ClipRevealProps) {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.15 });
  const innerRef = useRef<HTMLDivElement | null>(null);
  const reduced = typeof window !== "undefined" && prefersReducedMotion();

  // Parallax über Scroll (transform only).
  useEffect(() => {
    if (!parallax || reduced) return;
    const el = innerRef.current;
    if (!el) return;
    let ticking = false;
    const update = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const progress = (rect.top + rect.height / 2 - vh / 2) / vh; // -1..1
      el.style.setProperty("--anim-parallax", `${(-progress * parallax).toFixed(1)}px`);
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parallax, reduced]);

  // WICHTIG: Der IntersectionObserver beobachtet den ÄUSSEREN Wrapper, der NIE
  // beschnitten wird. clip-path liegt auf dem INNEREN Element. Sonst meldet
  // Chromium für den clip-to-zero-Kasten intersectionRatio 0 → Reveal bliebe
  // für immer aus (Henne-Ei-Problem).
  const clipStyle: CSSProperties = reduced
    ? {}
    : {
        clipPath: inView ? "inset(0 0 0 0)" : CLIP_FROM[direction],
        WebkitClipPath: inView ? "inset(0 0 0 0)" : CLIP_FROM[direction],
        transition: `clip-path ${durationMs}ms ${EASE} ${delay}ms, -webkit-clip-path ${durationMs}ms ${EASE} ${delay}ms`,
        willChange: "clip-path",
      };

  return (
    <div ref={ref} className={className} style={{ overflow: "hidden" }}>
      <div
        ref={innerRef}
        style={{
          position: "relative",
          height: "100%",
          width: "100%",
          transform: parallax && !reduced ? "translateY(var(--anim-parallax, 0))" : undefined,
          willChange: parallax ? "transform, clip-path" : "clip-path",
          ...clipStyle,
        }}
      >
        {children}
      </div>
    </div>
  );
}

// ── Stagger: Kinder treten gestaffelt ein (translate + scale + opacity) ───
type StaggerProps = {
  children: ReactNode;
  className?: string;
  step?: number; // ms zwischen Kindern
  y?: number; // px translate
  tag?: keyof JSX.IntrinsicElements;
};

/** Container, dessen direkte .anim-stagger-Kinder gestaffelt einsteigen. */
export function Stagger({
  children,
  className = "",
  step = 90,
  y = 28,
  tag: Tag = "div",
}: StaggerProps) {
  const { ref, inView } = useInView<HTMLElement>({ threshold: 0.15 });
  const Component = Tag as React.ElementType;
  return (
    <Component
      ref={ref}
      className={`${className} anim-stagger-group ${inView ? "is-in" : ""}`}
      style={
        {
          "--anim-step": `${step}ms`,
          "--anim-y": `${y}px`,
        } as CSSProperties
      }
    >
      {children}
    </Component>
  );
}

// ── Rise: einzelnes Element steigt ein ────────────────────────────────────
type RiseProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  tag?: keyof JSX.IntrinsicElements;
};

export function Rise({
  children,
  className = "",
  delay = 0,
  y = 24,
  tag: Tag = "div",
}: RiseProps) {
  const { ref, inView } = useInView<HTMLElement>();
  const reduced = typeof window !== "undefined" && prefersReducedMotion();
  const Component = Tag as React.ElementType;
  const style: CSSProperties = reduced
    ? {}
    : {
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : `translateY(${y}px)`,
        transition: `opacity 800ms ${EASE} ${delay}ms, transform 800ms ${EASE} ${delay}ms`,
        willChange: "opacity, transform",
      };
  return (
    <Component ref={ref} className={className} style={style}>
      {children}
    </Component>
  );
}
