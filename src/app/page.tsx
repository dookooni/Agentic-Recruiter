import Link from "next/link";

const metrics = [
  { label: "오늘 신규 공고", value: "48" },
  { label: "AI 매칭 평균", value: "82" },
  { label: "이번 주 지원 가능", value: "137" },
];

const highlights = [
  "실시간으로 최신 채용 공고를 확인",
  "AI 요약으로 핵심만 빠르게 파악",
  "직무 적합도 점수 기반 우선순위 추천",
];

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,#1e293b_0%,#020617_55%,#000000_100%)]" />

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 py-14 sm:px-10">
        <header className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur md:p-12">
          <p className="mb-4 inline-flex rounded-full border border-cyan-300/30 bg-cyan-300/10 px-3 py-1 text-xs font-semibold tracking-wide text-cyan-200">
            CATCH JOB INSIGHT
          </p>

          <h1 className="max-w-3xl text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl">
            채용 탐색을 더 빠르고 정확하게,
            <br className="hidden sm:block" />
            현대적인 지원 경험으로 바꿉니다.
          </h1>

          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
            공고 목록, AI 요약, 매칭 점수를 한 화면에서 확인하고 바로 상세 페이지로
            이동하세요.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/jobs"
              className="inline-flex items-center justify-center rounded-xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
            >
              채용 공고 보러가기
            </Link>
            <a
              href="https://nextjs.org/docs"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-xl border border-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              개발 문서 열기
            </a>
          </div>
        </header>

        <section className="grid gap-4 sm:grid-cols-3">
          {metrics.map((item) => (
            <article
              key={item.label}
              className="rounded-2xl border border-white/10 bg-slate-900/70 p-5"
            >
              <p className="text-xs text-slate-400">{item.label}</p>
              <p className="mt-3 text-3xl font-bold text-white">{item.value}</p>
            </article>
          ))}
        </section>

        <section className="rounded-2xl border border-white/10 bg-slate-900/70 p-6 sm:p-8">
          <h2 className="text-lg font-semibold text-white sm:text-xl">핵심 기능</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {highlights.map((text) => (
              <div
                key={text}
                className="rounded-xl border border-white/10 bg-slate-800/70 px-4 py-3 text-sm text-slate-200"
              >
                {text}
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
