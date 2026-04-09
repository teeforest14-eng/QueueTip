/** True when outbound email is wired (not the console-only reset link). */
export function isEmailDeliveryConfigured(): boolean {
  return !!(
    process.env.RESEND_API_KEY?.trim() ||
    process.env.SMTP_HOST?.trim() ||
    process.env.SENDGRID_API_KEY?.trim()
  );
}
