import { GetServerSideProps } from "next";

function Blog(): JSX.Element {
  return <></>;
}

export const getServerSideProps: GetServerSideProps = async () => ({
  redirect: {
    destination: "/blog/1",
    permanent: true,
  },
});

export default Blog;
