import dynamic from "next/dynamic";
import Seo from "components/Seo";
import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import getClient from "libs/getClient";
import { GetStaticProps } from "next";
import Lightbox, { ILightBoxProps } from "react-image-lightbox";
import { GalleryTopProps } from "components/GalleryTop";
import useSwitch from "@react-hook/switch";

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
  const [value] = useSwitch(typeof id === "string");
  const [mainSrc, setMainSrc] = useState<ILightBoxProps["mainSrc"]>();

  useEffect(() => {
    if (typeof id !== "string") {
      setMainSrc(undefined);

      return;
    }

    const foundGalleryItem = galleryItems.find(
      ({ id: galleryItemId }) => id === galleryItemId
    );

    if (!foundGalleryItem) {
      router.replace(`/gallery/${id}`);

      return;
    }

    const { src } = foundGalleryItem;

    setMainSrc(src);
  }, [galleryItems, id, router]);

  useEffect(() => {
    const body = document.getElementsByTagName("body")[0];

    body.style.overflowX = value ? "hidden" : "auto";
  }, [id, value]);

  return (
    <>
      <Seo title="ギャラリー" />
      <GalleryTop galleryItems={galleryItems} />
      {typeof mainSrc === "string" ? (
        <Lightbox mainSrc={mainSrc} onCloseRequest={handleCloseRequest} />
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
