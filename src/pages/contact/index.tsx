import { ContactTopProps } from "components/ContactTop";
import Seo from "components/Seo";
import React, { useCallback } from "react";
import dynamic from "next/dynamic";

const ContactTop = dynamic(() => import("components/ContactTop"), {
  ssr: false,
});

function Contact(): JSX.Element {
  const handleSubmit = useCallback<ContactTopProps["onSubmit"]>((data) => {
    console.log(data);
  }, []);

  return (
    <>
      <Seo title="ご依頼等" />
      <ContactTop onSubmit={handleSubmit} />
    </>
  );
}

export default Contact;
