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
  if (score === null) return "border-slate-400/30 bg-slate-500/20 text-slate-200";
  if (score >= 85) return "border-emerald-300/30 bg-emerald-400/20 text-emerald-100";
  if (score >= 70) return "border-amber-200/30 bg-amber-300/20 text-amber-100";
  return "border-rose-300/30 bg-rose-400/20 text-rose-100";
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
      <main className="mx-auto min-h-screen w-full max-w-5xl px-6 py-14 sm:px-10">
        <div className="rounded-2xl border border-rose-300/30 bg-rose-500/10 p-6 text-rose-100">
          <h1 className="text-xl font-semibold">Failed to load jobs</h1>
          <p className="mt-3 text-sm opacity-90">{error.message}</p>
        </div>
      </main>
    );
  }

  const jobs = (data ?? []) as Job[];

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,#1e293b_0%,#020617_55%,#000000_100%)]" />

      <div className="mx-auto w-full max-w-5xl px-6 py-12 sm:px-10">
        <header className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur sm:p-8">
          <p className="inline-flex rounded-full border border-cyan-300/30 bg-cyan-300/10 px-3 py-1 text-xs font-semibold tracking-wide text-cyan-200">
            CATCH JOB INSIGHT
          </p>
          <h1 className="mt-4 text-3xl font-bold text-white sm:text-4xl">Open Job Listings</h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-300 sm:text-base">
            Review up to 50 latest postings, then compare role summary and match score in one place.
          </p>
          <p className="mt-4 text-sm font-semibold text-cyan-200">Total {jobs.length}</p>
        </header>

        <section className="mt-6 grid gap-4">
          {jobs.map((j) => (
            <article
              key={j.recruitid}
              className="rounded-2xl border border-white/10 bg-slate-900/70 p-5 transition hover:border-cyan-300/40"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-300">
                  {j.compname ?? "No company"}
                </p>
                <span
                  className={`rounded-full border px-3 py-1 text-xs font-semibold ${scoreTone(
                    j.matched_score
                  )}`}
                >
                  Match {j.matched_score ?? "?"}
                </span>
              </div>

              <h2 className="mt-3 text-xl font-bold leading-tight text-white">
                <Link href={`/jobs/${j.recruitid}`} className="hover:text-cyan-200">
                  {j.recruittitle ?? "No title"}
                </Link>
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-200">
                {j.ai_summary ?? "AI summary is not available yet."}
              </p>

              <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-300">
                <span className="rounded-full border border-white/20 bg-white/5 px-3 py-1">
                  {j.workarea ?? "Location TBD"}
                </span>
                <span className="rounded-full border border-white/20 bg-white/5 px-3 py-1">
                  D-{j.dday ?? "?"}
                </span>
                <span className="rounded-full border border-white/20 bg-white/5 px-3 py-1">
                  Posted {j.created_at?.slice(0, 10) ?? "Unknown"}
                </span>
              </div>
            </article>
          ))}
        </section>

        {jobs.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-white/10 bg-slate-900/70 p-6 text-sm text-slate-300">
            There are no job postings to show right now.
          </div>
        ) : null}
      </div>
    </main>
  );
}
