import React, { useMemo } from "react";
import styles from "./style.module.scss";
import Link from "next/link";
import { SocialIcon } from "react-social-icons";

function Menu(): JSX.Element {
  const snsItems = useMemo(
    () =>
      [
        {
          url: "https://www.instagram.com/hisafune",
        },
        {
          url: "https://www.youtube.com/channel/UCzp-G8Q0zWj4GC1lFo2OmjA",
        },
      ].map(({ url }) => (
        <li className={styles.item} key={url}>
          <SocialIcon className={styles.socialIcon} target="_blank" url={url} />
        </li>
      )),
    []
  );
  const items = useMemo(
    () =>
      [
        {
          href: "/",
          title: "トップ",
        },
        {
          href: "/gallery",
          title: "ギャラリー",
        },
        {
          href: "/blog",
          title: "日記",
        },
        {
          href: "/about",
          title: "ひさ舟について",
        },
        {
          href: "/contact",
          title: "ご依頼等",
        },
      ].map(({ href, title }) => (
        <li className={styles.item} key={href}>
          <Link href={href}>
            <a className={styles.anchor}>{title}</a>
          </Link>
        </li>
      )),
    []
  );

  return (
    <aside className={styles.aside}>
      <div className={styles.listWrapper}>
        <ul className={styles.snsList}>{snsItems}</ul>
      </div>
      <nav className={styles.navigation}>
        <ul className={styles.list}>{items}</ul>
      </nav>
    </aside>
  );
}

export default Menu;
