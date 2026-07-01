"use client";

// Shared Reveal-Helper für Konzept I (Klon von F) (Architectural POV).
// .di-* Namespace. Selbe Logik wie /d und /e.

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  tag?: keyof JSX.IntrinsicElements;
};

export function Reveal({
  children,
  className = "",
  delay = 0,
  tag: Tag = "div",
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduced) {
      setVisible(true);
      return;
    }
    if (
      typeof CSS !== "undefined" &&
      CSS.supports("animation-timeline: view()")
    ) {
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            obs.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.18, rootMargin: "0px 0px -10% 0px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const Component = Tag as React.ElementType;
  return (
    <Component
      ref={ref}
      className={`${className} di-reveal ${visible ? "is-visible" : ""}`}
      style={{ "--di-delay": `${delay}ms` } as CSSProperties}
    >
      {children}
    </Component>
  );
}

type WordRevealProps = {
  text: string;
  className?: string;
  delay?: number;
  tag?: keyof JSX.IntrinsicElements;
  id?: string;
};

export function WordReveal({
  text,
  className = "",
  delay = 0,
  tag: Tag = "h2",
  id,
}: WordRevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);
  const words = text.split(" ");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduced) {
      setVisible(true);
      return;
    }
    if (
      typeof CSS !== "undefined" &&
      CSS.supports("animation-timeline: view()")
    ) {
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            obs.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.35, rootMargin: "0px 0px -15% 0px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const Component = Tag as React.ElementType;
  return (
    <Component
      ref={ref}
      id={id}
      className={`${className} di-words ${visible ? "is-visible" : ""}`}
      style={{ "--di-delay": `${delay}ms` } as CSSProperties}
    >
      {words.map((word, i) => (
        <span key={`${word}-${i}`} className="di-word">
          <span
            className="di-word__inner"
            style={{ "--di-i": i } as CSSProperties}
          >
            {word}
          </span>
        </span>
      ))}
    </Component>
  );
}

// SpecReveal: wraps a <dl class="di-spec"> and toggles .is-visible for
// fallback underline-fill (when CSS scroll-driven not supported).
type SpecRevealProps = {
  children: ReactNode;
  className?: string;
};

export function SpecReveal({ children, className = "" }: SpecRevealProps) {
  const ref = useRef<HTMLDListElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduced) {
      setVisible(true);
      return;
    }
    if (
      typeof CSS !== "undefined" &&
      CSS.supports("animation-timeline: view()")
    ) {
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            obs.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.3, rootMargin: "0px 0px -15% 0px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <dl
      ref={ref}
      className={`${className} di-spec ${visible ? "is-visible" : ""}`}
    >
      {children}
    </dl>
  );
}
