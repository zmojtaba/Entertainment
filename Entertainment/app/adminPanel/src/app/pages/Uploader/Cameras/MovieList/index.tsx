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
import { Divider, IconButton, Tooltip } from "@mui/material";
import ReplayIcon from '@mui/icons-material/Replay';
import { API_CONFIG } from "app/app-configs/apiConfig";

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
  const { loadingMsg, error, currentlyDownload } = useDataStore((st) => ({
    loadingMsg: st.loadingMsg,
    error: st.errorLoadingMovies,
    currentlyDownload: st.currentlyDownload
  }));
  const isEmpty = Object.values(movieList!).every((arr) => arr.length == 0);

  const uploadIbject: SelectedObjectType = {
    // movies
    // id: "72b16a29-ad5a-4824-8641-7c818c2f83ec",
    // albums
    // id: "56b8faad-e73e-46a2-b319-becffbe780a3",
    // seriea
    id: "7b1d3b11-0b12-443a-b2a2-db7dce7a0c54",
    mediaType: "Series",
    percentage: 100,
    episodeId: '',
    fileType: 'stream',
    title: '',

  };

  // const handelCurrentDownload = () => {
  //   const test: UploadObject = {
  //     id: "46339b02-9bff-49a2-bc15-7544a9aecf23",
  //     percent: 50,
  //     type: 'series'
  //   }
  //   finedObject(test)
  // }

  useEffect(() => {
    document.title = "Uploading";
    loadMovieList();

    // setInterval(() => {
    //   handelCurrentDownload()
    // }, 3000)
    // finedObject(uploadIbject);
  }, []);

  useEffect(() => {
    if (currentlyDownload.length) {
      const _data: UploadObject = {
        id: currentlyDownload[0].id,
        percent: 0,
        type: currentlyDownload[0].type
      }
      finedObject(_data);
    }
  }, [currentlyDownload]);

  // useEffect(() => {
  //   finedObject({ id: uploadIbject.id, percent: uploadIbject.percentage, type: uploadIbject.mediaType });
  // }, [movieList]);

  const finedObject = (object: UploadObject) => {
    // console.log("object", movieList[`${object.type.toLocaleLowerCase()}`])
    // console.log("object", object.type.toLocaleLowerCase())

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
      case "audiostorie":
      case "podcast":
        let titleAlbume = ''
        let isEdpisod = false;
        movieList[`${object.type.toLocaleLowerCase()}`].map((item) => {
          console.log("item", item)
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
          setSelectedObject({
            ...selectedObject,
            id: selectedSeries?.id,
            title: !isEdpisod
              ? `Album ${selectedSeries?.title}`
              : `Album name is: "${titleAlbume}" | Eposode title "${selectedSeries?.title}"`,
            fileType: object.type,
            mediaType: object.type,
            percentage: object.percent,
          });
        }
        break;

      case "movie":
      case "coru":
      case "track":
      case "magazine":
      case "newspaper":
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
            mediaType: object.type,
            percentage: object.percent,
          });
        }
        break;
    }
  };


  const { on: onDownload } = useSignalR({
    hubUrl: `${API_CONFIG.faceDetection}/download-queue`,
    autoConnect: true,
  });

  onDownload('DownloadProgress', (e) => {
    // if(!selectedObject.id){
    setSelectedObject(e)
    // }
    finedObject({ id: e.id, percent: e.percentage, type: e.mediaType })
  })

  const { on: downloadHub, isConnected, isConnecting, errorTxt } = useSignalR({
    hubUrl: `${API_CONFIG.faceDetection}/downloadHub`,
    autoConnect: true,
  });
  downloadHub('DownloadProgress', (e) => {
    // console.log('Signal R', e);
    setSelectedObject(e)
    finedObject({ id: e.id, percent: e.percentage, type: e.mediaType })
  })

  // console.log("selectedObject", `${API_CONFIG.faceDetection}/downloadHub`)
  return (
    <div className={classes.panel}>
      <div className={classes.header}>
        <div className={classes.title}>
          <span >{"Uploading data list"}</span>
        </div>
        <div data-connect>
          <Tooltip title={errorTxt as string}>
            <>
              <span>Connection Status : </span>
              {isConnecting ? <span >Connecting </span> : isConnected ? <span style={{ color: 'green' }}>Connect</span> :
                <span style={{ color: 'red' }}>Disconnect ?</span>}
            </>
          </Tooltip>
          <Divider
            orientation="vertical"
            flexItem
            sx={{
              height: 16,
              alignSelf: "center",
            }}
          />
          <Tooltip title={'Refresh'}>
            <IconButton onClick={() => loadMovieList()}>
              <ReplayIcon fontSize="small" />
            </IconButton>
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
              {
                // currentlyDownload.length>0 &&
                selectedObject.id &&
                <div className={clsx(classes.cameraListItem, classes.row)} >
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
              }

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
                  case "album":
                  case "audioStory":
                  case "podCast":
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
