import dynamic from "next/dynamic";
import Seo from "components/Seo";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import getClient from "libs/getClient";
import { GetStaticProps } from "next";
import Lightbox, { ILightBoxProps } from "react-image-lightbox";
import { GalleryTopProps } from "components/GalleryTop";

const GalleryTop = dynamic(() => import("components/GalleryTop"), {
  ssr: false,
});

export type GalleryProps = Pick<GalleryTopProps, "galleryItems">;

function Gallery({ galleryItems }: GalleryProps): JSX.Element {
  const {
    query: { id },
    ...router
  } = useRouter();
  const handleCloseRequest = useCallback<
    ILightBoxProps["onCloseRequest"]
  >(() => {
    router.push("/gallery", undefined, { scroll: false });
  }, [router]);
  const [index, setIndex] = useState<number>();
  const mainSrc = useMemo(() => {
    if (typeof index !== "number") {
      return "";
    }

    const { src } = galleryItems[index];

    return src;
  }, [galleryItems, index]);
  const nextSrc = useMemo(() => {
    if (typeof index !== "number") {
      return "";
    }

    const { src } =
      galleryItems[(index + galleryItems.length - 1) % galleryItems.length];

    return src;
  }, [galleryItems, index]);
  const prevSrc = useMemo(() => {
    if (typeof index !== "number") {
      return "";
    }

    const { src } = galleryItems[(index + 1) % galleryItems.length];

    return src;
  }, [galleryItems, index]);
  const handleMoveNextRequest = useCallback<
    NonNullable<ILightBoxProps["onMoveNextRequest"]>
  >(() => {
    if (typeof index !== "number") {
      return;
    }

    const nextIndex = (index + galleryItems.length - 1) % galleryItems.length;
    const { id } = galleryItems[nextIndex];

    router.push(`/gallery?id=${id}`, undefined, { scroll: false });
  }, [galleryItems, index, router]);
  const handleMovePrevRequest = useCallback<
    NonNullable<ILightBoxProps["onMovePrevRequest"]>
  >(() => {
    if (typeof index !== "number") {
      return;
    }

    const prevIndex = (index + 1) % galleryItems.length;
    const { id } = galleryItems[prevIndex];

    router.push(`/gallery?id=${id}`, undefined, { scroll: false });
  }, [galleryItems, index, router]);

  useEffect(() => {
    if (typeof id !== "string") {
      setIndex(undefined);

      return;
    }

    const index = galleryItems.findIndex(
      ({ id: galleryItemId }) => id === galleryItemId
    );

    if (index < 0) {
      router.replace(`/gallery/${id}`);

      return;
    }

    setIndex(index);
  }, [galleryItems, id, router]);

  useEffect(() => {
    const body = document.getElementsByTagName("body")[0];

    body.style.overflowX = typeof id === "string" ? "hidden" : "auto";
  }, [id]);

  return (
    <>
      <Seo title="ギャラリー" />
      <GalleryTop galleryItems={galleryItems} />
      {typeof index === "number" ? (
        <Lightbox
          mainSrc={mainSrc}
          nextSrc={nextSrc}
          onCloseRequest={handleCloseRequest}
          onMoveNextRequest={handleMoveNextRequest}
          onMovePrevRequest={handleMovePrevRequest}
          prevSrc={prevSrc}
        />
      ) : null}
    </>
  );
}

export const getStaticProps: GetStaticProps<GalleryProps> = async () => {
  const client = getClient();

  if (typeof process.env.MICRO_CMS_ENDPOINT_GALLERY !== "string") {
    return {
      notFound: true,
    };
  }

  const { contents } = await client.get<
    Contents<Pick<GALLERY, "id" | "image">[]>
  >({
    endpoint: process.env.MICRO_CMS_ENDPOINT_GALLERY,
    queries: {
      fields: "id,image",
    },
  });

  return {
    props: {
      galleryItems: contents.map(({ id, image: { height, url, width } }) => ({
        height,
        id,
        width,
        src: url,
      })),
    },
    revalidate: 60 * 60,
  };
};

export default Gallery;
