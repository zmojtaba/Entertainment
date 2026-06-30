import {
    alpha, Autocomplete, Chip, Dialog, DialogActions, DialogContent,
    DialogTitle, Divider, IconButton, InputLabel, MenuItem, Select, Stack,
    TextField,
    Tooltip
} from '@mui/material'
import { SelectChangeEvent } from '@mui/material/Select';
import React, { ChangeEventHandler, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import ArrowRightRoundedIcon from '@mui/icons-material/ArrowRightRounded';
import CloseIcon from "@mui/icons-material/Close";
import useDataStore from '../store/useDataStore';
import {
    _CameraRules, createMovie_Schema, dataValidator,
    isRTSP, validateName
} from 'app/services/utils/validatorsAndHelpers';
import ErrorComponent from 'app/shared-components/ErrorComponent';
import { LoadingButton } from '@mui/lab';
import { toast } from 'react-toastify';
import _, { cloneDeep } from 'lodash';
import ToastMsg from 'app/shared-components/ToastMsg';
import { uploadVideo, UpdatePassword } from '../constants/api';
import classes from './style.module.scss'
import DropzoneFile from 'app/shared-components/Dropzone';
import imageMp4 from 'assets/images/icon/mp4.png'
import imageJpg from 'assets/images/icon/imag.png'
import AutorenewIcon from '@mui/icons-material/Autorenew';
import clsx from 'clsx';
import { ErrorType1, ErrorType2 } from '../constants/types';
import { createMagazin_Schema, formatBytes } from '../constants/utils';
import { IGenersItem, IMagazin } from '../store/type';
import PDF from 'assets/images/icon/mp32.png'


const errorsInit = {
    username: '',
    password: '',
    confirmPassword: '',
    role: ''
}

function MovieEditModal() {
    const { t } = useTranslation("SETTINGS");
    const params = useParams()
    const editID = params['id']
    const navigate = useNavigate();
    const MovieFirstValue = useRef<IMagazin>();
    const movieList = useDataStore(store => store.movieList)
    const insertMovie = useDataStore(store => store.insertMovie)
    const errorLoadingMovies = useDataStore(store => store.errorLoadingMovies);
    const loadingMsg = useDataStore(store => store.loadingMsg)
    const loadingMovieList = useDataStore(store => store.loadingMovieList)
    // const movieRefrenceData = useDataStore(st => st.movieRefrenceData)
    const [notFoundError, setNotFoundError] = useState(false)
    const [errors, setErrors] = useState<Record<string, string>>(errorsInit);
    const [loading, setLoading] = useState(false)
    const [isShowCameraInfo, setIsShowCameraInfo] = useState(false);
    const [movie, setMovie] = useState<IMagazin>(createMagazin_Schema())
    const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
    const [selectedPoster, setSelectedPoster] = useState<File | null>(null);
    const [genres, setGenres] = useState<string[]>([]);
    const [progress, setProgress] = useState('0 of 0');
    const isErrors = _.some(errors, (value) => value !== '');

    // console.log('isErrors : ', isErrors)

    useEffect(() => {
        // getGenerList().then(res => {
        //     setGenres(res.data)
        // })
    }, [])

    useEffect(() => {
        if (loadingMovieList)
            return
        if (editID) {
            let foundedCamera = movieList.find(c => c.id == editID)
            // setIsShowCameraInfo(true)
            if (foundedCamera) {

                setMovie(foundedCamera!)
                MovieFirstValue.current = foundedCamera


            } else
                setNotFoundError(true)
        }
        else { //new mode
            const cameraTemplate = createMagazin_Schema()
            setMovie(cameraTemplate)
        }
    }, [loadingMovieList]);

    const handleClose = () => {
        navigate('/users/users');
    };


    const handleChangeCameraName: ChangeEventHandler<HTMLInputElement> = (e) => {
        const { name, value } = e.target
        if (!value) {
            setErrors({ ...errors, [name]: 'select title' })
        } else {
            setErrors({ ...errors, [name]: '' })
        }

        setMovie({
            ...movie,
            [name]: e.target.value
        })
    }




    const handleChangeURL: ChangeEventHandler<HTMLInputElement> = (e) => {
        // const url = e.target.value
        // setCamera({ ...camera, url });
        // const newErrors = dataValidator({ url }, _CameraRules, t);
        // setErrors({ ...errors, ...newErrors })
        // setIsShowCameraInfo(false)
    }

    const handleSaveCamera = () => {
        let temErrors: Record<string, string> = cloneDeep(errors);


        if (!movie.username) {
            temErrors.username = 'select username'
        }
        if (!movie.password || movie.password.length < 8) {
            temErrors.password = 'select password'
        }
        if (!movie.confirmPassword && !editID) {
            temErrors.confirmPassword = 'select confirmPassword'
        }


        // console.log("Erros temp : ", temErrors)
        setErrors(temErrors)
        // return
        const isError = _.some(temErrors, (value) => value !== '');
        if (!isError) {
            if (!editID) {
                setLoading(true)
                uploadVideo(movie)
                    .then(async res => {
                        await window.wait(1000)
                        insertMovie(res.data)
                        setLoading(false)
                        handleClose()
                    }).catch(err => {
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
                                errorData.ValidationErrors.map((err, index) => {
                                    toast.error(err?.errorMessage, {
                                        style: {
                                            direction: "ltr",
                                            textAlign: "left",
                                        }
                                    })
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
                    }
                    )
            } else {
                UpdatePassword(movie)
                    .then(async res => {

                        await window.wait()
                        insertMovie(res.data)
                        setLoading(false)
                        handleClose()

                    }).catch(err => {
                        setLoading(false)
                        if (err.code == 'ERR_NETWORK') {
                            toast.error('Connection to the server is not established', {
                                style: {
                                    direction: "ltr",
                                    textAlign: "left",
                                }
                            })
                        }
                        else if (err.response) {
                            const errorData: ErrorType1 = err.response.data
                            // console.log("Error", errorData.validationErrors)
                            if (errorData.ValidationErrors) {
                                errorData.ValidationErrors.map((err, index) => {
                                    toast.error(err?.errorMessage, {
                                        style: {
                                            direction: "ltr",
                                            textAlign: "left",
                                        }
                                    })
                                })
                            } else {
                                toast.error(errorData.detail, {
                                    style: {
                                        direction: "ltr",
                                        textAlign: "left",
                                    }
                                })
                            }
                        } else {
                            toast.error('Unknown error', {
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


    const onDropVideo = (files: File[]) => {
        if (!files[0]) return;
        setSelectedVideo(files[0])
        setErrors({ ...errors, video: '' })

    }
    const onDropImage = (files: File[]) => {
        if (!files[0]) return;
        setSelectedPoster(files[0])
        setErrors({ ...errors, poster: '' })
    }


    const handleChange = (e: SelectChangeEvent) => {

        if (!e.target.value) {
            setErrors({ ...errors, role: 'select role' })
        } else {
            setErrors({ ...errors, role: '' })
        }

        setMovie({
            ...movie,
            role: e.target.value as string
        })
    };
    return (
        <Dialog
            open
            fullWidth
            maxWidth={'sm'}
            sx={{ height: 'auto', direction: 'ltr !important' }}
        // className={classes.custom}
        // PaperProps={{ className: isSpinning ? classes.customModal : '' }}
        >

            <DialogTitle sx={{ display: 'flex', alignItems: 'center', py: .5, pr: 1, fontSize: '1.4rem' }}>
                <p>
                    {editID ? 'Edit User' : t('New User')}
                </p>
                {editID &&
                    <p style={{ fontSize: '1.6rem', fontWeight: 600 }} >
                        <ArrowRightRoundedIcon color="action" fontSize="large" />  {MovieFirstValue?.current?.username}
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
                    minHeight: '160px'
                }}>
                {
                    errorLoadingMovies || notFoundError ?
                        <ErrorComponent
                            error
                            errorMessage={t('Failed load list Track')}
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

                                <Stack spacing={2}
                                    direction={'column'}
                                >

                                    <Stack spacing={0.5} style={{ flex: 3 }}>
                                        <InputLabel >
                                            {t('Username')}
                                        </InputLabel>
                                        <TextField
                                            value={movie?.username}
                                            onChange={handleChangeCameraName}
                                            dir='ltr'
                                            size='small'
                                            name={'username'}
                                            // disabled={!isShowCameraInfo}
                                            fullWidth
                                            // helperText={errors?.['name']}
                                            error={Boolean(errors['username'])}
                                        />
                                        <InputLabel >
                                            {t('Password (8 character)')}
                                        </InputLabel>
                                        <TextField
                                            value={movie?.password!}
                                            onChange={handleChangeCameraName}
                                            dir='ltr'
                                            name={'password'}
                                            size='small'
                                            // disabled={!isShowCameraInfo}
                                            fullWidth
                                            // helperText={errors?.['name']}
                                            error={Boolean(errors['password'])}
                                        />
                                        {

                                            !editID &&
                                            <>
                                                <InputLabel >
                                                    {t('ConfirmPassword ')}
                                                </InputLabel>
                                                <TextField
                                                    value={movie?.confirmPassword!}
                                                    onChange={handleChangeCameraName}
                                                    dir='ltr'
                                                    size='small'
                                                    name={'confirmPassword'}
                                                    // disabled={!isShowCameraInfo}
                                                    fullWidth
                                                    // helperText={errors?.['name']}
                                                    error={Boolean(errors['confirmPassword'])}
                                                />
                                                <InputLabel >
                                                    {t('Role')}
                                                </InputLabel>
                                                <Select
                                                    labelId="demo-simple-select-label"
                                                    id="demo-simple-select"
                                                    value={movie.role}
                                                    // label="Ro"
                                                    onChange={handleChange}
                                                    size='small'
                                                >
                                                    <MenuItem value={'Admin'}>Admin</MenuItem>
                                                    <MenuItem value={'User'}>User</MenuItem>
                                                </Select>

                                            </>}
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