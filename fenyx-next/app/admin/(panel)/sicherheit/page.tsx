export default function AdminSicherheit() {
  return (
    <div>
      <h1 className="text-2xl font-heading mb-2">Sicherheit</h1>
      <p className="text-mist text-sm">
        Hier entstehen Passwort ändern und 2-Faktor-Authentifizierung (2FA).
        Beides übernimmt Supabase Auth – wir binden hier nur die Bedienoberfläche an.
      </p>
    </div>
  );
}
