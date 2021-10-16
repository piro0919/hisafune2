/* eslint-disable @next/next/no-img-element */
import { useWindowSize } from "@react-hook/window-size";
import { useMemo } from "react";
import styles from "./style.module.scss";
import useMeasure from "react-use-measure";
import dayjs from "dayjs";
import fetcher from "libs/fetcher";
import useSWR from "swr";
import parse, { domToReact } from "html-react-parser";

export type BlogArticleTopProps = {
  id: string;
  setMainSrc: (mainSrc: string) => void;
};

function BlogArticleTop({ id, setMainSrc }: BlogArticleTopProps): JSX.Element {
  const [width, height] = useWindowSize();
  const [ref, { width: articleWidth }] = useMeasure();
  const style = useMemo(
    () => ({
      height: `${height}px`,
      justifyContent: width > articleWidth ? "center" : "flex-start",
    }),
    [articleWidth, height, width]
  );
  const {
    data: { article, publishedAt, title } = {
      article: "",
      publishedAt: "",
      title: "",
    },
  } = useSWR<Pick<Blog, "article" | "publishedAt" | "title">>(
    `/api/blogs/${id}`,
    fetcher,
    { revalidateOnFocus: false }
  );

  return (
    <div className={styles.wrapper} style={style}>
      <article className={styles.article} ref={ref}>
        <h2 className={styles.heading}>{title}</h2>
        <div className={styles.date}>
          {dayjs(publishedAt).format("YYYY.MM.DD")}
        </div>
        <div className={styles.articleWrapper}>
          {parse(article, {
            replace: (domNode) => {
              if (!("name" in domNode)) {
                return;
              }

              const { name } = domNode;

              if (name === "img" && "attribs" in domNode) {
                const {
                  attribs: { alt, src },
                } = domNode;
                const handleClick = () => {
                  setMainSrc(src);
                };

                return (
                  <div className={styles.imageWrapper} onClick={handleClick}>
                    <img alt={alt} className={styles.image} src={src} />
                  </div>
                );
              }

              if (name === "ul" && "children" in domNode) {
                const { children } = domNode;

                return <ul className={styles.list}>{domToReact(children)}</ul>;
              }
            },
          })}
        </div>
      </article>
    </div>
  );
}

export default BlogArticleTop;
