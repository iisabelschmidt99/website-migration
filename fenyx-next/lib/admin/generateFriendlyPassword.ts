/** 8-stelliges Passwort ohne leicht verwechselbare Zeichen (wie LUMEUS). */
export function generateFriendlyPassword(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  let password = "";
  const array = new Uint8Array(8);
  crypto.getRandomValues(array);
  for (let i = 0; i < 8; i++) {
    password += chars[array[i]! % chars.length];
  }
  return password;
}
