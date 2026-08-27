/**
 * Validates a UK Postcode format (e.g. SW1A 1AA, EC1A 1BB, M1 1AE, CR2 6XH, B33 8TH).
 */
export function isValidUKPostcode(postcode: string): boolean {
  if (!postcode) return false;
  const clean = postcode.trim().toUpperCase();
  const regex = /^([A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}|GIR\s*0AA)$/i;
  return regex.test(clean);
}

/**
 * Formats a UK postcode cleanly (e.g. "sw1a1aa" -> "SW1A 1AA").
 */
export function formatUKPostcode(postcode: string): string {
  if (!postcode) return "";
  const clean = postcode.trim().toUpperCase().replace(/\s+/g, "");
  if (clean.length > 3) {
    const inc = clean.slice(-3);
    const out = clean.slice(0, -3);
    return `${out} ${inc}`;
  }
  return clean;
}

/**
 * Validates a UK Phone Number format (e.g. 07830682710, 02035760507, +44 7830 682710).
 */
export function isValidUKPhoneNumber(phone: string): boolean {
  if (!phone) return false;
  const clean = phone.replace(/[\s\-\(\)]/g, "");
  const regex = /^(\+44|0)(7\d{9}|[1238]\d{8,9})$/;
  return regex.test(clean);
}

/**
 * Formats UK phone numbers nicely.
 */
export function formatUKPhoneNumber(phone: string): string {
  if (!phone) return "";
  const clean = phone.replace(/[\s\-\(\)]/g, "");
  if (clean.startsWith("07") && clean.length === 11) {
    return `${clean.slice(0, 5)} ${clean.slice(5)}`;
  }
  if (clean.startsWith("020") && clean.length === 11) {
    return `${clean.slice(0, 4)} ${clean.slice(4, 8)} ${clean.slice(8)}`;
  }
  return phone;
}
