import classes from "./style.module.scss";
import { useTranslation } from "react-i18next";
import useDataStore from "../../store/useDataStore";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import clsx from "clsx";
import LoadingComponent from "app/shared-components/LoadingComponent";
import ErrorComponent from "app/shared-components/ErrorComponent";
import TableHeader from "../../components/TableHeader";
import MovieListItem, { iconObject } from "../CameraItem";
import { IAlbume, ISeriesItem } from "../../store/type";
import SeriesItem from "../../components/SeriesItem";
import Podcasts from "../../components/PodCasts";
import { CircularProgressWithLabel } from "../../components/CircleLoading";
import { useSignalR } from "../../hooks/useSignalR";
import { Tooltip } from "@mui/material";

type UploadObject = {
  id: string;
  type: string;
  percent: number;
};
// {
//   "id": "f863e6a9-4e04-4235-a38d-e8fd21cf075d",
//   "episodeId": "9020b034-d70b-4f4c-b11f-6cf8e62ed2b5",
//   "mediaType": 0,
//   "fileType": "movie",
//   "percentage": 50.01,
//   "downloadedBytes": 232010,
//   "totalBytes": 865325124,
//   "status": 3,
//   "errorMessage": "asdflkasjdfs"
// }

type SelectedObjectType = {
  id: string;
  episodeId: string;
  title: string;
  seasonNumber?: number;
  episodeNumber?: number;
  fileType: string;
  mediaType: string,
  percentage: number;
};

const initSelectedObject: SelectedObjectType = {
  id: "",
  episodeId: '',
  title: "",
  fileType: "",
  episodeNumber: 0,
  seasonNumber: 0,
  percentage: 0,
  mediaType: ''
};

function MovieList() {
  const { t } = useTranslation("SETTINGS");
  const [selectedObject, setSelectedObject] =
    useState<SelectedObjectType>(initSelectedObject);
  const movieList = useDataStore((st) => st.movieList);
  const loadMovieList = useDataStore((st) => st.loadMovieList);
  const { loadingMsg, error } = useDataStore((st) => ({
    loadingMsg: st.loadingMsg,
    error: st.errorLoadingMovies,
  }));
  const isEmpty = Object.values(movieList!).every((arr) => arr.length === 0);

  const uploadIbject: SelectedObjectType = {
    // movies
    // id: "72b16a29-ad5a-4824-8641-7c818c2f83ec",
    // albums
    // id: "56b8faad-e73e-46a2-b319-becffbe780a3",
    // seriea
    id: "9e22417b-66e1-43e2-a5d2-8e9a3346120e",
    mediaType: "Series",
    percentage: 100,
    episodeId: '',
    fileType: 'stream',
    title: '',

  };
  useEffect(() => {
    document.title = "Uploading";
    loadMovieList();
    // finedObject(uploadIbject);
  }, []);

  // useEffect(() => {
  //   finedObject({ id: uploadIbject.id, percent: uploadIbject.percentage, type: uploadIbject.mediaType });
  // }, [movieList]);

  const finedObject = (object: UploadObject) => {
    // console.log("object", object)
    let selectedSeries: any;
    switch (object.type.toLocaleLowerCase()) {
      case "series":
        let title = "";
        let seasonNumber = 0;
        movieList[`${object.type.toLocaleLowerCase()}`].map((item, index) => {
          title = item.title;
          if (item.id === object.id) {
            selectedSeries = item;
          }
          item.seasons.map((season, index) => {
            // console.log("Finedd",);
            if (season.id === object.id) {
              selectedSeries = season;
            }
            season.episodes.map((episod, index) => {
              seasonNumber = season.seasonNumber;
              if (episod.id === object.id) {
                // console.log("Finedd", episod);
                selectedSeries = episod;
              }
            });
          });
        });
        if (selectedSeries) {
          // console.log("Fineddgggggggggggggggggggggggggg", selectedSeries);
          setSelectedObject({
            ...selectedObject,
            id: selectedSeries?.id,
            title: selectedSeries.seasonNumber
              ? `Series " ${title} " Season ${selectedSeries.seasonNumber}`
              : `Series name is: "${title}"  Season ${seasonNumber} Eposode ${selectedSeries.episodeNumber}`,
            mediaType: object.type,
            percentage: object.percent,
          });
        }
        break;

      case "album":
      case "audioStorie":
      case "podCast":
        let titleAlbume = ''
        let isEdpisod = false;
        movieList[`${object.type.toLocaleLowerCase()}`].map((item) => {
          titleAlbume = item.title;
          if (item.id === object.id) {
            selectedSeries = item;
          }

          item.episodes.map((episod) => {
            if (episod.id === object.id) {
              isEdpisod = true;
              // console.log("Finedd", episod);
              selectedSeries = episod;
            }
          });
        });
        if (selectedSeries) {
          // console.log("Fineddgggggggggggggggggggggggggg", selectedSeries);
          setSelectedObject({
            ...selectedObject,
            id: selectedSeries?.id,
            title: !isEdpisod
              ? `Album ${selectedSeries?.title}`
              : `Album name is: "${titleAlbume}" | Eposode title "${selectedSeries?.title}"`,
            fileType: object.type,
            percentage: object.percent,
          });
        }
        break;

      case "movie":
      case "coru":
      case "track":
      case "magazine":
      case "newsPaper":
      case "books":
        const selectedTemp = movieList[`${object.type.toLocaleLowerCase()}`].find(
          (i) => i.id === object.id,
        );
        console.log("Finedd", selectedTemp);
        if (selectedTemp) {
          setSelectedObject({
            ...selectedObject,
            id: selectedTemp?.id,
            title: selectedTemp?.title,
            seasonNumber: selectedObject.seasonNumber ?? 0,
            episodeNumber: selectedObject.episodeNumber ?? 0,
            fileType: object.type,
            percentage: object.percent,
          });
        }
        break;
    }
  };


  const { on: onDownload, isConnected, isConnecting, errorTxt } = useSignalR({
    hubUrl: 'http://192.168.151.2:5030/download-queue',
    autoConnect: true,
  });

  onDownload('DownloadProgress', (e) => {
    // if(!selectedObject.id){
      setSelectedObject(e)
    // }
    finedObject({ id: e.id, percent: e.percentage, type: e.mediaType })
  })


  const { on: downloadHub } = useSignalR({
    hubUrl: 'http://192.168.151.2:5030/downloadHub',
    autoConnect: true,
  });
  downloadHub('DownloadProgress', (e) => {
    // console.log('Signal R', e);
    setSelectedObject(e)
    finedObject({ id: e.id, percent: e.percentage, type: e.mediaType })
  })

  return (
    <div className={classes.panel}>
      <div className={classes.header}>
        <div className={classes.title}>
          <span >{"Uploading data list"}</span>
        </div>
        <div data-connect>
          <Tooltip title={errorTxt as string}>
            {isConnecting ? <span >Connecting </span> : isConnected ? <span style={{ color: 'green' }}>Connect</span> :
              <span style={{ color: 'red' }}>Disconnect ?</span>}
          </Tooltip>
        </div>
      </div>
      <div className={classes.body}>
        {error ? (
          <ErrorComponent
            error
            errorMessage={t("Failed load uploader list")}
            onRetry={loadMovieList}
          />
        ) : !isEmpty ? (
          <div className={clsx(classes.container)}>
            <div className={classes.cameraList}>
              <TableHeader />
              <div className={clsx(classes.cameraListItem, classes.row)}>
                <div className={classes.cell} style={{ textAlign: "center" }}>
                  {iconObject[`${selectedObject.mediaType.toLocaleLowerCase()}`]}
                  <span data-span>{`${selectedObject.mediaType.toLocaleLowerCase()}`}</span>
                </div>
                <div className={classes.cell} style={{ textAlign: "center" }}>
                  {selectedObject?.title}
                </div>
                <div className={classes.cell}>
                  <CircularProgressWithLabel value={selectedObject.percentage} />
                </div>
              </div>

              {Object.entries(movieList).map(([key, value], index) => {
                if (!Array.isArray(value)) return [];
                switch (key) {
                  case "series":
                    return (
                      <SeriesItem
                        key={key}
                        type={key}
                        movies={value as ISeriesItem[]}
                      />
                    )
                  case "albums":
                  case "audioStories":
                  case "podCasts":
                    return (
                      <Podcasts
                        key={key}
                        type={key}
                        movies={value as IAlbume[]}
                      />
                    )

                  default:
                    return (
                      <MovieListItem key={key} type={key} movies={value} />
                    )
                }
              })}
            </div>
          </div>
        ) : (
          !loadingMsg && (
            <div className={clsx(classes.notFound)}>
              <p>{"No data available"}</p>
            </div>
          )
        )}
        <LoadingComponent
          loading={Boolean(loadingMsg)}
          message={"loading uploader list"}
        />

        {!loadingMsg && <Outlet />}
      </div>
    </div>
  );
}

export default MovieList;
