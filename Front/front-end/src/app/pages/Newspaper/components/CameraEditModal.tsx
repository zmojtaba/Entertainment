import {
    alpha, Autocomplete, Chip, Dialog, DialogActions, DialogContent,
    DialogTitle, Divider, IconButton, InputLabel, Stack,
    TextField,
    Tooltip
} from '@mui/material'
import React, { ChangeEventHandler, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import ArrowLeftRoundedIcon from '@mui/icons-material/ArrowLeftRounded';
import CloseIcon from "@mui/icons-material/Close";
import useDataStore from '../store/useDataStore';
import {
    _CameraRules, createMagazin_Schema, createMovie_Schema, dataValidator,
    isRTSP, validateName
} from 'app/services/utils/validatorsAndHelpers';
import ErrorComponent from 'app/shared-components/ErrorComponent';
import { LoadingButton } from '@mui/lab';
import { toast } from 'react-toastify';
import _, { cloneDeep } from 'lodash';
import ToastMsg from 'app/shared-components/ToastMsg';
import classes from './style.module.scss'
import DropzoneFile from 'app/shared-components/Dropzone';
import imageMp4 from 'assets/images/icon/mp4.png'
import imageJpg from 'assets/images/icon/imag.png'
import AutorenewIcon from '@mui/icons-material/Autorenew';
import clsx from 'clsx';
import { ErrorType1, ErrorType2 } from '../constants/types';
import { formatBytes } from '../constants/utils';
import { IGenersItem, IMagazin } from '../store/type';
import PDF from 'assets/svg/PDF.svg'
import { updateVideo, uploadVideo } from '../constants/api';
import moment from 'moment'

const errorsInit = {
    title: '',
    poster: '',
    streamUrl: '',
    publishedDate: '',
    language: '',
    contries: '',
    generes: '',
    publisher: ''
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
    const movieRefrenceData = useDataStore(st => st.movieRefrenceData)
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
                foundedCamera = { ...foundedCamera, publishedDate: +new Date(foundedCamera.publishedDate * 1000).toLocaleDateString('en-US', { year: 'numeric', }) }

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
        navigate('/newspapers/newspapers');
    };

    const handleChangeCameraName: ChangeEventHandler<HTMLInputElement> = (e) => {
        if (!e.target.value) {
            setErrors({ ...errors, title: 'select title' })
        } else {
            setErrors({ ...errors, title: '' })
        }

        setMovie({
            ...movie,
            title: e.target.value
        })
    }
    const handleChangePublishedDate: ChangeEventHandler<HTMLInputElement> = (e) => {

        // console.log(" PublishedDate", e.target.value);
        const dateMoment = moment(e.target.value, 'YYYY-MM-DD', true);
        if (!dateMoment.isValid()) {
            setErrors({ ...errors, publishedDate: 'select PublishedDate' })
        } else {
            setErrors({ ...errors, publishedDate: '' })
        }
        const timestamp = dateMoment.unix();
        // if (!isNaN(+e.target.value) && e.target.value.length < 5) {
        setMovie({
            ...movie,
            publishedDate: timestamp
        })
        // }

    }
    const handleChangePublisherName: ChangeEventHandler<HTMLInputElement> = (e) => {
        if (!e.target.value) {
            setErrors({ ...errors, publisher: 'select publisher' })
        } else {
            setErrors({ ...errors, publisher: '' })
        }

        setMovie({
            ...movie,
            publisher: { name: e.target.value }
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
        if (selectedVideo == null && !editID) {
            temErrors.streamUrl = 'select video'
        }

        if (selectedPoster == null) {
            temErrors.poster = 'select poster'
        }

        if (!movie.title) {
            temErrors.title = 'select title'
        }


        if (!movie.publishedDate) {
            temErrors.year = 'select publishedDate'
        }

        if (!movie.languages.length) {
            temErrors.language = 'select language'
        }

        if (!movie.genres.length) {
            temErrors.genres = 'select genres'
        }
        if (!movie.publisher.name) {
            temErrors.publisher = 'select publisherّ'
        }

        // console.log("Erros temp : ", temErrors)
        setErrors(temErrors)
        // return
        const isError = _.some(temErrors, (value) => value !== '');
        if (!isError) {
            if (!editID) {
                setLoading(true)
                uploadVideo(movie, selectedVideo!, selectedPoster!, (progress) => {
                    setProgress(progress)
                }).then(async res => {
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
                        // console.log("Error", errorData.validationErrors)
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
                }
                )
            } else {
                updateVideo(movie, selectedPoster!, (progress) => {
                    setProgress(progress)
                }).then(async res => {

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

    const handleChangeTag = (newValue) => {
        setMovie({ ...movie, languages: newValue })
        if (!newValue.length) {
            setErrors({ ...errors, language: 'select language' })
        } else {
            setErrors({ ...errors, language: '' })
        }
    }

    const handleChangeGener = (newValue) => {
        const mapped = newValue.map(v =>
            typeof v === 'string'
                ? { title: v }
                : v
        );
        setMovie({ ...movie, genres: mapped })
        if (!newValue.length) {
            setErrors({ ...errors, genres: 'select genres' })
        } else {
            setErrors({ ...errors, genres: '' })
        }
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

    return (
        <Dialog
            open
            fullWidth
            maxWidth={'md'}
            sx={{ height: 'auto', direction: 'ltr !important' }}
        // className={classes.custom}
        // PaperProps={{ className: isSpinning ? classes.customModal : '' }}
        >

            <DialogTitle sx={{ display: 'flex', alignItems: 'center', py: .5, pr: 1, fontSize: '1.4rem' }}>
                <p>
                    {editID ? 'Edit Newspaper' : t('New Newspaper')}
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
                    position: 'relative'
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
                                                {t('Select Pdf')}
                                            </InputLabel>

                                            {
                                                selectedVideo
                                                    ?
                                                    <div className={classes.showFile} >
                                                        <div className={classes.file}>
                                                            <img src={PDF} />
                                                            <div className={classes.fileInfo}>
                                                                <span>{selectedVideo?.name}</span>
                                                                <span>{progress}</span>
                                                            </div>
                                                        </div>
                                                        <Tooltip title='Select New pdf'>
                                                            <IconButton onClick={() => setSelectedVideo(null)}>
                                                                <AutorenewIcon fontSize='small' />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </div>
                                                    :
                                                    <DropzoneFile

                                                        validFormats={['.pdf']}
                                                        style={{
                                                            borderColor: Boolean(errors['streamUrl']) ? 'red' : 'lightgray',
                                                            pointerEvents: editID ? 'none' : 'all',
                                                        }}
                                                        onDropFiles={onDropVideo} />
                                            }

                                        </Stack>
                                        <Stack spacing={0.5} style={{ flex: 3 }}>
                                            <InputLabel >
                                                {t('poster Image')}
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
                                                    <DropzoneFile validFormats={['.png', '.jpg']}
                                                        style={{
                                                            borderColor: Boolean(errors['poster']) ? 'red' : 'lightgray',
                                                            // pointerEvents: editID ? 'none' : 'all',
                                                        }}
                                                        onDropFiles={onDropImage} />
                                            }
                                        </Stack>

                                    </Stack>
                                </Stack>

                                <Stack spacing={1}
                                    direction={'column'}
                                >
                                    <Stack spacing={2}
                                        direction={'row'}
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
                                                // disabled={!isShowCameraInfo}
                                                fullWidth
                                                // helperText={errors?.['name']}
                                                error={Boolean(errors['title'])}
                                            />
                                        </Stack>
                                        <Stack spacing={0.5} style={{ flex: 3 }}>
                                            <InputLabel >
                                                {t('publishedDate')}
                                            </InputLabel>
                                            <TextField
                                                value={moment.unix(movie?.publishedDate).format('YYYY-MM-DD')}
                                                onChange={handleChangePublishedDate}
                                                dir='ltr'
                                                type='date'
                                                size='small'
                                                // disabled={!isShowCameraInfo}
                                                fullWidth
                                                // helperText={errors?.['name']}
                                                error={Boolean(errors['publishedDate'])}
                                            />
                                        </Stack>
                                    </Stack>

                                </Stack>
                                <Stack spacing={1} >

                                    <Stack spacing={3}
                                        direction={'row'}
                                        sx={{ '>div': { flex: 1 } }}>
                                        <Stack spacing={0.5} >
                                            <InputLabel >
                                                {t('Language')}
                                            </InputLabel>
                                            <Autocomplete
                                                multiple
                                                value={movie.languages}
                                                onChange={(_, newValue) => handleChangeTag(newValue)}
                                                options={movieRefrenceData?.languages! ?? []}
                                                size='small'
                                                getOptionLabel={(option) => option}
                                                isOptionEqualToValue={(option, value) => option === value}
                                                sx={{ gap: 1 }}
                                                filterSelectedOptions
                                                 componentsProps={{
                                                    popper: {
                                                        dir: 'ltr'
                                                    }
                                                }}
                                                renderTags={(value, getTagProps) =>
                                                    value.map((option, index: number) => (
                                                        <Chip
                                                            variant="outlined"
                                                            size='small'
                                                            {...getTagProps({ index })}
                                                            key={index}

                                                            label={option}
                                                            sx={{
                                                                mr: 0.5,
                                                                border: theme => `1px solid ${alpha(theme.palette.info.light, 0.6)}`,
                                                                background: (theme) => alpha(theme.palette.info.light, 0.2)
                                                            }}
                                                        />
                                                    ))
                                                }
                                                renderInput={(params) => (
                                                    <TextField
                                                        error={Boolean(errors?.['language'])}
                                                        // helperText={errors?.['tags']}
                                                        {...params}
                                                        size='small'
                                                        placeholder={t("Select Language")}
                                                    />
                                                )}
                                            />
                                        </Stack>
                                    </Stack>

                                    <Stack spacing={3}
                                        direction={'row'}
                                        sx={{ '>div': { flex: 1 } }}>
                                        <Stack spacing={0.5} >
                                            <InputLabel >
                                                {t('Genres')}
                                            </InputLabel>
                                            <Autocomplete
                                                multiple
                                                freeSolo
                                                options={[]}          // عمداً خالی
                                                value={movie?.genres || []}
                                                onChange={(_, newValue) => handleChangeGener(newValue)}
                                                size="small"
                                                filterSelectedOptions
                                                // getOptionLabel={(option) =>
                                                //     typeof option === 'string' ? option : option.name
                                                // }
                                                renderTags={(value, getTagProps) =>
                                                    value.map((option, index) => (
                                                        <Chip
                                                            {...getTagProps({ index })}
                                                            key={index}
                                                            size="small"
                                                            label={option.title}
                                                            sx={{
                                                                mr: 0.5,
                                                                border: theme => `1px solid ${alpha(theme.palette.info.light, 0.6)}`,
                                                                background: (theme) => alpha(theme.palette.info.light, 0.2)
                                                            }}
                                                        />
                                                    ))
                                                }
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        error={Boolean(errors?.genres)}
                                                        size="small"
                                                        placeholder={t("Select Genres")}
                                                    />
                                                )}
                                            />
                                        </Stack>
                                    </Stack>
                                    <Stack spacing={3}
                                        direction={'row'}
                                        sx={{ '>div': { flex: 1 } }}>
                                        <Stack spacing={0.5} >
                                            <InputLabel >
                                                {t('Publisher')}
                                            </InputLabel>

                                            <TextField
                                                value={movie?.publisher.name}
                                                onChange={handleChangePublisherName}
                                                dir='ltr'
                                                size='small'
                                                // disabled={!isShowCameraInfo}
                                                fullWidth
                                                // helperText={errors?.['name']}
                                                error={Boolean(errors['publisher'])}
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