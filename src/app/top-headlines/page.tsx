import React from 'react'
import {getTopHeadlinesBlogs} from '@/api'
import {articleType} from '../types'
import { v4 as uuidv4 } from 'uuid'
import moment from "moment"
import Link from "next/link"


export default async function page() {
  const blogsData = await getTopHeadlinesBlogs({pageSize:10})
  const articles = blogsData.articles
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
      <div className="row mt-5">
        <div className="col-12">
          <h1>Top headlines</h1>
        </div>
      </div>
      <div className="row mt-5">
      {renderArticles()}

      </div>
    </div>
  )
}
