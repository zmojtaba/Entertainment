import { useEffect, useRef, useState } from "react";
import classes from "./style.module.scss";
import { IoReturnUpBackOutline } from "react-icons/io5";
import logoImage from "@assets/images/download.png";
import { useLocation, useNavigate } from "react-router-dom";
import { API_CONFIG } from "../../../../constants/ApiConfig";
import clsx from "clsx";
import { filterByGenres, getGeners, getMovies } from "../../constants/api";
import type { Genre, Movie } from "../../constants/types";
import Grid from "@mui/material/Grid";
import { FaFilter } from "react-icons/fa";
import { IoMdCloseCircle } from "react-icons/io";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import BarLoadingComponent from "@/shareComponents/loading";
import { FcFilmReel } from "react-icons/fc";

export default function Slider() {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [genres, setGerners] = useState<Genre>();
  const [menuOpen, setMenuOpen] = useState(false);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const urlPath = useLocation();
  const currentPath = urlPath.pathname.split("/").at(-1);
  const changeLand = useRef(false);

  useEffect(() => {
    changeLand.current = window.matchMedia("(orientation: portrait)").matches;
    let tempLanguage = "";
    if (currentPath == "Iranian_film") {
      tempLanguage = "Persian";
    } else if (currentPath == "International_film")
      tempLanguage = "English";

    getMovies(tempLanguage, "")
      .then((res) => {
        setMovies(res.data);
      })
      .catch((_err) => { })
      .finally(() => {
        setSelectedLanguage(tempLanguage);
        getGeners()
          .then(async (res) => {
            await window.wait(1000);
            setGerners(res.data);
          })
          .catch((_err) => {
            console.log(_err);
          });
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
          onClick={() => navigate("/Movies_&_series")}
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
                        <span>{movie.countries[0]}</span>
                        <div data-divider />
                        <span>{movie.publishedDate}</span>
                      </div>
                      <div data-imdb>
                        <span>{`IMBD`}</span>
                        <span>{`: ${movie.imdbRating}`}</span>
                      </div>
                    </div>
                  </div>
                </Grid>
              ))}
            </Grid>
          ) : 
            <div className={classes.notFound}>
              <FcFilmReel size={100} />
              <span>Movie Not found</span>
            </div>
          }
        </div>
      </div>
      <BarLoadingComponent loading={loading} />
    </div>
  );
}
