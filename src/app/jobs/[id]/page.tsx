import { supabase } from "@/lib/supabase";

export const revalidate = 60;

export default async function JobDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const recruitid = Number(params.id);

  const { data, error } = await supabase
    .from("job_posting")
    .select("*")
    .eq("recruitid", recruitid)
    .single();

  if (error) {
    return (
      <div style={{ padding: 24 }}>
        <h1>Job Detail</h1>
        <pre>{error.message}</pre>
      </div>
    );
  }

  return (
    <div style={{ padding: 24, maxWidth: 980, margin: "0 auto" }}>
      <div style={{ fontSize: 12, opacity: 0.7 }}>{data.compname}</div>
      <h1 style={{ fontSize: 28, fontWeight: 750, marginTop: 6 }}>
        {data.recruittitle}
      </h1>

      <div style={{ marginTop: 10, fontSize: 14, opacity: 0.85 }}>
        {data.workarea ?? "지역 미상"} · D-{data.dday ?? "?"} · Score {data.matched_score ?? "?"}
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
          {data.ai_summary ?? "요약 없음"}
        </div>
      </div>

      <div style={{ marginTop: 16, display: "flex", gap: 10, flexWrap: "wrap" }}>
        {data.recruitcategory ? (
          <span style={{ fontSize: 12, padding: "6px 10px", border: "1px solid #eee", borderRadius: 999 }}>
            {data.recruitcategory}
          </span>
        ) : null}
        {data.popularcategory ? (
          <span style={{ fontSize: 12, padding: "6px 10px", border: "1px solid #eee", borderRadius: 999 }}>
            {data.popularcategory}
          </span>
        ) : null}
        {data.groupname ? (
          <span style={{ fontSize: 12, padding: "6px 10px", border: "1px solid #eee", borderRadius: 999 }}>
            {data.groupname}
          </span>
        ) : null}
      </div>

      {data.detailpage ? (
        <a
          href={data.detailpage}
          target="_blank"
          rel="noreferrer"
          style={{ display: "inline-block", marginTop: 18 }}
        >
          원문 공고 페이지 열기 ↗
        </a>
      ) : null}

      <div style={{ marginTop: 20, fontSize: 12, opacity: 0.6 }}>
        created_at: {data.created_at}
      </div>
    </div>
  );
}