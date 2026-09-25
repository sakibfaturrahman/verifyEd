import { NextRequest, NextResponse } from "next/server";

const TARGET_API_URL = "https://api-verifyed.vercel.app/api/v1";

async function proxyHandler(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  const targetPath = path.join("/");
  const targetUrl = new URL(`${TARGET_API_URL}/${targetPath}`);

  // Teruskan query parameters jika ada
  req.nextUrl.searchParams.forEach((val, key) => {
    targetUrl.searchParams.set(key, val);
  });

  // Salin header yang relevan tanpa menyertakan host lokal
  const forwardHeaders = new Headers();
  req.headers.forEach((value, key) => {
    const lowerKey = key.toLowerCase();
    if (!["host", "connection", "content-length"].includes(lowerKey)) {
      forwardHeaders.set(key, value);
    }
  });

  const method = req.method;
  let body: BodyInit | undefined = undefined;

  if (!["GET", "HEAD"].includes(method)) {
    // Ambil body mentah untuk mendukung JSON maupun Multipart FormData
    const arrayBuffer = await req.arrayBuffer();
    if (arrayBuffer.byteLength > 0) {
      body = arrayBuffer;
    }
  }

  try {
    const response = await fetch(targetUrl.toString(), {
      method,
      headers: forwardHeaders,
      body,
    });

    const responseData = await response.arrayBuffer();
    const clientResponse = new NextResponse(responseData, {
      status: response.status,
      statusText: response.statusText,
    });

    // Salin header respon dari backend ke browser
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
      error instanceof Error ? error.message : "Proxy fetch error";
    return NextResponse.json(
      {
        success: false,
        message: `Gagal menghubungi backend: ${errMessage}`,
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
