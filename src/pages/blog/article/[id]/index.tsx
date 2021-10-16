import { BlogArticleTopProps } from "components/BlogArticleTop";
import Seo, { SeoProps } from "components/Seo";
import getClient from "libs/getClient";
import { GetStaticProps, GetStaticPaths } from "next";
import React, { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { SWRConfig } from "swr";
import Lightbox, { ILightBoxProps } from "react-image-lightbox";

const BlogArticleTop = dynamic(() => import("components/BlogArticleTop"), {
  ssr: false,
});

export type IdProps = Pick<BlogArticleTopProps, "id"> &
  Required<Pick<SeoProps, "title">> & {
    fallback: {
      [key: string]: Pick<Blog, "article" | "publishedAt" | "title">;
    };
  };

function Id({ fallback, id, title }: IdProps): JSX.Element {
  const [mainSrc, setMainSrc] = useState<ILightBoxProps["mainSrc"]>();
  const handleCloseRequest = useCallback<
    ILightBoxProps["onCloseRequest"]
  >(() => {
    setMainSrc(undefined);
  }, []);

  useEffect(() => {
    const body = document.getElementsByTagName("body")[0];

    body.style.overflowX = typeof mainSrc === "string" ? "hidden" : "auto";
  }, [mainSrc]);

  return (
    <>
      <Seo title={title} />
      <SWRConfig value={{ fallback }}>
        <BlogArticleTop id={id} setMainSrc={setMainSrc} />
      </SWRConfig>
      {typeof mainSrc === "string" ? (
        <Lightbox mainSrc={mainSrc} onCloseRequest={handleCloseRequest} />
      ) : null}
    </>
  );
}

export const getStaticProps: GetStaticProps<IdProps> = async ({
  params: { id } = {
    id: undefined,
  },
}) => {
  if (typeof id !== "string") {
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

  const { article, publishedAt, title } = await client.get<
    Pick<Blog, "article" | "publishedAt" | "title">
  >({
    contentId: id,
    endpoint: process.env.MICRO_CMS_ENDPOINT_BLOGS,
    queries: {
      fields: "article,publishedAt,title",
    },
  });

  return {
    props: {
      id,
      title,
      fallback: {
        [`/api/blogs/${id}`]: {
          article,
          publishedAt,
          title,
        },
      },
    },
    revalidate: 60 * 60,
  };
};

export const getStaticPaths: GetStaticPaths<{ id: string }> = async () => {
  const client = getClient();

  if (typeof process.env.MICRO_CMS_ENDPOINT_BLOGS !== "string") {
    return {
      // TODO
      fallback: true,
      paths: [],
    };
  }

  const { contents } = await client.get<Contents<Pick<Blog, "id">[]>>({
    endpoint: process.env.MICRO_CMS_ENDPOINT_BLOGS,
    queries: {
      fields: "id",
      limit:
        typeof process.env.MICRO_CMS_ENDPOINT_BLOGS_LIMIT === "string"
          ? parseInt(process.env.MICRO_CMS_ENDPOINT_BLOGS_LIMIT, 10)
          : 10,
    },
  });

  return {
    fallback: true,
    paths: contents.map(({ id }) => ({
      params: {
        id,
      },
    })),
  };
};

export default Id;
