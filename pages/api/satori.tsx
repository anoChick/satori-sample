import satori from "satori";
import type { NextRequest } from "next/server";
export const config = {
  runtime: "edge",
};

const FONT_URL = "http://localhost:3000/DotGothic16-Regular.ttf";

export default async function handler(req: NextRequest) {
  const fontBufferArray = await fetch(FONT_URL).then((r) => r.arrayBuffer());

  const { searchParams } = new URL(req.url);
  const text = `${searchParams.get("text") ?? "noname"}`;
  console.log(searchParams);
  const svg = await satori(
    <div style={{ display: "flex", color: "black" }}>hello, {text}</div>,
    {
      width: 600,
      height: 400,
      fonts: [
        {
          name: "Noto",
          data: fontBufferArray,
          weight: 400,
          style: "normal",
        },
      ],
    }
  );

  return new Response(svg, {
    status: 200,
    headers: {
      "content-type": "image/svg+xml",
    },
  });
}
