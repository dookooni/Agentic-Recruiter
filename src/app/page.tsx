import Link from "next/link";

const metrics = [
  { label: "New postings today", value: "48" },
  { label: "Avg AI match score", value: "82" },
  { label: "Open this week", value: "137" },
];

const highlights = [
  "Track fresh postings in near real-time",
  "Use AI summaries to scan faster",
  "Prioritize applications by match score",
];

const architecture = [
  "[n8n Scheduler]",
  "      -> [Browserless Scraper]",
  "      -> [AI Summary Worker]",
  "      -> [Supabase DB]",
  "      -> [Next.js /jobs UI on Vercel]",
];

const techPoints = [
  "n8n + Browserless: scheduled crawl flow with stable headless automation.",
  "Supabase: central storage for postings, summaries, and query-ready fields.",
  "Next.js on Vercel: fast listing/detail UI with simple deploy and scale.",
];

const projectOneLiner =
  "CATCH \uACF5\uACE0\uB97C \uC790\uB3D9 \uC218\uC9D1\u2192AI \uC694\uC57D\u2192DB \uC801\uC7AC\u2192\uAC80\uC0C9/\uC5F4\uB78C";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,#dbeafe_0%,#f8fafc_45%,#f8fafc_100%)]" />

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 py-14 sm:px-10">
        <header className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm md:p-12">
          <p className="mb-4 inline-flex rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold tracking-wide text-sky-700">
            CATCH JOB INSIGHT
          </p>

          <h1 className="max-w-3xl text-3xl font-bold leading-tight text-slate-900 sm:text-4xl md:text-5xl">
            Faster hiring discovery with a modern workflow.
          </h1>

          <p className="mt-5 max-w-3xl rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-relaxed text-slate-700 sm:text-base">
            {projectOneLiner}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/jobs"
              className="inline-flex items-center justify-center rounded-xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-700"
            >
              Jobs
            </Link>
            <Link
              href="/portfolio/upload"
              className="inline-flex items-center justify-center rounded-xl border border-sky-200 bg-sky-50 px-5 py-3 text-sm font-semibold text-sky-700 transition hover:bg-sky-100"
            >
              Portfolio
            </Link>
            <a
              href="https://nextjs.org/docs"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              Docs
            </a>
          </div>
        </header>

        <section className="grid gap-4 sm:grid-cols-3">
          {metrics.map((item) => (
            <article
              key={item.label}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <p className="text-xs text-slate-500">{item.label}</p>
              <p className="mt-3 text-3xl font-bold text-slate-900">{item.value}</p>
            </article>
          ))}
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">
              Architecture Mini Diagram
            </h2>
            <pre className="mt-4 overflow-x-auto rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs leading-6 text-slate-700">
              {architecture.join("\n")}
            </pre>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">
              Tech Stack / Operating Points
            </h2>
            <div className="mt-4 grid gap-3">
              {techPoints.map((point) => (
                <p
                  key={point}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"
                >
                  {point}
                </p>
              ))}
            </div>
          </article>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">
            Core Benefits
          </h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {highlights.map((text) => (
              <div
                key={text}
                className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"
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
