import classes from "./style.module.scss";
import { useTranslation } from "react-i18next";
import ReplayOutlinedIcon from "@mui/icons-material/ReplayOutlined";
import { Button, IconButton, TextField, Tooltip } from "@mui/material";
import useDataStore from "../../store/useDataStore";
import { ChangeEventHandler, useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import clsx from "clsx";
import LoadingComponent from "app/shared-components/LoadingComponent";
import _, { values } from "lodash";
import ErrorComponent from "app/shared-components/ErrorComponent";
import AddIcon from "@mui/icons-material/Add";
import TableHeader from "../../components/TableHeader";
import { EmptyCameraListIcon } from "../../constants/icons";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import MovieListItem from "../CameraItem";
import { SearchItemResource } from "../../constants/api";
import jwtDecode from "jwt-decode";
import { MdAudioFile } from "react-icons/md";
import { ICrew } from "../../store/type";

type Search = {
  country?: string;
  city?: string;
};

function MovieList() {
  const { t } = useTranslation("SETTINGS");
  const navigate = useNavigate();
  const movieList = useDataStore((st) => st.movieList);
  const [filter, setFilter] = useState<ICrew[]>([]);
  const setLoadingMsg = useDataStore((st) => st.setLoadingMsg);
  const showSearchList = useDataStore((st) => st.showSearchList);
  const loadMovieList = useDataStore((st) => st.loadMovieList);
  const { loadingMsg, error } = useDataStore((st) => ({
    loadingMsg: st.loadingMsg,
    error: st.errorLoadingMovies,
  }));
  const [searchItem, setSearchItem] = useState<Search>({
    country: "",
    city: "",
  });
  useEffect(() => {
    document.title = "Crews";
    loadMovieList();
  }, []);

  useEffect(() => {
    setFilter(movieList);
  }, [movieList]);

  useEffect(() => {
      setFilter(movieList.filter(
        (person) =>
          person.city.toLowerCase().includes(searchItem?.city!.toLowerCase()) &&
          person.country.toLowerCase().includes(searchItem?.country!.toLowerCase()),
      ));
  }, [searchItem]);

  const getAccessToken = () => {
    const token = window.localStorage.getItem("jwt_access_token");
    const decodedToken: any = token && jwtDecode(token);
    // console.log('Data',decodedToken[''])
    // console.log("ddddddd", decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']);
    return decodedToken[
      "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
    ];
  };

  // const currentuser = getAccessToken()
  const handleChangeCameraName: ChangeEventHandler<HTMLInputElement> = (e) => {
    const { name, value } = e.target;
    setSearchItem({ ...searchItem, [name]: value });
    // setLoadingMsg('... Searching ')g
    // setFilterMovie(name=='city'?name:'',name=='country'?name:'')
   //  console.log("movieList", movieList);
   //  if (name === "city")
   //    setFilter(movieList.filter((c) => c.city.includes(value)));
   //  else setFilter(movieList.filter((c) => c.country.includes(value)));

    //  );
    // SearchItemResource(searchItem.country!, searchItem.city!)
    //    .then(res => {
    //       showSearchList(res.data)
    //       setLoadingMsg('')
    //    })
    //    .catch(err => {
    //       setLoadingMsg('')
    //    })
  };

  return (
    <div className={classes.panel}>
      <div className={classes.header}>
        <div className={classes.title}>
          <span>{"Audio List"}</span>
        </div>
        <div className={classes.searchBox}>
          <TextField
            value={searchItem?.city!}
            onChange={handleChangeCameraName}
            name="city"
            dir="ltr"
            size="small"
            label="Filter by City"
            color="primary"
          />
          <TextField
            value={searchItem?.country!}
            onChange={handleChangeCameraName}
            name="country"
            dir="ltr"
            size="small"
            label="Filetr by Country"
            color="primary"
          />
        </div>
        <div className={classes.actionsButtons}>
          {
            getAccessToken() == 'Admin' &&(
            // true && (
              <IconButton
                onClick={() => navigate("new")}
                disabled={!!loadingMsg || error}
                size="small"
                data-press
              >
                <Tooltip title={t("Add Audio")}>
                  <PlaylistAddIcon sx={{ fontSize: 30 }} />
                </Tooltip>
              </IconButton>
            )
          }
          <IconButton
            onClick={loadMovieList}
            className={clsx({ [classes.rotating]: !!loadingMsg })}
          >
            <Tooltip title={t("Refresh")}>
              <ReplayOutlinedIcon />
            </Tooltip>
          </IconButton>
        </div>
      </div>
      <div className={classes.body}>
        {error ? (
          <ErrorComponent
            error
            errorMessage={t("Failed load audio list")}
            onRetry={loadMovieList}
          />
        ) : filter.length ? (
          <div className={clsx(classes.container)}>
            <div className={classes.cameraList}>
              <TableHeader />
              {filter.map((movie) => (
                <MovieListItem key={movie.id} movie={movie} />
              ))}
            </div>
          </div>
        ) : (
          !loadingMsg && (
            <div className={clsx(classes.notFound)}>
              {/* <EmptyCameraListIcon /> */}
              <MdAudioFile size={70} />
              <p>{t("Audio list is empty")}</p>
              {getAccessToken() == "Admin" && (
                <Button
                  onClick={() => navigate("new")}
                  startIcon={<AddIcon />}
                  variant="outlined"
                >
                  {t("Add audio")}
                </Button>
              )}
            </div>
          )
        )}
        <LoadingComponent
          loading={Boolean(loadingMsg)}
          // loading={true}
          message={t(loadingMsg)}
        />

        {!loadingMsg && <Outlet />}
      </div>
    </div>
  );
}

export default MovieList;
