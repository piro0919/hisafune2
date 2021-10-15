import { NextSeo } from "next-seo";
import React from "react";

export type SeoProps = {
  title?: string;
};

function Seo({ title }: SeoProps): JSX.Element {
  return (
    <>
      <NextSeo
        description="広島県福山市の書家「河村ひさ舟」の公式サイト"
        title={`${title ? `${title} - ` : ""}書家 河村ひさ舟`}
      />
    </>
  );
}

export default Seo;
