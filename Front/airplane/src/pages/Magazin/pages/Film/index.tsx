import { useEffect, useRef, useState } from 'react'
import classes from "./style.module.scss";
import { useNavigate, useParams } from 'react-router-dom'
import { getMoviesByID } from '../../../../constants/api'
import type { Movie } from '../../../../store/types'
import { IoReturnUpBackOutline } from "react-icons/io5";
import logoImage from '@assets/images/download.png'
import { API_CONFIG } from '../../../../constants/ApiConfig';
import clsx from 'clsx';
import { FaPlay } from "react-icons/fa6";
// import MoviePlayer from '../../components/Player/NetflixPlayer';
// import VideoJS from '../../components/Player/NetflixPlayer';

function Film() {
  const params = useParams()
  const movieId = params['id']
  const navigate = useNavigate()
  const [movie, setMovie] = useState<Movie>();
  const [play, setPlay] = useState(false);
  const [selectImage, setSelectedImage] = useState('');
  const selectVideoRef = useRef<HTMLVideoElement | null>(null)

  useEffect(() => {
    getMoviesByID(movieId as string).then(res => {
      const movie: Movie = res.data[0];
      setSelectedImage(`url(${API_CONFIG.movie}/${movie?.posterImageUrl})`)

      if (selectVideoRef.current) {
        selectVideoRef.current.src = `${API_CONFIG.movie}/${movie?.streamUrl}`
        selectVideoRef.current.load();
        if (play) {
          selectVideoRef.current.play();
        }

      }
      setMovie(movie)
    }).catch(_err => {

    })
  }, [])

  useEffect(() => {
    if (play && selectVideoRef.current) {
      selectVideoRef.current.play();
    }
  }, [play])




  return (
    <div className={classes.container} >
      <div className={classes.header}>
        <div className={classes.backIcon} onClick={() => navigate(-1)}>
          <IoReturnUpBackOutline size={25} title='Back' />
        </div>
        <div className={classes.logo}>
          <img src={logoImage} width={100} height={40} />
        </div>
      </div>
      {/* Hamburger */}

      <div className={classes.main} >
        <div className={clsx(classes.infoMovie, { [classes.hiddenPoster]: play })}
          style={{ backgroundImage: movie?.posterImageUrl ? selectImage : "none" }}>
          <div className={classes.info}>
            <span>{movie?.title}</span>
            <p>{movie?.description}</p>
            <span className={classes.imdb}>{`★: ${movie?.imdbRating}`}</span>

            <div className={classes.generList}>
              <p>gener </p>
              {movie?.genres.map((gener, index) => (
                <div className={classes.generItem} key={index}>{gener}</div>
              ))}
            </div>
            <div className={classes.generList}>
              <p>Directors </p>
              {movie?.directors.map((dir, index) => (
                <div className={classes.generItem} key={index}>{dir.name}</div>
              ))}
            </div>

            <div className={classes.generList}>
              <p>Actors </p>
              {movie?.actors.map((actor, index) => (
                <div className={classes.generItem} key={index}>{actor.name}</div>
              ))}
            </div>
            <div className={classes.actions} title='Play video'>
              <button className={classes.playBtn} onClick={() => setPlay(true)}>
                <FaPlay size={25} />
              </button>
              {/* <button className={classes.playBtn}>
                More Info
                <span className={classes.tooltip}>
                  Show more information about this movie
                </span>
              </button> */}
            </div>
          </div>

        </div>
        <div className={clsx(classes.player, { [classes.hiddenPoster]: !play })}>
          {/* <video /> */}
          {/* <vid */}
          {/* <MoviePlayer playlist={[{ url: `${API_CONFIG.movie}/${movie?.streamUrl}` }]} /> */}
          {/* <VideoJS options={videoJsOptions} /> */}
          <video ref={selectVideoRef} width={'100%'} controls  >
            <source type="video/mp4" />
            {/* <source  src={`http://localhost:5030/images/mov.mp4`} type="video/mp4" /> */}
          </video>
        </div>
      </div>
    </div>
  )
}

export default Film