import { useEffect, useRef, useState } from "react";
import classes from "./style.module.scss";
import { useNavigate, useParams } from "react-router-dom";
import { IoReturnUpBackOutline } from "react-icons/io5";
import logoImage from "@assets/images/download.png";
import clsx from "clsx";
import { FaPlay } from "react-icons/fa6";
import type { IAlbum, IEpisodes } from "../types";
import { API_CONFIG } from "@/constants/ApiConfig";
import { getMoviesByID } from "../constant/api";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import { FaPlayCircle } from "react-icons/fa";
import { FcMusic } from "react-icons/fc";
import { FaPauseCircle } from "react-icons/fa";
import { alpha, Divider } from "@mui/material";

function AlbumPlayer() {
  const params = useParams();
  const movieId = params["id"];
  const navigate = useNavigate();
  const [movie, setMovie] = useState<IAlbum>();
  const [play, setPlay] = useState(false);
  const [selectImage, setSelectedImage] = useState("");
  const [menuOpen, setMenuOpen] = useState(true);
  const [selectedEpisod, setSelectedEpisod] = useState<IEpisodes | null>(null);
  const [music, setMusic] = useState("");
  const [test, setTest] = useState(false);
  const playerRef = useRef<AudioPlayer>(null);

  useEffect(() => {
    getMoviesByID(movieId as string)
      .then((res) => {
        const movie: IAlbum = res.data;
        // console.log("Data   ,", movie)
        setSelectedImage(
          `${API_CONFIG.movie}/media/${movie?.posterImageUrl.replaceAll("\\", "/").replaceAll(" ", "%20")}`,
        );
        setSelectedEpisod(movie.episodes[0]);

        setMovie(movie);
        setMusic(
          `${API_CONFIG.movie}/media/${movie?.episodes[0].streamUrl.replaceAll("\\", "/").replaceAll(" ", "%20")}`,
        );
      })
      .catch((_err) => {});
  }, []);

  useEffect(() => {
    console.log("music PLay", music);
    if (play) {
      if (playerRef.current) playerRef.current?.audio?.current.play();
    } else {
      if (playerRef.current) playerRef.current?.audio?.current.pause();
    }
  }, [play]);

  console.log("music", music);
  // const handleClickedPuase = (e: React.MouseEvent<SVGSVGElement>) => {
  //   console.log("eeeeee", event);
  //   e.stopPropagation();
  //   e.preventDefault();
  //   setPlay(false);
  // };
  const handelClickedEpisod = (episoda: IEpisodes) => {
    const path = `${API_CONFIG.movie}/media/${episoda.streamUrl.replaceAll("\\", "/")}`;
    if (music == path && play) {
      setPlay(false);
    } else {
      setPlay(true);
    }
    setMusic(path);
    setSelectedEpisod(episoda);
  };
  const handlePlayBtnPlayer = (e: Event) => {
    if (e.type == "play") {
      setPlay(true);
    } else {
      setPlay(false);
    }
  };

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
        {movie?.posterImageUrl && (
          <img src={selectImage} alt="poster" className={classes.posterImage} />
        )}

        <div className={clsx(classes.infoMovie)}>
          <div className={classes.title}>
            <span>{movie?.title}</span>
            {/* <span className={classes.description}>{movie?.}</span> */}
          </div>
          <div className={classes.more}>
            <div className={classes.generList}>
              <p className={classes.lable}>Singer </p>
              <div className={classes.generItem}>{movie?.singer!.name}</div>
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
              <p className={classes.lable}>Directors</p>
              {movie?.languages.map((dir, index) => (
                <div className={classes.generItem} key={index}>
                  {dir}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className={classes.musicList}>
          <div data-titlelist>Play List</div>
          <div className={classes.gradientTaperLine} />
          <div className={classes.musics}>
            {movie?.episodes.map((episod, index) => (
              <div
                key={index}
                className={clsx(classes.item, {
                  [classes.isSelected]: selectedEpisod?.id == episod.id,
                })}
                onClick={() => handelClickedEpisod(episod)}
              >
                <FcMusic size={45} />
                <span>{episod.streamUrl}</span>
                {play && selectedEpisod?.id == episod.id ? (
                  <FaPauseCircle size={25} />
                ) : (
                  <FaPlayCircle size={25} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className={clsx(classes.player)}>
        <AudioPlayer
          src={music}
          autoPlayAfterSrcChange
          ref={playerRef}
          onPlay={handlePlayBtnPlayer}
          onPause={handlePlayBtnPlayer}
        />
      </div>
    </div>
  );
}

export default AlbumPlayer;
