/**
 * No (main) layout — only app/app/layout. Use to verify /app shell without auth/Prisma onboarding.
 * https://your-host/app/status
 */
export default function AppStatusPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-16 text-center">
      <p className="text-sm font-semibold text-qt-text">App shell OK</p>
      <p className="mt-2 text-xs text-qt-text-secondary">
        If this loads but /app/dashboard does not, the failure is in the main
        layout (session or database), not the root app layout.
      </p>
    </div>
  );
}
