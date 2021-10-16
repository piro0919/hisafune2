import "ress";
import "../styles/global.scss";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/lazy";
import "swiper/css/pagination";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import "react-image-lightbox/style.css";
import type { AppProps } from "next/app";
import React from "react";
import Head from "next/head";
import Layout from "components/Layout";

if (process.env.NODE_ENV === "development") {
  require("../styles/show-breakpoints.scss");
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta
          content="initial-scale=1.0,minimum-scale=1.0,width=device-width"
          name="viewport"
        />
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
}

export default MyApp;
