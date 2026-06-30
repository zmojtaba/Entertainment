import React, { useState } from "react";
import classes from "./style.module.scss";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { Chip, CircularProgress, IconButton, Tooltip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ConfirmDialogComponent from "app/shared-components/ConfirmDialogComponent/index";
import PushPinOutlinedIcon from "@mui/icons-material/PushPinOutlined";
import VideocamOffOutlinedIcon from "@mui/icons-material/VideocamOffOutlined";
import EditIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import VideocamOutlinedIcon from "@mui/icons-material/VideocamOutlined";
import useDataStore from "../../store/useDataStore";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import _ from "lodash";
import { toast } from "react-toastify";
import ToastMsg from "app/shared-components/ToastMsg";
import { convertToRelativeTime } from "app/services/utils/validatorsAndHelpers";
import { IMagazin, IUploaderItem } from "../../store/type";
import { setLoading } from "app/store/core/loadingSlice";
import { deleteResource } from "../../constants/api";
import { ErrorType1 } from "../../constants/types";
import { MdMovie } from "react-icons/md";
import { FaBook } from "react-icons/fa6";
import { CircularProgressWithLabel } from "../../components/CircleLoading";
import { TiGroup } from "react-icons/ti";
import { MdAudiotrack } from "react-icons/md";
import { MdLocalMovies } from "react-icons/md";
import { MdLibraryMusic } from "react-icons/md";
import { FaRegNewspaper } from "react-icons/fa";
import { GiNewspaper } from "react-icons/gi";
import { FaHeadphones } from "react-icons/fa";
import { FaMicrophoneAlt } from "react-icons/fa";

interface PropsType {
  movies: IUploaderItem[];
  type: string;
}
export const iconObject = {
  movie: <MdMovie size={30} />,
  series: <MdLocalMovies size={30} />,
  coru: <TiGroup size={30} />,
  track: <MdAudiotrack size={30} />,
  album: <MdLibraryMusic size={30} />,
  magazine: <FaRegNewspaper size={30} />,
  newsPaper: <GiNewspaper size={30} />,
  audioStorie: <FaHeadphones size={30} />,
  book: <FaBook size={30} />,
  podCast: <FaMicrophoneAlt size={30} />,
};

function MovieListItem(props: PropsType) {
  const { movies, type } = props;

  return (
    <>
      {movies.map((movie, index) => (
        <div
          key={movie.id}
          className={clsx(classes.cameraListItem, classes.row)}
          // id={`${movie}`}
        >
          <div className={classes.cell} style={{ textAlign: "center" }}>
            {iconObject[`${type}`]}
            <span data-span>{`${type}`}</span>
          </div>
          <div className={classes.cell} style={{ textAlign: "center" }}>
            {movie.title}
          </div>
          <div className={classes.cell}>
            {/* <CircularProgressWithLabel value={movie.downloadStatus} /> */}
            {/* <CircularProgressWithLabel value={20} /> */}
          </div>
        </div>
      ))}
    </>
  );
}

export default MovieListItem;
