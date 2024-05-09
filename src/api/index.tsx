
export async function getTopHeadlinesBlogs({country='us', pageSize=2}) {
    const res = await fetch(`${process.env.BASEURL}/top-headlines?country=${country}&pageSize=${pageSize}&apiKey=${process.env.APIKEY}`, {
        next: { revalidate : 10}
    })
    return res.json()
  }