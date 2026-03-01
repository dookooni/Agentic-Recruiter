"use client";

import Link from "next/link";
import { ChangeEvent, FormEvent, useMemo, useState } from "react";

const MAX_FILE_SIZE_MB = 15;
const ACCEPTED_TYPES = [".pdf", ".doc", ".docx", ".txt"];

function formatBytes(bytes: number) {
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(2)} MB`;
}

export default function PortfolioUploadPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "ready" | "submitted">("idle");

  const limitBytes = MAX_FILE_SIZE_MB * 1024 * 1024;

  const helperText = useMemo(() => {
    if (!selectedFile) return "포트폴리오 파일을 선택해 주세요.";
    return `${selectedFile.name} (${formatBytes(selectedFile.size)})`;
  }, [selectedFile]);

  const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setStatus("idle");
    setError(null);

    if (!file) {
      setSelectedFile(null);
      return;
    }

    const lowerName = file.name.toLowerCase();
    const isAccepted = ACCEPTED_TYPES.some((ext) => lowerName.endsWith(ext));
    if (!isAccepted) {
      setSelectedFile(null);
      setError(`지원 형식: ${ACCEPTED_TYPES.join(", ")}`);
      return;
    }

    if (file.size > limitBytes) {
      setSelectedFile(null);
      setError(`파일 크기는 최대 ${MAX_FILE_SIZE_MB}MB까지 가능합니다.`);
      return;
    }

    setSelectedFile(file);
    setStatus("ready");
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedFile) {
      setError("업로드할 포트폴리오 파일을 선택해 주세요.");
      return;
    }

    setError(null);
    setStatus("submitted");
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,#dbeafe_0%,#f8fafc_45%,#f8fafc_100%)]" />

      <div className="mx-auto w-full max-w-4xl px-6 py-10 sm:px-10">
        <Link
          href="/"
          className="inline-flex w-fit items-center rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
        >
          Back to home
        </Link>

        <section className="mt-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="inline-flex rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold tracking-wide text-sky-700">
            PORTFOLIO UPDATE
          </p>
          <h1 className="mt-4 text-3xl font-bold text-slate-900 sm:text-4xl">
            포트폴리오 업로드
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-600 sm:text-base">
            업로드된 최신 포트폴리오를 기준으로 공고 매칭 점수를 다시 계산할 수 있게
            준비합니다.
          </p>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <label
              htmlFor="portfolio-file"
              className="block rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5"
            >
              <span className="block text-sm font-semibold text-slate-700">
                파일 선택
              </span>
              <span className="mt-1 block text-xs text-slate-500">
                {ACCEPTED_TYPES.join(", ")} / 최대 {MAX_FILE_SIZE_MB}MB
              </span>
              <input
                id="portfolio-file"
                type="file"
                accept={ACCEPTED_TYPES.join(",")}
                onChange={onFileChange}
                className="mt-4 block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 file:mr-3 file:rounded-md file:border-0 file:bg-sky-600 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-sky-700"
              />
            </label>

            <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
              <p className="text-sm text-slate-700">{helperText}</p>
            </div>

            {error ? (
              <p className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-2 text-sm text-rose-700">
                {error}
              </p>
            ) : null}

            {status === "submitted" ? (
              <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-700">
                파일 검증이 완료되었습니다. 다음 단계에서 DB 저장/점수 재계산 연동을
                연결하면 됩니다.
              </p>
            ) : null}

            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-slate-300"
              disabled={status !== "ready"}
            >
              업로드 준비 완료
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
