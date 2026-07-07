"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import MegaMenuPanel from "./MegaMenuPanel";
import {
  DIRECT_LINKS,
  MEGA_MENUS,
  type MegaMenuConfig,
} from "@/data/navigation";

/** Pfade mit hellem Hero – Header bleibt durchgehend dunkel/solid. */
const LIGHT_HEADER_PATHS = [
  "/bestandsmanagement/digitale-inventarisierung",
  "/bestandsmanagement/projektmanagement",
  // Konzept-Vorschauen mit hellem Hero (mist-soft) – transparenter Header
  // mit weißer Schrift wäre dort unlesbar.
  "/e",
  "/f",
  "/i",
  "/h",
];

export default function Header() {
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [openId, setOpenId] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<Record<string, boolean>>(
    {}
  );
  const [isScrolled, setIsScrolled] = useState(false);
  const [panelTop, setPanelTop] = useState<number>(0);

  const isLightHeader = LIGHT_HEADER_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );
  const isMenuOpen = openId !== null || mobileOpen;

  const updateScrollState = useCallback(() => {
    if (isLightHeader) {
      setIsScrolled(true);
      return;
    }
    setIsScrolled(window.scrollY > 20);
  }, [isLightHeader]);

  const positionPanel = useCallback(() => {
    const header = headerRef.current;
    if (!header || window.innerWidth < 1024) return;
    setPanelTop(header.getBoundingClientRect().bottom);
  }, []);

  const closeAll = useCallback(() => {
    setOpenId(null);
  }, []);

  const openMenu = useCallback(
    (id: string) => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
      setOpenId(id);
      requestAnimationFrame(positionPanel);
    },
    [positionPanel]
  );

  const scheduleClose = useCallback(() => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    closeTimerRef.current = setTimeout(closeAll, 160);
  }, [closeAll]);

  useEffect(() => {
    updateScrollState();
    positionPanel();
    window.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("scroll", positionPanel, { passive: true });
    window.addEventListener("resize", updateScrollState, { passive: true });
    window.addEventListener("resize", positionPanel, { passive: true });

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeAll();
    };
    document.addEventListener("keydown", onKeyDown);

    const onDocumentClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        !target.closest(".mega-item") &&
        !target.closest(".mega-panel")
      ) {
        closeAll();
      }
    };
    document.addEventListener("click", onDocumentClick);

    return () => {
      window.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("scroll", positionPanel);
      window.removeEventListener("resize", updateScrollState);
      window.removeEventListener("resize", positionPanel);
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("click", onDocumentClick);
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, [updateScrollState, positionPanel, closeAll]);

  useEffect(() => {
    closeAll();
    setMobileOpen(false);
    updateScrollState();
  }, [pathname, closeAll, updateScrollState]);

  const handleTriggerClick = (menu: MegaMenuConfig) => {
    setOpenId((current) => (current === menu.id ? null : menu.id));
    requestAnimationFrame(positionPanel);
  };

  const headerClass = [
    "site-header",
    "fixed top-0 left-0 right-0 z-50",
    isScrolled || isMenuOpen ? "is-scrolled" : "",
    isMenuOpen ? "is-menu-open" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <header id="site-header" ref={headerRef} className={headerClass}>
      <div className="site-nav-container">
        <div className="flex w-full items-center h-16 lg:h-[72px]">
          <Link
            href="/"
            className="site-header-logo flex items-center shrink-0 self-center leading-none"
            data-track-event="cta_click"
            data-track-id="header__logo__home"
          >
            <Image
              src="/assets/fenyx-logo-header.png"
              alt="FENYX"
              width={82}
              height={18}
              className="h-4 sm:h-[17px] lg:h-[18px] w-auto object-contain"
              priority
            />
          </Link>

          <div className="ml-auto flex items-center gap-4 xl:gap-6">
            <nav
              className="hidden lg:flex items-center gap-5 xl:gap-6"
              aria-label="Hauptnavigation"
            >
              {MEGA_MENUS.map((menu) => {
                const isOpen = openId === menu.id;
                return (
                  <div
                    key={menu.id}
                    className={`mega-item relative${
                      menu.alignEnd ? " mega-item--end" : ""
                    }${isOpen ? " is-open" : ""}`}
                    onMouseEnter={() => {
                      if (window.innerWidth >= 1024) openMenu(menu.id);
                    }}
                    onMouseLeave={() => {
                      if (window.innerWidth >= 1024) scheduleClose();
                    }}
                  >
                    <button
                      type="button"
                      className="mega-trigger"
                      aria-expanded={isOpen}
                      aria-haspopup="true"
                      onClick={() => handleTriggerClick(menu)}
                    >
                      {menu.title}
                    </button>
                    {isOpen && (
                      <div
                        onMouseEnter={() => {
                          if (closeTimerRef.current)
                            clearTimeout(closeTimerRef.current);
                        }}
                        onMouseLeave={scheduleClose}
                      >
                        <MegaMenuPanel
                          config={menu}
                          isOpen={isOpen}
                          panelStyle={
                            menu.layout === "simple"
                              ? undefined
                              : { top: panelTop }
                          }
                        />
                      </div>
                    )}
                  </div>
                );
              })}

              {DIRECT_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="mega-direct-link"
                  data-track-event="cta_click"
                  data-track-id={`header__direct__${link.label.toLowerCase().replace(/\s+/g, "_")}`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <Link
              href="/#kontakt"
              className="hidden sm:inline-flex items-center px-5 py-2.5 bg-signal text-black text-[11px] font-bold uppercase tracking-[0.1em] hover:brightness-95 transition-all duration-200"
              data-track-event="cta_click"
              data-track-id="header__cta__kontakt"
              data-track-label="Kontakt"
            >
              Kontakt
            </Link>

            <button
              id="menu-toggle"
              type="button"
              className="lg:hidden p-2 text-white hover:text-signal transition-colors"
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
              aria-label={mobileOpen ? "Menü schließen" : "Menü öffnen"}
              onClick={() => setMobileOpen((v) => !v)}
            >
              {mobileOpen ? (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      <nav
        id="mobile-menu"
        className={`lg:hidden bg-black border-t border-white/5 max-h-[80vh] overflow-y-auto${
          mobileOpen ? "" : " hidden"
        }`}
        aria-label="Mobile Navigation"
      >
        <div className="wf-padding-global py-4 space-y-1">
          {MEGA_MENUS.map((menu) => {
            const expanded = mobileExpanded[menu.id] ?? false;
            const links =
              menu.simpleLinks ??
              menu.services.map((s) => ({ label: s.label, href: s.href }));

            return (
              <div key={menu.id}>
                <button
                  type="button"
                  className="mobile-mega-trigger"
                  aria-expanded={expanded}
                  onClick={() =>
                    setMobileExpanded((prev) => ({
                      ...prev,
                      [menu.id]: !prev[menu.id],
                    }))
                  }
                >
                  {menu.title}
                </button>
                {expanded && (
                  <div className="pl-3 pb-2 space-y-1">
                    {links.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="mobile-nav-link block px-3 py-2 text-white/70 hover:text-signal text-sm"
                        onClick={() => setMobileOpen(false)}
                        data-track-event="cta_click"
                        data-track-id={`mobile_nav__${menu.id}__${link.label.toLowerCase().replace(/\s+/g, "_")}`}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {DIRECT_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="mobile-nav-link block px-3 py-3 text-white/70 hover:text-signal text-sm font-semibold uppercase tracking-wider"
              onClick={() => setMobileOpen(false)}
              data-track-event="cta_click"
              data-track-id={`mobile_nav__direct__${link.label.toLowerCase().replace(/\s+/g, "_")}`}
            >
              {link.label}
            </Link>
          ))}

          <Link
            href="/#kontakt"
            className="mobile-nav-link block mt-2 px-5 py-3 bg-signal text-black text-sm font-bold uppercase tracking-wider text-center hover:brightness-95 transition-all"
            onClick={() => setMobileOpen(false)}
            data-track-event="cta_click"
            data-track-id="mobile_nav__cta__kontakt"
            data-track-label="Kontakt"
          >
            Kontakt
          </Link>
        </div>
      </nav>
    </header>
  );
}
