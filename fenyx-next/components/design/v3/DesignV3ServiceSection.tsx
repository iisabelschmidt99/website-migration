"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export type DesignV3ServiceSectionProps = {
  index: string;
  eyebrow: string;
  title: string;
  body: string;
  /** SpaceX-Spec-Rows: label links (klein, Caps), Wert rechts */
  specs: { label: string; value: string }[];
  href: string;
  imageSrc: string;
  imageAlt: string;
  imageRight?: boolean;
};

/**
 * V3 Info-Section – vollbildig (100svh), SpaceX-Spec-Table, Scroll-Reveal.
 */
export default function DesignV3ServiceSection({
  index,
  eyebrow,
  title,
  body,
  specs,
  href,
  imageSrc,
  imageAlt,
  imageRight = true,
}: DesignV3ServiceSectionProps) {
  const textFirst = !imageRight;
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => setVisible(e.isIntersecting),
      { threshold: 0.08 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className={`dv3-service${visible ? " is-visible" : ""}`}
      aria-labelledby={`dv3-service-heading-${index}`}
    >
      <div className={`dv3-service__inner${textFirst ? " dv3-service__inner--flip" : ""}`}>
        {/* ── Text ─────────────────────────────────────────────────────────── */}
        <div className="dv3-service__text">
          <span className="dv3-service__eyebrow">{eyebrow}</span>
          <h2 id={`dv3-service-heading-${index}`} className="dv3-service__title">
            {title}
          </h2>
          <p className="dv3-service__body">{body}</p>

          {/* SpaceX-Spec-Table */}
          <dl className="dv3-service__specs">
            {specs.map((s) => (
              <div key={s.label} className="dv3-service__spec-row">
                <dt className="dv3-service__spec-label">{s.label}</dt>
                <span className="dv3-service__spec-fill" aria-hidden="true" />
                <dd className="dv3-service__spec-value">{s.value}</dd>
              </div>
            ))}
          </dl>

          <Link href={href} className="dv3-service__link">
            Mehr erfahren <span aria-hidden="true">→</span>
          </Link>
        </div>

        {/* ── Bild – vollflächig, edge-to-edge ─────────────────────────────── */}
        <div className="dv3-service__media">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            className="object-cover object-center"
            sizes="100vw"
            quality={95}
            loading="lazy"
          />
          <div className="dv3-service__media-scrim" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
