import { useEffect, useRef, useState } from "react";
import classes from "./style.module.scss";
import { IoReturnUpBackOutline } from "react-icons/io5";
import logoImage from "@assets/images/download.png";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { type Genre } from "../../../../store/types";
import { API_CONFIG } from "../../../../constants/ApiConfig";
import clsx from "clsx";
import type { IPodcast } from "../../types";
import { FaFilter } from "react-icons/fa";
import { IoMdCloseCircle } from "react-icons/io";
import { filterByGenres, getGeners, getMovies } from "../../constant/api";
import { Button, Grid, IconButton } from "@mui/material";
import { BsFillPersonFill } from "react-icons/bs";
import BarLoadingComponent from "@/shareComponents/loading";
import { FaMicrophoneAlt } from "react-icons/fa";

export default function Slider() {
  const sliderRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [genres, setGerners] = useState<Genre>();
  const [menuOpen, setMenuOpen] = useState(false);
  const [movies, setMovies] = useState<IPodcast[]>([]);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const navigate = useNavigate();
  const { category } = useParams();
  const urlPath = useLocation();
  const currentPath = urlPath.pathname.split("/").at(-1);

  useEffect(() => {
    let tempLanguage = "";
    if (category == "Iranian_Podcast") {
      tempLanguage = "Persian";
    } else tempLanguage = "English";

    getMovies(tempLanguage, "")
      .then((res) => {
        setLoadingData(false)
        setMovies(res.data);
      })
      .catch((_err) => { })
      .finally(() => {
        setLoadingData(false)
        setSelectedLanguage(tempLanguage);
        getGeners()
          .then((res) => {
            setGerners(res.data);
          })
          .catch((_err) => { });
      });
  }, []);

  useEffect(() => {
    const handleOrientationChange = () => {
      if (sliderRef.current) {
        sliderRef.current.scrollLeft = 0;
      }
    };
    window.addEventListener("orientationchange", handleOrientationChange);
    window.addEventListener("resize", handleOrientationChange);

    handleOrientationChange();

    return () => {
      window.removeEventListener("orientationchange", handleOrientationChange);
      window.removeEventListener("resize", handleOrientationChange);
    };
  }, []);

  const handleSetSelectedGenre = async (title: string) => {
    setSelectedGenre(title);
  };
  const handleFilterByGeners = async () => {
    setLoading(true);
    setMenuOpen(false);
    filterByGenres(selectedLanguage, selectedGenre)
      .then(async (res) => {
        await window.wait(1000);
        setLoading(false);
        setMovies(res.data);
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <div
          className={classes.backIcon}
          onClick={() => navigate("/Audio_story")}
        >
          <IoReturnUpBackOutline size={25} title="Back" />
        </div>
        <div className={classes.logo}>
          <img src={logoImage} width={100} height={40} />
          <button
            className={classes.hamburger}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {/* {menuOpen ? 'x' : '☰'} */}
            <FaFilter size="15px" />
          </button>
        </div>
      </div>

      <div className={classes.main}>
        <div className={`${classes.menu} ${menuOpen && classes.open}`}>
          <div className={classes.menuContainer}>
            <div className={classes.menuHeader}>
              <div className={classes.title}>Filter by Genre</div>
              <IconButton
                title="Close"
                className={classes.closeIcon}
                onClick={() => setMenuOpen(false)}
              >
                <IoMdCloseCircle />
              </IconButton>
            </div>
            <div className={classes.content}>
              {genres?.genres?.length &&
                genres?.genres?.map((genre, index) => (
                  <div
                    key={index}
                    className={clsx(classes.menuItem, {
                      [classes.isSelect]: selectedGenre == genre,
                    })}
                    onClick={() => handleSetSelectedGenre(genre)}
                  >
                    {genre}
                  </div>
                ))}
            </div>
          </div>

          <Button
            className={classes.filterBtn}
            variant="contained"
            onClick={handleFilterByGeners}
          >
            Filter
          </Button>
        </div>
        {/* onClick={() => navigate(`/Podcast/${category}/${m.id}`)} */}
        {/* >{`Speakers : ${m.speakers.map((s) => s.name)}`}</div> */}

        <div className={classes.cards}>
          {movies.length ? (
            <Grid
              container
              alignContent="flex-start"
              flex={1}
              sx={{ overflowY: "auto" }}
              spacing={{ xs: 1, sm: 1, md: 1, lg: 0.5, xl: 2 }}
            // columns={{ xs: 3, sm: 3, md: 1, lg: 12, xl: 12 }}
            >
              {movies.map((movie, index) => (
                <Grid key={index} size={{ xs: 4, sm: 3, md: 4, lg: 2.2, xl: 2 }}>
                  <div
                    className={classes.cardItem}
                    onClick={() => navigate(`/Podcast/${category}/${movie.id}`)}
                  >
                    <div className={classes.cardHeader}>
                      <img
                        src={`${API_CONFIG.movie}/media/${movie.posterImageUrl.replaceAll("\\", "/")}`}
                      />
                      <span
                        data-span
                        className={clsx({
                          [classes.showAnimation]: movie.title.length > 20,
                        })}
                      >
                        {`${movie.title}`}
                      </span>
                    </div>

                    <div className={classes.info}>
                      <span
                        className={clsx({
                          [classes.showAnimation]: false,
                          //   movie.singer.name.length + 10 > 30,
                        })}
                      >
                        <BsFillPersonFill size={18} />
                        {`   ${movie.speakers[0].name}`}
                      </span>
                    </div>
                  </div>
                </Grid>
              ))}
            </Grid>
          ) : (
            !loadingData &&
            <div className={classes.notFound}>
              <FaMicrophoneAlt size={100} />
              <span>Podcast Not found</span>
            </div>
          )}
        </div>
      </div>
      <BarLoadingComponent loading={loading} />
    </div>
  );
}
