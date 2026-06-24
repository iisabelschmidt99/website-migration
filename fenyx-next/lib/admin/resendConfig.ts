export function isResendConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY?.trim());
}

export function getResendFromAddress(): string {
  return (
    process.env.RESEND_FROM?.trim() ||
    "Fenyx Backend <noreply@fenyx-office.com>"
  );
}
