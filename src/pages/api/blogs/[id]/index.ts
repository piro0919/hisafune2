import getClient from "libs/getClient";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = Pick<Blog, "article" | "publishedAt" | "title">;

async function handler(
  { method, query: { id } }: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (method === "GET") {
    const client = getClient();

    if (
      typeof process.env.MICRO_CMS_ENDPOINT_BLOGS !== "string" ||
      typeof id !== "string"
    ) {
      // TODO
      res.status(404);

      return;
    }

    const { article, publishedAt, title } = await client.get<
      Pick<Blog, "article" | "publishedAt" | "title">
    >({
      contentId: id,
      endpoint: process.env.MICRO_CMS_ENDPOINT_BLOGS,
      queries: {
        fields: "article,publishedAt,title",
      },
    });

    res.status(200).json({ article, publishedAt, title });

    return;
  }

  // TODO
  res.status(404);
}

export default handler;
