import {useCallback, useEffect, useState} from 'react'
import {Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import {TailSpin} from 'react-loader-spinner'
import {FaPlay, FaInfoCircle} from 'react-icons/fa'

import Header from '../Header'
import Footer from '../Footer'
import ReactSlick from '../ReactSlick'
import {
  apiStatusConstants,
  formatMovie,
  getRequestOptions,
  loaderColor,
  originalsApiUrl,
  topRatedMoviesApiUrl,
  trendingMoviesApiUrl,
} from '../endpoints'

import './index.css'

const Home = () => {
  const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial)
  const [featuredMovie, setFeaturedMovie] = useState(null)

  const fetchFeaturedMovie = useCallback(async () => {
    setApiStatus(apiStatusConstants.inProgress)
    const jwtToken = Cookies.get('jwt_token')

    try {
      const response = await fetch(originalsApiUrl, getRequestOptions(jwtToken))

      if (response.ok) {
        const data = await response.json()
        const moviesList = data.results.map(formatMovie)
        const randomIndex = Math.floor(Math.random() * moviesList.length)
        setFeaturedMovie(moviesList[randomIndex])
        setApiStatus(apiStatusConstants.success)
        return
      }

      setApiStatus(apiStatusConstants.failure)
    } catch {
      setApiStatus(apiStatusConstants.failure)
    }
  }, [])

  useEffect(() => {
    fetchFeaturedMovie()
  }, [fetchFeaturedMovie])

  const renderLoadingView = () => (
    <div className="hero-fallback-view">
      <div className="loader-container" testid="loader" data-testid="loader">
        <TailSpin color={loaderColor} height={50} width={50} />
      </div>
    </div>
  )

  const renderFailureView = () => (
    <div className="hero-fallback-view">
      <div className="failure-view">
        <img
          className="failure-image"
          src="/failure-view.svg"
          alt="failure view"
        />
        <p className="failure-description">
          Something went wrong. Please try again
        </p>
        <button
          className="retry-button"
          type="button"
          onClick={fetchFeaturedMovie}
        >
          Try Again
        </button>
      </div>
    </div>
  )

  const renderFeaturedMovieView = () => {
    const {id, title, overview, backdropPath} = featuredMovie

    return (
      <section className="home-hero">
        <div
          className="hero-backdrop"
          style={{backgroundImage: `url(${backdropPath})`}}
        />
        <div className="hero-gradient" />
        <div className="hero-content content-wrapper">
          <p className="prime-badge">Included with Prime</p>
          <h1 className="hero-title">{title}</h1>
          <h1 className="hero-overview">{overview}</h1>
          <div className="hero-buttons">
            <Link className="primary-button" to={`/movies/${id}`}>
              <FaPlay />
              Play
            </Link>
            <Link className="secondary-button" to={`/movies/${id}`}>
              <FaInfoCircle />
              More info
            </Link>
          </div>
        </div>
      </section>
    )
  }

  const renderHeroSection = () => {
    switch (apiStatus) {
      case apiStatusConstants.success:
        return renderFeaturedMovieView()
      case apiStatusConstants.failure:
        return renderFailureView()
      default:
        return renderLoadingView()
    }
  }

  return (
    <div className="page-container">
      <Header />
      <main className="page-content">
        {renderHeroSection()}
        <div className="home-sliders content-wrapper">
          <ReactSlick title="Trending Now" apiUrl={trendingMoviesApiUrl} />
          <ReactSlick title="Originals" apiUrl={originalsApiUrl} />
          <ReactSlick title="Top Rated" apiUrl={topRatedMoviesApiUrl} />
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Home
