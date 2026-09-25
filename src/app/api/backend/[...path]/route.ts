import { NextRequest, NextResponse } from "next/server";

const TARGET_API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://api-verifyed.vercel.app/api/v1";

async function proxyHandler(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  try {
    const { path } = await params;
    const targetPath = path.join("/");
    const targetUrl = new URL(`${TARGET_API_URL}/${targetPath}`);

    // Teruskan semua query parameters
    req.nextUrl.searchParams.forEach((val, key) => {
      targetUrl.searchParams.set(key, val);
    });

    // Salin headers secara aman
    const forwardHeaders = new Headers();
    req.headers.forEach((value, key) => {
      const lower = key.toLowerCase();
      // Jangan forward host atau connection agar Vercel tidak menolak
      if (!["host", "connection"].includes(lower)) {
        forwardHeaders.set(key, value);
      }
    });

    // Pastikan Authorization header tetap ada
    const authHeader = req.headers.get("authorization");
    if (authHeader) {
      forwardHeaders.set("Authorization", authHeader);
    }

    const method = req.method;
    let body: BodyInit | undefined = undefined;

    if (!["GET", "HEAD"].includes(method)) {
      const arrayBuffer = await req.arrayBuffer();
      if (arrayBuffer.byteLength > 0) {
        body = arrayBuffer;
      }
    }

    const response = await fetch(targetUrl.toString(), {
      method,
      headers: forwardHeaders,
      body,
      // Jangan cache request API dinamis
      cache: "no-store",
    });

    const responseData = await response.arrayBuffer();
    const clientResponse = new NextResponse(responseData, {
      status: response.status,
      statusText: response.statusText,
    });

    // Salin header respons backend kembali ke client
    response.headers.forEach((value, key) => {
      const lower = key.toLowerCase();
      if (
        !["content-encoding", "content-length", "transfer-encoding"].includes(
          lower,
        )
      ) {
        clientResponse.headers.set(key, value);
      }
    });

    return clientResponse;
  } catch (error: unknown) {
    const errMessage =
      error instanceof Error ? error.message : "Proxy connection failed";
    console.error("[Proxy Error]:", errMessage);
    return NextResponse.json(
      {
        success: false,
        message: `Proxy Error: ${errMessage}`,
        error: { code: "BAD_GATEWAY" },
      },
      { status: 502 },
    );
  }
}

export const GET = proxyHandler;
export const POST = proxyHandler;
export const PUT = proxyHandler;
export const PATCH = proxyHandler;
export const DELETE = proxyHandler;
export const OPTIONS = proxyHandler;
