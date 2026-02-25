import { useEffect, useRef, useState } from 'react'
import classes from "./style.module.scss";
import { useNavigate, useParams } from 'react-router-dom'
import { IoReturnUpBackOutline } from "react-icons/io5";
import logoImage from '@assets/images/download.png'
import clsx from 'clsx';
import { FaPlay } from "react-icons/fa6";
import type { IEpisodes, IPodcast } from '../types';
import { API_CONFIG } from '@/constants/ApiConfig';
import { getMoviesByID } from '../constant/api';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
// import MoviePlayer from '../../components/Player/NetflixPlayer';
// import VideoJS from '../../components/Player/NetflixPlayer';

function ShowPodcast() {
  const params = useParams()
  const movieId = params['id']
  const navigate = useNavigate()
  const [movie, setMovie] = useState<IPodcast>();
  const [play, setPlay] = useState(true);
  const [selectImage, setSelectedImage] = useState('');
  const [menuOpen, setMenuOpen] = useState(true);
  const [selectedEpisod, setSelectedEpisod] = useState<IEpisodes>();
  const [music, setMusic] = useState('');
  const [playClickedTrack, setPlayClickedTrack] = useState(false);

  useEffect(() => {
    getMoviesByID(movieId as string).then(res => {
      // console.log("dddddfffffffffffffffffffffffffff", res.data)
      const movie: IPodcast = res.data;
      setSelectedImage(`${API_CONFIG.movie}/media/${movie?.posterImageUrl.replaceAll('\\', '/').replaceAll(' ', '%20')}`)
      setSelectedEpisod(movie.episodes[0])
      setMovie(movie)

      setMusic(`${API_CONFIG.movie}/media/${movie?.episodes[0].streamUrl.replaceAll('\\', '/').replaceAll(' ', '%20')}`)

    }).catch(_err => {

    })
  }, [])



  const handelClickedEpisod = (episoda: IEpisodes) => {
    if (episoda) {
      setPlayClickedTrack(true)
      setSelectedEpisod(episoda)
      setMusic(`${API_CONFIG.movie}/media/${episoda.streamUrl.replaceAll('\\', '/')}`)
    }
  }

  return (
    <div className={classes.container} >
      <div className={classes.header}>
        <div className={classes.backIcon} onClick={() => navigate('/Podcast/International_Podcast')}>
          <IoReturnUpBackOutline size={25} title='Back' />
        </div>
        <div className={classes.logo}>
          <img src={logoImage} width={100} height={40} />
          <button
            className={classes.hamburger}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? 'x' : '☰'}
          </button>
        </div>
      </div>
      {/* Hamburger */}


      <div className={classes.main} >
        <div className={`${classes.menu} ${menuOpen && classes.open}`}>
          <div className={classes.menuTitle}>
            <div className={classes.title}>Select Music</div>

            <button
              title="Close"
              className={classes.closeIcon}
              onClick={() => setMenuOpen(false)}
            >
              {menuOpen ? 'x' : '☰'}
            </button>
          </div>
          <div className={classes.menuContent}>
            <div className={classes.episod}>
              {movie?.episodes?.map((epi, index) => (
                <span className={clsx(selectedEpisod?.id == epi.id && classes.selected)}
                  onClick={() => handelClickedEpisod(epi)}
                >{`${epi.streamUrl}`}</span>
              ))}

            </div>
          </div>


        </div>

        <div className={classes.imageSection} >
          {movie?.posterImageUrl && (
            <img
              src={selectImage}
              alt="poster"
              className={classes.posterImage}
            />
          )}
          <div className={clsx(classes.infoMovie)}
            style={{ backgroundImage: movie?.posterImageUrl ? selectImage : "none" }}>
            <div className={classes.info}>
              <span>{movie?.title}</span>
               <p className={classes.description}>{movie?.description}</p>
              {/* <span className={classes.imdb}>{`★: ${movie?.imdbRating}`}</span> */}

              <div className={classes.generList}>
                <p>Gener </p>
                {movie?.genres.map((gener, index) => (
                  <div className={classes.generItem} key={index}>{gener?.title}</div>
                ))}
              </div>
              <div className={classes.generList}>
                <p>Languages </p>
                {movie?.languages.map((dir, index) => (
                  <div className={classes.generItem} key={index}>{dir}</div>
                ))}
              </div>
              <div className={classes.generList}>
                <p>Speakers </p>
                {movie?.speakers.map((dir, index) => (
                  <div className={classes.generItem} key={index}>{dir.name}</div>
                ))}
              </div>

            </div>

          </div>
        </div>
        <div className={clsx(classes.player)}>
          <AudioPlayer
            src={music}
            // autoPlay
            autoPlayAfterSrcChange={playClickedTrack}
          // onPlay={e => console.log("onPlay")}
          // other props here
          />
        </div>
      </div>
    </div>
  )
}

export default ShowPodcast