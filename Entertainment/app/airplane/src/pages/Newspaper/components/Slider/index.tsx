import { useEffect, useRef, useState } from "react";
import classes from "./style.module.scss";
import { IoReturnUpBackOutline } from "react-icons/io5";
import logoImage from "@assets/images/download.png";
import { useNavigate, useParams } from "react-router-dom";
import { API_CONFIG } from "../../../../constants/ApiConfig";
import clsx from "clsx";
import type { INewspaper } from "../../types";
import type { Genre } from "@/store/types";
import { FaFilter } from "react-icons/fa";
import { filterByGenres, getGeners, getMovies } from "../../constant/api";
import Button from "@mui/material/Button";
import { IoMdCloseCircle } from "react-icons/io";
import IconButton from "@mui/material/IconButton";
import BarLoadingComponent from "@/shareComponents/loading";
import Grid from "@mui/material/Grid";
import { GiNewspaper } from "react-icons/gi";

export default function Slider() {
  const sliderRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [genres, setGerners] = useState<Genre>();
  const [menuOpen, setMenuOpen] = useState(false);
  const [language, setLanguage] = useState("");
  const [movies, setMovies] = useState<INewspaper[]>([]);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(true);
  const navigate = useNavigate();
  const { category } = useParams();

  useEffect(() => {
    let tempLanguage = "";
    if (category == "Iranian_Newspaper") {
      tempLanguage = "Persian";
    } else tempLanguage = "English";

    getMovies(tempLanguage, "")
      .then((res) => {
        setMovies(res.data);
        setLoadingData(false)
      })
      .catch((_err) => {})
      .finally(() => {
        setLoadingData(false)
        setLanguage(tempLanguage);

        getGeners()
          .then((res) => {
            setGerners(res.data);
          })
          .catch((_err) => {});
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

    // cleanup
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
    filterByGenres(language, selectedGenre)
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
        <div className={classes.backIcon} onClick={() => navigate("/Magazine")}>
          <IoReturnUpBackOutline size={25} title="Back" />
        </div>
        <div className={classes.logo}>
          <img src={logoImage} width={100} height={40} />
          <button
            className={classes.hamburger}
            onClick={() => setMenuOpen(!menuOpen)}
          >
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
                    onClick={() => navigate(`${movie.id}`)}
                  >
                    <div className={classes.cardHeader}>
                      <img
                        src={`${API_CONFIG.movie}/media/${movie.posterImageUrl.replaceAll("\\", "/")}`}
                      />
                      <span
                        data-span
                        className={clsx({
                          [classes.showAnimation]: movie.title.length > 30,
                        })}
                      >
                        {movie.title}
                      </span>
                    </div>
                    <div className={classes.info}>
                      <div className={classes.contry}>
                        <span>{movie.publisher.name}</span>
                      </div>
                      {/* <div data-imdb>
                      <span > 
                        {moment
                          .unix(movie.publishedDate)
                          .utc()
                          .format("MM/DD/YYYY")}
                      </span>
                    </div> */}
                    </div>
                  </div>
                </Grid>
              ))}
            </Grid>
          ) : (
            !loadingData &&
            <div className={classes.notFound}>
              <GiNewspaper size={100} />
              <span>Paper Not found</span>
            </div>
          )}
        </div>
      </div>
      <BarLoadingComponent loading={loading} />
    </div>
  );
}
