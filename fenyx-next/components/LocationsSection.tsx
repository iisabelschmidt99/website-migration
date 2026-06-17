"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

type Location = {
  slug: string;
  city: string;
  href: string;
  top: number;
  left: number;
};

type LocationsSectionProps = {
  heading: string;
  mapSrc: string;
  locations: Location[];
  variant?: "default" | "gradient";
};

function LocationIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      className="locations-section__icon"
      aria-hidden="true"
    >
      <path
        d="M19 9C19 8.08075 18.8189 7.1705 18.4672 6.32122C18.1154 5.47194 17.5998 4.70026 16.9497 4.05025C16.2997 3.40024 15.5281 2.88463 14.6788 2.53284C13.8295 2.18106 12.9193 2 12 2C11.0807 2 10.1705 2.18106 9.32122 2.53284C8.47194 2.88463 7.70026 3.40024 7.05025 4.05025C6.40024 4.70026 5.88463 5.47194 5.53284 6.32122C5.18106 7.1705 5 8.08075 5 9C5 10.387 5.409 11.677 6.105 12.765H6.097L12 22L17.903 12.765H17.896C18.6169 11.6416 19.0001 10.3348 19 9ZM12 12C11.2044 12 10.4413 11.6839 9.87868 11.1213C9.31607 10.5587 9 9.79565 9 9C9 8.20435 9.31607 7.44129 9.87868 6.87868C10.4413 6.31607 11.2044 6 12 6C12.7956 6 13.5587 6.31607 14.1213 6.87868C14.6839 7.44129 15 8.20435 15 9C15 9.79565 14.6839 10.5587 14.1213 11.1213C13.5587 11.6839 12.7956 12 12 12Z"
        fill="currentColor"
      />
    </svg>
  );
}

/** Standorte-Liste mit interaktiver Europakarte (Webflow section_locations). */
export default function LocationsSection({
  heading,
  mapSrc,
  locations,
  variant = "default",
}: LocationsSectionProps) {
  const [activeSlug, setActiveSlug] = useState<string | null>(null);

  return (
    <section
      className={`locations-section${
        variant === "gradient" ? " locations-section--gradient" : ""
      }`}
      aria-labelledby="locations-heading"
    >
      <div className="max-w-[80rem] mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
        <div className="locations-section__layout">
          <div>
            <h2 id="locations-heading" className="locations-section__heading">
              {heading}
            </h2>

            <ul className="locations-section__list">
              {locations.map((location) => {
                const isActive = activeSlug === location.slug;
                return (
                  <li key={location.slug}>
                    <Link
                      href={location.href}
                      className={`locations-section__link${
                        isActive ? " is-active" : ""
                      }`}
                      onMouseEnter={() => setActiveSlug(location.slug)}
                      onMouseLeave={() => setActiveSlug(null)}
                      onFocus={() => setActiveSlug(location.slug)}
                      onBlur={() => setActiveSlug(null)}
                    >
                      <span className="locations-section__link-inner">
                        <LocationIcon />
                        <span className="locations-section__city">
                          Standort {location.city}
                        </span>
                      </span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 16 16"
                        fill="none"
                        className="locations-section__arrow"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M5.50048 4H12.0005V10.5H11.0005V5.707L4.85448 11.854L4.14648 11.146L10.2935 5H5.50048V4Z"
                          fill="currentColor"
                        />
                      </svg>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="locations-section__map">
            <Image
              src={mapSrc}
              alt=""
              width={1128}
              height={1253}
              className="locations-section__map-image"
              loading="lazy"
            />

            <div className="locations-section__dots" aria-hidden="true">
              {locations.map((location) => {
                const isActive = activeSlug === location.slug;
                return (
                  <Link
                    key={location.slug}
                    href={location.href}
                    className={`locations-section__dot${
                      isActive ? " is-active" : ""
                    }`}
                    style={{
                      top: `${location.top}%`,
                      left: `${location.left}%`,
                    }}
                    onMouseEnter={() => setActiveSlug(location.slug)}
                    onMouseLeave={() => setActiveSlug(null)}
                    onFocus={() => setActiveSlug(location.slug)}
                    onBlur={() => setActiveSlug(null)}
                    tabIndex={-1}
                    aria-hidden="true"
                  >
                    <span className="locations-section__dot-pulse" />
                    <span className="locations-section__dot-label">
                      {location.city}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
