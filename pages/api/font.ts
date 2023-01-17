import type { NextApiRequest, NextApiResponse } from "next";
import subsetFont from "subset-font";

const FONT_URL = "http://localhost:3000/DotGothic16-Regular.ttf";
const CONTENT_TYPE = "font/ttf";
const FONT_FORMAT = "truetype";
export const config = {
  runtime: "edge",
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // 使用する文字列を与える
  const text = `${req.query.text}`;

  // CDNからフォントデータをダウンロードする(キャッシュさせる)
  const fontBufferArray = await fetch(FONT_URL).then((res) =>
    res.arrayBuffer()
  );

  //フォントデータをサブセット化する
  const subsetBuffer = await subsetFont(Buffer.from(fontBufferArray), text, {
    targetFormat: FONT_FORMAT,
  });

  res.setHeader("content-type", CONTENT_TYPE);
  res.status(200).send(subsetBuffer);
}
