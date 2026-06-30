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
    _CameraRules, createMovie_Schema, dataValidator,
    isRTSP, validateName
} from 'app/services/utils/validatorsAndHelpers';
import ErrorComponent from 'app/shared-components/ErrorComponent';
import { LoadingButton } from '@mui/lab';
import { toast } from 'react-toastify';
import _, { cloneDeep } from 'lodash';
import ToastMsg from 'app/shared-components/ToastMsg';
import { uploadVideo, updateVideo } from '../constants/api';
import classes from './style.module.scss'
import { IMovie } from 'app/services/utils/public_types';
import DropzoneFile from 'app/shared-components/Dropzone';
import imageMp4 from 'assets/images/icon/mp4.png'
import imageJpg from 'assets/images/icon/imag.png'
import AutorenewIcon from '@mui/icons-material/Autorenew';
import clsx from 'clsx';
import { ErrorType1, ErrorType2 } from '../constants/types';
import { formatBytes } from '../constants/utils';
import moment from 'moment';





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

function MovieEditModal() {
    const { t } = useTranslation("SETTINGS");
    const params = useParams()
    const editID = params['id']
    const navigate = useNavigate();
    const MovieFirstValue = useRef<IMovie>();
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
    const [movie, setMovie] = useState<IMovie>(createMovie_Schema())
    const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
    const [selectedPoster, setSelectedPoster] = useState<File | null>(null);
    const [genres, setGenres] = useState<string[]>([]);
    const [progress, setProgress] = useState('0 of 0');
    const isErrors = _.some(errors, (value) => value !== '' && value !== undefined);

    // console.log('currentError : ', movie)

    useEffect(() => {
        // getGenerList().then(res => {
        //     setGenres(res.data)
        // })
    }, [])

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
            const cameraTemplate = createMovie_Schema()
            setMovie(cameraTemplate)
        }
    }, [loadingMovieList]);

    const handleClose = () => {
        navigate('/movies/movies');
    };


    const handleChangeCameraName: ChangeEventHandler<HTMLInputElement> = (e) => {
        // const tempName = e.target.value.replace(' ', '_')
        // const newName = tempName;
        // const searchId = editID ? +editID : '';
        // const allNames = _.map(movieList.filter(p => p.rtspId !== searchId), 'name');

        // setErrors(preValues => ({
        //     ...preValues,
        //     name: validateName(newName) ? t(validateName(newName)) : allNames.includes(newName) ? t('CAMERA_NAME_DUPLICATED') : ''
        // }))

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
    const handleChangeImdb: ChangeEventHandler<HTMLInputElement> = (e) => {
        const regex = /^(?:[0-9]|10)(?:\.[0-9]*)?$/;

        if (!e.target.value || !regex.test(e.target.value)) {
            setErrors({ ...errors, imdb: 'select imdb' })
        } else {
            setErrors({ ...errors, imdb: '' })
        }
        // if (regex.test(e.target.value))
        setMovie({
            ...movie,
            imdbRating: e.target.value
        })
    }
    const handleChangeAge: ChangeEventHandler<HTMLInputElement> = (e) => {
        const regex = /^\d{2}$/;

        if (!e.target.value || !regex.test(e.target.value)) {
            setErrors({ ...errors, age: 'select age' })
        } else {
            setErrors({ ...errors, age: '' })
        }
        setMovie({
            ...movie,
            ageGroup: e.target.value
        })
    }
    const handleChangePublished: ChangeEventHandler<HTMLInputElement> = (e) => {
        const regex = /^\d{4}$/;

        if (!e.target.value || !regex.test(e.target.value) || !(+e.target.value <= +new Date().getFullYear())) {
            setErrors({ ...errors, year: 'select year' })
        } else {
            setErrors({ ...errors, year: '' })
        }
        setMovie({
            ...movie,
            publishedDate: e.target.value
        })
    }
    const handleChangeDescription: ChangeEventHandler<HTMLInputElement> = (e) => {
        if (!e.target.value) {
            setErrors({ ...errors, description: 'select description' })
        } else {
            setErrors({ ...errors, description: '' })
        }
        setMovie({
            ...movie,
            description: e.target.value
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
            temErrors.video = 'select video'
        }

        if (selectedPoster == null && !editID) {
            temErrors.poster = 'select poster'
        }

        if (!movie.title) {
            temErrors.title = 'select title'
        }

        if (!movie.description) {
            temErrors.description = 'select description'
        }
        if (!movie.imdbRating) {
            temErrors.imdb = 'select impd'
        }
        if (!movie.ageGroup) {
            temErrors.age = 'select age'
        }
        if (!movie.publishedDate) {
            temErrors.year = 'select publishedDate'
        }

        if (!movie.language.length) {
            temErrors.language = 'select language'
        }
        if (!movie.countries.length) {
            temErrors.countries = 'select countries'
        }
        if (!movie.genres.length) {
            temErrors.genres = 'select genres'
        }
        if (!movie.directors.length) {
            temErrors.directors = 'select directors'
        }
        if (!movie.actors.length) {
            temErrors.actors = 'select actors'
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
                }).then(res => {
                    insertMovie(res.data)
                    setLoading(false)
                    handleClose()
                    toast.success('The operation was successful', {
                        style: {
                            direction: "ltr",
                            textAlign: "left",
                        }
                    })

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
                        console.log("Error", errorData)
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
                updateVideo(movie).then(res => {
                    insertMovie(res.data)
                    setLoading(false)
                    toast.success('The operation was successful', {
                        style: {
                            direction: "ltr",
                            textAlign: "left",
                        }
                    })
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
        setMovie({ ...movie, language: newValue })
        if (!newValue.length) {
            setErrors({ ...errors, language: 'select language' })
        } else {
            setErrors({ ...errors, language: '' })
        }
    }
    const handleChangeContries = (newValue) => {
        setMovie({ ...movie, countries: newValue })
        if (!newValue.length) {
            setErrors({ ...errors, countries: 'select countries' })
        } else {
            setErrors({ ...errors, countries: '' })
        }
    }

    const handleChangeGener = (newValue) => {

        setMovie({ ...movie, genres: newValue })
        if (!newValue.length) {
            setErrors({ ...errors, genres: 'select genres' })
        } else {
            setErrors({ ...errors, genres: '' })
        }
    }
    const handleChangeActors = (newValue) => {
        // console.log('Log',newValue);

        const mapped = newValue.map(v =>
            typeof v === 'string'
                ? { name: v, imagePath: '' }
                : v
        );
        setMovie({ ...movie, actors: mapped })
        if (!newValue.length) {
            setErrors({ ...errors, actors: 'select actors' })
        } else {
            setErrors({ ...errors, actors: '' })
        }
    }
    const handleChangeDirectors = (newValue) => {
        // console.log('Log',newValue);

        const mapped = newValue.map(v =>
            typeof v === 'string'
                ? { name: v, imagePath: '' }
                : v
        );
        setMovie({ ...movie, directors: mapped })
        if (!newValue.length) {
            setErrors({ ...errors, directors: 'select directors' })
        } else {
            setErrors({ ...errors, directors: '' })
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
                    {editID ? 'Edit Movie' : t('New movie')}
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
                                                {t('Select video')}
                                            </InputLabel>

                                            {
                                                selectedVideo
                                                    ?
                                                    <div className={classes.showFile} >
                                                        <div className={classes.file}>
                                                            <img src={imageMp4} />
                                                            <div className={classes.fileInfo}>
                                                                <span>{selectedVideo?.name}</span>
                                                                <span>{progress}</span>
                                                            </div>
                                                        </div>
                                                        <Tooltip title='Select New video'>
                                                            <IconButton onClick={() => setSelectedVideo(null)}>
                                                                <AutorenewIcon fontSize='small' />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </div>
                                                    :
                                                    <DropzoneFile

                                                        validFormats={['.mp4']}
                                                        style={{
                                                            borderColor: Boolean(errors['video']) ? 'red' : 'lightgray',
                                                            pointerEvents: editID ? 'none' : 'all',
                                                        }}
                                                        onDropFiles={onDropVideo} />
                                            }

                                        </Stack>
                                        <Stack spacing={0.5} style={{ flex: 3 }}>
                                            <InputLabel >
                                                {t('Poster Image')}
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
                                        <Stack spacing={0.5} style={{ flex: 1 }}>
                                            <InputLabel >
                                                {t('Imdb Rating')}
                                            </InputLabel>
                                            <TextField
                                                value={movie?.imdbRating}
                                                onChange={handleChangeImdb}
                                                dir='ltr'
                                                size='small'
                                                fullWidth

                                                // helperText={errors?.['fps']}
                                                error={Boolean(errors['imdb'])}

                                            />
                                        </Stack>

                                        <Stack spacing={0.5} style={{ flex: 1 }}>
                                            <InputLabel >
                                                {t('Age Group')}
                                            </InputLabel>
                                            <TextField
                                                value={movie?.ageGroup}
                                                onChange={handleChangeAge}
                                                dir='ltr'
                                                size='small'
                                                fullWidth
                                                // helperText={errors?.['height']}
                                                error={Boolean(errors['age'])}
                                                placeholder=''
                                                sx={{
                                                    '& .MuiFormHelperText-root': {
                                                        direction: 'ltr',
                                                    }
                                                }}
                                                inputProps={{
                                                    readOnly: isShowCameraInfo
                                                }}
                                            />
                                        </Stack>
                                        <Stack spacing={0.5} style={{ flex: 1 }}>
                                            <InputLabel >
                                                {t('Published Years')}
                                            </InputLabel>
                                            <TextField
                                                value={movie?.publishedDate}
                                                onChange={handleChangePublished}
                                                dir='ltr'
                                                size='small'
                                                fullWidth
                                                // helperText={errors?.['width']}
                                                error={Boolean(errors['year'])}
                                                placeholder=''
                                                sx={{
                                                    '& .MuiFormHelperText-root': {
                                                        direction: 'ltr',
                                                    }
                                                }}
                                            />
                                        </Stack>
                                    </Stack>
                                    <Stack spacing={0.5} style={{ flex: 1 }}>
                                        <InputLabel >
                                            {t('Description')}
                                        </InputLabel>
                                        <TextField
                                            value={movie?.description}
                                            onChange={handleChangeDescription}
                                            dir='ltr'
                                            size='small'
                                            multiline
                                            rows={3}
                                            fullWidth
                                            // disabled={!!editID}
                                            // helperText={errors?.['url']}
                                            error={Boolean(errors['description'])}
                                            // placeholder='rtsp//:user:pass@ip:port'
                                            sx={{
                                                '& .MuiFormHelperText-root': {
                                                    direction: 'ltr',
                                                }
                                            }}
                                        // inputProps={{
                                        //     readOnly: !!editID
                                        // }}

                                        />
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
                                                value={movie.language}
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
                                                        placeholder={t("Select language")}
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
                                                {t('Contries')}
                                            </InputLabel>
                                            <Autocomplete
                                                multiple
                                                value={movie?.countries}
                                                onChange={(_, newValue) => handleChangeContries(newValue)}
                                                options={movieRefrenceData?.countries! ?? []}
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
                                                        error={Boolean(errors?.['countries'])}
                                                        // helperText={errors?.['tags']}
                                                        {...params}
                                                        size='small'
                                                        placeholder={t("Select Contries")}
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
                                                options={movieRefrenceData?.genres! ?? []}          // عمداً خالی
                                                value={movie?.genres || []}
                                                onChange={(_, newValue) => handleChangeGener(newValue)}
                                                size="small"
                                                getOptionLabel={(option) => option ?? option}
                                                isOptionEqualToValue={(option, value) => option === value}
                                                filterSelectedOptions
                                                 componentsProps={{
                                                    popper: {
                                                        dir: 'ltr'
                                                    }
                                                }}
                                                renderTags={(value, getTagProps) =>
                                                    value.map((option, index) => (
                                                        <Chip
                                                            {...getTagProps({ index })}
                                                            key={index}
                                                            size="small"
                                                            label={option ?? option}
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
                                                        error={Boolean(errors?.['genres'])}
                                                        // helperText={errors?.['tags']}
                                                        {...params}
                                                        size='small'
                                                        placeholder={t("Select genre list or Type genre ,Press Enter")}
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
                                                {t('Directors')}
                                            </InputLabel>

                                            <Autocomplete
                                                multiple
                                                freeSolo
                                                options={[]}          // عمداً خالی
                                                value={movie?.directors || []}
                                                onChange={(_, newValue) => handleChangeDirectors(newValue)}
                                                size="small"
                                                filterSelectedOptions
                                                 componentsProps={{
                                                    popper: {
                                                        dir: 'ltr'
                                                    }
                                                }}
                                                renderTags={(value, getTagProps) =>
                                                    value.map((option, index) => (
                                                        <Chip
                                                            {...getTagProps({ index })}
                                                            key={index}
                                                            size="small"
                                                            label={option.name}
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
                                                        error={Boolean(errors?.['directors'])}
                                                        size="small"
                                                        placeholder="Type name director,press enter"
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
                                                {t('Actors')}
                                            </InputLabel>
                                            <Autocomplete
                                                multiple
                                                freeSolo
                                                options={[]}          // عمداً خالی
                                                value={movie?.actors || []}
                                                onChange={(_, newValue) => handleChangeActors(newValue)}
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
                                                            label={option.name}
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
                                                        error={Boolean(errors?.['actors'])}
                                                        size="small"
                                                        placeholder="Type name actor,press enter"
                                                    />
                                                )}
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