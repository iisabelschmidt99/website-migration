"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import CtaButton from "./CtaButton";

type Category = {
  id: string;
  label: string;
  hint?: string;
  co2PerWorkstation: number;
  defaultSelected?: boolean;
};

type Co2CalculatorProps = {
  heading: string;
  body: string;
  ctaLabel: string;
  ctaHref: string;
  backgroundSrc: string;
  categories: Category[];
  icons: { car: string; tree: string };
};

const KM_PER_TON = 4117;
const TREES_PER_TON = 16.5;

function calculateSavings(
  workstationCount: number,
  categories: Category[],
  selected: Record<string, boolean>
) {
  const totalKg = categories.reduce((sum, category) => {
    if (!selected[category.id]) return sum;
    return sum + category.co2PerWorkstation * workstationCount;
  }, 0);

  const tons = totalKg / 1000;

  return {
    tons: tons.toFixed(1),
    km: Math.round(tons * KM_PER_TON),
    trees: (tons * TREES_PER_TON).toFixed(1),
  };
}

/** Interaktiver CO₂-Rechner (Webflow section_calculator). */
export default function Co2Calculator({
  heading,
  body,
  ctaLabel,
  ctaHref,
  backgroundSrc,
  categories,
  icons,
}: Co2CalculatorProps) {
  const [workstationCount, setWorkstationCount] = useState(100);
  const [selected, setSelected] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(
      categories.map((category) => [
        category.id,
        category.defaultSelected ?? false,
      ])
    )
  );

  const savings = useMemo(
    () => calculateSavings(workstationCount, categories, selected),
    [workstationCount, categories, selected]
  );

  const toggleCategory = (id: string) => {
    setSelected((current) => ({ ...current, [id]: !current[id] }));
  };

  return (
    <section
      className="co2-calculator relative overflow-hidden text-white"
      aria-labelledby="co2-calculator-heading"
    >
      <div className="absolute inset-0" aria-hidden="true">
        <Image
          src={backgroundSrc}
          alt=""
          fill
          className="object-cover object-center"
          sizes="100vw"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-abyss-deep via-abyss-deep/95 to-[#020405]/80" />
      </div>

      <div className="relative z-[1] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
        <div className="co2-calculator__grid">
          <div className="max-w-xl">
            <h2
              id="co2-calculator-heading"
              className="text-3xl sm:text-4xl font-heading tracking-[-0.03em] mb-5 leading-tight"
            >
              {heading}
            </h2>
            <div className="space-y-4 text-base leading-relaxed text-mist mb-8">
              {body.split("\n\n").map((paragraph) => (
                <p key={paragraph.slice(0, 32)}>{paragraph}</p>
              ))}
            </div>
            <CtaButton href={ctaHref}>{ctaLabel}</CtaButton>
          </div>

          <div className="co2-calculator__panel bg-white text-abyss-deep rounded-[10px] p-6 sm:p-8">
            <h3 className="text-lg sm:text-[22px] font-heading tracking-[-0.02em] mb-4">
              Aus wie vielen Arbeitsplätzen besteht Ihr Büro?
            </h3>

            <div className="flex items-baseline gap-1 mb-2 font-bold text-[#1a2029]">
              <span aria-live="polite">{workstationCount}</span>
              <span>Arbeitsplätze</span>
            </div>

            <input
              type="range"
              min={0}
              max={500}
              value={workstationCount}
              onChange={(event) =>
                setWorkstationCount(Number(event.target.value))
              }
              className="co2-calculator__slider w-full"
              aria-label="Anzahl Arbeitsplätze"
            />
            <div className="flex justify-between mt-2.5 px-1 text-sm text-black/60">
              <span className="font-bold text-black/80">0</span>
              <span>100</span>
              <span>200</span>
              <span>300</span>
              <span>400</span>
              <span className="font-bold text-black/80">500</span>
            </div>

            <div className="mt-10 sm:mt-12">
              <h4 className="text-lg sm:text-[22px] font-heading tracking-[-0.02em] mb-1">
                Von welchen Teilen Ihrer Büroeinrichtung möchten Sie sich
                trennen?
              </h4>
              <p className="text-sm text-black/50 mb-4">
                Zum Auswählen anklicken.
              </p>

              <div className="co2-calculator__categories">
                {categories.map((category) => {
                  const isSelected = selected[category.id];

                  return (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => toggleCategory(category.id)}
                      aria-pressed={isSelected}
                      className={`co2-calculator__category${
                        isSelected ? " co2-calculator__category--selected" : ""
                      }`}
                    >
                      <span className="font-bold text-sm sm:text-base">
                        {category.label}
                      </span>
                      {category.hint ? (
                        <span className="text-sm text-black/60 mt-1">
                          {category.hint}
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-10 sm:mt-12">
              <h5 className="text-lg sm:text-[22px] font-heading tracking-[-0.02em] mb-4">
                Geschätzte Einsparungen:
              </h5>

              <div className="co2-calculator__results">
                <div
                  className="co2-calculator__result-main"
                  aria-live="polite"
                  aria-atomic="true"
                >
                  <span className="text-3xl sm:text-4xl font-heading tracking-[-0.03em] text-abyss-deep">
                    {savings.tons}
                  </span>
                  <span className="text-2xl sm:text-3xl font-heading tracking-[-0.03em] text-abyss-deep">
                    Tonnen CO₂
                  </span>
                </div>

                <div className="co2-calculator__result-equiv">
                  <Image
                    src={icons.car}
                    alt=""
                    width={48}
                    height={48}
                    className="w-12 h-12 mb-2"
                  />
                  <p className="text-sm leading-relaxed text-left">
                    Equivalente Emissionen von{" "}
                    <strong>{savings.km.toLocaleString("de-DE")}</strong>{" "}
                    gefahrenen Kilometern mit einem Auto
                  </p>
                </div>

                <div className="co2-calculator__result-equiv">
                  <Image
                    src={icons.tree}
                    alt=""
                    width={48}
                    height={48}
                    className="w-12 h-12 mb-2"
                  />
                  <p className="text-sm leading-relaxed text-left">
                    Equivalente Kompensation von{" "}
                    <strong>{savings.trees}</strong> gepflanzten Bäumen, die 10
                    Jahre wachsen
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
