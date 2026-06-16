import Image from "next/image";
import Link from "next/link";
import type { MegaMenuConfig } from "@/data/navigation";
import { PROMO } from "@/data/navigation";

type MegaMenuPanelProps = {
  config: MegaMenuConfig;
  isOpen: boolean;
  panelStyle?: React.CSSProperties;
};

function PromoColumn() {
  return (
    <div className="mega-col-promo">
      <div className="mega-promo">
        <div className="mega-promo-media">
          <Image
            src={PROMO.imageSrc}
            alt={PROMO.imageAlt}
            fill
            className="object-cover object-center"
            sizes="(max-width: 1279px) 0px, 360px"
            loading="lazy"
          />
        </div>
        <p className="mega-promo-title">{PROMO.title}</p>
        <Link href={PROMO.href} className="mega-promo-btn">
          Mehr erfahren
        </Link>
      </div>
    </div>
  );
}

/** Vollbreites Mega-Menü-Panel (Leistungen, Cases, Promo). */
export default function MegaMenuPanel({
  config,
  isOpen,
  panelStyle,
}: MegaMenuPanelProps) {
  const isSimple = config.layout === "simple";
  const isTwo = config.layout === "two";

  const panelFullClass = isSimple
    ? "mega-panel-full mega-panel-full--one"
    : isTwo
      ? "mega-panel-full mega-panel-full--two"
      : "mega-panel-full";

  return (
    <div
      className={`mega-panel${isSimple ? " mega-panel--simple" : ""}${
        config.alignEnd ? " mega-panel--end" : ""
      }`}
      role="region"
      aria-label={config.title}
      aria-hidden={!isOpen}
      style={panelStyle}
    >
      <div className={panelFullClass}>
        <div className="mega-col-services">
          <p className="mega-eyebrow mega-eyebrow--dark">{config.eyebrow}</p>
          {config.simpleLinks ? (
            <ul className="mega-link-list">
              {config.simpleLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="mega-link">
                    <span className="mega-link-title">{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <ul className="mega-service-list">
              {config.services.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="mega-service-link">
                    <span className="mega-service-thumb">
                      <Image
                        src={link.imageSrc}
                        alt=""
                        fill
                        className="object-cover object-center"
                        sizes="64px"
                        loading="lazy"
                      />
                    </span>
                    <span className="mega-service-text">
                      <span className="mega-service-title">{link.label}</span>
                      <span className="mega-service-sub">{link.sub}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {config.cases && config.cases.length > 0 && (
          <div className="mega-col-cases">
            <p className="mega-eyebrow mega-eyebrow--signal">Erfolgsgeschichten</p>
            <ul className="mega-case-list">
              {config.cases.map((item) => (
                <li key={item.title}>
                  <Link href={item.href} className="mega-case-link">
                    <span className="mega-case-thumb">
                      <Image
                        src={item.imageSrc}
                        alt=""
                        fill
                        className="object-cover object-center"
                        sizes="64px"
                        loading="lazy"
                      />
                    </span>
                    <span className="mega-case-text">
                      <span className="mega-case-title">{item.title}</span>
                      <span className="mega-case-sub">{item.sub}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {!isSimple && <PromoColumn />}
      </div>
    </div>
  );
}
