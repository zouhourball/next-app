import Link from "next/link"
import {getTopHeadlinesBlogs} from '@/api'
import { v4 as uuidv4 } from 'uuid'
import moment from "moment"
import {articleType} from './types'



export default async function Home() {

  const blogsData = await getTopHeadlinesBlogs({})
  const articles = blogsData.articles
  //console.log('ffffffff', articles)
  const renderArticles = ()=> articles?.filter((article: articleType)=> article.title !== '[Removed]').map((article:articleType) => {
    const arKey = uuidv4()
    
    return(
    <div className="col-12 col-sm-6" key={arKey}>
          <div className="card h-100 w-100">
        <img
          alt={article.title}
          src={article.urlToImage ?? "https://picsum.photos/200/300"}
          className="card-img-top imgs"

        />
        <div className="card-body">
           <Link href={article.url} className="link-offset-2 link-underline link-underline-opacity-0" target="_blank">{article.title}</Link>
           {article?.source?.name && <div>Source: {article?.source?.name}</div>}
           {article?.author && <div>Author: {article?.author}</div>}
          <div>Published: {moment(article?.publishedAt).format('DD-MM-YYYY')}</div>
          </div>
          </div>
        </div>
  )})
  return (
    <div className="container px-4 pt-5">
      <h1>Welcome to this News page</h1>
      <span>This Blog is to showcase Development process only</span>
      <div className="row mt-5">
        <div className="col-12">
          <h1>Top headlines</h1>
        </div>
      </div>
      <div className="row mt-5">
        {renderArticles()}
      </div> 
      <div className="row w-auto mt-5">
        <span>
        <Link href={
          '/top-headlines'
          } className="btn btn-primary">See More</Link>
        </span>
      </div>
    </div>
  )
}
