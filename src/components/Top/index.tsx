import hoge from "./images/hoge.png";
import fuga from "./images/fuga.png";
import piyo from "./images/piyo.png";
import Image from "next/image";
import { useWindowSize } from "@react-hook/window-size";
import styles from "./style.module.scss";
import React, { CSSProperties, useMemo } from "react";
import { A11y, Autoplay, EffectFade, Lazy, Pagination } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";

function Top(): JSX.Element {
  const [width, height] = useWindowSize();
  const style = useMemo<CSSProperties>(
    () => ({
      height: `${height}px`,
    }),
    [height]
  );
  const imageWrapperStyle = useMemo<CSSProperties>(
    () => ({
      height: `${height * 0.8}px`,
      width: `${width * 0.8}px`,
    }),
    [height, width]
  );
  const items = useMemo(
    () =>
      [
        {
          background: "linear-gradient(to right bottom, #c3b2a2, #9a8776)",
          image: hoge,
        },
        {
          background: "linear-gradient(to right bottom, #909668, #666c40)",
          image: fuga,
        },
        {
          background: "linear-gradient(to right bottom, #a899ae, #827088)",
          image: piyo,
        },
      ].map(({ background, image }) => {
        const { src } = image;

        return (
          <SwiperSlide
            className={styles.swiperSlide}
            key={src}
            style={{ background }}
          >
            <div className={styles.imageWrapper} style={imageWrapperStyle}>
              <Image
                alt=""
                layout="fill"
                objectFit="contain"
                placeholder="blur"
                src={image}
              />
            </div>
          </SwiperSlide>
        );
      }),
    [imageWrapperStyle]
  );

  return (
    <div className={styles.wrapper} style={style}>
      <Swiper
        autoplay={{
          delay: 10000,
        }}
        className={styles.swiper}
        direction="vertical"
        effect="fade"
        loop={true}
        modules={[A11y, Autoplay, EffectFade, Lazy, Pagination]}
        pagination={{ clickable: true }}
        speed={1000}
      >
        {items}
      </Swiper>
    </div>
  );
}

export default Top;
