import { useEffect, useRef, useState } from "react";
import classes from "./style.module.scss";
import { useNavigate, useParams } from "react-router-dom";
import { IoReturnUpBackOutline } from "react-icons/io5";
import logoImage from "@assets/images/download.png";
import clsx from "clsx";
import { FaPlay } from "react-icons/fa6";
import type { Movie } from "../../constants/types";
import { getMoviesByID } from "../../constants/api";
import { API_CONFIG } from "@/constants/ApiConfig";
import VideoPlayerTest from "./VideoPlayer";
import VideoPlayer from "../../components/Player/Player";
// import VideoJSPlayer from "../../components/Player/NetflixPlayer";
// import VideoJSPlayerTest from "../../components/Player/PlayeTest";
// import MoviePlayer from '../../components/Player/NetflixPlayer';
// import VideoJS from '../../components/Player/NetflixPlayer';

function MoviePlayer() {
  const params = useParams();
  const movieId = params["id"];
  const navigate = useNavigate();
  const [movie, setMovie] = useState<Movie>();
  const [play, setPlay] = useState(false);
  const [selectImage, setSelectedImage] = useState("");
  const [url, setUrl] = useState("");
  const [adUrl, setAdUrl] = useState(API_CONFIG.adUrl);
  const [subtitle, setSubtitle] = useState("");

  useEffect(() => {
    getMoviesByID(movieId as string)
      .then((res) => {
        const movie: Movie = res.data;
        setSelectedImage(
          `${API_CONFIG.movie}/media/${movie?.posterImageUrl.replaceAll("\\", "/").replaceAll(" ", "%20")}`,
        );
        // console.log(
        //   "dddd",
        //   `${API_CONFIG.movie}/media/${movie?.posterImageUrl.replaceAll("\\", "/").replaceAll(" ", "%20")}`,
        // );
        setUrl(
          `${API_CONFIG.movie}/media/${movie?.streamUrl.replaceAll("\\", "/")}`,
        );
        setSubtitle(
          `${API_CONFIG.movie}/media/${movie?.subtitleUrl.replaceAll("\\", "/")}`,
        );

        // console.log('movie',movie)
        setMovie(movie);
      })
      .catch((_err) => { });
  }, []);


  // useEffect(() => {
  // }, [play])

  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <div className={classes.backIcon} onClick={() => navigate(-1)}>
          <IoReturnUpBackOutline size={25} title="Back" />
        </div>
        <div className={classes.logo} onClick={() => navigate("/")}>
          <img src={logoImage} width={100} height={40} />
        </div>
      </div>

      <div className={classes.main}>
        {movie?.posterImageUrl && !play && (
          <img src={selectImage} alt="poster" className={classes.posterImage} />
        )}

        <div
          className={clsx(classes.infoMovie, { [classes.hiddenPoster]: play })}
        >
          <div className={classes.title}>
            <span>{movie?.title}</span>
            <span className={classes.description}>{movie?.description}</span>
          </div>
          <div className={classes.more}>
            <div className={classes.imdb}>
              <span>{`IMDB: ${movie?.imdbRating}`}</span>
            </div>
            <div className={classes.generList}>
              <p className={classes.lable}>gener </p>
              {movie?.genres.map((gener, index) => (
                <div className={classes.generItem} key={index}>
                  {gener}
                </div>
              ))}
            </div>
            <div className={classes.generList}>
              <p className={classes.lable}>Directors </p>
              {movie?.directors.map((dir, index) => (
                <div className={classes.generItem} key={index}>
                  {dir.name}
                </div>
              ))}
            </div>

            <div className={classes.generList}>
              <p className={classes.lable}>Actors </p>
              {movie?.actors.map((actor, index) => (
                <div className={classes.generItem} key={index}>
                  {actor.name}
                </div>
              ))}
            </div>
            <div className={classes.actions} title="Play video">
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

        <div
          className={clsx(classes.player, { [classes.hiddenPoster]: !play })}
        >
          {
            play &&
            <VideoPlayer
              play={play}
              videoSrc={url}
              // videoSrc={'http://localhost:3000/d.mp4'}
              subtitle={subtitle}
              adSrc={adUrl} />
            // subtitle={subtitle} adSrc={''} />
          }
        </div>
      </div>
    </div>
  );
}

export default MoviePlayer;
