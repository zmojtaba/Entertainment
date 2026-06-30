import {
    Dialog, DialogActions, DialogContent,
    DialogTitle,IconButton, InputLabel, Stack,
    TextField,
    Tooltip
} from '@mui/material'
import React, { ChangeEventHandler, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import ArrowLeftRoundedIcon from '@mui/icons-material/ArrowLeftRounded';
import CloseIcon from "@mui/icons-material/Close";
import useDataStore from '../store/useDataStore';

import ErrorComponent from 'app/shared-components/ErrorComponent';
import { LoadingButton } from '@mui/lab';
import { toast } from 'react-toastify';
import _, { cloneDeep } from 'lodash';
import { uploadVideo,  updateVideo } from '../constants/api';
import classes from './style.module.scss'
import DropzoneFile from 'app/shared-components/Dropzone';
import imageJpg from 'assets/svg/mp3.svg'
import AutorenewIcon from '@mui/icons-material/Autorenew';
import { ErrorType1 } from '../constants/types';
import { createCrew_Schema, formatBytes } from '../constants/utils';
import { ICrew } from '../store/type';

const errorsInit = {
    title: '',
    poster: '',
    contry: '',
    city: ''
}

function MovieEditModal() {
    const { t } = useTranslation("SETTINGS");
    const params = useParams()
    const editID = params['id']
    const navigate = useNavigate();
    const MovieFirstValue = useRef<ICrew>();
    const movieList = useDataStore(store => store.movieList)
    const insertMovie = useDataStore(store => store.insertMovie)
    const errorLoadingMovies = useDataStore(store => store.errorLoadingMovies);
    const loadingMovieList = useDataStore(store => store.loadingMovieList)
    const [notFoundError, setNotFoundError] = useState(false)
    const [errors, setErrors] = useState<Record<string, string>>(errorsInit);
    const [loading, setLoading] = useState(false)
    const [movie, setMovie] = useState<ICrew>(createCrew_Schema())
    const [selectedPoster, setSelectedPoster] = useState<File | null>(null);
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
            const cameraTemplate = createCrew_Schema()
            setMovie(cameraTemplate)
        }
    }, [loadingMovieList]);

    const handleClose = () => {
        navigate('/crews/crews');
    };


    const handleChangeCameraName: ChangeEventHandler<HTMLInputElement> = (e) => {
        const { name, value } = e.target;
        if (!value) {
            setErrors({ ...errors, [name]: 'select title' })
        } else {
            setErrors({ ...errors, [name]: '' })
        }

        setMovie({
            ...movie,
            [name]: value
        })
    }



    const handleSaveCamera = () => {
        let temErrors: Record<string, string> = cloneDeep(errors);
       

        if (selectedPoster == null && !editID) {
            temErrors.poster = 'select poster'
        }

        if (!movie.title) {
            temErrors.title = 'select title'
        }

        if (!movie.city) {
            temErrors.city = 'select city'
        }
        if (!movie.country) {
            temErrors.country = 'select country'
        }


        // console.log("Erros temp : ", temErrors)
        setErrors(temErrors)
        // return
        const isError = _.some(temErrors, (value) => value !== '');
        if (!isError) {
            if (!editID) {
                setLoading(true)
                uploadVideo(movie, selectedPoster!, (progress) => {
                    // setProgress(progress)
                }).then(res => {
                    insertMovie(res.data)
                    setLoading(false)
                    handleClose()
                    toast.success('The operation was successful.',{
                                        style: {
                                            direction: "ltr",
                                            textAlign: "left",
                                        }
                                    })

                }).catch(err => {

                    setLoading(false)
                    if (err.code == 'ERR_NETWORK') {
                        toast.error('Connection to the server is not established',{
                                        style: {
                                            direction: "ltr",
                                            textAlign: "left",
                                        }
                                    })
                    } else if (err.response) {

                        const errorData: ErrorType1 = err.response.data
                        // console.log("Error", errorData)
                        if (errorData.validationErrors) {
                            toast.error(errorData.validationErrors.at(-1)?.errorMessage,{
                                        style: {
                                            direction: "ltr",
                                            textAlign: "left",
                                        }
                                    })
                        } else {
                            toast.error(errorData.detail,{
                                        style: {
                                            direction: "ltr",
                                            textAlign: "left",
                                        }
                                    })
                        }
                        // toast.error('Connection to the server is not established')
                    } else {
                        toast.error('Unknown error',{
                                        style: {
                                            direction: "ltr",
                                            textAlign: "left",
                                        }
                                    })
                    }
                }
                )
            } else {
                updateVideo(movie, selectedPoster!).then(res => {
                    insertMovie(res.data)
                    setLoading(false)
                    toast.success('The operation was successful.',{
                                        style: {
                                            direction: "ltr",
                                            textAlign: "left",
                                        }
                                    })
                    handleClose()

                }).catch(err => {
                    setLoading(false)
                    if (err.code == 'ERR_NETWORK') {
                        toast.error('Connection to the server is not established',{
                                        style: {
                                            direction: "ltr",
                                            textAlign: "left",
                                        }
                                    })
                    }
                    else if (err.response) {
                        const errorData: ErrorType1 = err.response.data
                        // console.log("Error", errorData.validationErrors)
                        if (errorData.validationErrors) {
                            toast.error(errorData.validationErrors.at(-1)?.errorMessage,{
                                        style: {
                                            direction: "ltr",
                                            textAlign: "left",
                                        }
                                    })
                        } else {
                            toast.error(errorData.detail,{
                                        style: {
                                            direction: "ltr",
                                            textAlign: "left",
                                        }
                                    })
                        }
                    } else {
                        toast.error('Unknown error',{
                                        style: {
                                            direction: "ltr",
                                            textAlign: "left",
                                        }
                                    })
                    }
                }
                )
            }
        }

        // handleClose()


    }

    const onDropImage = (files: File[]) => {
        if (!files[0]) return;
        setSelectedPoster(files[0])
        setErrors({ ...errors, poster: '' })
    }

    return (
        <Dialog
            open
            fullWidth
            maxWidth={'sm'}
            sx={{ height: 'auto',direction: 'ltr !important' }}
        // className={classes.custom}
        // PaperProps={{ className: isSpinning ? classes.customModal : '' }}
        >

            <DialogTitle sx={{ display: 'flex', alignItems: 'center', py: .5, pr: 1, fontSize: '1.4rem' }}>
                <p>
                    {editID ? 'Edit audio' : t('New audio')}
                </p>
                {editID &&
                    <p style={{ fontSize: '1.6rem', fontWeight: 600 }} >
                        <ArrowLeftRoundedIcon color="action" fontSize="large" />  {MovieFirstValue?.current?.title}
                    </p>
                }
                <IconButton onClick={handleClose}
                    disabled={loading}
                    sx={{ ml: 'auto', cursor: 'pointer' }}>
                    <CloseIcon fontSize="small" />
                </IconButton>
            </DialogTitle>
            <DialogContent dividers
                className={classes.dialogContent}
                sx={{
                    overflowY: 'auto',
                    position: 'relative',
                    minHeight:'160px'
                }}>
                {
                    errorLoadingMovies || notFoundError ?
                        <ErrorComponent
                            error
                            errorMessage={t(errorLoadingMovies ? 'FAILED_LOAD_CAMERA_LIST' : 'CAMERA_NOT_FOUND')}
                            style={{ top: '10%', height: '90%' }}
                        />
                        :
                        <Stack  >
                            <Stack spacing={1} sx={{
                                p: 0,
                                'input.MuiInputBase-input':
                                    { fontFamily: 'system-ui,serif', fontSize: '1.2rem' },
                                '& .MuiFormLabel-root ': {
                                    fontWeight: 'bold',
                                }
                            }}>
                                <Stack spacing={0.5} style={{ flex: 1 }}>
                                    <Stack spacing={2} direction={'row'}>
                                        <Stack spacing={0.5} style={{ flex: 3 }}>
                                            <InputLabel >
                                                {t('Select audio file')}
                                            </InputLabel>
                                            {
                                                selectedPoster
                                                    ?
                                                    <div className={classes.showFile} >
                                                        <div className={classes.file}>
                                                            <img src={imageJpg} />
                                                            <div className={classes.fileInfo}>
                                                                <span>{selectedPoster?.name}</span>
                                                                <span>{`${formatBytes(selectedPoster.size)}`}</span>
                                                            </div>
                                                        </div>
                                                        <Tooltip title='Select New video'>
                                                            <IconButton onClick={() => setSelectedPoster(null)}>
                                                                <AutorenewIcon fontSize='small' />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </div>
                                                    :
                                                    <DropzoneFile validFormats={['.mp3']}
                                                        style={{
                                                            borderColor: Boolean(errors['poster']) ? 'red' : 'lightgray',
                                                            pointerEvents: editID ? 'none' : 'all',
                                                        }}
                                                        onDropFiles={onDropImage} />
                                            }
                                        </Stack>

                                    </Stack>
                                </Stack>

                                <Stack spacing={1}
                                    direction={'column'}
                                >

                                    <Stack spacing={0.5} style={{ flex: 3 }}>
                                        <InputLabel >
                                            {t('Title')}
                                        </InputLabel>
                                        <TextField
                                            value={movie?.title}
                                            onChange={handleChangeCameraName}
                                            dir='ltr'
                                            size='small'
                                            name='title'
                                            // disabled={!isShowCameraInfo}
                                            fullWidth
                                            // helperText={errors?.['name']}
                                            error={Boolean(errors['title'])}
                                        />
                                    </Stack>
                                    <Stack direction={'row'} spacing={2}>

                                        <Stack spacing={0.5} style={{ flex: 3 }}>
                                            <InputLabel >
                                                {t('Contry')}
                                            </InputLabel>
                                            <TextField
                                                value={movie?.country}
                                                onChange={handleChangeCameraName}
                                                dir='ltr'
                                                name='country'
                                                size='small'
                                                // disabled={!isShowCameraInfo}
                                                fullWidth
                                                // helperText={errors?.['name']}
                                                error={Boolean(errors['country'])}
                                            />
                                        </Stack>
                                        <Stack spacing={0.5} style={{ flex: 3 }}>
                                            <InputLabel >
                                                {t('City')}
                                            </InputLabel>
                                            <TextField
                                                value={movie?.city}
                                                onChange={handleChangeCameraName}
                                                dir='ltr'
                                                name='city'
                                                size='small'
                                                // disabled={!isShowCameraInfo}
                                                fullWidth
                                                // helperText={errors?.['name']}
                                                error={Boolean(errors['city'])}
                                            />
                                        </Stack>
                                    </Stack>
                                </Stack>
                            </Stack>
                        </Stack>
                }
            </DialogContent>

            <DialogActions >
                <div className={classes.actions} >
                    <div className={classes.getInfo}>
                        <LoadingButton sx={{ minWidth: 100 }}
                            onClick={handleSaveCamera}
                            color='success'
                            variant='contained'
                            disabled={isErrors}
                            loading={loading}
                        >
                            {t('Save')}
                        </LoadingButton>
                    </div>
                </div>
            </DialogActions>
        </Dialog >
    )
}

export default MovieEditModal