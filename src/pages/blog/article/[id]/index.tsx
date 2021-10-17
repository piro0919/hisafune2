import { BlogArticleTopProps } from "components/BlogArticleTop";
import Seo, { SeoProps } from "components/Seo";
import getClient from "libs/getClient";
import { GetStaticProps, GetStaticPaths } from "next";
import React, { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { SWRConfig } from "swr";
import Lightbox, { ILightBoxProps } from "react-image-lightbox";
import { useRouter } from "next/router";

const BlogArticleTop = dynamic(() => import("components/BlogArticleTop"), {
  ssr: false,
});

export type IdProps = Pick<BlogArticleTopProps, "id"> &
  Required<Pick<SeoProps, "title">> & {
    article: string;
    fallback: {
      [key: string]: Pick<Blog, "article" | "publishedAt" | "title">;
    };
  };

function Id({ article, fallback, id, title }: IdProps): JSX.Element {
  const {
    query: { imageid },
    ...router
  } = useRouter();
  const [mainSrc, setMainSrc] = useState<ILightBoxProps["mainSrc"]>();
  const handleCloseRequest = useCallback<
    ILightBoxProps["onCloseRequest"]
  >(() => {
    router.push(`/blog/article/${id}`, undefined, { scroll: false });
  }, [id, router]);

  useEffect(() => {
    const body = document.getElementsByTagName("body")[0];

    body.style.overflowX = typeof mainSrc === "string" ? "hidden" : "auto";
  }, [mainSrc]);

  useEffect(() => {
    if (typeof imageid !== "string") {
      setMainSrc(undefined);

      return;
    }

    const images = article.match(/<img.*?>/g);

    if (!Array.isArray(images)) {
      router.replace(`/blog/article/${id}`);

      return;
    }

    const parser = new DOMParser();
    const foundSrc = images
      .map((image) =>
        parser.parseFromString(image, "text/html").querySelector("img")
      )
      .map((image) => {
        const { src } = image || { src: "" };

        return src;
      })
      .find((src) => src.includes(imageid));

    if (typeof foundSrc !== "string") {
      router.replace(`/blog/article/${id}`);

      return;
    }

    setMainSrc(foundSrc);
  }, [article, id, imageid, router]);

  return (
    <>
      <Seo title={title} />
      <SWRConfig value={{ fallback }}>
        <BlogArticleTop id={id} />
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
      article,
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
