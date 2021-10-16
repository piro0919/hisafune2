import { useWindowSize } from "@react-hook/window-size";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import ContentEditable, { Props } from "react-contenteditable";
import { SubmitHandler, useForm } from "react-hook-form";
import useMeasure from "react-use-measure";
import striptags from "striptags";
import styles from "./style.module.scss";

type FieldValues = {
  body: string;
  email: string;
  name: string;
  subject: string;
  tel: string;
};

export type ContactTopProps = {
  onSubmit: SubmitHandler<FieldValues>;
};

function ContactTop({ onSubmit }: ContactTopProps): JSX.Element {
  const [width, height] = useWindowSize();
  const [ref, { width: innerWidth }] = useMeasure();
  const style = useMemo(
    () => ({
      height: `${height}px`,
      justifyContent: width > innerWidth ? "center" : "flex-start",
    }),
    [height, innerWidth, width]
  );
  const { handleSubmit, register, setValue, watch } = useForm<FieldValues>({
    defaultValues: {
      body: "",
      email: "",
      name: "",
      subject: "",
      tel: "",
    },
  });
  const handleChangeWithStripTags = useCallback<Props["onChange"]>(
    ({ currentTarget: { id }, target: { value } }) => {
      setValue(id, striptags(value));
    },
    [setValue]
  );
  const handleChange = useCallback<Props["onChange"]>(
    ({ currentTarget: { id }, target: { value } }) => {
      setValue(id, value);
    },
    [setValue]
  );
  const innerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!innerRef.current) {
      return;
    }

    innerRef.current.focus();
  }, [innerRef]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className={styles.wrapper} style={style}>
        <div className={styles.formInner} ref={ref}>
          <div className={styles.fieldWrapper}>
            <label htmlFor="name">
              お名前
              <abbr className={styles.required}>*</abbr>
            </label>
            <ContentEditable
              {...register("name", { required: true })}
              className={styles.input}
              contentEditable={true}
              html={watch("name")}
              id="name"
              innerRef={innerRef}
              onChange={handleChangeWithStripTags}
            />
          </div>
          <div className={styles.fieldWrapper}>
            <label htmlFor="subject">件名</label>
            <ContentEditable
              {...register("subject")}
              className={styles.input}
              contentEditable={true}
              html={watch("subject")}
              id="subject"
              onChange={handleChangeWithStripTags}
            />
          </div>
          <div className={styles.fieldWrapper}>
            <label htmlFor="tel">ご連絡先（電話番号）</label>
            <ContentEditable
              {...register("tel")}
              className={styles.input}
              contentEditable={true}
              html={watch("tel")}
              id="tel"
              onChange={handleChangeWithStripTags}
            />
          </div>
          <div className={styles.fieldWrapper}>
            <label htmlFor="email">ご連絡先（メールアドレス）</label>
            <ContentEditable
              {...register("email")}
              className={styles.input}
              contentEditable={true}
              html={watch("email")}
              id="email"
              onChange={handleChangeWithStripTags}
            />
          </div>
          <div className={styles.fieldWrapper}>
            <label htmlFor="body">
              ご依頼内容
              <abbr className={styles.required}>*</abbr>
            </label>
            <ContentEditable
              {...register("body", { required: true })}
              className={styles.textarea}
              contentEditable={true}
              html={watch("body")}
              id="body"
              onChange={handleChange}
            />
          </div>
          <button className={styles.button} type="submit">
            <div className={styles.buttonInner}>送信する</div>
          </button>
        </div>
      </div>
    </form>
  );
}

export default ContactTop;
