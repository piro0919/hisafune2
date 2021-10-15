import Menu from "components/Menu";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/dist/client/router";
import React, { ReactNode, useEffect, useMemo } from "react";
import { useOutsideClickRef } from "rooks";
import useSwitch from "@react-hook/switch";
import hoge from "./images/hoge.png";
import Image from "next/image";
import styles from "./style.module.scss";

export type LayoutProps = {
  children: ReactNode;
};

function Layout({ children }: LayoutProps): JSX.Element {
  const { pathname } = useRouter();
  const [value, toggle] = useSwitch(true);
  const { off } = useMemo(() => toggle, [toggle]);
  const [ref] = useOutsideClickRef(off);

  useEffect(() => {
    off();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <>
      <h1 className={styles.heading}>書家 河村ひさ舟</h1>
      <AnimatePresence exitBeforeEnter={true} initial={true}>
        <motion.main
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          key={pathname}
          initial={{ opacity: 0 }}
        >
          {children}
        </motion.main>
      </AnimatePresence>
      <div className={styles.navigationWrapper} ref={ref}>
        {value ? <Menu /> : null}
        <button className={styles.button} onClick={toggle}>
          <Image alt="" layout="fill" src={hoge} />
        </button>
      </div>
    </>
  );
}

export default Layout;
