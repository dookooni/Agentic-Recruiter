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
  if (score === null) return "bg-slate-500/20 text-slate-200 border-slate-400/30";
  if (score >= 85) return "bg-emerald-400/20 text-emerald-200 border-emerald-300/30";
  if (score >= 70) return "bg-amber-300/20 text-amber-100 border-amber-200/30";
  return "bg-rose-400/20 text-rose-100 border-rose-300/30";
}

export default function JobDetailPage() {
  const params = useParams<{ recruitid: string }>();
  const recruitidStr = params?.recruitid;

  const [job, setJob] = useState<Job | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    async function run() {
      if (!recruitidStr || !/^\d+$/.test(recruitidStr)) {
        setErr(`유효하지 않은 recruitid: ${String(recruitidStr)}`);
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
      job.workarea ?? "근무지 미정",
      `D-${job.dday ?? "?"}`,
      `등록일 ${job.created_at?.slice(0, 10) ?? "미정"}`,
    ];
  }, [job]);

  if (err) {
    return (
      <main className="mx-auto min-h-screen w-full max-w-4xl px-6 py-14 sm:px-10">
        <div className="rounded-2xl border border-rose-300/30 bg-rose-500/10 p-6 text-rose-100">
          <h1 className="text-xl font-semibold">오류가 발생했습니다</h1>
          <p className="mt-3 text-sm opacity-90">{err}</p>
          <Link
            href="/jobs"
            className="mt-5 inline-flex rounded-lg border border-white/20 px-4 py-2 text-sm font-semibold transition hover:bg-white/10"
          >
            목록으로 돌아가기
          </Link>
        </div>
      </main>
    );
  }

  if (!job) {
    return (
      <main className="mx-auto min-h-screen w-full max-w-4xl px-6 py-14 sm:px-10">
        <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-6 text-slate-200">
          공고 정보를 불러오는 중입니다...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,#0f172a_0%,#020617_60%,#000000_100%)]" />

      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-6 py-12 sm:px-10">
        <Link
          href="/jobs"
          className="inline-flex w-fit items-center rounded-lg border border-white/20 px-3 py-1.5 text-xs font-semibold text-slate-200 transition hover:bg-white/10"
        >
          ← 채용 목록
        </Link>

        <section className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-cyan-200/90">
            {job.compname ?? "회사 정보 없음"}
          </p>
          <h1 className="mt-3 text-2xl font-bold leading-tight text-white sm:text-3xl">
            {job.recruittitle ?? "채용 제목 없음"}
          </h1>

          <div className="mt-5 flex flex-wrap gap-2">
            {metaChips.map((chip) => (
              <span
                key={chip}
                className="rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs text-slate-200"
              >
                {chip}
              </span>
            ))}
            <span
              className={`rounded-full border px-3 py-1 text-xs font-semibold ${scoreTone(
                job.matched_score
              )}`}
            >
              매칭 점수 {job.matched_score ?? "?"}
            </span>
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-slate-900/70 p-6 sm:p-8">
          <h2 className="text-lg font-semibold text-white">AI 요약</h2>
          <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-200 sm:text-base">
            {job.ai_summary ?? "아직 생성된 요약이 없습니다."}
          </p>
        </section>

        {job.detailpage ? (
          <a
            href={job.detailpage}
            target="_blank"
            rel="noreferrer"
            className="inline-flex w-fit items-center rounded-xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
          >
            원문 공고 페이지 열기
          </a>
        ) : null}
      </div>
    </main>
  );
}
