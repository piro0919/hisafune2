type Blog = {
  article: string;
  createdAt: string;
  id: string;
  publishedAt: string;
  revisedAt: string;
  title: string;
  updatedAt: string;
};

type Contents<T> = {
  contents: T;
  limit: number;
  offset: number;
  totalCount: number;
};
