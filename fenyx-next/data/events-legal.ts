import type { LegalBlock } from "@/data/legal";

export const eventsLegalPage = {
  title: "Events Teilnahmebedingungen & Datenschutz",
  meta: {
    title: "Events Teilnahmebedingungen | Fenyx",
    description: "Teilnahmebedingungen und Datenschutzhinweise für Fenyx-Events.",
  },
  blocks: [
    {
      type: "p",
      text: "Diese Hinweise gelten für alle von der Fenyx GmbH veranstalteten Events, unabhängig von Stadt und Termin. Die event-spezifischen Angaben werden Ihnen bei der Anmeldung zur jeweiligen Veranstaltung mitgeteilt.",
    },
    { type: "h2", text: "Teil A — Teilnahmebedingungen" },
    {
      type: "p",
      text: "Veranstalter: Fenyx GmbH, Oranienstraße 183, 10999 Berlin · info@fenyx-office.com",
    },
    { type: "h3", text: "1. Anmeldung & Teilnahme" },
    {
      type: "p",
      text: "Mit dem Absenden des Anmeldeformulars melden Sie sich verbindlich an. Die Plätze sind begrenzt; Anmeldungen werden in der Reihenfolge des Eingangs berücksichtigt.",
    },
    { type: "h3", text: "2. Kosten, Absage & Nichterscheinen (No-Show)" },
    {
      type: "p",
      text: "Sofern bei der jeweiligen Veranstaltung nicht anders angegeben, ist die Teilnahme kostenlos. Eine Absage ist bis 48 Stunden vor Beginn kostenfrei möglich. Bei Nichterscheinen oder späterer Absage kann eine No-Show-Pauschale erhoben werden (Standard: 49,00 € zzgl. MwSt.).",
    },
    { type: "h3", text: "3. Foto- und Videoaufnahmen" },
    {
      type: "p",
      text: "Bei unseren Veranstaltungen werden Foto- und Videoaufnahmen erstellt. Diese können für die Öffentlichkeitsarbeit der Fenyx GmbH sowie beteiligter Partner verwendet werden. Die Einwilligung ist freiwillig und jederzeit widerrufbar.",
    },
    { type: "h2", text: "Teil B — Datenschutzhinweis zu FENYX-Events" },
    { type: "h3", text: "1. Verantwortlicher" },
    {
      type: "p",
      text: "Fenyx GmbH, Oranienstraße 183, 10999 Berlin · info@fenyx-office.com",
    },
    {
      type: "p",
      text: "Weitere Informationen zum Datenschutz finden Sie in unserer allgemeinen Datenschutzerklärung unter /datenschutz.",
    },
  ] as LegalBlock[],
};
