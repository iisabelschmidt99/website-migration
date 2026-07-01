"use client";

export default function TabIntro({
  title,
  description,
  hint,
}: {
  title: string;
  description: string;
  hint?: string;
}) {
  return (
    <div className="space-y-3 border border-white/10 bg-white/[0.02] p-4">
      <div>
        <h2 className="text-sm font-semibold text-white">{title}</h2>
        <p className="mt-1 text-sm text-mist">{description}</p>
      </div>
      {hint ? (
        <p className="border border-white/10 bg-abyss-deep px-3 py-2 text-xs text-mist-ash">{hint}</p>
      ) : null}
    </div>
  );
}
