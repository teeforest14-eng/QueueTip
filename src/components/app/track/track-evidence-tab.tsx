"use client";

import { ContentLabel } from "@/components/content-label";
import { getEvidenceGuidanceForForm } from "@/lib/track-form-evidence";

const DISCLAIMER =
  "This is general guidance based on common USCIS requirements. Always verify with official USCIS instructions for your specific case.";

export function TrackEvidenceTab({ formType }: { formType: string }) {
  const { formKey, categories } = getEvidenceGuidanceForForm(formType);
  const formLabel =
    formKey === "generic" ? formType.trim() || "this form" : formKey;

  return (
    <div className="space-y-6">
      <div className="rounded-[12px] border border-neutral-200 bg-neutral-50/90 p-4 sm:p-5">
        <p className="text-sm font-medium leading-relaxed text-neutral-800">
          {DISCLAIMER}
        </p>
      </div>

      <div className="space-y-3 rounded-[12px] border border-neutral-100 bg-white p-4">
        <div className="flex flex-wrap items-center gap-2">
          <ContentLabel kind="typical" />
          <span className="text-sm text-neutral-600">
            Common supporting evidence people gather for{" "}
            <span className="font-semibold text-neutral-900">{formLabel}</span>
            — not a complete or mandatory list.
          </span>
        </div>
        <div className="flex flex-wrap items-start gap-2 border-t border-neutral-100 pt-3">
          <ContentLabel kind="official" />
          <span className="text-sm text-neutral-600">
            Only USCIS form instructions and your RFE or interview notice define
            what you must file.
          </span>
        </div>
        <div className="flex flex-wrap items-start gap-2 border-t border-neutral-100 pt-3">
          <ContentLabel kind="action" />
          <span className="text-sm text-neutral-600">
            Next step: pull the current form edition on uscis.gov and match your
            packet to that checklist — keep copies for yourself; nothing here is
            uploaded to QueueTip.
          </span>
        </div>
      </div>

      <div className="space-y-8">
        {categories.map((cat) => (
          <section key={cat.id}>
            <h3 className="text-xs font-semibold uppercase tracking-[0.08em] text-neutral-500">
              {cat.label}
            </h3>
            <ul className="mt-3 space-y-3">
              {cat.items.map((item) => (
                <li
                  key={item.title}
                  className="rounded-[12px] border border-neutral-100 bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
                >
                  <p className="font-medium text-neutral-900">{item.title}</p>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                    {item.why}
                  </p>
                  {item.whenApplies ? (
                    <p className="mt-2 border-t border-neutral-100 pt-2 text-xs text-neutral-500">
                      <span className="font-semibold text-neutral-600">
                        When it applies:{" "}
                      </span>
                      {item.whenApplies}
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
