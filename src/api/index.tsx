
/*export async function getTopHeadlinesBlogs({country='fr', pageSize=2}) {
    const res = await fetch(`${process.env.BASEURL}/top-headlines?country=${country}&pageSize=${pageSize}&apiKey=${process.env.APIKEY}`, {
        next: { revalidate : 10}
    })
    return res.json()
  }*/

export async function getMakeupProducts(productType: string = 'lipstick') {
    const res = await fetch(
      `https://makeup-api.herokuapp.com/api/v1/products.json?product_type=${productType}`,
      { next: { revalidate: 3600 } }
    )
    return res.json()
  }

export async function getBeautyFacts(searchTerm: string = 'rouge à lèvres') {
    const res = await fetch(
      `https://fr.openbeautyfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(searchTerm)}&json=1&page_size=20`,
      { next: { revalidate: 3600 } }
    )
    return res.json()
  }

export async function getYoutubeVideos(query: string = 'maquillage', maxResults: number = 12) {
    const shortsQuery = encodeURIComponent(`${query} #shorts`)
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${shortsQuery}&type=video&videoDuration=short&maxResults=${maxResults}&relevanceLanguage=fr&regionCode=FR&key=${process.env.YOUTUBE_API_KEY}`,
      { next: { revalidate: 3600 } }
    )
    return res.json()
  }
