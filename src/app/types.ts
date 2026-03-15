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

export type MakeupProductType = {
  id: number;
  brand: string | null;
  name: string;
  price: string | null;
  price_sign: string | null;
  currency: string | null;
  image_link: string | null;
  product_link: string | null;
  description: string | null;
  rating: number | null;
  category: string | null;
  product_type: string | null;
  tag_list: string[];
}

export type BeautyFactProductType = {
  code: string;
  product_name: string;
  brands: string;
  image_url: string;
  ingredients_text: string;
  categories: string;
  quantity: string;
  labels?: string;
}

export type BeautyFactsResponseType = {
  products: BeautyFactProductType[];
  count: number;
  page: number;
  page_size: string;
}

export type YoutubeVideoType = {
  id: { videoId: string };
  snippet: {
    title: string;
    description: string;
    channelTitle: string;
    publishedAt: string;
    thumbnails: {
      medium: { url: string; width: number; height: number };
    };
  };
}

export type YoutubeSearchResponseType = {
  items: YoutubeVideoType[];
  pageInfo: { totalResults: number; resultsPerPage: number };
  error?: { message: string };
}