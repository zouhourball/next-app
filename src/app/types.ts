export type articleType = {
    source: {
      id: string,
      name: string
    }
    author: string | null,
    title: string,
    description: string | null,
    url: string,
    urlToImage: string | null,
    publishedAt: string,
    content: string | null
  }