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
      <div style={{ padding: 24 }}>
        <h1>Jobs</h1>
        <pre>{error.message}</pre>
      </div>
    );
  }

  const jobs = (data ?? []) as Job[];

  return (
    <div style={{ padding: 24, maxWidth: 980, margin: "0 auto" }}>
      <h1 style={{ fontSize: 28, fontWeight: 700 }}>
        CATCH Job Insight
      </h1>

      <div style={{ marginTop: 16, display: "grid", gap: 12 }}>
        {jobs.map((j) => (
          <div
            key={j.recruitid}
            style={{
              border: "1px solid #eee",
              borderRadius: 12,
              padding: 14,
            }}
          >
            <div style={{ fontSize: 12, opacity: 0.7 }}>
              {j.compname ?? "(no company)"}
            </div>

            <Link
              href={`/jobs/${j.recruitid}`}
              style={{ fontSize: 18, fontWeight: 650 }}
            >
              {j.recruittitle ?? "(no title)"}
            </Link>

            <div style={{ marginTop: 6, fontSize: 14, opacity: 0.85 }}>
              {j.ai_summary ?? "요약 없음"}
            </div>

            <div style={{ marginTop: 8, fontSize: 12, opacity: 0.7 }}>
              {(j.workarea ?? "지역 미상") +
                " · " +
                `D-${j.dday ?? "?"}` +
                " · " +
                `Score ${j.matched_score ?? "?"}`}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
