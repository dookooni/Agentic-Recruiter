import { supabase } from "@/lib/supabase";

export const revalidate = 60;

export default async function JobDetailPage({
  params,
}: {
  params: { recruitid: string };
}) {
  const idStr = params.recruitid;

  // recruitid 숫자 검증
  if (!/^\d+$/.test(idStr)) {
    return (
      <div style={{ padding: 24 }}>
        <h1>Invalid recruitid</h1>
        <pre>{`params.recruitid = ${String(idStr)}`}</pre>
      </div>
    );
  }

  const recruitid = parseInt(idStr, 10);

  const { data, error } = await supabase
    .from("job_posting")
    .select(
      "recruitid,recruittitle,compname,workarea,dday,matched_score,ai_summary,detailpage,created_at"
    )
    .eq("recruitid", recruitid)
    .single();

  if (error) {
    return (
      <div style={{ padding: 24 }}>
        <h1>Supabase error</h1>
        <pre style={{ padding: 12, background: "#f6f6f6", borderRadius: 8 }}>
          {error.message}
        </pre>
      </div>
    );
  }

  if (!data) {
    return (
      <div style={{ padding: 24 }}>
        <h1>No data</h1>
        <pre>{`recruitid = ${recruitid}`}</pre>
      </div>
    );
  }

  return (
    <div style={{ padding: 24, maxWidth: 980, margin: "0 auto" }}>
      <div style={{ fontSize: 12, opacity: 0.7 }}>{data.compname ?? ""}</div>
      <h1 style={{ fontSize: 28, fontWeight: 750, marginTop: 6 }}>
        {data.recruittitle ?? ""}
      </h1>
      <div style={{ marginTop: 12, lineHeight: 1.6 }}>
        {data.ai_summary ?? "요약 없음"}
      </div>
      {data.detailpage ? (
        <a href={data.detailpage} target="_blank" rel="noreferrer" style={{ display: "inline-block", marginTop: 18 }}>
          원문 공고 페이지 ↗
        </a>
      ) : null}
    </div>
  );
}