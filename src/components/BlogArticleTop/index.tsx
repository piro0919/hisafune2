import { useWindowSize } from "@react-hook/window-size";
import { useMemo } from "react";
import styles from "./style.module.scss";
import useMeasure from "react-use-measure";
import dayjs from "dayjs";
import fetcher from "libs/fetcher";
import useSWR from "swr";

export type BlogArticleTopProps = {
  id: string;
};

function BlogArticleTop({ id }: BlogArticleTopProps): JSX.Element {
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
        <div
          className={styles.articleWrapper}
          dangerouslySetInnerHTML={{
            __html: article.replace(
              /(<img.*?>)/g,
              `<div class="${styles.imageWrapper}">$1</div>`
            ),
          }}
        />
      </article>
    </div>
  );
}

export default BlogArticleTop;
