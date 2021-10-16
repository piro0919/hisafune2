import React, { CSSProperties, useMemo } from "react";
import useMeasure from "react-use-measure";
import styles from "./style.module.scss";
import { useWindowSize } from "@react-hook/window-size";
import Image from "next/image";
import Link from "next/link";
// import useInfiniteScroll from "react-infinite-scroll-hook";
// import Loader from "react-loader-spinner";

type GalleryItem = {
  height: number;
  id: string;
  src: string;
  width: number;
};

export type GalleryTopProps = {
  galleryItems: GalleryItem[];
};

function GalleryTop({ galleryItems }: GalleryTopProps): JSX.Element {
  const [width, height] = useWindowSize();
  const [ref, { width: innerWidth }] = useMeasure();
  const style = useMemo(
    () => ({
      height: `${height}px`,
      justifyContent: width > innerWidth ? "center" : "flex-start",
    }),
    [height, innerWidth, width]
  );
  // const [sentryRef] = useInfiniteScroll({
  //   hasNextPage: true,
  //   loading: false,
  //   onLoadMore: () => {
  //     console.log("aaa");
  //   },
  // });
  const listStyle = useMemo<CSSProperties>(
    () => ({
      gridTemplateColumns: `repeat(${height > 720 ? 3 : 2}, 1fr)`,
    }),
    [height]
  );

  return (
    <div className={styles.wrapper} style={style}>
      <div className={styles.inner} ref={ref}>
        <ul className={styles.list} style={listStyle}>
          {galleryItems.map(({ height, id, src, width }) => (
            <li key={id}>
              <Link href={`/gallery?id=${id}`} scroll={false}>
                <a className={styles.anchor}>
                  <Image
                    alt=""
                    height={height}
                    layout="fill"
                    objectFit="cover"
                    src={src}
                    width={width}
                  />
                </a>
              </Link>
            </li>
          ))}
        </ul>
        {/* <aside className={styles.loaderWrapper} ref={sentryRef}>
          <Loader color="#000" height={36} type="TailSpin" width={36} />
        </aside> */}
      </div>
    </div>
  );
}

export default GalleryTop;
