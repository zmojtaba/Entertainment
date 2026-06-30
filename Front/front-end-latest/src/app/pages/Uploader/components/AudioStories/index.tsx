import React from "react";
// import classes from "../../Cameras/CameraItem/style.module.scss";
import classes from "./style.module.scss";
import { CircularProgressWithLabel } from "../CircleLoading";
import { iconObject } from "../../Cameras/CameraItem";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { IAlbume } from "../../store/type";

type PropsType = {
  movies: IAlbume[];
  type: string;
};

function AudioStories(props: PropsType) {
  const { movies, type } = props;
  //   console.log("Movie", movie.seasons);

  return (
    <div className={classes.container}>
      {movies.map((movie, index) => (
        <Accordion
          key={movie.id}
          sx={{
            //   mb: 2, // فاصله بین آیتم‌ها
            //   borderRadius: 2,
            overflow: "hidden",
            "&:before": {
              display: "none",
            },
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ color: "black" }} />}
            sx={{
              gap: 0,
              pr: "11.5%",
              pl: "11.2%",
              // py: "12px",
              bgcolor: "rgb(97,97,97,.07)",
              color: "black",
            }}
          >
            <Typography>
              {iconObject[`${type}`]}
              <span data-span>{`${type}`}</span>
            </Typography>
          </AccordionSummary>
          {movie.episodes.map((episod, index) => (
            <AccordionDetails
              key={index}
              sx={{
                py: 0.5,
                // border:'1px solid red',
                color: "black",
              }}
            >
              <div className={classes.item}>
                <span>{episod.title}</span>
                {/* <CircularProgressWithLabel value={movie.downloadStatus} /> */}
              </div>
            </AccordionDetails>
          ))}
        </Accordion>
      ))}
      ;
    </div>
  );
}

export default AudioStories;
