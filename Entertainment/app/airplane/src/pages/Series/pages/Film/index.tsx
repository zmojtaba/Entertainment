import { useEffect, useRef, useState } from "react";
import classes from "./style.module.scss";
import { useNavigate, useParams } from "react-router-dom";
import { IoReturnUpBackOutline } from "react-icons/io5";
import logoImage from "@assets/images/download.png";
import { API_CONFIG } from "../../../../constants/ApiConfig";
import clsx from "clsx";
import { FaPlay } from "react-icons/fa6";
import type { IEpisodes, ISeasons, Series } from "../../constants/types";
import { getMoviesByID } from "../../constants/api";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import AccordionDetails from "@mui/material/AccordionDetails";
import { MdExpandMore } from "react-icons/md";
import { RiMenuFold4Line } from "react-icons/ri";
import { RiMenuFold3Line } from "react-icons/ri";
import {
  //   Accordion,
  //   AccordionSummary,
  //   AccordionDetails,
  //   Typography,
  Box,
  IconButton,
} from "@mui/material";
import VideoPlayer from "@/pages/Movies/components/Player/Player";
import VideoPlayerTbligh from "@/pages/Movies/components/Player/Tabligh";
// import VideoPlayer from "@/pages/Movies/components/Player/Player";
// import VideoJSPlayer from "../../components/Player/NetflixPlayer";
// import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

// import MoviePlayer from '../../components/Player/NetflixPlayer';
// import VideoJS from '../../components/Player/NetflixPlayer';

function SeriesPlayer() {
  const params = useParams();
  const movieId = params["id"];
  const navigate = useNavigate();
  const [movie, setMovie] = useState<Series>();
  const [play, setPlay] = useState(false);
  const [selectImage, setSelectedImage] = useState("");
  const [adUrl, setAdUrl] = useState(API_CONFIG.adUrl);
  // const selectVideoRef = useRef<HTMLVideoElement | null>(null)
  const [menuOpen, setMenuOpen] = useState(true);

  const [selectedSeason, setSelectedSeason] = useState<ISeasons>();
  const [selectedEpisod, setSelectedEpisod] = useState<IEpisodes>();
  const [selectedVideoUrl, setSelectedVideoUrl] = useState("");
  const [subtitle, setSubtitle] = useState("");

  useEffect(() => {
    getMoviesByID(movieId as string)
      .then((res) => {
        const movie: Series = res.data;
        setSelectedImage(
          `${API_CONFIG.movie}/media/${movie?.posterImageUrl.replaceAll("\\", "/").replaceAll(" ", "%20")}`,
        );
        setSelectedSeason(movie.seasons[0]);
        setSelectedEpisod(movie.seasons[0].episodes[0]);
        setMovie(movie);
        setSelectedVideoUrl(
          `${API_CONFIG.movie}/media/${movie?.seasons[0].episodes[0].streamUrl.replaceAll("\\", "/").replaceAll(" ", "%20")}`,
        );
        // console.log('ssssssssssssss',`${API_CONFIG.movie}/media/${movie?.seasons[0].episodes[0]?.subtitleUrl!.replaceAll("\\", "/").replaceAll(" ", "%20")}`)

        setSubtitle(
          `${API_CONFIG.movie}/media/${movie?.seasons[0].episodes[0]?.subtitleUrl!.replaceAll("\\", "/").replaceAll(" ", "%20")}`,
        );
      })
      .catch((_err) => { });
  }, []);

  const handelClickedSeason = (seasons: ISeasons) => {
    if (seasons) {
      setSelectedSeason(seasons);
    }
  };
  const handelClickedEpisod = (episoda: IEpisodes) => {
    // console.log("`${API_CONFIG.movie}/media/${episoda.streamUrl}`", `${API_CONFIG.movie}/media/${episoda.subtitleUrl}`)
    if (episoda) {
      setSelectedEpisod(episoda);
      setSelectedVideoUrl(`${API_CONFIG.movie}/media/${episoda.streamUrl}`);
      setSubtitle(
        `${API_CONFIG.movie}/media/${episoda.subtitleUrl!.replaceAll("\\", "/").replaceAll(" ", "%20")}`,
      );
    }
  };
  const handlePlayBtnClicked = () => {
    setPlay(true);
    setMenuOpen(false);
  };

  // console.log('ssssssssssssss',subtitle)

  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <div className={classes.backIcon} onClick={() => navigate(-1)}>
          <IoReturnUpBackOutline size={25} title="Back" />
        </div>
        <div className={classes.logo}>
          <img
            src={logoImage}
            width={100}
            height={40}
            onClick={() => navigate("/")}
          />
          <IconButton
            title=""
            color="inherit"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? (
              <RiMenuFold4Line size={25} />
            ) : (
              <RiMenuFold3Line size={25} />
            )}
          </IconButton>
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
              <button
                className={classes.playBtn}
                onClick={handlePlayBtnClicked}
              >
                <FaPlay size={25} />
              </button>
            </div>
          </div>
        </div>

        <div
          className={clsx(classes.seasons, {
            [classes.close]: !menuOpen,
          })}
        >
          <div className={classes.seasonsHeader}>
            <span>Select Season</span>
          </div>
          <Box sx={{ maxWidth: 800, mx: "auto", m: 2 }}>
            {movie?.seasons.map((season, index) => (
              <Accordion
                key={index}
                disableGutters
                sx={{
                  mb: "5px",
                  borderRadius: "16px !important",
                  overflow: "hidden",
                  border: "none",
                  color: "white",
                }}
              >
                <AccordionSummary
                  expandIcon={<MdExpandMore />}
                  sx={{
                    backgroundColor: "rgba(34, 34, 34, 1)",
                    "& .MuiAccordionSummary-content": { alignItems: "center" },
                    "& .MuiAccordionSummary-expandIconWrapper": {
                      color: "white",
                      fontSize: "30px",
                      transition: "0.3s",
                    },
                    "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
                      transform: "rotate(180deg)",
                    },
                  }}
                >
                  <Typography fontWeight={600} fontSize={16} color="white">
                    {`Season ${season.seasonNumber}`}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails
                  sx={{
                    border: "none",
                    backgroundColor: "rgba(black,0.7)",
                    color: "#000408ff",
                    lineHeight: 2,
                  }}
                >
                  {season.episodes.map((episode, index) => (
                    <div
                      key={index}
                      className={clsx(classes.episode, {
                        [classes.selected]: selectedEpisod == episode,
                      })}
                      onClick={() => handelClickedEpisod(episode)}
                    >
                      {`Episod ${episode.episodeNumber}`}
                    </div>
                  ))}
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        </div>

        <div
          className={clsx(classes.player, { [classes.hiddenPoster]: !play })}
        >
          {
            play &&
            <VideoPlayer
              play={play}
              videoSrc={selectedVideoUrl}
              // videoSrc={'http://10.174.176.233:3000/d.mp4'}
              subtitle={subtitle}
              // videoSrc={'http://localhost:3000/d.mp4'}
              // subtitle={subtitle} 
              adSrc={adUrl} 
              // adSrc={'http://localhost:3000/test.mp4'}
               />
           
        }
        </div>
      </div>
    </div>
  );
}

export default SeriesPlayer;
