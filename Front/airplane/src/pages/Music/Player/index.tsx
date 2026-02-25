import { useEffect, useRef, useState } from 'react'
import classes from "./style.module.scss";
import { useNavigate, useParams } from 'react-router-dom'
import { IoReturnUpBackOutline } from "react-icons/io5";
import logoImage from '@assets/images/download.png'
import clsx from 'clsx';
import { FaPlay } from "react-icons/fa6";
import type { Music } from '../types';
import { getMoviesByID } from '../constant/api';
import { API_CONFIG } from '@/constants/ApiConfig';
// import PlaylistMusicPlayer from '@/pages/Magazin/Player/Player';
// import MoviePlayer from '../../components/Player/NetflixPlayer';
// import VideoJS from '../../components/Player/NetflixPlayer';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

function MusicPlayer() {
  const params = useParams()
  const MusicId = params['id']
  const navigate = useNavigate()
  const [movie, setMovie] = useState<Music>();
  const [play, setPlay] = useState(true);
  const [selectImage, setSelectedImage] = useState('');
  const [music, setMusic] = useState('');

  useEffect(() => {
    getMoviesByID(MusicId as string).then(res => {
      const movie: Music = res.data;
      // console.log("Music", `${API_CONFIG.movie}/media/${movie?.streamUrl.replaceAll('\\', '/')}`)
      // console.log("Music", res.data)

      setSelectedImage(`${API_CONFIG.movie}/media/${movie?.posterImageUrl.replaceAll('\\', '/').replaceAll(' ', '%20')}`)
      setMusic(`${API_CONFIG.movie}/media/${movie?.streamUrl.replaceAll('\\', '/').replaceAll(' ', '%20')}`)

      setMovie(movie)
    }).catch(_err => {

    })
  }, [])



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
        <div className={classes.imageSection} >
          {movie?.posterImageUrl && (
            <img
              src={selectImage}
              alt="poster"
              className={classes.posterImage}
            />
          )}
          <div className={clsx(classes.infoMovie, { [classes.hiddenPoster]: play })}
          >
            <div className={classes.info}>
              <span>{movie?.title}</span>
              <div className={classes.generList}>
                <p>gener </p>
                {movie?.genres?.map((gener, index) => (
                  <div className={classes.generItem} key={index}>{gener}</div>
                ))}
              </div>
              <div className={classes.generList}>
                <p>language </p>
                {movie?.language?.map((gener, index) => (
                  <div className={classes.generItem} key={index}>{gener}</div>
                ))}
              </div>
              <div className={classes.generList}>
                <p>Singer </p>
                <div className={classes.generItem} >{movie?.singer!.name}</div>
              </div>
              <div className={classes.actions} title='Play music'>
              </div>
            </div>

          </div>
        </div>
        {/* <div className={clsx(classes.player, { [classes.hiddenPoster]: !play })}> */}
        <div className={clsx(classes.player)}>
          {
            play &&
            <AudioPlayer
              src={music}
              // autoPlay
              // autoPlayAfterSrcChange
              onPlay={e => setPlay(true)}
            // other props here
            />
          }
        </div>
      </div>
    </div>
  )
}

export default MusicPlayer



// const tracks = [
//   {
//     title: "Song Title 1",
//     artist: "Artist Name",
//     src: "http://10.211.47.233:5030/media/relaxi.mp3",
//     cover: 'http://10.211.47.233:5030/mediaimages/824-600x400.jpg'
//   },
//   // ...
// ];