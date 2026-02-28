import Link from "next/link";
import { supabase } from "@/lib/supabase";

export const revalidate = 60; // 60초 캐시

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

export default async function JobsPage({
  searchParams,
}: {
  searchParams: { q?: string; page?: string };
}) {
  const q = searchParams.q?.trim();
  const page = Math.max(parseInt(searchParams.page ?? "1", 10) || 1, 1);
  const pageSize = 20;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("job_posting")
    .select(
      "recruitid,recruittitle,compname,workarea,dday,matched_score,ai_summary,detailpage,created_at",
      { count: "exact" }
    )
    .order("created_at", { ascending: false })
    .range(from, to);

  if (q) {
    query = query.or(`recruittitle.ilike.%${q}%,compname.ilike.%${q}%`);
  }

  const { data, count, error } = await query;

  if (error) {
    return (
      <div style={{ padding: 24 }}>
        <h1>Jobs</h1>
        <p style={{ opacity: 0.7 }}>
          Supabase에서 job_posting을 읽다가 에러가 났어.
        </p>
        <pre style={{ marginTop: 12, padding: 12, background: "#f6f6f6", borderRadius: 8 }}>
          {error.message}
        </pre>
      </div>
    );
  }

  const jobs = (data ?? []) as Job[];
  const totalPages = Math.max(Math.ceil((count ?? 0) / pageSize), 1);

  return (
    <div style={{ padding: 24, maxWidth: 980, margin: "0 auto" }}>
      <h1 style={{ fontSize: 28, fontWeight: 700 }}>CATCH Job Demo</h1>

      <form style={{ marginTop: 16, display: "flex", gap: 8 }}>
        <input
          name="q"
          defaultValue={q}
          placeholder="회사/포지션 검색"
          style={{ flex: 1, padding: 10, border: "1px solid #ddd", borderRadius: 8 }}
        />
        <button
          type="submit"
          style={{ padding: "10px 14px", border: "1px solid #ddd", borderRadius: 8 }}
        >
          검색
        </button>
      </form>

      <div style={{ marginTop: 16, display: "grid", gap: 12 }}>
        {jobs.map((j) => (
          <div
            key={j.recruitid}
            style={{ border: "1px solid #eee", borderRadius: 12, padding: 14 }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
              <div>
                <div style={{ fontSize: 12, opacity: 0.7 }}>{j.compname ?? "(no company)"}</div>
                <Link href={`/jobs/${j.recruitid}`} style={{ fontSize: 18, fontWeight: 650 }}>
                  {j.recruittitle ?? "(no title)"}
                </Link>
                <div style={{ marginTop: 6, fontSize: 14, opacity: 0.85 }}>
                  {j.ai_summary ?? "요약 없음"}
                </div>
                <div style={{ marginTop: 8, fontSize: 12, opacity: 0.7 }}>
                  {(j.workarea ?? "지역 미상") + " · " + `D-${j.dday ?? "?"}` + " · " + `Score ${j.matched_score ?? "?"}`}
                </div>
              </div>

              {j.detailpage ? (
                <a
                  href={j.detailpage}
                  target="_blank"
                  rel="noreferrer"
                  style={{ fontSize: 12, whiteSpace: "nowrap" }}
                >
                  원문 보기 ↗
                </a>
              ) : null}
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 16, display: "flex", justifyContent: "space-between" }}>
        <Link href={`/jobs?page=${Math.max(page - 1, 1)}${q ? `&q=${encodeURIComponent(q)}` : ""}`}>
          ← Prev
        </Link>
        <div style={{ fontSize: 12, opacity: 0.7 }}>
          Page {page} / {totalPages}
        </div>
        <Link
          href={`/jobs?page=${Math.min(page + 1, totalPages)}${
            q ? `&q=${encodeURIComponent(q)}` : ""
          }`}
        >
          Next →
        </Link>
      </div>
    </div>
  );
}