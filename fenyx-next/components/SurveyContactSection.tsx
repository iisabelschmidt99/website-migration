"use client";

// Interaktives Umfrage-Kontaktformular (Prototyp, Test auf /bestandsmanagement/
// digitale-inventarisierung). Ersetzt das statische HubSpot-Formular durch einen
// mehrstufigen, klickbaren "Quiz"-Flow mit catchy Headline.
//
// Hinweis: Der Absenden-Schritt ist bewusst frontend-only (kein HubSpot-Wiring).
// Bei Freigabe kann onSubmit an HubSpot / die dataLayer-Lead-Events angebunden
// werden (siehe HubSpotForm.tsx: trackGenerateLead / pushLead).

import Image from "next/image";
import { useState } from "react";

type Choice = { value: string; label: string; emoji: string };
type Step = {
  key: string;
  question: string;
  hint?: string;
  multi: boolean;
  choices: Choice[];
};

const STEPS: Step[] = [
  {
    key: "interesse",
    question: "Woran habt ihr Interesse?",
    hint: "Mehrfachauswahl möglich.",
    multi: true,
    choices: [
      { value: "refurbished", label: "Refurbished Möbel", emoji: "♻️" },
      { value: "miete", label: "Möbel mieten", emoji: "📅" },
      { value: "kauf", label: "Neu kaufen", emoji: "🛋️" },
      { value: "verwertung", label: "Bestand verwerten", emoji: "📦" },
      { value: "unklar", label: "Noch unklar – beratet mich", emoji: "🤔" },
    ],
  },
  {
    key: "groesse",
    question: "Wie viele Arbeitsplätze umfasst euer Büro?",
    multi: false,
    choices: [
      { value: "s", label: "Bis 20", emoji: "🌱" },
      { value: "m", label: "20 – 50", emoji: "🏢" },
      { value: "l", label: "50 – 150", emoji: "🏬" },
      { value: "xl", label: "Mehr als 150", emoji: "🏙️" },
    ],
  },
  {
    key: "zeitpunkt",
    question: "Wann soll es losgehen?",
    multi: false,
    choices: [
      { value: "sofort", label: "So schnell wie möglich", emoji: "⚡" },
      { value: "quartal", label: "In 1 – 3 Monaten", emoji: "🗓️" },
      { value: "halbjahr", label: "In 3 – 6 Monaten", emoji: "🌤️" },
      { value: "stoebern", label: "Erstmal nur stöbern", emoji: "👀" },
    ],
  },
];

type Answers = Record<string, string[]>;

export type SurveyContactSectionProps = {
  email: string;
  phone: string;
  portraitSrc: string;
  portraitAlt: string;
  quote: string;
  name: string;
  role: string;
};

export default function SurveyContactSection({
  email,
  phone,
  portraitSrc,
  portraitAlt,
  quote,
  name,
  role,
}: SurveyContactSectionProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [contact, setContact] = useState({ name: "", email: "", company: "" });
  const [submitted, setSubmitted] = useState(false);

  const totalSteps = STEPS.length + 1; // + Kontaktschritt
  const isContactStep = stepIndex === STEPS.length;
  const step = STEPS[stepIndex];
  const progress = Math.round(((stepIndex + (submitted ? 1 : 0)) / totalSteps) * 100);

  function toggleChoice(stepKey: string, value: string, multi: boolean) {
    setAnswers((prev) => {
      const current = prev[stepKey] ?? [];
      if (multi) {
        const next = current.includes(value)
          ? current.filter((v) => v !== value)
          : [...current, value];
        return { ...prev, [stepKey]: next };
      }
      return { ...prev, [stepKey]: [value] };
    });
  }

  const currentSelection = step ? answers[step.key] ?? [] : [];
  const canAdvance = isContactStep
    ? contact.name.trim() !== "" && /\S+@\S+\.\S+/.test(contact.email)
    : currentSelection.length > 0;

  function next() {
    if (!canAdvance) return;
    if (isContactStep) {
      // Prototyp: nur Frontend. Hier später HubSpot / Lead-Tracking anbinden.
      setSubmitted(true);
      return;
    }
    setStepIndex((i) => i + 1);
  }
  function back() {
    setStepIndex((i) => Math.max(0, i - 1));
  }

  return (
    <section
      id="kontakt"
      className="service-contact bg-gradient-to-b from-black-gradient to-abyss-deep"
      aria-labelledby="survey-kontakt-heading"
    >
      <div className="wf-padding-global">
        <div className="wf-container-large">
          <div className="wf-padding-section-large">
            <div className="service-contact__grid">
              <div className="service-contact__portrait">
                <Image
                  src={portraitSrc}
                  alt={portraitAlt}
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  loading="lazy"
                />
                <div
                  className="service-contact__portrait-overlay"
                  aria-hidden="true"
                />
                <div className="service-contact__portrait-caption">
                  <p className="service-contact__quote">{quote}</p>
                  <div className="service-contact__person">
                    <p className="service-contact__name">{name}</p>
                    <p className="service-contact__role">{role}</p>
                  </div>
                </div>
              </div>

              <div className="service-contact__form survey">
                <p className="survey__eyebrow">In unter einer Minute</p>
                <h2 id="survey-kontakt-heading" className="survey__headline">
                  Refurbished, mieten oder kaufen?
                </h2>
                <p className="survey__subline">
                  Klick dich durch – wir finden heraus, was für euer Büro am
                  meisten Sinn ergibt, und melden uns mit einem passenden
                  Vorschlag.
                </p>

                {!submitted && (
                  <>
                    <div
                      className="survey__progress"
                      role="progressbar"
                      aria-valuenow={progress}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    >
                      <span
                        className="survey__progress-bar"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <p className="survey__step-count">
                      Schritt {stepIndex + 1} von {totalSteps}
                    </p>
                  </>
                )}

                {submitted ? (
                  <div className="survey__done" key="done">
                    <div className="survey__done-badge" aria-hidden="true">
                      ✓
                    </div>
                    <h3 className="survey__done-title">
                      Danke, {contact.name.split(" ")[0] || "und bis gleich"}!
                    </h3>
                    <p className="survey__done-text">
                      Wir haben eure Angaben erhalten und melden uns in Kürze mit
                      einem passenden Vorschlag. Bei Eile erreicht ihr uns direkt:
                    </p>
                    <div className="survey__done-links">
                      <a href={`mailto:${email}`}>{email}</a>
                      <a href={`tel:${phone.replace(/\s/g, "")}`}>{phone}</a>
                    </div>
                  </div>
                ) : isContactStep ? (
                  <div className="survey__panel" key="contact">
                    <h3 className="survey__question">
                      Fast geschafft – wohin dürfen wir den Vorschlag schicken?
                    </h3>
                    <div className="survey__fields">
                      <input
                        type="text"
                        className="survey__input"
                        placeholder="Name"
                        value={contact.name}
                        onChange={(e) =>
                          setContact({ ...contact, name: e.target.value })
                        }
                        autoComplete="name"
                      />
                      <input
                        type="email"
                        className="survey__input"
                        placeholder="E-Mail"
                        value={contact.email}
                        onChange={(e) =>
                          setContact({ ...contact, email: e.target.value })
                        }
                        autoComplete="email"
                      />
                      <input
                        type="text"
                        className="survey__input"
                        placeholder="Unternehmen (optional)"
                        value={contact.company}
                        onChange={(e) =>
                          setContact({ ...contact, company: e.target.value })
                        }
                        autoComplete="organization"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="survey__panel" key={step.key}>
                    <h3 className="survey__question">{step.question}</h3>
                    {step.hint && <p className="survey__hint">{step.hint}</p>}
                    <div className="survey__choices">
                      {step.choices.map((choice) => {
                        const selected = currentSelection.includes(choice.value);
                        return (
                          <button
                            type="button"
                            key={choice.value}
                            className={`survey__choice${
                              selected ? " is-selected" : ""
                            }`}
                            aria-pressed={selected}
                            onClick={() =>
                              toggleChoice(step.key, choice.value, step.multi)
                            }
                          >
                            <span className="survey__choice-emoji" aria-hidden="true">
                              {choice.emoji}
                            </span>
                            <span className="survey__choice-label">
                              {choice.label}
                            </span>
                            <span className="survey__choice-check" aria-hidden="true">
                              ✓
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {!submitted && (
                  <div className="survey__nav">
                    {stepIndex > 0 ? (
                      <button
                        type="button"
                        className="survey__back"
                        onClick={back}
                      >
                        ← Zurück
                      </button>
                    ) : (
                      <span />
                    )}
                    <button
                      type="button"
                      className="survey__next"
                      onClick={next}
                      disabled={!canAdvance}
                    >
                      {isContactStep ? "Absenden" : "Weiter →"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
