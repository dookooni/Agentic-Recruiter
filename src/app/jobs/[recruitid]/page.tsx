"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

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

export default function JobDetailPage() {
  const params = useParams<{ recruitid: string }>();
  const recruitidStr = params?.recruitid;

  const [job, setJob] = useState<Job | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    async function run() {
      if (!recruitidStr || !/^\d+$/.test(recruitidStr)) {
        setErr(`Invalid recruitid: ${String(recruitidStr)}`);
        return;
      }

      const recruitid = parseInt(recruitidStr, 10);

      const { data, error } = await supabase
        .from("job_posting")
        .select(
          "recruitid,recruittitle,compname,workarea,dday,matched_score,ai_summary,detailpage,created_at"
        )
        .eq("recruitid", recruitid)
        .single();

      if (error) {
        setErr(error.message);
        return;
      }

      setJob(data as Job);
    }

    run();
  }, [recruitidStr]);

  const metaChips = useMemo(() => {
    if (!job) return [] as string[];

    return [
      job.workarea ?? "Location TBD",
      `D-${job.dday ?? "?"}`,
      `Posted ${job.created_at?.slice(0, 10) ?? "Unknown"}`,
    ];
  }, [job]);

  if (err) {
    return (
      <main className="mx-auto min-h-screen w-full max-w-4xl px-6 py-12 sm:px-10">
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-rose-700">
          <h1 className="text-xl font-semibold">Failed to load job details</h1>
          <p className="mt-2 text-sm">{err}</p>
          <Link
            href="/jobs"
            className="mt-5 inline-flex rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            Back to jobs
          </Link>
        </div>
      </main>
    );
  }

  if (!job) {
    return (
      <main className="mx-auto min-h-screen w-full max-w-4xl px-6 py-12 sm:px-10">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-600">
          Loading job details...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,#e0f2fe_0%,#f8fafc_45%,#f8fafc_100%)]" />

      <div className="mx-auto flex w-full max-w-4xl flex-col gap-5 px-6 py-10 sm:px-10">
        <Link
          href="/jobs"
          className="inline-flex w-fit items-center rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
        >
          Back to job listings
        </Link>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-sky-700">
            {job.compname ?? "No company"}
          </p>
          <h1 className="mt-3 text-2xl font-bold leading-tight text-slate-900 sm:text-3xl">
            {job.recruittitle ?? "No title"}
          </h1>

          <div className="mt-4 flex flex-wrap gap-2">
            {metaChips.map((chip) => (
              <span
                key={chip}
                className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-600"
              >
                {chip}
              </span>
            ))}
            <span
              className={`rounded-full border px-3 py-1 text-xs font-semibold ${scoreTone(
                job.matched_score
              )}`}
            >
              Match score {job.matched_score ?? "?"}
            </span>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-lg font-semibold text-slate-900">AI Summary</h2>
          <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-700 sm:text-base">
            {job.ai_summary ?? "AI summary is not available yet."}
          </p>
        </section>

        {job.detailpage ? (
          <a
            href={job.detailpage}
            target="_blank"
            rel="noreferrer"
            className="inline-flex w-fit items-center rounded-xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-700"
          >
            Open original posting
          </a>
        ) : null}
      </div>
    </main>
  );
}
