export async function POST(req: Request) {
  try {
    const body = await req.json();

    const url = `${process.env.N8N_WEBHOOK_BASE_URL}/webhook/portfolio-upload`;

    const r = await fetch(url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-webhook-secret": process.env.N8N_WEBHOOK_SECRET!,
      },
      body: JSON.stringify(body),
    });

    const text = await r.text();
    return new Response(text, { status: r.status });
  } catch (e: any) {
    return Response.json(
      { ok: false, error: e?.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}