import Link from "next/link";
import { supabase } from "@/lib/supabase";

export const revalidate = 60;

type Job = {
  recruitid: number;
  recruittitle: string | null;
  compname: string | null;
  workarea: string | null;
  dday: number | null;
  matched_score: number | null;
  ai_summary: string | null;
  detailpage: string | null;
  created_at: string | null;
};

function scoreTone(score: number | null) {
  if (score === null) return "border-slate-200 bg-slate-100 text-slate-600";
  if (score >= 85) return "border-emerald-200 bg-emerald-50 text-emerald-700";
  if (score >= 70) return "border-amber-200 bg-amber-50 text-amber-700";
  return "border-rose-200 bg-rose-50 text-rose-700";
}

function compactText(text: string | null, maxLength = 120) {
  if (!text) return "AI summary is not available yet.";
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
}

export default async function JobsPage() {
  const { data, error } = await supabase
    .from("job_posting")
    .select(
      "recruitid,recruittitle,compname,workarea,dday,matched_score,ai_summary,detailpage,created_at"
    )
    .not("recruitid", "is", null)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    return (
      <main className="mx-auto min-h-screen w-full max-w-6xl px-6 py-12 sm:px-10">
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-rose-700">
          <h1 className="text-xl font-semibold">Failed to load jobs</h1>
          <p className="mt-2 text-sm">{error.message}</p>
        </div>
      </main>
    );
  }

  const jobs = (data ?? []) as Job[];
  const urgentCount = jobs.filter((j) => j.dday !== null && j.dday <= 7).length;

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,#e0f2fe_0%,#f8fafc_45%,#f8fafc_100%)]" />

      <div className="mx-auto w-full max-w-6xl px-6 py-10 sm:px-10">
        <header className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="inline-flex rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold tracking-wide text-sky-700">
            CATCH JOB INSIGHT
          </p>
          <h1 className="mt-4 text-3xl font-bold text-slate-900 sm:text-4xl">Open Job Listings</h1>
          <p className="mt-2 text-sm text-slate-600 sm:text-base">
            Compact cards let you compare title, summary, score, and deadline quickly.
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-xs text-slate-500">Total</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">{jobs.length}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-xs text-slate-500">Urgent (D-7 or less)</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">{urgentCount}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-xs text-slate-500">Latest first</p>
              <p className="mt-1 text-sm font-semibold text-slate-700">Updated by created_at</p>
            </div>
          </div>
        </header>

        <section className="mt-5 grid gap-3 lg:grid-cols-2">
          {jobs.map((job) => (
            <article
              key={job.recruitid}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                    {job.compname ?? "No company"}
                  </p>
                  <h2 className="mt-1 text-base font-bold leading-snug text-slate-900">
                    <Link href={`/jobs/${job.recruitid}`} className="hover:text-sky-700">
                      {job.recruittitle ?? "No title"}
                    </Link>
                  </h2>
                </div>

                <span
                  className={`shrink-0 rounded-full border px-3 py-1 text-xs font-semibold ${scoreTone(
                    job.matched_score
                  )}`}
                >
                  Match {job.matched_score ?? "?"}
                </span>
              </div>

              <p className="mt-3 text-sm leading-6 text-slate-700">{compactText(job.ai_summary)}</p>

              <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-600">
                <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1">
                  {job.workarea ?? "Location TBD"}
                </span>
                <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1">
                  D-{job.dday ?? "?"}
                </span>
                <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1">
                  Posted {job.created_at?.slice(0, 10) ?? "Unknown"}
                </span>
              </div>
            </article>
          ))}
        </section>

        {jobs.length === 0 ? (
          <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
            There are no job postings to show right now.
          </div>
        ) : null}
      </div>
    </main>
  );
}
