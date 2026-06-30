import React from "react";
import classes from "./style.module.scss";
import clsx from "clsx";
import { IUploaderItem } from "../../store/type";
import { MdMovie } from "react-icons/md";
import { FaBook } from "react-icons/fa6";
import { TiGroup } from "react-icons/ti";
import { MdAudiotrack } from "react-icons/md";
import { MdLocalMovies } from "react-icons/md";
import { MdLibraryMusic } from "react-icons/md";
import { FaRegNewspaper } from "react-icons/fa";
import { GiNewspaper } from "react-icons/gi";
import { FaHeadphones } from "react-icons/fa";
import { FaMicrophoneAlt } from "react-icons/fa";

interface PropsType {
  movies: IUploaderItem[] 
  type: string;
}
export const iconObject = {
  movie: <MdMovie size={30} />,
  series: <MdLocalMovies size={30} />,
  coru: <TiGroup size={30} />,
  track: <MdAudiotrack size={30} />,
  album: <MdLibraryMusic size={30} />,
  magazine: <FaRegNewspaper size={30} />,
  newspaper: <GiNewspaper size={30} />,
  audiostory: <FaHeadphones size={30} />,
  book: <FaBook size={30} />,
  podcast: <FaMicrophoneAlt size={30} />,
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
            {iconObject[`${type.toLocaleLowerCase()}`]}
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
