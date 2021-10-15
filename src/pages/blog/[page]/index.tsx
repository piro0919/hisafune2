import Seo from "components/Seo";
import React, { useCallback } from "react";
import dynamic from "next/dynamic";
import { BlogTopProps } from "components/BlogTop";
import { GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";
import getClient from "libs/getClient";
import { SWRConfig } from "swr";

const BlogTop = dynamic(() => import("components/BlogTop"), {
  ssr: false,
});

export type PageProps = Pick<BlogTopProps, "pageNumber"> & {
  fallback: {
    [key: string]: Pick<
      Contents<Pick<Blog, "id" | "publishedAt" | "title">[]>,
      "contents" | "limit" | "totalCount"
    >;
  };
};

function Page({ fallback, pageNumber }: PageProps): JSX.Element {
  const router = useRouter();
  const handleClickNext = useCallback<BlogTopProps["onClickNext"]>(() => {
    router.push(`/blog/${pageNumber + 1}`);
  }, [pageNumber, router]);
  const handleClickPrev = useCallback<BlogTopProps["onClickPrev"]>(() => {
    router.push(`/blog/${pageNumber - 1}`);
  }, [pageNumber, router]);

  return (
    <>
      <Seo title="日記" />
      <SWRConfig value={{ fallback }}>
        <BlogTop
          onClickNext={handleClickNext}
          onClickPrev={handleClickPrev}
          pageNumber={pageNumber}
        />
      </SWRConfig>
    </>
  );
}

export const getStaticProps: GetStaticProps<PageProps> = async ({
  params: { page } = {
    page: undefined,
  },
}) => {
  if (typeof page !== "string") {
    return {
      notFound: true,
    };
  }

  const pageNumber = parseInt(page, 10);

  if (isNaN(pageNumber) || pageNumber < 1) {
    return {
      notFound: true,
    };
  }

  const client = getClient();

  if (typeof process.env.MICRO_CMS_ENDPOINT_BLOGS !== "string") {
    return {
      notFound: true,
    };
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

  return contents.length
    ? {
        props: {
          pageNumber,
          fallback: {
            [`/api/blogs?page=${pageNumber}`]: {
              contents,
              limit,
              totalCount,
            },
          },
        },
        revalidate: 60 * 60,
      }
    : {
        notFound: true,
      };
};

export const getStaticPaths: GetStaticPaths<{ page: string }> = async () => {
  const client = getClient();

  if (typeof process.env.MICRO_CMS_ENDPOINT_BLOGS !== "string") {
    return {
      // TODO
      fallback: true,
      paths: [],
    };
  }

  const { limit, totalCount } = await client.get<Contents<[]>>({
    endpoint: process.env.MICRO_CMS_ENDPOINT_BLOGS,
    queries: {
      fields: "",
      limit:
        typeof process.env.MICRO_CMS_ENDPOINT_BLOGS_LIMIT === "string"
          ? parseInt(process.env.MICRO_CMS_ENDPOINT_BLOGS_LIMIT, 10)
          : 10,
    },
  });

  return {
    fallback: true,
    paths: Array(Math.ceil(totalCount / limit))
      .fill(undefined)
      .map((_, index) => ({
        params: {
          page: (index + 1).toString(),
        },
      })),
  };
};

export default Page;
