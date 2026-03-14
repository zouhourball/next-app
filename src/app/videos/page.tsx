import React from 'react'
import { getYoutubeVideos } from '@/api'
import { YoutubeSearchResponseType, YoutubeVideoType } from '../types'
import SearchForm from './SearchForm'

export default async function VideosPage({
  searchParams,
}: {
  searchParams: { q?: string }
}) {
  const query = searchParams.q ?? 'maquillage'
  const data: YoutubeSearchResponseType = await getYoutubeVideos(query)

  if (data.error) {
    return (
      <div className="container px-4 pt-5">
        <div className="row mt-5">
          <div className="col-12">
            <h1>Shorts Beauté</h1>
            <SearchForm defaultValue={query} />
            <div className="alert alert-danger mt-4">
              Erreur YouTube API : {data.error.message}
            </div>
          </div>
        </div>
      </div>
    )
  }

  const videos: YoutubeVideoType[] = data.items ?? []

  return (
    <div className="container px-4 pt-5">
      <div className="row mt-5">
        <div className="col-12">
          <h1>Shorts Beauté</h1>
          <p className="text-muted">Via YouTube Shorts</p>
          <SearchForm defaultValue={query} />
        </div>
      </div>
      <div className="row mt-4 g-4">
        {videos.map((video) => (
          <div className="col-12 col-sm-6 col-md-3" key={video.id.videoId}>
            <div className="card h-100">
              <div className="ratio" style={{ '--bs-aspect-ratio': '177.78%' } as React.CSSProperties}>
                <iframe
                  src={`https://www.youtube.com/embed/${video.id.videoId}`}
                  title={video.snippet.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div className="card-body">
                <h6 className="card-title">{video.snippet.title}</h6>
                <p className="text-muted mb-1">
                  <small>{video.snippet.channelTitle}</small>
                </p>
                {video.snippet.description && (
                  <p className="card-text" style={{ fontSize: '0.8rem' }}>
                    {video.snippet.description.slice(0, 100)}
                    {video.snippet.description.length > 100 ? '...' : ''}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
        {videos.length === 0 && (
          <div className="col-12">
            <p className="text-muted">Aucune vidéo trouvée pour &quot;{query}&quot;.</p>
          </div>
        )}
      </div>
    </div>
  )
}
