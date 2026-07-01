import Image from "next/image";
import { shuffledLogos, splitRows } from "@/components/concepts/shared/logos";

// Konzept G – Logo-Ticker mit eigenem Text + schwarzem Hintergrund.
// Keine Nummerierung, kein Cursor-Hinweis.

const ROWS = 3;
const rows = splitRows(shuffledLogos(20260701), ROWS);

export default function LogoGridArchitecturalG() {
  return (
    <section className="df-ticker dg-ticker" aria-labelledby="dg-ticker-heading">
      {/* Gleiche Container-Struktur wie dg-intro für exaktes Alignment */}
      <div className="dg-ticker__head-wrap wf-padding-global">
        <div className="wf-container-large">
          <h2 id="dg-ticker-heading" className="df-ticker__heading dg-ticker__heading">
            Diese und viele weitere Unternehmen vertrauen bereits auf Fenyx.
          </h2>
          <p className="dg-ticker__body">
            Führende Unternehmen aus verschiedenen Branchen haben sich für nachhaltige
            Bürolösungen von Fenyx entschieden und profitieren von messbaren
            Kosteneinsparungen und zertifizierbarer Nachhaltigkeit.
          </p>
        </div>
      </div>
      <div className="df-ticker__inner dg-ticker__rows-wrap">

          <div className="df-ticker__rows">
          {rows.map((rowLogos, r) => (
            <div
              key={r}
              className={`df-ticker__row df-ticker__row--${r % 2 === 0 ? "ltr" : "rtl"}`}
              style={{ "--df-row-duration": `${75 + r * 30}s` } as React.CSSProperties}
            >
              <ul className="df-ticker__track" role="list">
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
