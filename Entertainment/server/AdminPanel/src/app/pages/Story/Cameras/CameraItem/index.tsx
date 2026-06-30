import React, { useState } from 'react'
import classes from './style.module.scss'
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { Chip, Dialog, DialogContent, DialogTitle, Divider, IconButton, Tooltip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ConfirmDialogComponent from 'app/shared-components/ConfirmDialogComponent/index';
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined';
import VideocamOffOutlinedIcon from '@mui/icons-material/VideocamOffOutlined';
import EditIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined'
import useDataStore from '../../store/useDataStore';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import _ from 'lodash';
import { toast } from 'react-toastify';
import ToastMsg from 'app/shared-components/ToastMsg';
import { deleteEpizodApi, deleteSeasonApi, uploadVideoSeries } from '../../constants/api';
import { convertToRelativeTime } from 'app/services/utils/validatorsAndHelpers';
import { ISeries } from '../../store/type';
import TheatersIcon from '@mui/icons-material/Theaters';
import CloseIcon from "@mui/icons-material/Close";
import ErrorComponent from 'app/shared-components/ErrorComponent';
import DropzoneFile from 'app/shared-components/Dropzone';
import imageMp4 from 'assets/images/icon/mp32.png'
import { LoadingButton } from '@mui/lab';
import { ErrorType1 } from '../../constants/types';

interface PropsType {
    movie: ISeries;
}

function MovieListItem(props: PropsType) {
    const { movie } = props
    const { t } = useTranslation("SETTINGS");
    const navigate = useNavigate()
    const insertMovie = useDataStore(st => st.insertMovie);
    const deleteMovie = useDataStore(st => st.deleteMovie);
    const deleteEpisod = useDataStore(st => st.deleteEpisod);
    const setLoadingMsg = useDataStore(st => st.setLoadingMsg);
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [loading, setLoading] = useState(false);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [progress, setProgress] = useState('0 of 0');
    const [selectedPoster, setSelectedPoster] = useState<File | null>(null);


    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    const handleClickAddSeasons = (e) => {
        e.stopPropagation();
        setOpenDialog(true)
    }
    const handleClickEditCamera = (e) => {
        e.stopPropagation();
        navigate('edit/' + movie.id);
        handleCloseMenu()
    }


    const handleClose = () => {
        setOpenDialog(false)
    }


    const handleDeleteCamera = () => {
        setOpenConfirmDialog(false);
       
        deleteSeasonApi(movie.id)
            .then(async () => {
                setLoadingMsg('')
                setOpenConfirmDialog(false);
                document.getElementById(String(movie.id))?.execAnimation('animated zoomOutUp').then(re => {
                    deleteMovie(movie)
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
            })
    }

    const onClickDeleteCamera = (e) => {
        e.stopPropagation();
        setOpenConfirmDialog(true);
        handleCloseMenu()
    }


    const handleUploadFile = () => {
        setLoading(true)
        uploadVideoSeries(selectedPoster!, movie, (progress) => {
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
            insertMovie(res.data)
            setSelectedPoster(null)
        })
            .catch(err => {
                console.log(';og', err)
                setLoading(false)
                toast.error('Error upload video', {
                                style: {
                                    direction: "ltr",
                                    textAlign: "left",
                                }
                            })
            })
    }


    const onDropImage = (files: File[]) => {
        if (!files[0]) return;
        setSelectedPoster(files[0])
        // setErrors({ ...errors, poster: '' })
    }

    const handleDeleteEndItem = (id: string) => {
        setOpenConfirmDialog(false);
        deleteEpizodApi(id)
            .then(res => {
                document.getElementById(String(id))?.execAnimation('animated zoomOutUp').then(re => {
                    deleteEpisod(id)
                })
                toast.success('The operation was successful', {
                                style: {
                                    direction: "ltr",
                                    textAlign: "left",
                                }
                            })
            })
            .catch(err => {
                toast.error('Error deleting episode', {
                                style: {
                                    direction: "ltr",
                                    textAlign: "left",
                                }
                            })
            })

    }

    return (
        <>
            <div className={clsx(classes.cameraListItem, classes.row)}
                id={`${movie.id}`}
            >
                <div className={classes.cell} style={{ textAlign: 'center' }}>
                    {movie.title}
                </div>



                <div className={classes.cell}
                    style={{ textAlign: 'center' }}
                    data-hidden-dashboard>
                    <Tooltip title={
                        movie?.speakers?.map((tag, index) => (
                            <Chip label={tag.name} key={index} />
                        ))
                    }>
                        <div className={classes.tags}>
                            {
                                movie?.speakers?.length &&
                                <Chip label={movie?.speakers[0].name} />
                            }
                        </div>
                    </Tooltip>
                </div>
                <div className={classes.cell}
                    style={{ textAlign: 'center' }}
                    data-hidden-dashboard>
                    <Tooltip title={
                        movie?.languages?.map((tag, index) => (
                            <Chip label={tag} key={index} />
                        ))
                    }>
                        <div className={classes.tags}>
                            {
                                movie?.languages?.length &&
                                <Chip label={movie?.languages[0]} />
                            }
                        </div>
                    </Tooltip>
                </div>

                <div className={classes.cell}
                    style={{ textAlign: 'center' }}
                    data-hidden-dashboard>

                    <Tooltip title={
                        movie.genres.map((tag, index) => (
                            <Chip label={tag} key={index} />
                        ))
                    }>
                        <div className={classes.tags}>
                            {
                                movie.genres.length &&
                                <Chip label={movie.genres[0]} />
                            }
                        </div>
                    </Tooltip>
                </div>


                <div className={classes.cell} data-hidden-dashboard>
                    <IconButton onClick={handleClickAddSeasons} color='info'>
                        <TheatersIcon fontSize="small" />
                    </IconButton>
                </div>
                <div className={classes.cell} data-hidden-dashboard>
                    <IconButton onClick={handleClickEditCamera} color='info'>
                        <EditIcon fontSize="small" />
                    </IconButton>
                </div>
                <div className={classes.cell} data-hidden-dashboard>
                    <IconButton onClick={onClickDeleteCamera}>
                        <DeleteOutlineOutlinedIcon fontSize="small" color='error' />
                    </IconButton>
                </div>
            </div >
            <ConfirmDialogComponent
                onOkClick={handleDeleteCamera}
                message={'Are you sure you want to delete this AudioStory? There is no way to undo it if you delete it'}
                open={openConfirmDialog}
                onClose={() => setOpenConfirmDialog(false)}
            />

            {/* ------------------------------------------------------------------ */}
            <Dialog
                open={openDialog}
                fullWidth
                maxWidth={'sm'}
                sx={{ height: 'auto', direction: 'ltr !important' }}
            // className={classes.custom}
            // PaperProps={{ className: isSpinning ? classes.customModal : '' }}
            >

                <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: .8, pr: 1, fontSize: '1.4rem' }}>
                    <p>
                        {'Episod List'}
                    </p>
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
                        false ?
                            <ErrorComponent
                                error
                                errorMessage={'Failed load list'}
                                style={{ top: '10%', height: '90%' }}
                            />
                            :
                            <div className={classes.container}>
                                <div className={classes.left}>
                                    {
                                        movie?.episodes?.map((episod, index) => (
                                            <div className={classes.item} key={index} id={`${episod.id}`}>
                                                {
                                                    <span>{`${episod?.title}`}</span>
                                                }
                                                <IconButton onClick={() => handleDeleteEndItem(episod.id)}
                                                    disabled={loading}
                                                    sx={{ ml: 'auto', cursor: 'pointer' }}>
                                                    <DeleteOutlineOutlinedIcon color='error' fontSize="small" />
                                                </IconButton>

                                            </div>
                                        ))
                                    }
                                </div>
                                <Divider orientation="vertical" variant="middle" flexItem />
                                <div className={classes.right}>
                                    <div className={classes.up}>
                                        <DropzoneFile validFormats={['.mp3']}
                                            style={{ cursor: loading ? 'not-allowed' : 'pointer', pointerEvents: loading ? 'none' : 'all' }}
                                            // style={{ borderColor: Boolean(errors['poster']) ? 'red' : 'lightgray' }}
                                            onDropFiles={onDropImage} />

                                    </div>
                                    <div className={classes.down}>
                                        {
                                            selectedPoster
                                            // true
                                            &&
                                            <>
                                                <div className={classes.showFile} >
                                                    <div className={classes.file}>
                                                        <img src={imageMp4} />
                                                        <div className={classes.fileInfo}>
                                                            <span>{selectedPoster?.name}</span>
                                                            {/* <span>{'gggggggggggggggggggggggggggggggggggggggggg'}</span> */}
                                                            <span>{progress}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className={classes.action}>
                                                    <LoadingButton sx={{ width: '100%' }}
                                                        onClick={handleUploadFile}
                                                        color='success'
                                                        variant='contained'
                                                        size='small'
                                                        disabled={false}
                                                        loading={loading}
                                                    >
                                                        {'Upload'}
                                                    </LoadingButton>
                                                </div>
                                            </>
                                        }
                                    </div>
                                </div>
                            </div>
                    }
                </DialogContent>
            </Dialog >
        </>
    )
}

export default MovieListItem