/** Grüne Häkchen-Liste wie in der Webflow-Vorlage (Timeline, Video etc.). */

type CheckListProps = {
  items: string[];
  className?: string;
  "aria-label"?: string;
};

function CheckIcon() {
  return (
    <svg
      className="w-4 h-4 shrink-0 mt-0.5 text-signal"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M20 6L9 17L4 12"
      />
    </svg>
  );
}

export default function CheckList({
  items,
  className = "",
  "aria-label": ariaLabel,
}: CheckListProps) {
  return (
    <ul className={`space-y-2.5 ${className}`} aria-label={ariaLabel}>
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2.5 text-sm">
          <CheckIcon />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
