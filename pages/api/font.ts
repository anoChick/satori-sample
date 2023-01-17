// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import subsetFont from "subset-font";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const text = `${req.query.text}`;
  const fontBufferArray = await fetch(
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000") + "/DotGothic16-Regular.ttf"
  ).then((res) => res.arrayBuffer());
  const fontBuffer = Buffer.from(fontBufferArray);
  res.setHeader("content-type", "font/ttf");
  const subsetBuffer = await subsetFont(fontBuffer, text, {
    targetFormat: "truetype",
  });

  res.status(200).send(subsetBuffer);
}
