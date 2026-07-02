"use client";

// Variante B des Kontaktformulars — verzweigter Wizard (siehe
// Kontaktformular_AB-Test_Plan.md). Frontend-Prototyp: das Absenden ist noch
// NICHT an HubSpot angebunden. Bei Freigabe: Antworten (siehe buildPayload)
// per HubSpot Forms-API in das Backend-Formular B einspeisen und
// trackGenerateLead / pushLead auslösen (vgl. HubSpotForm.tsx).

import Image from "next/image";
import { useMemo, useRef, useState } from "react";

type Option = { value: string; label: string };
type SelectStep = {
  kind: "select";
  key: "kundentyp" | "interesse" | "arbeitsplaetze" | "verwertungsart" | "zeithorizont";
  question: string;
  hint?: string;
  options: Option[];
};
type ContactStep = { kind: "contact"; privat: boolean };
type FlowStep = SelectStep | ContactStep;

type Answers = Partial<Record<SelectStep["key"], string>>;

const INTERESSE_OPTIONS: Option[] = [
  { value: "einrichten", label: "Büro einrichten" },
  { value: "mieten", label: "Möbel mieten" },
  { value: "kaufen", label: "Möbel kaufen" },
  { value: "verwerten", label: "Bestand aufnehmen oder verwerten" },
];

/** Baut die Schrittfolge dynamisch aus den bisherigen Antworten (Verzweigung). */
function buildFlow(a: Answers): FlowStep[] {
  const flow: FlowStep[] = [
    {
      kind: "select",
      key: "kundentyp",
      question: "Für wen planen wir?",
      options: [
        { value: "geschaeft", label: "Geschäftskunde" },
        { value: "privat", label: "Privatkunde" },
      ],
    },
    {
      kind: "select",
      key: "interesse",
      question: "Worum geht es?",
      options: INTERESSE_OPTIONS,
    },
  ];

  if (a.kundentyp === "privat") {
    flow.push({ kind: "contact", privat: true });
    return flow;
  }
  if (a.kundentyp !== "geschaeft") return flow; // noch nicht gewählt

  if (a.interesse === "verwerten") {
    flow.push({
      kind: "select",
      key: "verwertungsart",
      question: "Welche Art der Verwertung passt?",
      options: [
        { value: "ankauf", label: "Ankauf" },
        { value: "spende", label: "Spende" },
        { value: "aufbereitung", label: "Aufbereitung" },
        { value: "inventarisierung", label: "Inventarisierung" },
      ],
    });
  } else if (a.interesse) {
    flow.push({
      kind: "select",
      key: "arbeitsplaetze",
      question: "Wie viele Arbeitsplätze umfasst Ihr Büro?",
      options: [
        { value: "bis20", label: "Bis 20" },
        { value: "20-50", label: "20 – 50" },
        { value: "50-150", label: "50 – 150" },
        { value: "ueber150", label: "Mehr als 150" },
      ],
    });
  } else {
    return flow; // Interesse noch offen
  }

  flow.push({
    kind: "select",
    key: "zeithorizont",
    question: "Wann soll es losgehen?",
    options: [
      { value: "asap", label: "So schnell wie möglich" },
      { value: "1-3", label: "In 1 – 3 Monaten" },
      { value: "3-6", label: "In 3 – 6 Monaten" },
      { value: "stoebern", label: "Erstmal stöbern" },
    ],
  });
  flow.push({ kind: "contact", privat: false });
  return flow;
}

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
  const [answers, setAnswers] = useState<Answers>({});
  const [stepIndex, setStepIndex] = useState(0);
  const [contact, setContact] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const flow = useMemo(() => buildFlow(answers), [answers]);
  const clampedIndex = Math.min(stepIndex, flow.length - 1);
  const step = flow[clampedIndex];
  const progress = submitted
    ? 100
    : Math.round((clampedIndex / flow.length) * 100);

  function chooseOption(stepKey: SelectStep["key"], value: string) {
    const nextAnswers: Answers = { ...answers, [stepKey]: value };
    // Nachgelagerte Antworten verwerfen, wenn eine frühere Weiche neu gestellt wird
    if (stepKey === "kundentyp") {
      delete nextAnswers.interesse;
      delete nextAnswers.arbeitsplaetze;
      delete nextAnswers.verwertungsart;
      delete nextAnswers.zeithorizont;
    }
    if (stepKey === "interesse") {
      delete nextAnswers.arbeitsplaetze;
      delete nextAnswers.verwertungsart;
    }
    setAnswers(nextAnswers);

    const nextFlow = buildFlow(nextAnswers);
    if (advanceTimer.current) clearTimeout(advanceTimer.current);
    advanceTimer.current = setTimeout(() => {
      setStepIndex((i) => Math.min(i + 1, nextFlow.length - 1));
    }, 260);
  }

  function back() {
    if (advanceTimer.current) clearTimeout(advanceTimer.current);
    setStepIndex((i) => Math.max(0, i - 1));
  }

  const contactValid =
    contact.name.trim() !== "" && /\S+@\S+\.\S+/.test(contact.email);

  function buildPayload() {
    const projektart =
      answers.interesse === "verwerten" ? "Liquidierung" : "Einrichtung";
    return {
      kundentyp: answers.kundentyp === "privat" ? "Privatkunde" : "Geschäftskunde",
      interesse: answers.interesse ?? "",
      projektart,
      arbeitsplaetze: answers.arbeitsplaetze ?? "",
      verwertungsart: answers.verwertungsart ?? "",
      zeithorizont: answers.zeithorizont ?? "",
      ...contact,
    };
  }

  function submit() {
    if (!contactValid) return;
    // TODO(HubSpot): buildPayload() an Forms-API / Backend-Formular B senden
    // und trackGenerateLead("contact_form", "survey_b") auslösen.
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.log("Survey B Submission:", buildPayload());
    }
    setSubmitted(true);
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
                  Was dürfen wir für Sie tun?
                </h2>
                <p className="survey__subline">
                  Ein paar Klicks genügen – wir melden uns mit einem passenden
                  Vorschlag für Ihr Büro.
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
                      Schritt {clampedIndex + 1} von {flow.length}
                    </p>
                  </>
                )}

                {submitted ? (
                  <div className="survey__done" key="done">
                    <div className="survey__done-badge" aria-hidden="true">
                      ✓
                    </div>
                    <h3 className="survey__done-title">
                      Vielen Dank
                      {contact.name ? `, ${contact.name.split(" ")[0]}` : ""}!
                    </h3>
                    <p className="survey__done-text">
                      {answers.kundentyp === "privat"
                        ? "Wir leiten Ihre Anfrage an unseren Partner Office for Sale weiter – er meldet sich zeitnah bei Ihnen. Bei Fragen erreichen Sie uns direkt:"
                        : "Wir haben Ihre Angaben erhalten und melden uns in Kürze mit einem passenden Vorschlag. Bei Eile erreichen Sie uns direkt:"}
                    </p>
                    <div className="survey__done-links">
                      <a href={`mailto:${email}`}>{email}</a>
                      <a href={`tel:${phone.replace(/\s/g, "")}`}>{phone}</a>
                    </div>
                  </div>
                ) : step.kind === "contact" ? (
                  <div className="survey__panel" key="contact">
                    {step.privat && (
                      <div className="survey__disclaimer" role="note">
                        <strong>Hinweis:</strong> Wir bedienen ausschließlich
                        Geschäftskunden. Für private Anliegen arbeiten wir mit
                        unserem Partner <em>Office for Sale</em> zusammen – wir
                        leiten Ihre Anfrage gerne dorthin weiter.
                      </div>
                    )}
                    <h3 className="survey__question">
                      {step.privat
                        ? "Wohin dürfen wir Ihre Anfrage weiterleiten?"
                        : "Wohin dürfen wir den Vorschlag schicken?"}
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
                      {!step.privat && (
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
                      )}
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
                        type="tel"
                        className="survey__input"
                        placeholder="Telefon (optional)"
                        value={contact.phone}
                        onChange={(e) =>
                          setContact({ ...contact, phone: e.target.value })
                        }
                        autoComplete="tel"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="survey__panel" key={step.key}>
                    <h3 className="survey__question">{step.question}</h3>
                    {step.hint && <p className="survey__hint">{step.hint}</p>}
                    <div className="survey__choices">
                      {step.options.map((option) => {
                        const selected = answers[step.key] === option.value;
                        return (
                          <button
                            type="button"
                            key={option.value}
                            className={`survey__choice${
                              selected ? " is-selected" : ""
                            }`}
                            aria-pressed={selected}
                            onClick={() => chooseOption(step.key, option.value)}
                          >
                            <span
                              className="survey__choice-radio"
                              aria-hidden="true"
                            />
                            <span className="survey__choice-label">
                              {option.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {!submitted && (
                  <div className="survey__nav">
                    {clampedIndex > 0 ? (
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
                    {step.kind === "contact" ? (
                      <button
                        type="button"
                        className="survey__next"
                        onClick={submit}
                        disabled={!contactValid}
                      >
                        Absenden
                      </button>
                    ) : (
                      <span className="survey__hint-inline">
                        Zum Fortfahren auswählen
                      </span>
                    )}
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
