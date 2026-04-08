import Link from "next/link";
import { AddCaseForm } from "./add-case-form";

export default function AddCasePage() {
  return (
    <div className="mx-auto max-w-lg space-y-6">
      <Link
        href="/app/track"
        className="text-sm font-medium text-qt-slate hover:underline"
      >
        ← Back to Track
      </Link>
      <div>
        <h1 className="text-2xl font-semibold text-qt-text">Add a receipt</h1>
        <p className="mt-2 text-sm text-qt-text-secondary">
          Already filed? Enter your USCIS receipt to create a practice tracking
          record. Live government API integration can replace the mock sync
          service later without UI rewrites.
        </p>
      </div>
      <AddCaseForm />
    </div>
  );
}
