import Image from "next/image";
import { shuffledLogos, splitRows, validHomepageLogos } from "@/components/concepts/shared/logos";

/**
* Konzept F – Infinite Logo-Ticker.
*
* Alle Partner in 3 horizontalen Ticker-Reihen, verschiedene Geschwindigkeiten
* + Richtungen. Pause on Hover. Architektonisch-dynamisch, fühlt sich „lebendig"
* an ohne pro-Logo-Spielerei.
*
* Reihen aus deterministischem Shuffle (SSR/CSR-stabil). Inhalte werden pro
* Reihe dupliziert, damit der Loop nahtlos ist (translateX 0 → -50%).
* Server-Komponente (reine CSS-Animation).
*/

const ROWS = 3;
const rows = splitRows(shuffledLogos(20260701), ROWS);

export default function LogoGridArchitectural() {
  return (
    <section className="df-ticker" aria-labelledby="df-ticker-heading">
      <div className="df-ticker__inner">
        <header className="df-ticker__head">
          <div>
            <p className="df-ticker__eyebrow">02 / 03 — Partner</p>
            <h2 id="df-ticker-heading" className="df-ticker__heading">
              {validHomepageLogos.length} Marken weltweit vertrauen auf Fenyx.
            </h2>
          </div>
          <p className="df-ticker__meta">— bewegen Sie den Cursor über eine Reihe zum Pausieren</p>
        </header>

        <div className="df-ticker__rows">
          {rows.map((rowLogos, r) => (
            <div
              key={r}
              className={`df-ticker__row df-ticker__row--${r % 2 === 0 ? "ltr" : "rtl"}`}
              style={{ "--df-row-duration": `${75 + r * 30}s` } as React.CSSProperties}
            >
              {/* Inhalt doppeln für nahtlosen Loop. */}
              <ul className="df-ticker__track" role="list" aria-hidden={false}>
                {rowLogos.map((logo) => (
                  <li key={logo.src} className="df-ticker__cell">
                    <Image
                      src={logo.src}
                      alt={logo.alt}
                      width={130}
                      height={36}
                      loading="lazy"
                      className="df-ticker__img"
                    />
                  </li>
                ))}
              </ul>
              <ul className="df-ticker__track" role="list" aria-hidden>
                {rowLogos.map((logo) => (
                  <li key={`${logo.src}-dup`} className="df-ticker__cell">
                    <Image
                      src={logo.src}
                      alt={logo.alt}
                      width={130}
                      height={36}
                      loading="lazy"
                      className="df-ticker__img"
                    />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
