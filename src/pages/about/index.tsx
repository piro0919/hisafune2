import React from "react";
import dynamic from "next/dynamic";
import Seo from "components/Seo";

const AboutTop = dynamic(() => import("components/AboutTop"), {
  ssr: false,
});

function About(): JSX.Element {
  return (
    <>
      <Seo title="ひさ舟について" />
      <AboutTop />
    </>
  );
}

export default About;
