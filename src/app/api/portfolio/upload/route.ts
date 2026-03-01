export async function POST(req: Request) {
  try {
    const body = await req.json();

    const base = process.env.N8N_WEBHOOK_BASE_URL;
    const secret = process.env.N8N_WEBHOOK_SECRET;

    if (!base || !secret) {
      return Response.json(
        { ok: false, error: "Missing env", base: !!base, secret: !!secret },
        { status: 500 }
      );
    }

    const url = `${base}/webhook/portfolio-upload`;

    const r = await fetch(url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-webhook-secret": secret,
      },
      body: JSON.stringify(body),
    });

    const text = await r.text();
    return new Response(text || JSON.stringify({ ok: r.ok }), { status: r.status });
  } catch (e: any) {
    return Response.json(
      { ok: false, error: e?.message ?? String(e) },
      { status: 500 }
    );
  }
}