"use client";

// Variante B des Kontaktformulars — verzweigter Wizard.
// Absenden geht per POST an /api/lead (Server-Route → n8n-Webhook „Flow 1"),
// n8n legt Kontakt + Deal in „New Leads" an und triggert Power Automate.

import Image from "next/image";
import { useMemo, useRef, useState } from "react";
import { pushLead } from "@/lib/analytics/dataLayer";
import { trackGenerateLead } from "@/lib/analytics/events";

type Option = { value: string; label: string };
type SelectKey = "kundentyp" | "interesse" | "arbeitsplaetze" | "zeithorizont";

type SelectStep = {
  kind: "select";
  key: SelectKey;
  question: string;
  hint?: string;
  options: Option[];
};
type SizeStep = { kind: "size" };
type ContactStep = { kind: "contact"; privat: boolean };
type FlowStep = SelectStep | SizeStep | ContactStep;

type Answers = Partial<Record<SelectKey, string>>;
type Groesse = { unit: "m2" | "ap"; value: number };

const INTERESSE_OPTIONS: Option[] = [
  { value: "einrichten", label: "Büroeinrichtung – Miete oder Kauf" },
  { value: "verwerten", label: "Büroauflösung, Verwertung & Umzug" },
  { value: "bestand", label: "Bestandsaufnahme & digitale Inventarisierung" },
  { value: "unsicher", label: "Erstberatung – noch in der Orientierung" },
];

const AP_EINRICHTEN: Option[] = [
  { value: "bis20", label: "Bis 20" },
  { value: "20-50", label: "20 – 50" },
  { value: "50-150", label: "50 – 150" },
  { value: "ueber150", label: "Mehr als 150" },
];
const AP_VERWERTEN: Option[] = [
  { value: "0-50", label: "0 – 50" },
  { value: "50-100", label: "50 – 100" },
  { value: "ueber100", label: "Mehr als 100" },
];
const ZEITHORIZONT: Option[] = [
  { value: "asap", label: "So schnell wie möglich" },
  { value: "1-3", label: "In 1 – 3 Monaten" },
  { value: "3-6", label: "In 3 – 6 Monaten" },
  { value: "stoebern", label: "Erstmal stöbern" },
];

const SIZE_BOUNDS = {
  m2: { min: 20, max: 2000, step: 20, def: 300, unit: "m²" },
  ap: { min: 5, max: 500, step: 5, def: 50, unit: "Arbeitsplätze" },
} as const;

/** Gibt das Label einer Option zum internen Wert zurück. */
function labelFor(options: Option[], value?: string): string {
  return options.find((o) => o.value === value)?.label ?? "";
}

/** Baut die Schrittfolge dynamisch aus den bisherigen Antworten (Verzweigung). */
function buildFlow(a: Answers): FlowStep[] {
  const flow: FlowStep[] = [
    {
      kind: "select",
      key: "kundentyp",
      question: "Wer sind Sie?",
      options: [
        { value: "geschaeft", label: "Unternehmen" },
        { value: "privat", label: "Privatperson" },
      ],
    },
  ];
  if (!a.kundentyp) return flow;

  flow.push({
    kind: "select",
    key: "interesse",
    question: "Wobei dürfen wir Sie unterstützen?",
    options: INTERESSE_OPTIONS,
  });

  if (a.kundentyp === "privat") {
    flow.push({ kind: "contact", privat: true });
    return flow;
  }
  if (!a.interesse) return flow;

  if (a.interesse === "einrichten") {
    flow.push({
      kind: "select",
      key: "arbeitsplaetze",
      question: "Wie viele Arbeitsplätze umfasst Ihr Büro?",
      options: AP_EINRICHTEN,
    });
    flow.push({
      kind: "select",
      key: "zeithorizont",
      question: "Wann soll es losgehen?",
      options: ZEITHORIZONT,
    });
    flow.push({ kind: "contact", privat: false });
  } else if (a.interesse === "verwerten") {
    flow.push({
      kind: "select",
      key: "arbeitsplaetze",
      question: "Wie viele Arbeitsplätze umfasst das Objekt?",
      options: AP_VERWERTEN,
    });
    flow.push({
      kind: "select",
      key: "zeithorizont",
      question: "Wann soll es losgehen?",
      options: ZEITHORIZONT,
    });
    flow.push({ kind: "contact", privat: false });
  } else if (a.interesse === "bestand") {
    flow.push({ kind: "size" });
    flow.push({ kind: "contact", privat: false });
  } else {
    // unsicher – direkt zur Beratung
    flow.push({ kind: "contact", privat: false });
  }
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
  const [groesse, setGroesse] = useState<Groesse>({ unit: "m2", value: 300 });
  const [contact, setContact] = useState({
    firstName: "",
    lastName: "",
    company: "",
    city: "",
    email: "",
    phone: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(false);
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const flow = useMemo(() => buildFlow(answers), [answers]);
  const clampedIndex = Math.min(stepIndex, flow.length - 1);
  const step = flow[clampedIndex];
  const progress = submitted
    ? 100
    : Math.round((clampedIndex / flow.length) * 100);

  function chooseOption(stepKey: SelectKey, value: string) {
    const nextAnswers: Answers = { ...answers, [stepKey]: value };
    if (stepKey === "kundentyp") {
      delete nextAnswers.interesse;
      delete nextAnswers.arbeitsplaetze;
      delete nextAnswers.zeithorizont;
    }
    if (stepKey === "interesse") {
      delete nextAnswers.arbeitsplaetze;
      delete nextAnswers.zeithorizont;
    }
    setAnswers(nextAnswers);

    const nextFlow = buildFlow(nextAnswers);
    if (advanceTimer.current) clearTimeout(advanceTimer.current);
    advanceTimer.current = setTimeout(() => {
      setStepIndex((i) => Math.min(i + 1, nextFlow.length - 1));
    }, 260);
  }

  function goNext() {
    if (advanceTimer.current) clearTimeout(advanceTimer.current);
    setStepIndex((i) => Math.min(i + 1, flow.length - 1));
  }
  function back() {
    if (advanceTimer.current) clearTimeout(advanceTimer.current);
    setStepIndex((i) => Math.max(0, i - 1));
  }

  function setUnit(unit: Groesse["unit"]) {
    setGroesse({ unit, value: SIZE_BOUNDS[unit].def });
  }

  const bounds = SIZE_BOUNDS[groesse.unit];
  const groesseLabel =
    groesse.value >= bounds.max
      ? `${bounds.max}+ ${bounds.unit}`
      : `${groesse.value} ${bounds.unit}`;

  const contactValid =
    contact.firstName.trim() !== "" &&
    contact.lastName.trim() !== "" &&
    contact.city.trim() !== "" &&
    /\S+@\S+\.\S+/.test(contact.email);

  function buildPayload() {
    const leistungsartMap: Record<string, string> = {
      einrichten: "Einrichtung",
      verwerten: "Verwertung",
      bestand: "Bestandsmanagement",
      unsicher: "Unklar",
    };
    const isBestand = answers.interesse === "bestand";
    const apOptions =
      answers.interesse === "verwerten" ? AP_VERWERTEN : AP_EINRICHTEN;

    // Arbeitsplätze: aus dem Auswahl-Schritt ODER aus dem Regler (Arbeitsplatz-Modus)
    let arbeitsplaetze = labelFor(apOptions, answers.arbeitsplaetze);
    if (isBestand && groesse.unit === "ap") {
      arbeitsplaetze = groesseLabel;
    }
    // Bürofläche in m² (Zahl) nur im Bestand-Stream + m²-Modus
    const flaecheM2 =
      isBestand && groesse.unit === "m2" ? String(groesse.value) : "";

    const payload: Record<string, string> = {
      kontaktart_website:
        answers.kundentyp === "privat" ? "Privatkunde" : "Geschäftskunde",
      leistungsart_website: leistungsartMap[answers.interesse ?? ""] ?? "",
      arbeitsplatze_website: arbeitsplaetze,
      burogroe_m2: flaecheM2,
      startzeitpunkt_website: labelFor(ZEITHORIZONT, answers.zeithorizont),
      firstname: contact.firstName,
      lastname: contact.lastName,
      company: contact.company,
      city: contact.city,
      email: contact.email,
      phone: contact.phone,
      // Nachricht -> Deal-Beschreibung (HubSpot-Property "description")
      description: contact.message,
      message: contact.message,
      leadquelle: "Website",
    };
    return payload;
  }

  async function submit() {
    if (!contactValid || sending) return;
    setSending(true);
    setError(false);
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...buildPayload(),
          ab_variant: "B",
          page_url:
            typeof window !== "undefined" ? window.location.href : "",
        }),
      });
      if (!res.ok) throw new Error("submit_failed");
      trackGenerateLead("contact_form", "survey_b");
      pushLead({
        lead_type: "contact_form",
        lead_surface: "survey_b",
        page_path:
          typeof window !== "undefined" ? window.location.pathname : "",
      });
      setSubmitted(true);
    } catch {
      setError(true);
    } finally {
      setSending(false);
    }
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
                  className="object-cover"
                  style={{ objectPosition: "center 30%" }}
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
                  Was dürfen wir <span className="survey__hl">für Sie</span>{" "}
                  tun?
                </h2>
                <p className="survey__subline">
                  Ein paar Klicks genügen – wir melden uns mit einem{" "}
                  <span className="survey__hl">passenden Vorschlag</span> für Ihr
                  Büro.
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
                      {contact.firstName ? `, ${contact.firstName}` : ""}!
                    </h3>
                    <p className="survey__done-text">
                      {answers.kundentyp === "privat"
                        ? "Wir leiten Ihre Anfrage an einen ausgewählten Partner weiter – er meldet sich zeitnah bei Ihnen. Bei Fragen erreichen Sie uns direkt:"
                        : "Wir haben Ihre Angaben erhalten und melden uns in Kürze mit einem passenden Vorschlag. Bei Eile erreichen Sie uns direkt:"}
                    </p>
                    <div className="survey__done-links">
                      <a href={`mailto:${email}`}>{email}</a>
                      <a href={`tel:${phone.replace(/\s/g, "")}`}>{phone}</a>
                    </div>
                  </div>
                ) : step.kind === "contact" ? (
                  <div className="survey__panel" key="contact">
                    {step.privat ? (
                      <div
                        className="mb-5 border-l-2 border-signal bg-signal/10 px-4 py-3 text-sm leading-relaxed text-white/85"
                        role="note"
                      >
                        <strong className="text-signal font-semibold">Hinweis:</strong>{" "}
                        Wir bedienen ausschließlich Geschäftskunden. Für private
                        Anliegen arbeiten wir mit einem ausgewählten Partner zusammen
                        – wir leiten Ihre Anfrage gerne dorthin weiter.
                      </div>
                    ) : (
                      <div
                        className="mb-5 border-l-2 border-signal bg-signal/10 px-4 py-3 text-sm leading-relaxed text-white/85"
                        role="note"
                      >
                        <strong className="text-signal font-semibold">
                          Gut zu wissen:
                        </strong>{" "}
                        Sollten wir Ihre Anfrage einmal nicht selbst übernehmen können,
                        leiten wir Sie an einen unserer ausgewählten Partner weiter.
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
                        placeholder="Vorname *"
                        value={contact.firstName}
                        onChange={(e) =>
                          setContact({ ...contact, firstName: e.target.value })
                        }
                        autoComplete="given-name"
                        required
                        aria-required="true"
                      />
                      <input
                        type="text"
                        className="survey__input"
                        placeholder="Nachname *"
                        value={contact.lastName}
                        onChange={(e) =>
                          setContact({ ...contact, lastName: e.target.value })
                        }
                        autoComplete="family-name"
                        required
                        aria-required="true"
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
                        placeholder="E-Mail *"
                        value={contact.email}
                        onChange={(e) =>
                          setContact({ ...contact, email: e.target.value })
                        }
                        autoComplete="email"
                        required
                        aria-required="true"
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
                      <input
                        type="text"
                        className="survey__input"
                        placeholder="Stadt *"
                        value={contact.city}
                        onChange={(e) =>
                          setContact({ ...contact, city: e.target.value })
                        }
                        autoComplete="address-level2"
                        required
                        aria-required="true"
                      />
                      <textarea
                        className="survey__input survey__textarea"
                        placeholder="Ihre Nachricht (optional)"
                        value={contact.message}
                        onChange={(e) =>
                          setContact({ ...contact, message: e.target.value })
                        }
                        rows={3}
                      />
                    </div>
                    <p className="survey__required-note">* Pflichtfeld</p>
                    {error && (
                      <p
                        className="survey__required-note"
                        role="alert"
                        style={{ color: "#ef9a9a" }}
                      >
                        Das hat leider nicht geklappt. Bitte erneut senden.
                      </p>
                    )}
                  </div>
                ) : step.kind === "size" ? (
                  <div className="survey__panel" key="size">
                    <h3 className="survey__question">Wie groß ist Ihr Büro?</h3>
                    <p className="survey__hint">
                      Geben Sie die Fläche oder die Zahl der Arbeitsplätze an –
                      eine grobe Schätzung genügt.
                    </p>
                    <div className="survey__unit-toggle" role="group">
                      <button
                        type="button"
                        className={`survey__unit-btn${
                          groesse.unit === "m2" ? " is-active" : ""
                        }`}
                        aria-pressed={groesse.unit === "m2"}
                        onClick={() => setUnit("m2")}
                      >
                        Fläche (m²)
                      </button>
                      <button
                        type="button"
                        className={`survey__unit-btn${
                          groesse.unit === "ap" ? " is-active" : ""
                        }`}
                        aria-pressed={groesse.unit === "ap"}
                        onClick={() => setUnit("ap")}
                      >
                        Arbeitsplätze
                      </button>
                    </div>
                    <div className="survey__slider-value">{groesseLabel}</div>
                    <input
                      type="range"
                      className="survey__slider"
                      min={bounds.min}
                      max={bounds.max}
                      step={bounds.step}
                      value={groesse.value}
                      onChange={(e) =>
                        setGroesse({
                          unit: groesse.unit,
                          value: Number(e.target.value),
                        })
                      }
                      aria-label="Bürogröße"
                    />
                    <div className="survey__slider-scale">
                      <span>{bounds.min}</span>
                      <span>{bounds.max}+</span>
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
                        disabled={!contactValid || sending}
                      >
                        {sending ? "Wird gesendet…" : "Absenden"}
                      </button>
                    ) : step.kind === "size" ? (
                      <button
                        type="button"
                        className="survey__next"
                        onClick={goNext}
                      >
                        Weiter →
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
