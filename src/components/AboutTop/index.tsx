import { useWindowSize } from "@react-hook/window-size";
import React, { useMemo } from "react";
import useMeasure from "react-use-measure";
import styles from "./style.module.scss";

function AboutTop(): JSX.Element {
  const [width, height] = useWindowSize();
  const [ref, { width: innerWidth }] = useMeasure();
  const style = useMemo(
    () => ({
      height: `${height}px`,
      justifyContent: width > innerWidth ? "center" : "flex-start",
    }),
    [height, innerWidth, width]
  );

  return (
    <div className={styles.wrapper} style={style}>
      <article className={styles.article} ref={ref}>
        <h2 className={styles.heading}>河村ひさ舟</h2>
        <p className={styles.paragraph}>
          ここに文章が入りますここに文章が入りますここに文章が入りますここに文章が入りますここに文章が入りますここに文章が入りますここに文章が入りますここに文章が入りますここに文章が入りますここに文章が入りますここに文章が入りますここに文章が入りますここに文章が入りますここに文章が入りますここに文章が入りますここに文章が入りますここに文章が入りますここに文章が入りますここに文章が入りますここに文章が入りますここに文章が入りますここに文章が入りますここに文章が入りますここに文章が入りますここに文章が入りますここに文章が入りますここに文章が入ります
        </p>
      </article>
    </div>
  );
}

export default AboutTop;
