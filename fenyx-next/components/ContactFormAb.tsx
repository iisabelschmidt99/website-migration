"use client";

import { useEffect, useState } from "react";
import HubSpotForm from "./HubSpotForm";
import SurveyContactForm from "./SurveyContactForm";
import {
  pickContactFormVariant,
  type ContactFormVariant,
} from "@/lib/contact-form-variant";

type ContactFormAbProps = {
  forcedVariant?: ContactFormVariant;
  heading: string;
  subline?: string;
  email: string;
  phone: string;
  headingId: string;
  trackSurface: string;
  trackEmailId: string;
  trackPhoneId: string;
};

export default function ContactFormAb({
  forcedVariant,
  heading,
  subline,
  email,
  phone,
  headingId,
  trackSurface,
  trackEmailId,
  trackPhoneId,
}: ContactFormAbProps) {
  const [variant, setVariant] = useState<ContactFormVariant | null>(
    forcedVariant ?? null,
  );

  useEffect(() => {
    setVariant(forcedVariant ?? pickContactFormVariant());
  }, [forcedVariant]);

  if (!variant) {
    return (
      <div
        className="service-contact__form min-h-[320px]"
        aria-hidden="true"
      />
    );
  }

  if (variant === "B") {
    return (
      <div className="service-contact__form survey">
        <SurveyContactForm
          email={email}
          phone={phone}
          headingId={headingId}
        />
      </div>
    );
  }

  return (
    <div className="service-contact__form contact-form-a">
      <h2 id={headingId} className="wf-heading-h2 text-white mb-6">
        {heading}
      </h2>
      {subline ? (
        <p className="text-mist text-sm sm:text-base leading-relaxed mb-6">
          {subline}
        </p>
      ) : null}

      <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 mb-8 text-sm">
        <a
          href={`mailto:${email}`}
          className="flex items-center gap-2 text-mist hover:text-signal transition-colors"
          data-track-surface={trackSurface}
          data-track-id={trackEmailId}
        >
          <svg
            className="w-4 h-4 shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
          {email}
        </a>
        <a
          href={`tel:${phone.replace(/\s/g, "")}`}
          className="flex items-center gap-2 text-mist hover:text-signal transition-colors"
          data-track-surface={trackSurface}
          data-track-id={trackPhoneId}
        >
          <svg
            className="w-4 h-4 shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
            />
          </svg>
          {phone}
        </a>
      </div>

      <HubSpotForm leadSurface={`${trackSurface}_a`} />
    </div>
  );
}
