"use client";

import { useState } from "react";
import { trackEvent } from "@/lib/analytics/tracker";

export type FaqItem = {
  question: string;
  answer: string;
};

type FaqSectionProps = {
  heading?: string;
  items: FaqItem[];
  dark?: boolean;
};

/** Aufklappbare FAQ-Liste. */
export default function FaqSection({
  heading = "Häufige Fragen",
  items,
  dark = false,
}: FaqSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section
      className={`py-20 sm:py-28 ${dark ? "faq-section--dark bg-abyss-deep text-white" : "bg-white"}`}
      aria-labelledby="faq-heading"
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2
          id="faq-heading"
          className={`text-3xl sm:text-4xl font-heading tracking-[-0.03em] mb-10 text-center ${
            dark ? "text-white" : "text-black"
          }`}
        >
          {heading}
        </h2>
        <div className="faq-list">
          {items.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={item.question}
                className={`faq-item${isOpen ? " is-open" : ""}`}
              >
                <button
                  type="button"
                  className="faq-trigger"
                  aria-expanded={isOpen}
                  onClick={() => {
                    setOpenIndex(isOpen ? null : index);
                    if (!isOpen) {
                      trackEvent("faq_open", {
                        question_id: `faq_${index + 1}`,
                        question: item.question,
                      });
                    }
                  }}
                >
                  {item.question}
                  <svg
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                <div className="faq-answer">
                  <p>{item.answer}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
