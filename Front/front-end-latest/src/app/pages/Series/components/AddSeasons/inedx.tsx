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
import ArrowRightRoundedIcon from '@mui/icons-material/ArrowRightRounded';
import ErrorComponent from 'app/shared-components/ErrorComponent';
import { LoadingButton } from '@mui/lab';
import TableHeader from './components/TableHeader';
import SeasonsListItem from './components/SeasonsItem';
import LibraryAddRoundedIcon from '@mui/icons-material/LibraryAddRounded';
import { AddSeason, uploadVideoSeries } from '../../constants/api';
import LoadingComponent from 'app/shared-components/LoadingComponent';
import AddIcon from '@mui/icons-material/Add';
import DropzoneFile from 'app/shared-components/Dropzone';
import imageMp4 from 'assets/images/icon/mp4.png'
import subtitle from 'assets/images/icon/subtitle.png'
import { toast } from 'react-toastify';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import { ErrorType1 } from '../../constants/types';

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
  const insertMovieSeasons = useDataStore(store => store.insertMovieSeasons)
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
  const [selectedSubtitle, setSelectedSubtitle] = useState<File | null>(null);
  const [genres, setGenres] = useState<string[]>([]);
  const [progress, setProgress] = useState('0 of 0');
  const [openDialogUploadFile, setOpenDialogUploadFile] = useState(false);
  const [selectedPoster, setSelectedPoster] = useState<File | null>(null);
  const isErrors = _.some(errors, (value) => value !== '' && value !== undefined);



  useEffect(() => {
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

  const handleCloseSeasons = () => {
    navigate('/series/series');
  }
  const handleClose = () => {
    // navigate('/series/series');
    setOpenDialogUploadFile(false)
  };
  const handleAddSeasons = () => {
    setOpenDialogUploadFile(true)
  };

  const handleSaveCamera = () => {
    navigate('/series/series');
  };
  const handleUploadFile = () => {
    setLoading(true)
    uploadVideoSeries(selectedPoster!, movie, selectedSubtitle!, (progress) => {
      setProgress(progress)
    }).then(async res => {
      await window.wait()
      setLoading(false)
      toast.success('The operation was successful', {
        style: {
          direction: "ltr",
          textAlign: "left",
        }
      })
      insertMovieSeasons(movie, res.data)
      setSelectedPoster(null)
      setOpenDialogUploadFile(false)
    })
      .catch(err => {
        setLoading(false)
        if (err.code == 'ERR_NETWORK') {
          toast.error('Connection to the server is not established', {
            style: {
              direction: "ltr",
              textAlign: "left",
            }
          })
        } else if (err.response) {

          const errorData: ErrorType1 = err.response.data
          // console.log("Error", errorData)
          if (errorData.ValidationErrors) {
            toast.error(errorData.ValidationErrors.at(-1)?.errorMessage, {
              style: {
                direction: "ltr",
                textAlign: "left",
              }
            })
          } else {
            toast.error(errorData.detail, {
              style: {
                direction: "ltr",
                textAlign: "left",
              }
            })
          }
          // toast.error('Connection to the server is not established')
        } else {
          toast.error('Unknown error', {
            style: {
              direction: "ltr",
              textAlign: "left",
            }
          })
        }
      })
  };

  const onDropImage = (files: File[]) => {
    if (!files[0]) return;
    setSelectedPoster(files[0])
    // setErrors({ ...errors, poster: '' })
  }
  const onDropSubtitle = (files: File[]) => {
    if (!files[0]) return;
    setSelectedSubtitle(files[0])
    // setErrors({ ...errors, poster: '' })
  }

  return (
    <>
      <Dialog
        open
        fullWidth
        maxWidth={'xl'}
        fullScreen
        className='font-sans'
        sx={{ direction: 'ltr !important' }}
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
            <IconButton onClick={handleCloseSeasons}
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
                          <SeasonsListItem key={index} seasons={item} series={movie} />
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

      <Dialog
        open={openDialogUploadFile}
        fullWidth
        maxWidth={'sm'}
        sx={{ height: 'auto', direction: 'ltr !important' }}
      // className={classes.custom}
      // PaperProps={{ className: isSpinning ? classes.customModal : '' }}
      >

        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: .8, pr: 1, fontSize: '1.4rem' }}>
          <p>
            {'Add Season'}
          </p>
          <p style={{ fontSize: '1.3rem', fontWeight: 500 }} >
            <ArrowRightRoundedIcon color="action" fontSize="large" />
            {`Season ${movie?.seasons?.at(-1)?.seasonNumber
              ?
              movie?.seasons?.at(-1)?.seasonNumber! + 1
              : 1}`}
          </p>
          <IconButton onClick={handleClose}
            disabled={loading}
            sx={{ ml: 'auto', cursor: 'pointer' }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers
          className={classes.seasonDialog}
          sx={{
            overflowY: 'auto',
            position: 'relative',
            minHeight: '160px'
          }}>
          {
            false ?
              <ErrorComponent
                error
                errorMessage={'Failed load list'}
                style={{ top: '10%', height: '90%' }}
              />
              :
              <div className={classes.container}>                
                  <div className={classes.boxWithTitle} >
                  <span>Select Video</span>
                  {
                  selectedPoster
                    // true
                    ?
                    <div className={classes.showFile} >
                      <div className={classes.file}>
                        <img src={imageMp4} />
                        <div className={classes.fileInfo}>
                          <span>{selectedPoster?.name}</span>
                          <span>{progress}</span>
                        </div>
                      </div>
                      <Tooltip title='Select New video'>
                        <IconButton onClick={() => setSelectedPoster(null)}>
                          <AutorenewIcon fontSize='small' />
                        </IconButton>
                      </Tooltip>
                    </div>
                    :
                    <div className={classes.getFile} >
                      <DropzoneFile validFormats={['.mp4']}
                        style={{ cursor: loading ? 'not-allowed' : 'pointer', pointerEvents: loading ? 'none' : 'all' }}
                        // style={{ borderColor: Boolean(errors['poster']) ? 'red' : 'lightgray' }}
                        onDropFiles={onDropImage} />

                    </div>
                }
                </div>

                <div className={classes.boxWithTitle} >
                  <span>Subtitle</span>

                  {
                    selectedSubtitle
                      // true
                      ?
                      <div className={classes.showFile} >
                        <div className={classes.file}>
                          <img src={subtitle} />
                          <div className={classes.fileInfo}>
                            <span>{selectedSubtitle?.name}</span>
                            {/* <span>{progress}</span> */}
                          </div>
                        </div>
                        <Tooltip title='Select New subtitle'>
                          <IconButton onClick={() => setSelectedSubtitle(null)}>
                            <AutorenewIcon fontSize='small' />
                          </IconButton>
                        </Tooltip>
                      </div>
                      :
                      <div className={classes.getFile} >
                        <DropzoneFile validFormats={['.vtt']}
                          style={{ cursor: loading ? 'not-allowed' : 'pointer', pointerEvents: loading ? 'none' : 'all' }}
                          // style={{ borderColor: Boolean(errors['poster']) ? 'red' : 'lightgray' }}
                          onDropFiles={onDropSubtitle} />
                      </div>
                  }
                </div>
              </div>
          }
        </DialogContent>
        <DialogActions >
          <div className={classes.actions} >
            <div className={classes.getInfo}>
              <LoadingButton sx={{ minWidth: 100 }}
                onClick={handleUploadFile}
                color='success'
                variant='contained'
                disabled={!selectedPoster || !selectedSubtitle}
                loading={loading}
              >
                {'Create Season'}
              </LoadingButton>
            </div>
          </div>
        </DialogActions>


      </Dialog >


      <LoadingComponent message='Add New Season'
        loading={loading} />
    </>
  )
}

export default SeasonList