import { useWindowSize } from "@react-hook/window-size";
import React, { MouseEventHandler, useMemo } from "react";
import styles from "./style.module.scss";
import useMeasure from "react-use-measure";
import Link from "next/link";
import dayjs from "dayjs";
import { AnimatePresence, motion } from "framer-motion";
import { RiArrowDownFill, RiArrowUpFill } from "react-icons/ri";
import fetcher from "libs/fetcher";
import useSWR from "swr";

export type BlogTopProps = {
  onClickNext: MouseEventHandler<HTMLButtonElement>;
  onClickPrev: MouseEventHandler<HTMLButtonElement>;
  pageNumber: number;
};

function BlogTop({
  onClickNext,
  onClickPrev,
  pageNumber,
}: BlogTopProps): JSX.Element {
  const [width, height] = useWindowSize();
  const [ref, { width: innerWidth }] = useMeasure();
  const style = useMemo(
    () => ({
      height: `${height}px`,
      justifyContent: width > innerWidth ? "center" : "flex-start",
    }),
    [height, innerWidth, width]
  );
  const {
    data: { contents, limit, totalCount } = {
      contents: [],
      limit: 0,
      totalCount: 0,
    },
  } = useSWR<
    Pick<
      Contents<Pick<Blog, "id" | "publishedAt" | "title">[]>,
      "contents" | "limit" | "totalCount"
    >
  >(`/api/blogs?page=${pageNumber}`, fetcher, { revalidateOnFocus: false });
  const items = useMemo(
    () =>
      contents.map(({ id, publishedAt, title }) => (
        <li key={id}>
          <Link href={`/blog/article/${id}`}>
            <a className={styles.anchor}>
              <h2>{title}</h2>
              <span className={styles.date}>
                {dayjs(publishedAt).format("YYYY.MM.DD")}
              </span>
            </a>
          </Link>
        </li>
      )),
    [contents]
  );
  const last = useMemo(
    () => Math.ceil(totalCount / limit),
    [limit, totalCount]
  );
  const pagination = useMemo(
    () => (
      <aside className={styles.paginationWrapper}>
        {pageNumber !== 1 ? (
          <button onClick={onClickPrev}>
            <RiArrowUpFill size={24} />
          </button>
        ) : (
          <div />
        )}
        {pageNumber !== last ? (
          <button onClick={onClickNext}>
            <RiArrowDownFill size={24} />
          </button>
        ) : null}
      </aside>
    ),
    [last, onClickNext, onClickPrev, pageNumber]
  );

  return (
    <div className={styles.wrapper} style={style}>
      <div className={styles.inner} ref={ref}>
        <AnimatePresence exitBeforeEnter={true} initial={true}>
          <motion.div
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            key={pageNumber}
            initial={{ opacity: 0 }}
          >
            {last !== 1 ? (
              <div className={styles.prevPaginationWrapper}>{pagination}</div>
            ) : null}
            <ul className={styles.list}>{items}</ul>
            {last !== 1 ? (
              <div className={styles.nextPaginationWrapper}>{pagination}</div>
            ) : null}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default BlogTop;
