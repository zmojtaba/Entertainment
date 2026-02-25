import { useEffect, useRef, useState } from 'react'
import classes from "./style.module.scss";
import { useNavigate, useParams } from 'react-router-dom'
import { IoReturnUpBackOutline } from "react-icons/io5";
import logoImage from '@assets/images/download.png'
import { API_CONFIG } from '../../../../constants/ApiConfig';
import clsx from 'clsx';
import { FaPlay } from "react-icons/fa6";
import type { IEpisodes, ISeasons, Series } from '../../constants/types';
import { getMoviesByID } from '../../constants/api';
import VideoJSPlayer from '@/pages/Movies/components/Player/NetflixPlayer';

// import MoviePlayer from '../../components/Player/NetflixPlayer';
// import VideoJS from '../../components/Player/NetflixPlayer';

function SeriesPlayer() {
  const params = useParams()
  const movieId = params['id']
  const navigate = useNavigate()
  const [movie, setMovie] = useState<Series>();
  const [play, setPlay] = useState(false);
  const [selectImage, setSelectedImage] = useState('');
  // const selectVideoRef = useRef<HTMLVideoElement | null>(null)
  const [menuOpen, setMenuOpen] = useState(true);
  const [selectedSeason, setSelectedSeason] = useState<ISeasons>();
  const [selectedEpisod, setSelectedEpisod] = useState<IEpisodes>();
  const [selectedVideoUrl, setSelectedVideoUrl] = useState('');


  useEffect(() => {
    getMoviesByID(movieId as string).then(res => {
      // console.log("ddddd", res.data)
      const movie: Series = res.data;
      setSelectedImage(`${API_CONFIG.movie}/media/${movie?.posterImageUrl.replaceAll('\\', '/').replaceAll(' ', '%20')}`)
      setSelectedSeason(movie.seasons[0])
      setSelectedEpisod(movie.seasons[0].episodes[0])
      setMovie(movie)
      setSelectedVideoUrl(`${API_CONFIG.movie}/media/${movie?.seasons[0].episodes[0].streamUrl.replaceAll('\\', '/').replaceAll(' ', '%20')}`)


    }).catch(_err => {

    })
  }, [])


  const handelClickedSeason = (seasons: ISeasons) => {
    if (seasons) {
      setSelectedSeason(seasons)
    }
  }
  const handelClickedEpisod = (episoda: IEpisodes) => {
    if (episoda) {
      setSelectedEpisod(episoda)
      setSelectedVideoUrl(`${API_CONFIG.movie}/media/${episoda.streamUrl}`)
    }
  }


  return (
    <div className={classes.container} >
      <div className={classes.header}>
        <div className={classes.backIcon} onClick={() => navigate(-1)}>
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
            <div className={classes.title}>Select Series</div>

            <button
              title="Close"
              className={classes.closeIcon}
              onClick={() => setMenuOpen(false)}
            >
              {menuOpen ? 'x' : '☰'}
            </button>
          </div>
          <div className={classes.menuContent}>
            {
              movie?.seasons.map((se, index) => (
                <>
                  <div key={index} className={clsx(classes.seasons, selectedSeason?.id == se.id && classes.selected)}
                    onClick={() => handelClickedSeason(se)}>
                    <div>{`Seasons ${se.seasonNumber}`}</div>
                    {/* <span>^</span> */}
                  </div>
                  <div className={clsx(classes.episod, selectedSeason?.id == se.id && classes.selected)}>
                    {se?.episodes?.map((epi, index) => (
                      <span key={index} className={clsx(selectedEpisod?.id == epi.id && classes.selected)}
                        onClick={() => handelClickedEpisod(epi)}
                      >{`episode ${epi.episodeNumber}`}</span>
                    ))}

                  </div>

                </>
              ))
            }
          </div>
        </div>
        {(movie?.posterImageUrl && !play) && (
          <img
            src={selectImage}
            alt="poster"
            className={classes.posterImage}
          />
        )}
        <div className={clsx(classes.infoMovie, { [classes.hiddenPoster]: play })}
        // style={{ backgroundImage: movie?.posterImageUrl ? selectImage : "none" }}
        >
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
          <VideoJSPlayer play={play} playlist={[
            { url: selectedVideoUrl }
          ]} />
        </div>
      </div>
    </div>
  )
}

export default SeriesPlayer