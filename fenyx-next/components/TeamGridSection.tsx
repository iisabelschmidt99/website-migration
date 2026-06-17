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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
        <h2
          id={`team-heading-${variant}`}
          className="team-section__heading text-center"
        >
          {heading}
        </h2>

        <ul
          className={`team-section__grid${
            isExperts ? " team-section__grid--experts" : " team-section__grid--dach"
          }`}
        >
          {members.map((member) => (
            <li key={`${variant}-${member.name}`} className="team-card">
              <div
                className={`team-card__image-wrap${
                  isExperts ? " team-card__image-wrap--highlight" : ""
                }`}
              >
                <Image
                  src={member.imageSrc}
                  alt={member.imageAlt}
                  fill
                  className="object-cover object-center"
                  sizes={
                    isExperts
                      ? "(max-width: 1024px) 50vw, 20vw"
                      : "(max-width: 1024px) 50vw, 15vw"
                  }
                  loading="lazy"
                />
                {isExperts ? (
                  <span className="team-card__name-overlay">{member.name}</span>
                ) : null}
              </div>

              <div className="team-card__meta">
                {!isExperts ? (
                  <p className="team-card__name">{member.name}</p>
                ) : null}
                <p className="team-card__role">{member.role}</p>
                {member.email ? (
                  <a
                    href={`mailto:${member.email}`}
                    className="team-card__email"
                  >
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
    </section>
  );
}
