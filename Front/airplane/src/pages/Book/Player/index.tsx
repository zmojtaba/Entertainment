import { useEffect, useRef, useState } from 'react'
import classes from "./style.module.scss";
import { useNavigate, useParams } from 'react-router-dom'
import { IoReturnUpBackOutline } from "react-icons/io5";
import logoImage from '@assets/images/download.png'
import clsx from 'clsx';
import { FaPlay } from "react-icons/fa6";
import { getMoviesByID } from '../constant/api';
import { API_CONFIG } from '@/constants/ApiConfig';
import type { IBook } from '../types';
import moment from 'moment'
import { Viewer, Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';

import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';


function ShowBook() {
  const params = useParams()
  const movieId = params['id']
  const navigate = useNavigate()
  const [movie, setMovie] = useState<IBook>();
  const [play, setPlay] = useState(false);
  const [selectImage, setSelectedImage] = useState('');
  const [selectpdf, setSelectedPdf] = useState('');
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  useEffect(() => {
    getMoviesByID(movieId as string).then(res => {
      const movie: IBook = res.data;

      // console.log("ddddd", movie);

      setSelectedImage(`${API_CONFIG.movie}/media/${movie?.posterImageUrl.replaceAll('\\', '/').replaceAll(' ', '%20')}`)
      setSelectedPdf(`${API_CONFIG.movie}/media/${movie?.streamUrl.replaceAll('\\', '/').replaceAll(' ', '%20')}`)

      setMovie(movie)
    }).catch(_err => {

    })
  }, [])

  // useEffect(() => {
  //   if (play && selectVideoRef.current) {
  //     selectVideoRef.current.play();
  //   }
  // }, [play])




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
        {
          !play &&
          <div className={classes.imageSection} >
            {(movie?.posterImageUrl) && (
              <img
                src={selectImage}
                alt="poster"
                className={classes.posterImage}
              />
            )}
            <div className={clsx(classes.infoMovie, { [classes.hiddenPoster]: play })}>
              <div className={classes.info}>
                <span>{movie?.title}</span>
                <p>{movie?.description}</p>
                {/* <span className={classes.imdb}>{`★: ${movie?.imdbRating}`}</span> */}

                {/* <div className={classes.generList}> */}
                  {/* <p>Description</p> */}
                  {/* <div className={classes.generItem} >{movie?.description}</div> */}
                {/* </div> */}
                <div className={classes.generList}>
                  <p>Gener </p>
                  {movie?.genres.map((gener, index) => (
                    <div className={classes.generItem} key={index}>{gener.title ?? gener}</div>
                  ))}
                </div>
                <div className={classes.generList}>
                  <p>Language </p>
                  {movie?.language?.map((dir, index) => (
                    <div className={classes.generItem} key={index}>{dir}</div>
                  ))}
                </div>
                <div className={classes.generList}>
                  <p>Writers</p>
                  {movie?.writers?.map((dir, index) => (
                    <div className={classes.generItem} key={index}>{dir.name}</div>
                  ))}
                </div>
                <div className={classes.generList}>
                  <p>Published Date</p>
                  {/* <div className={classes.generItem} >{moment.unix(movie?.publishedDate!).utc().format('MM/DD/YYYY')}</div> */}
                  <div className={classes.generItem} >{moment.unix(movie?.publishedDate!).utc().format('MM/DD/YYYY')}</div>
                </div>


                <div className={classes.actions} title='Show Book'>
                  <button className={classes.playBtn} onClick={() => setPlay(true)}>
                    📑
                  </button>
                </div>
              </div>
            </div>
          </div>
        }
        <div className={clsx(classes.player, { [classes.hiddenPoster]: !play })}>
          {
            play &&
            <Worker workerUrl={new URL('/pdf.worker.min.js', import.meta.url).href}>
              <Viewer
                fileUrl={selectpdf}
                // fileUrl={'http://10.211.47.233:5030/media/Installation_Method.pdf'}
                plugins={[defaultLayoutPluginInstance]}
              />
            </Worker>
          }
        </div>
      </div>
    </div>
  )
}

export default ShowBook