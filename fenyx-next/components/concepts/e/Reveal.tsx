"use client";

// Shared Reveal-Helper für Konzept E (Editorial Premium).
// Selbe Logik wie /d/Reveal, aber .de-* Namespace für saubere Trennung.

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
      className={`${className} de-reveal ${visible ? "is-visible" : ""}`}
      style={{ "--de-delay": `${delay}ms` } as CSSProperties}
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
      className={`${className} de-words ${visible ? "is-visible" : ""}`}
      style={{ "--de-delay": `${delay}ms` } as CSSProperties}
    >
      {words.map((word, i) => (
        <span key={`${word}-${i}`} className="de-word">
          <span
            className="de-word__inner"
            style={{ "--de-i": i } as CSSProperties}
          >
            {word}
          </span>
        </span>
      ))}
    </Component>
  );
}
