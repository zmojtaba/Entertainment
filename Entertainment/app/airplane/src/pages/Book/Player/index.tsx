import { useEffect, useRef, useState } from "react";
import classes from "./style.module.scss";
import { useNavigate, useParams } from "react-router-dom";
import { IoReturnUpBackOutline } from "react-icons/io5";
import logoImage from "@assets/images/download.png";
import clsx from "clsx";
import { FaPlay } from "react-icons/fa6";
import { getMoviesByID } from "../constant/api";
import { API_CONFIG } from "@/constants/ApiConfig";
import type { IBook } from "../types";
import moment from "moment";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";

import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

function ShowBook() {
  const params = useParams();
  const movieId = params["id"];
  const navigate = useNavigate();
  const [movie, setMovie] = useState<IBook>();
  const [play, setPlay] = useState(false);
  const [selectImage, setSelectedImage] = useState("");
  const [selectpdf, setSelectedPdf] = useState("");
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  useEffect(() => {
    getMoviesByID(movieId as string)
      .then((res) => {
        const movie: IBook = res.data;

        // console.log("ddddd", movie);

        setSelectedImage(
          `${API_CONFIG.movie}/media/${movie?.posterImageUrl.replaceAll("\\", "/").replaceAll(" ", "%20")}`,
        );
        setSelectedPdf(
          `${API_CONFIG.movie}/media/${movie?.streamUrl.replaceAll("\\", "/").replaceAll(" ", "%20")}`,
        );

        setMovie(movie);
      })
      .catch((_err) => {});
  }, []);
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
            <div className={classes.generList}>
              <p className={classes.lable}>Gener </p>
              {movie?.genres.map((gener, index) => (
                <div className={classes.generItem} key={index}>
                  {gener}
                </div>
              ))}
            </div>
            <div className={classes.generList}>
              <p className={classes.lable}>Language </p>
              {movie?.language?.map((dir, index) => (
                <div className={classes.generItem} key={index}>
                  {dir}
                </div>
              ))}
            </div>
            <div className={classes.generList}>
              <p className={classes.lable}>Writers</p>
              {movie?.writers?.map((dir, index) => (
                <div className={classes.generItem} key={index}>
                  {dir.name}
                </div>
              ))}
            </div>
            <div className={classes.generList}>
              <p className={classes.lable}>Published Date</p>
              {/* <div className={classes.generItem} >{moment.unix(movie?.publishedDate!).utc().format('MM/DD/YYYY')}</div> */}
              <div className={classes.generItem}>
                {movie &&
                  moment.unix(movie.publishedDate).utc().format("MM/DD/YYYY")}
              </div>
            </div>

            <div className={classes.actions} title="Show Book">
              <button className={classes.playBtn} onClick={() => setPlay(true)}>
                <span>📑</span>
              </button>
            </div>
          </div>
        </div>
        <div
          className={clsx(classes.player, { [classes.hiddenPoster]: !play })}
        >
          {play && (
            <Worker
              workerUrl={new URL("/pdf.worker.min.js", import.meta.url).href}
            >
              <Viewer
                fileUrl={selectpdf}
                plugins={[defaultLayoutPluginInstance]}
              />
            </Worker>
          )}
        </div>
      </div>
    </div>
  );
}

export default ShowBook;
