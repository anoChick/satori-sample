import satori from "satori";
import type { NextRequest } from "next/server";
import { Resvg } from "@resvg/resvg-js";

export const config = {
  // Edge Functionsとしてデプロイするための設定
  runtime: "edge",
};

// フォントファイルURL
const FONT_URL =
  (process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000") + "/DotGothic16-Regular.ttf";

export default async function handler(req: NextRequest) {
  // フォントデータのダウンロード
  const fontBufferArray = await fetch(FONT_URL).then((r) => r.arrayBuffer());

  const { searchParams } = new URL(req.url);
  const text = `${searchParams.get("text")}`;
  const svg = await satori(
    <div
      style={{
        display: "flex",
        width: "300px",
        height: "300px",
        color: "white",
        backgroundColor: "black",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {text}
    </div>,
    {
      width: 300,
      height: 300,
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

  // SVGからPNGに変換する処理
  const opts = {
    fitTo: {
      mode: "width" as const,
      value: 300,
    },
  };
  const resvg = new Resvg(svg, opts);
  const pngData = resvg.render();
  const pngBuffer = pngData.asPng();

  return new Response(pngBuffer, {
    status: 200,
    headers: {
      "content-type": "image/png",
    },
  });
}
