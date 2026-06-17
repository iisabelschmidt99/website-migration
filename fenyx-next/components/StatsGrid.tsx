type StatItem = {
  prefix?: string;
  value: string;
  suffix?: string;
  label: string;
};

type StatsGridProps = {
  heading: string;
  items: StatItem[];
};

/** Kennzahlen-Grid (Webflow section_stats). */
export default function StatsGrid({ heading, items }: StatsGridProps) {
  return (
    <section
      className="py-20 sm:py-28 bg-abyss-deep text-white"
      aria-labelledby="stats-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2
          id="stats-heading"
          className="text-3xl sm:text-4xl font-heading tracking-[-0.03em] text-center mb-14 sm:mb-16"
        >
          {heading}
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10 sm:gap-x-8 sm:gap-y-12">
          {items.map((item) => (
            <div key={item.label} className="text-center">
              <p className="text-4xl sm:text-5xl font-black tracking-[-0.03em] text-signal mb-3 leading-none">
                {item.prefix === "+" ? (
                  <span className="inline-flex flex-col items-center gap-0.5">
                    <span>+</span>
                    <span>{item.value}</span>
                  </span>
                ) : (
                  <>
                    {item.prefix}
                    {item.value}
                    {item.suffix}
                  </>
                )}
              </p>
              <h3 className="text-sm sm:text-base font-semibold leading-snug">
                {item.label}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
