import { useEffect, useState } from "react";
import classes from "./style.module.scss";
import { useNavigate, useParams } from "react-router-dom";
import { IoReturnUpBackOutline } from "react-icons/io5";
import logoImage from "@assets/images/download.png";
import clsx from "clsx";
import type { Music } from "../types";
import { getMoviesByID } from "../constants/api";
import { API_CONFIG } from "@/constants/ApiConfig";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";

function MusicPlayer() {
  const params = useParams();
  const MusicId = params["id"];
  const navigate = useNavigate();
  const [movie, setMovie] = useState<Music>();
  const [play, setPlay] = useState(true);
  const [selectImage, setSelectedImage] = useState("");
  const [music, setMusic] = useState("");
  const { category } = useParams();

  useEffect(() => {
    getMoviesByID(MusicId as string)
      .then((res) => {
        const movie: Music = res.data;
        setSelectedImage(
          `${API_CONFIG.movie}/media/${movie?.posterImageUrl.replaceAll("\\", "/").replaceAll(" ", "%20")}`,
        );
        setMusic(
          `${API_CONFIG.movie}/media/${movie?.streamUrl.replaceAll("\\", "/").replaceAll(" ", "%20")}`,
        );

        setMovie(movie);
      })
      .catch((_err) => {});
  }, []);

  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <div
          className={classes.backIcon}
          onClick={() => navigate(`/Music/Music/${category}`)}
        >
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
            <span className={classes.description}>{movie?.title}</span>
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
              <p className={classes.lable}>language </p>
              {movie?.language?.map((gener, index) => (
                <div className={classes.generItem} key={index}>
                  {gener}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* <div className={classes.imageSection}>
          {movie?.posterImageUrl && (
            <img
              src={selectImage}
              alt="poster"
              className={classes.posterImage}
            />
          )}
          <div
            className={clsx(classes.infoMovie, {
              [classes.hiddenPoster]: play,
            })}
          >
            <div className={classes.info}>
              <span>{movie?.title}</span>
              <div className={classes.generList}>
                <p className={classes.lable}>gener </p>
                {movie?.genres?.map((gener, index) => (
                  <div className={classes.generItem} key={index}>
                    {gener}
                  </div>
                ))}
              </div>
              <div className={classes.generList}>
                <p className={classes.lable}>language </p>
                {movie?.language?.map((gener, index) => (
                  <div className={classes.generItem} key={index}>
                    {gener}
                  </div>
                ))}
              </div>
              <div className={classes.generList}>
                <p className={classes.lable}>Singer </p>
                <div className={classes.generItem}>{movie?.singer!.name}</div>
              </div>
              <div className={classes.actions} title="Play music"></div>
            </div>
          </div>
        </div> */}
      </div>
      <div className={clsx(classes.player)}>
        {play && (
          <AudioPlayer
            src={music}
            // autoPlay
            // autoPlayAfterSrcChange
            onPlay={(e) => setPlay(true)}
            // other props here
          />
        )}
      </div>
    </div>
  );
}

export default MusicPlayer;
