export function buildStaffCredentialsEmailHtml(opts: {
  email: string;
  password: string;
  loginUrl: string;
}): string {
  const { email, password, loginUrl } = opts;
  return `<!DOCTYPE html>
<html lang="de">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#0b171f;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0b171f;padding:40px 20px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;background:#132735;border:1px solid rgba(255,255,255,0.1);">
        <tr><td style="padding:32px 40px 16px;">
          <p style="margin:0;color:#c8ff00;font-size:11px;font-weight:bold;letter-spacing:0.15em;text-transform:uppercase;">Fenyx Backend</p>
          <h1 style="margin:16px 0 0;color:#ffffff;font-size:22px;font-weight:bold;">Dein Backend-Zugang</h1>
        </td></tr>
        <tr><td style="padding:8px 40px 32px;color:#8da4ba;font-size:15px;line-height:1.6;">
          <p style="margin:0 0 16px;">Hallo,</p>
          <p style="margin:0 0 24px;">für dich wurde ein Zugang zum Fenyx-Backend eingerichtet. Melde dich mit diesen Zugangsdaten an:</p>
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#0b171f;border:1px solid rgba(255,255,255,0.08);margin-bottom:24px;">
            <tr><td style="padding:16px 20px;">
              <p style="margin:0 0 8px;color:#8da4ba;font-size:12px;text-transform:uppercase;letter-spacing:0.08em;">E-Mail</p>
              <p style="margin:0;color:#ffffff;font-size:15px;">${email}</p>
            </td></tr>
            <tr><td style="padding:0 20px 16px;">
              <p style="margin:0 0 8px;color:#8da4ba;font-size:12px;text-transform:uppercase;letter-spacing:0.08em;">Passwort</p>
              <p style="margin:0;color:#c8ff00;font-size:15px;font-family:monospace;">${password}</p>
            </td></tr>
          </table>
          <p style="margin:0 0 24px;">Bitte ändere dein Passwort nach dem ersten Login unter <strong style="color:#dceaf5;">Sicherheit</strong>.</p>
          <a href="${loginUrl}" style="display:inline-block;background:#c8ff00;color:#020405;font-size:11px;font-weight:bold;text-decoration:none;padding:14px 24px;text-transform:uppercase;letter-spacing:0.12em;">Zum Backend-Login</a>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export async function sendStaffCredentialsEmail(opts: {
  to: string;
  password: string;
  loginUrl: string;
}): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("RESEND_API_KEY ist nicht konfiguriert.");
  }

  const { getResendFromAddress } = await import("@/lib/admin/resendConfig");
  const html = buildStaffCredentialsEmailHtml({
    email: opts.to,
    password: opts.password,
    loginUrl: opts.loginUrl,
  });

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: getResendFromAddress(),
      to: [opts.to],
      subject: "Dein Fenyx-Backend-Zugang",
      html,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`E-Mail-Versand fehlgeschlagen: ${body}`);
  }
}
