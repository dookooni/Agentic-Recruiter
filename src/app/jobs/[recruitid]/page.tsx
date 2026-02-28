"use client";

import { useEffect, useState } from "react";
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

  if (err) {
    return (
      <div style={{ padding: 24 }}>
        <h1>Error</h1>
        <pre>{err}</pre>
        <pre style={{ opacity: 0.7 }}>{JSON.stringify(params, null, 2)}</pre>
      </div>
    );
  }

  if (!job) {
    return <div style={{ padding: 24 }}>Loading...</div>;
  }

  return (
    <div style={{ padding: 24, maxWidth: 980, margin: "0 auto" }}>
      <div style={{ fontSize: 12, opacity: 0.7 }}>{job.compname ?? ""}</div>
      <h1 style={{ fontSize: 28, fontWeight: 750, marginTop: 6 }}>
        {job.recruittitle ?? ""}
      </h1>
      <div style={{ marginTop: 10, fontSize: 14, opacity: 0.85 }}>
        {(job.workarea ?? "지역 미상") +
          " · " +
          `D-${job.dday ?? "?"}` +
          " · " +
          `Score ${job.matched_score ?? "?"}`}
      </div>

      <div
        style={{
          marginTop: 18,
          border: "1px solid #eee",
          borderRadius: 12,
          padding: 14,
        }}
      >
        <div style={{ fontWeight: 700 }}>AI 요약</div>
        <div style={{ marginTop: 8, lineHeight: 1.6 }}>
          {job.ai_summary ?? "요약 없음"}
        </div>
      </div>

      {job.detailpage ? (
        <a
          href={job.detailpage}
          target="_blank"
          rel="noreferrer"
          style={{ display: "inline-block", marginTop: 18 }}
        >
          원문 공고 페이지 열기 ↗
        </a>
      ) : null}
    </div>
  );
}