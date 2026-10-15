import {useCallback, useEffect, useState} from 'react'
import Slider from 'react-slick'
import Cookies from 'js-cookie'
import {TailSpin} from 'react-loader-spinner'
import {MdChevronLeft, MdChevronRight} from 'react-icons/md'

import MovieItem from '../MovieItem'
import {
  apiStatusConstants,
  formatMovie,
  getRequestOptions,
  loaderColor,
} from '../endpoints'

import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import './index.css'

const PrevArrow = ({onClick}) => (
  <button
    className="slider-arrow prev-arrow"
    type="button"
    onClick={onClick}
    disabled={onClick === null}
    aria-label="Previous movies"
  >
    <MdChevronLeft />
  </button>
)

const NextArrow = ({onClick}) => (
  <button
    className="slider-arrow next-arrow"
    type="button"
    onClick={onClick}
    disabled={onClick === null}
    aria-label="Next movies"
  >
    <MdChevronRight />
  </button>
)

const sliderSettings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 6,
  slidesToScroll: 5,
  prevArrow: <PrevArrow />,
  nextArrow: <NextArrow />,
  responsive: [
    {breakpoint: 1400, settings: {slidesToShow: 5, slidesToScroll: 4}},
    {breakpoint: 1100, settings: {slidesToShow: 4, slidesToScroll: 3}},
    {breakpoint: 768, settings: {slidesToShow: 3, slidesToScroll: 2}},
    {breakpoint: 576, settings: {slidesToShow: 2, slidesToScroll: 2}},
  ],
}

const ReactSlick = ({title, apiUrl}) => {
  const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial)
  const [moviesList, setMoviesList] = useState([])

  const fetchMovies = useCallback(async () => {
    setApiStatus(apiStatusConstants.inProgress)
    const jwtToken = Cookies.get('jwt_token')

    try {
      const response = await fetch(apiUrl, getRequestOptions(jwtToken))

      if (response.ok) {
        const data = await response.json()
        setMoviesList(data.results.map(formatMovie))
        setApiStatus(apiStatusConstants.success)
        return
      }

      setApiStatus(apiStatusConstants.failure)
    } catch {
      setApiStatus(apiStatusConstants.failure)
    }
  }, [apiUrl])

  useEffect(() => {
    fetchMovies()
  }, [fetchMovies])

  const renderLoadingView = () => (
    <div className="loader-container" testid="loader" data-testid="loader">
      <TailSpin color={loaderColor} height={50} width={50} />
    </div>
  )

  const renderFailureView = () => (
    <div className="slider-failure-view">
      <img
        className="slider-failure-image"
        src="/failure-view.svg"
        alt="failure view"
      />
      <p className="slider-failure-description">
        Something went wrong. Please try again
      </p>
      <button className="retry-button" type="button" onClick={fetchMovies}>
        Try Again
      </button>
    </div>
  )

  const renderSliderView = () => (
    <Slider {...sliderSettings}>
      {moviesList.map(movie => (
        <MovieItem key={movie.id} movieDetails={movie} />
      ))}
    </Slider>
  )

  const renderMoviesSlider = () => {
    switch (apiStatus) {
      case apiStatusConstants.success:
        return renderSliderView()
      case apiStatusConstants.failure:
        return renderFailureView()
      default:
        return renderLoadingView()
    }
  }

  return (
    <section className="slider-section">
      <h1 className="section-heading">{title}</h1>
      <div className="slider-wrapper">{renderMoviesSlider()}</div>
    </section>
  )
}

export default ReactSlick
