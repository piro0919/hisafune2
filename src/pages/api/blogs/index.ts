import getClient from "libs/getClient";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = Pick<
  Contents<Pick<Blog, "id" | "publishedAt" | "title">[]>,
  "contents" | "limit" | "totalCount"
>;

async function handler(
  { method, query: { page } }: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (method === "GET") {
    const client = getClient();

    if (typeof page !== "string") {
      // TODO
      res.status(404);

      return;
    }

    const pageNumber = parseInt(page, 10);

    if (
      typeof process.env.MICRO_CMS_ENDPOINT_BLOGS !== "string" ||
      isNaN(pageNumber) ||
      pageNumber < 1
    ) {
      // TODO
      res.status(404);

      return;
    }

    const blogsLimit =
      typeof process.env.MICRO_CMS_ENDPOINT_BLOGS_LIMIT === "string"
        ? parseInt(process.env.MICRO_CMS_ENDPOINT_BLOGS_LIMIT, 10)
        : 10;
    const { contents, limit, totalCount } = await client.get<
      Contents<Pick<Blog, "id" | "publishedAt" | "title">[]>
    >({
      endpoint: process.env.MICRO_CMS_ENDPOINT_BLOGS,
      queries: {
        fields: "id,publishedAt,title",
        limit: blogsLimit,
        offset: (pageNumber - 1) * blogsLimit,
      },
    });

    res.status(200).json({ contents, limit, totalCount });

    return;
  }

  // TODO
  res.status(404);
}

export default handler;
