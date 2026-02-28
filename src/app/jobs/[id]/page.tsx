import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";

export const revalidate = 60;

export default async function JobDetailPage({
  params,
}: {
  params: { id: string };
}) {
  // 1) id가 숫자인지 엄격히 검증
  const idStr = params.id;
  if (!/^\d+$/.test(idStr)) {
    // 숫자가 아니면 404 처리
    notFound();
  }

  const recruitid = parseInt(idStr, 10);

  // 2) recruitid가 정상 숫자인지 재확인
  if (!Number.isFinite(recruitid)) {
    notFound();
  }

  const { data, error } = await supabase
    .from("job_posting")
    .select(
      "recruitid,recruittitle,compname,workarea,dday,matched_score,ai_summary,detailpage,created_at,recruitcategory,popularcategory,groupname,careergubuncode,gubuncode,depth"
    )
    .eq("recruitid", recruitid)
    .single();

  if (error) {
    // 데이터가 없으면 404로 처리하는 게 UX 좋음
    if ((error as any).code === "PGRST116") notFound(); // "Results contain 0 rows"
    return (
      <div style={{ padding: 24 }}>
        <h1>Job Detail</h1>
        <pre
          style={{
            marginTop: 12,
            padding: 12,
            background: "#f6f6f6",
            borderRadius: 8,
          }}
        >
          {error.message}
        </pre>
      </div>
    );
  }

  return (
    <div style={{ padding: 24, maxWidth: 980, margin: "0 auto" }}>
      <div style={{ fontSize: 12, opacity: 0.7 }}>{data.compname ?? ""}</div>
      <h1 style={{ fontSize: 28, fontWeight: 750, marginTop: 6 }}>
        {data.recruittitle ?? ""}
      </h1>

      <div style={{ marginTop: 10, fontSize: 14, opacity: 0.85 }}>
        {(data.workarea ?? "지역 미상") +
          " · " +
          `D-${data.dday ?? "?"}` +
          " · " +
          `Score ${data.matched_score ?? "?"}`}
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
    </div>
  );
}