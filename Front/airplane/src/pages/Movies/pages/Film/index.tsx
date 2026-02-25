import { useEffect, useRef, useState } from 'react'
import classes from "./style.module.scss";
import { useNavigate, useParams } from 'react-router-dom'
import { IoReturnUpBackOutline } from "react-icons/io5";
import logoImage from '@assets/images/download.png'
import clsx from 'clsx';
import { FaPlay } from "react-icons/fa6";
import type { Movie } from '../../constants/types';
import { getMoviesByID } from '../../constants/api';
import { API_CONFIG } from '@/constants/ApiConfig';
import VideoPlayerTest from './VideoPlayer';
import VideoJSPlayer from '../../components/Player/NetflixPlayer';
// import MoviePlayer from '../../components/Player/NetflixPlayer';
// import VideoJS from '../../components/Player/NetflixPlayer';

function MoviePlayer() {
  const params = useParams()
  const movieId = params['id']
  const navigate = useNavigate()
  const [movie, setMovie] = useState<Movie>();
  const [play, setPlay] = useState(false);
  const [selectImage, setSelectedImage] = useState('');
  const [url, setUrl] = useState('');


  useEffect(() => {
    getMoviesByID(movieId as string).then(res => {
      const movie: Movie = res.data;
      setSelectedImage(`${API_CONFIG.movie}/media/${movie?.posterImageUrl.replaceAll('\\', '/').replaceAll(' ', '%20')}`)
      console.log('dddd', `${API_CONFIG.movie}/media/${movie?.posterImageUrl.replaceAll('\\', '/').replaceAll(' ', '%20')}`)
      setUrl(`${API_CONFIG.movie}/media/${movie?.streamUrl.replaceAll('\\', '/')}`)
      setMovie(movie)

    }).catch(_err => {

    })
  }, [])

  useEffect(() => {
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
         {(movie?.posterImageUrl && !play) && (
            <img
              src={selectImage}
              alt="poster"
              className={classes.posterImage}
            />
          )}
           <div className={clsx(classes.infoMovie, { [classes.hiddenPoster]: play })}
          // style={{ backgroundImage: movie?.posterImageUrl ? `url(${selectImage})` : "none" }}
          >
         
          <div className={classes.info}>
            <span>{movie?.title}</span>
            <p className={classes.description}>{movie?.description}</p>
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
          <VideoJSPlayer play={play} playlist={[
            // { url: 'http://10.211.47.233:5030/media/images/mov.mp4' }
            { url: url }
          ]} />
        </div>
       
      </div>
    </div >
  )
}

export default MoviePlayer