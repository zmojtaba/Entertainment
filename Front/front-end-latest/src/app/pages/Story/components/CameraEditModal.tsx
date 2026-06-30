import {
    alpha, Autocomplete, Chip, Dialog, DialogActions, DialogContent,
    DialogTitle, IconButton, InputLabel, Stack,
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
    _CameraRules, createMovie_Schema, createSeries_Schema, dataValidator,
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
import { createAlbum_Schema, formatBytes } from '../constants/utils';
import { ISeries } from '../store/type';

const errorsInit = {
    title: '',
    poster: '',
    streamUrl: '',
    description: '',
    age: '',
    publishedDate: '',
    language: '',
    contries: '',
    genres: '',
    speaker: ''
}

function MovieEditModal() {
    const { t } = useTranslation("SETTINGS");
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
    const [movie, setMovie] = useState<ISeries>(createAlbum_Schema())
    const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
    const [selectedPoster, setSelectedPoster] = useState<File | null>(null);
    const [genres, setGenres] = useState<string[]>([]);
    const [progress, setProgress] = useState('0 of 0');
    const isErrors = _.some(errors, (value) => value !== '' && value !== undefined);

    // console.log('currentError : ', isErrors)

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
            const cameraTemplate = createAlbum_Schema()
            setMovie(cameraTemplate)
        }
    }, [loadingMovieList]);

    const handleClose = () => {
        navigate('/storys/storys');
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




    const handleChangeURL: ChangeEventHandler<HTMLInputElement> = (e) => {
        // const url = e.target.value
        // setCamera({ ...camera, url });
        // const newErrors = dataValidator({ url }, _CameraRules, t);
        // setErrors({ ...errors, ...newErrors })
        // setIsShowCameraInfo(false)
    }

    const handleSaveCamera = () => {
        let temErrors: Record<string, string> = cloneDeep(errors);

        if (selectedPoster == null) {
            temErrors.poster = 'select poster'
        }
        // if (selectedVideo == null) {
        //     temErrors.video = 'select video'
        // }

        if (!movie.title) {
            temErrors.title = 'select title'
        }


        if (!movie.languages.length) {
            temErrors.language = 'select language'
        }

        if (!movie.genres.length) {
            temErrors.genres = 'select genres'
        }

        if (!movie.description) {
            temErrors.description = 'select description'
        }

        if (!movie.ageGroup) {
            temErrors.age = 'select age'
        }

        if (!movie?.speakers?.length) {
            temErrors.speaker = 'select speakers'
        }

        // console.log("Erros temp : ", temErrors)
        setErrors(temErrors)
        // return
        const isError = _.some(temErrors, (value) => value !== '');
        if (!isError) {
            setLoading(true)
            if (!editID) {
                uploadVideo(movie, selectedPoster!, (progress) => {
                    setProgress(progress)
                }).then(res => {
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
                        toast.error('Connection to the server is not established', {
                                style: {
                                    direction: "ltr",
                                    textAlign: "left",
                                }
                            })
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
                setLoading(true)
                updateVideo(movie, selectedPoster!).then(res => {
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

        // let errors = dataValidator({
        //     ...camera,
        // }, _CameraRules, t)

        // let haveError = _(errors).values().filter().value().length
        // // console.log("_(errors).values().filter().value().length", errors)

        // if (haveError) {
        //     setErrors(errors)
        //     toast.warn<string>(t('INSERT_CORRECT_VALUES'))
        //     return
        // }
        // if (_.isEqual(MovieFirstValue.current, camera)) {
        //     toast.warn<string>(t('CAMERA_PARAMS_NOT_CHANGED'))
        //     return
        // }

        // const sendCamera = _.cloneDeep(camera)
        // setErrors(errorsInit)
        // // console.log("editID", editID)
        // // console.log("editID", sendCamera)
        // if (!editID) {
        //     //@ts-ignore
        //     sendCamera.id = null
        //     //@ts-ignore
        //     sendCamera.rtspId = null
        // }
        // setLoading(true)
        // insertCameraResource(sendCamera)
        //     .then(async (res) => {
        //         await window.wait()
        //         setIsShowCameraInfo(true)
        //         // console.log('ergggggggggggggggggggggggggr', res.data)
        //         insertMovie(res.data)
        //         toast.success<string>(t(editID ? 'CHANGE_SAVED_SUCCESSFULLY' : 'NEW_CAMERA_SUCCESSFULLY_ADDED'));
        //         setLoading(false);
        //         MovieFirstValue.current = sendCamera

        //         setCamera(res.data)
        //         setIsSpinning(true)
        //         // if (!editID) {
        //         //     handleClose();
        //         // }
        //     }).catch(err => {
        //         setIsShowCameraInfo(false)
        //         // console.log('ergggggggggggggggggggggggggr', err)
        //         let errorMsg = err?.response?.data[0]?.error as string
        //         // console.log("errr/o", errorMsg.replaceAll(' ', '_').replace('.', '').toLocaleUpperCase().toString());
        //         // console.log("errro", errorMsg.replaceAll(' ', '_').replace('.', ''));
        //         // console.log("errror Now", errorMsg.replaceAll(' ', '_').replace('.', '').toLocaleUpperCase().toString());

        //         setLoading(false);
        //         toast.error(<ToastMsg msg={t(errorMsg.replaceAll(' ', '_').replace('.', '').toLocaleUpperCase().toString())} code={err.response.status} />)
        //     })
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
        // const mapped = newValue.map(v =>
        //     typeof v === 'string'
        //         ? { title: v }
        //         : v
        // );
        setMovie({ ...movie, genres: newValue })
        if (!newValue.length) {
            setErrors({ ...errors, genres: 'select genres' })
        } else {
            setErrors({ ...errors, genres: '' })
        }
    }

    const handleChangeAge: ChangeEventHandler<HTMLInputElement> = (e) => {
        const regex = /^([1-9][0-9]?|100)$/;

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

    const handleChangePublisherName: ChangeEventHandler<HTMLInputElement> = (e) => {
        if (!e.target.value) {
            setErrors({ ...errors, singer: 'select singer' })
        } else {
            setErrors({ ...errors, singer: '' })
        }

        // setMovie({
        //     ...movie,
        //     singer: { name: e.target.value }
        // })
    }
    const handleChangeActors = (newValue) => {
        // console.log('Log',newValue);

        const mapped = newValue.map(v =>
            typeof v === 'string'
                ? { name: v, imagePath: '' }
                : v
        );
        setMovie({ ...movie, speakers: mapped })
        if (!newValue.length) {
            setErrors({ ...errors, speaker: 'select actors' })
        } else {
            setErrors({ ...errors, speaker: '' })
        }
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
                    {editID ? 'Edit Audio Story' : t('New Audio Story')}
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
                    minHeight: '160px'
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
                                                {t('Dont Select')}
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
                                                        validFormats={[editID ? 'NONE' : '.mp3']}
                                                        style={{
                                                            borderColor: Boolean(errors['video']) ? 'red' : 'lightgray',
                                                            pointerEvents: 'none'
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
                                                            // pointerEvents: editID ? 'none' : 'all'
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
                                        inputProps={{
                                            readOnly: !!editID
                                        }}

                                    />
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
                                                {t('Genres')}
                                            </InputLabel>
                                            <Autocomplete
                                                multiple
                                                freeSolo
                                                options={movieRefrenceData?.genres! ?? []}
                                                value={movie?.genres || []}
                                                onChange={(_, newValue) => handleChangeGener(newValue)}
                                                size="small"
                                                getOptionLabel={(option) => option ?? option}
                                                isOptionEqualToValue={(option, value) => option === value}
                                                filterSelectedOptions
                                                renderTags={(value, getTagProps) =>
                                                    value.map((option, index) => (
                                                        <Chip
                                                            {...getTagProps({ index })}
                                                            key={index}
                                                            size="small"
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
                                                {t('Speakers')}
                                            </InputLabel>
                                            <Autocomplete
                                                multiple
                                                freeSolo
                                                options={[]}          // عمداً خالی
                                                value={movie?.speakers || []}
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
                                                        error={Boolean(errors?.['speaker'])}
                                                        size="small"
                                                        placeholder="Type name Speaker,press Enter"
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