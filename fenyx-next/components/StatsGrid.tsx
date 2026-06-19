type StatItem = {
  prefix?: string;
  value: string;
  suffix?: string;
  label: string;
};

type StatsGridProps = {
  heading: string;
  items: StatItem[];
  sectionPadding?: "large" | "xlarge";
};

function chunkItems<T>(items: T[], size: number): T[][] {
  const rows: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    rows.push(items.slice(i, i + size));
  }
  return rows;
}

function StatNumber({ prefix, value, suffix }: Pick<StatItem, "prefix" | "value" | "suffix">) {
  if (prefix === "+") {
    return (
      <div className="stats_number-row">
        <div className="stats_number">
          <span>+</span>
        </div>
        <div className="stats_number">
          <span>{value}</span>
        </div>
      </div>
    );
  }

  if (suffix === "%" && !prefix) {
    return (
      <div className="stats_number-row">
        <div className="stats_number">
          <span>{value}</span>
        </div>
        <div className="stats_number">
          <span>%</span>
        </div>
      </div>
    );
  }

  return (
    <div className="stats_number">
      {prefix}
      <span>{value}</span>
      {suffix}
    </div>
  );
}

/** Kennzahlen-Grid (Webflow section_stats). */
export default function StatsGrid({
  heading,
  items,
  sectionPadding = "large",
}: StatsGridProps) {
  const rows = chunkItems(items, 3);
  const paddingClass =
    sectionPadding === "xlarge" ? "wf-padding-section-xlarge" : "wf-padding-section-large";

  return (
    <section className="section_stats" aria-labelledby="stats-heading">
      <div className="wf-padding-global">
        <div className="wf-container-large">
          <div className={paddingClass}>
            <div className="stats_component wf-text-wrap-balance">
              <div className="wf-max-width-large wf-text-align-center wf-align-center">
                <h2 id="stats-heading" className="wf-heading-h2">
                  {heading}
                </h2>
              </div>

              <div className="wf-spacer-xxlarge" aria-hidden="true" />

              <div className="stats_grid">
                {rows.map((row) => (
                  <div key={row.map((item) => item.label).join("-")} className="stats_list">
                    {row.map((item) => (
                      <div key={item.label} className="stats_item">
                        <StatNumber
                          prefix={item.prefix}
                          value={item.value}
                          suffix={item.suffix}
                        />
                        <div className="wf-spacer-xxsmall" aria-hidden="true" />
                        <h3 className="wf-heading-h6">{item.label}</h3>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
