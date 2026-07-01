"use client";

export default function TabNav<T extends string>({
  tabs,
  active,
  onChange,
}: {
  tabs: { id: T; label: string }[];
  active: T;
  onChange: (id: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2 border-b border-white/10 pb-3">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={`px-3 py-2 text-xs font-bold uppercase tracking-[0.12em] ${
            active === tab.id ? "bg-signal text-black" : "border border-white/10 text-mist hover:text-white"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
