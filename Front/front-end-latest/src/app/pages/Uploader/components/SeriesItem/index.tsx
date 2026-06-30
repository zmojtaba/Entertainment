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
import { ISeriesItem } from "../../store/type";

type PropsType = {
  movies: ISeriesItem[];
  type: string;
};

function SeriesItem(props: PropsType) {
  const { movies, type } = props;
  // console.log("Movie", movies);

  return (
    <div className={classes.container}>
      {movies.map((movie, index) => (
        <Accordion
          key={index}
          sx={{
            height: "100%",
            //   mb: 2, // فاصله بین آیتم‌ها
            //   borderRadius: 2,
            overflow: "hidden",
            "&:before": {
              display: "none",
            },
          }}
        >
          <AccordionSummary
            className={classes.summary}
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
            <span className={classes.title}>{movie.title}</span>
          </AccordionSummary>

          {movie.seasons.map((season, index) => (
            <AccordionDetails
              key={index}
              sx={{
                py: 0.7,
                color: "black",
              }}
            >
              <Accordion
                sx={{
                  height: "100%",
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
                    m: 0,
                    pr: "11%",
                    pl: "11.2%",
                    // py: "12px",
                    bgcolor: "rgb(97,97,97,.07)",
                    color: "black",
                  }}
                >
                  <Typography>
                    {/* {iconObject[`${movie.type!}`]} */}
                    <span data-span>{`Seasons ${season.seasonNumber}`}</span>
                  </Typography>
                </AccordionSummary>
                {movie.seasons.map((season, index) => (
                  <AccordionDetails
                    key={index}
                    sx={{
                      py: 0.5,
                      // border:'1px solid red',
                      color: "black",
                    }}
                  >
                    <div className={classes.item}>
                      <span>{` eposide ${season.seasonNumber}`}</span>
                      {/* <CircularProgressWithLabel value={movie.downloadStatus} /> */}
                    </div>
                  </AccordionDetails>
                ))}
              </Accordion>
              {/* <div className={classes.item}>
                <span>{` seasons ${season.seasonNumber}`}</span>
                  <CircularProgressWithLabel value={movie.downloadStatus} />
            </div>          */}
            </AccordionDetails>
          ))}
        </Accordion>
      ))}
    </div>
  );
}

export default SeriesItem;
