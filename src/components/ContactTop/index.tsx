import { useWindowSize } from "@react-hook/window-size";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import ContentEditable, { Props } from "react-contenteditable";
import { SubmitHandler, useForm } from "react-hook-form";
import useMeasure from "react-use-measure";
import striptags from "striptags";
import styles from "./style.module.scss";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import "yup-phone";

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

const phoneSchema = yup.string().phone("JP", undefined);

const schema = yup.object().shape(
  {
    body: yup.string().required("ご依頼内容を入力してください"),
    email: yup
      .string()
      .when("tel", {
        is: (tel: string) => tel.length,
        then: yup.string(),
        otherwise: yup
          .string()
          .required("電話番号またはメールアドレスを入力してください"),
      })
      .email("メールアドレスの形式で入力してください"),
    name: yup.string().required("お名前を入力してください"),
    subject: yup.string(),
    tel: yup
      .string()
      // TODO: エラーを吐く
      // .when("email", {
      //   is: (email: string) => email.length,
      //   then: yup.string(),
      //   otherwise: yup
      //     .string()
      //     .required("電話番号またはメールアドレスを入力してください"),
      // })
      .test("test-tel", "電話番号の形式で入力してください", (value) =>
        value ? phoneSchema.isValidSync(value) : true
      ),
  },
  [["email", "tel"]]
);

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
  const {
    formState: { errors },
    handleSubmit,
    register,
    setValue,
    watch,
  } = useForm<FieldValues>({
    defaultValues: {
      body: "",
      email: "",
      name: "",
      subject: "",
      tel: "",
    },
    resolver: yupResolver(schema),
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
              {...register("name")}
              className={styles.input}
              contentEditable={true}
              html={watch("name")}
              id="name"
              innerRef={innerRef}
              onChange={handleChangeWithStripTags}
            />
            {errors.name ? (
              <div className={styles.errorWrapper}>{errors.name.message}</div>
            ) : null}
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
            {errors.subject ? (
              <div className={styles.errorWrapper}>
                {errors.subject.message}
              </div>
            ) : null}
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
            {errors.tel ? (
              <div className={styles.errorWrapper}>{errors.tel.message}</div>
            ) : null}
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
            {errors.email ? (
              <div className={styles.errorWrapper}>{errors.email.message}</div>
            ) : null}
          </div>
          <div className={styles.fieldWrapper}>
            <label htmlFor="body">
              ご依頼内容
              <abbr className={styles.required}>*</abbr>
            </label>
            <ContentEditable
              {...register("body")}
              className={styles.textarea}
              contentEditable={true}
              html={watch("body")}
              id="body"
              onChange={handleChange}
            />
            {errors.body ? (
              <div className={styles.errorWrapper}>{errors.body.message}</div>
            ) : null}
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
