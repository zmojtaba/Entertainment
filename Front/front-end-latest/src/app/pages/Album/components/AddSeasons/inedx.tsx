import {
  alpha, Autocomplete, Button, Chip, Dialog, DialogActions, DialogContent,
  DialogTitle, Divider, IconButton, InputLabel, Stack,
  TextField,
  Tooltip
} from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import useDataStore from '../../store/useDataStore';
import { createSeries_Schema } from 'app/services/utils/validatorsAndHelpers';
import { ISeries } from '../../store/type';
import _ from 'lodash';
import CloseIcon from "@mui/icons-material/Close";
import classes from './style.module.scss'
import ArrowLeftRoundedIcon from '@mui/icons-material/ArrowLeftRounded';
import ErrorComponent from 'app/shared-components/ErrorComponent';
import { LoadingButton } from '@mui/lab';
import TableHeader from './components/TableHeader';
import SeasonsListItem from './components/SeasonsItem';
import LibraryAddRoundedIcon from '@mui/icons-material/LibraryAddRounded';
import { AddSeason } from '../../constants/api';
import LoadingComponent from 'app/shared-components/LoadingComponent';
import AddIcon from '@mui/icons-material/Add';

const errorsInit = {
  title: '',
  description: '',
  video: '',
  poster: '',
  imdb: '',
  age: '',
  year: '',
  language: '',
  contries: '',
  generes: '',
  directors: ''
}
function SeasonList() {
  const params = useParams()
  const editID = params['id']
  const navigate = useNavigate();
  const MovieFirstValue = useRef<ISeries>();
  const movieList = useDataStore(store => store.movieList)
  const insertMovie = useDataStore(store => store.insertMovie)
  const errorLoadingMovies = useDataStore(store => store.errorLoadingMovies);
  const loadingMsg = useDataStore(store => store.loadingMsg)
  const loadingMovieList = useDataStore(store => store.loadingMovieList)
  const movieRefrenceData = useDataStore(st => st.movieRefrenceData)
  const [notFoundError, setNotFoundError] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>(errorsInit);
  const [loading, setLoading] = useState(false)
  const [isShowCameraInfo, setIsShowCameraInfo] = useState(false);
  const [movie, setMovie] = useState<ISeries>(createSeries_Schema())
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [selectedPoster, setSelectedPoster] = useState<File | null>(null);
  const [genres, setGenres] = useState<string[]>([]);
  const [progress, setProgress] = useState('0 of 0');
  const isErrors = _.some(errors, (value) => value !== '' && value !== undefined);


  useEffect(() => {
    if (loadingMovieList)
      return
    if (editID) {
      const foundedCamera = movieList.find(c => c.id == editID)
      // setIsShowCameraInfo(true)
      if (foundedCamera) {
        setMovie(foundedCamera)
        MovieFirstValue.current = foundedCamera
      } else
        setNotFoundError(true)
    }
    else { //new mode
      const cameraTemplate = createSeries_Schema()
      setMovie(cameraTemplate)
    }
  }, [loadingMovieList, movieList]);

  const handleClose = () => {
    navigate('/series/series');
  };
  const handleAddSeasons = () => {
    setLoading(true)
    AddSeason(editID!)
      .then(async res => {
        await window.wait()
        console.log('data', res.data)
        insertMovie(res.data)
        setLoading(false)
      })
      .catch(err => {

        setLoading(false)

      })
  };

  const handleSaveCamera = () => {
    navigate('/series/series');
  };
  return (
    <>
      <Dialog
        open
        fullWidth
        maxWidth={'xl'}
        fullScreen
        // sx={{ height: '90%' }}
      // className={classes.custom}
      // PaperProps={{ className: isSpinning ? classes.customModal : '' }}
      >

        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 1, pr: 1, fontSize: '1.4rem' }}>
          <p>
            {'Seasons List'}
          </p>

          <div>
            <Tooltip title={"Add Season"}>
              <IconButton onClick={handleAddSeasons}
                disabled={loading}
                sx={{ ml: 'auto', cursor: 'pointer' }}>
                <LibraryAddRoundedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <IconButton onClick={handleClose}
              disabled={loading}
              sx={{ ml: 'auto', cursor: 'pointer' }}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </div>
        </DialogTitle>
        <DialogContent dividers
          className={classes.dialogContent}
          sx={{
            overflowY: 'auto',
            position: 'relative',
          }}>
          {
            errorLoadingMovies || notFoundError ?
              <ErrorComponent
                error
                errorMessage={errorLoadingMovies ? 'Failed load list' : 'Not Found'}
                style={{ top: '10%', height: '90%' }}
              />
              :
              <div className={classes.container}>
                {
                  movie?.seasons?.length > 0 ?
                    <>
                      <TableHeader />
                      {
                        movie.seasons.map((item, index) => (
                          <SeasonsListItem key={index} seasons={item} />
                        ))
                      }
                    </>
                    :
                    <div className={classes.notFound}>
                      {/* <EmptyCameraListIcon /> */}
                      <p >
                        {'No Seasone available. Add your first Season'}
                      </p>
                      <Button
                        size='small'
                        onClick={handleAddSeasons}
                        startIcon={<AddIcon />}
                        variant='outlined'>
                        {"Add Season"}
                      </Button>
                    </div>
                }
              </div>
          }
        </DialogContent>


      </Dialog >


      <LoadingComponent message='Add New Season'
        loading={loading} />


    </>
  )
}

export default SeasonList