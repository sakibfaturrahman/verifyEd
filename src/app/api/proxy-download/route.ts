import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");

  if (!url) {
    return NextResponse.json({ message: "URL is required" }, { status: 400 });
  }

  try {
    const response = await fetch(url);

    if (!response.ok) {
      return NextResponse.json(
        { message: `Failed to fetch file from source: ${response.statusText}` },
        { status: response.status },
      );
    }

    const arrayBuffer = await response.arrayBuffer();

    return new NextResponse(arrayBuffer, {
      headers: {
        "Content-Type":
          response.headers.get("Content-Type") || "application/pdf",
        "Content-Disposition": 'attachment; filename="certificate.pdf"',
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Proxy download failed" },
      { status: 500 },
    );
  }
}
