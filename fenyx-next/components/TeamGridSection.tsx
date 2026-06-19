import Image from "next/image";

export type TeamMember = {
  name: string;
  role: string;
  email?: string;
  quote?: string;
  imageSrc: string;
  imageAlt: string;
};

type TeamGridSectionProps = {
  heading: string;
  members: TeamMember[];
  variant: "experts" | "dach";
};

/** Team-Grid: Experten (highlight) oder DACH-Team (Webflow section_team). */
export default function TeamGridSection({
  heading,
  members,
  variant,
}: TeamGridSectionProps) {
  const isExperts = variant === "experts";

  return (
    <section
      className={`team-section${isExperts ? " team-section--signal" : ""}`}
      aria-labelledby={`team-heading-${variant}`}
    >
      <div className="wf-padding-global">
        <div className="wf-container-large">
          <div className="wf-padding-section-large">
            <div className="wf-text-align-center">
              <div className="wf-max-width-large wf-align-center">
                <h2 id={`team-heading-${variant}`} className="wf-heading-h2">
                  {heading}
                </h2>
              </div>
            </div>

            <div className="wf-spacer-xxlarge" aria-hidden="true" />

            <ul
              className={`team-section__grid${
                isExperts ? " team-section__grid--experts" : " team-section__grid--dach"
              }`}
            >
              {members.map((member) => (
                <li key={member.email ?? member.name} className="team-card">
                  <div
                    className={`team-card__image-wrap${
                      isExperts ? " team-card__image-wrap--highlight" : ""
                    }`}
                  >
                    <Image
                      src={member.imageSrc}
                      alt={member.imageAlt}
                      width={480}
                      height={isExperts ? 560 : 480}
                      className="team-card__image"
                      loading="lazy"
                    />
                    {isExperts ? (
                      <div className="team-card__name-overlay">{member.name}</div>
                    ) : null}
                  </div>

                  <div className="team-card__body">
                    {!isExperts ? (
                      <p className="team-card__name">{member.name}</p>
                    ) : null}
                    <p className="team-card__role">{member.role}</p>
                    {member.email ? (
                      <a href={`mailto:${member.email}`} className="team-card__email">
                        {member.email}
                      </a>
                    ) : null}
                    {member.quote ? (
                      <p className="team-card__quote">{member.quote}</p>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
