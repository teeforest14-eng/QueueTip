/** USCIS-style receipt: 3 letters + 10 digits (e.g. MSC1290123456). */
const RECEIPT_REGEX = /^[A-Z]{3}\d{10}$/i;

export function normalizeReceiptNumber(input: string): string {
  return input.replace(/\s+/g, "").toUpperCase();
}

export function isValidReceiptFormat(receipt: string): boolean {
  return RECEIPT_REGEX.test(normalizeReceiptNumber(receipt));
}
