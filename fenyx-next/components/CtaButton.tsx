import Link from "next/link";

type CtaButtonProps = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "outline";
  className?: string;
};

/** Wiederverwendbarer CTA-Button im Fenyx-Stil (Signal-Grün oder Outline). */
export default function CtaButton({
  href,
  children,
  variant = "primary",
  className = "",
}: CtaButtonProps) {
  const base =
    "inline-flex items-center justify-center px-8 py-4 text-[11px] font-bold uppercase tracking-[0.12em] transition-all duration-200";
  const styles =
    variant === "primary"
      ? "bg-signal text-black hover:brightness-95"
      : "border border-white/25 text-white hover:border-signal hover:text-signal";

  return (
    <Link href={href} className={`${base} ${styles} ${className}`}>
      {children}
    </Link>
  );
}
