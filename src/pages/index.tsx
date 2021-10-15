import React from "react";
import dynamic from "next/dynamic";
import Seo from "components/Seo";

const Top = dynamic(() => import("components/Top"), {
  ssr: false,
});

function Pages(): JSX.Element {
  return (
    <>
      <Seo />
      <Top />
    </>
  );
}

export default Pages;
