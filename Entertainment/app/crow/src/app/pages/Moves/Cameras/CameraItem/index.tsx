import React, { useState } from 'react'
import classes from './style.module.scss'
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { Chip, IconButton, Tooltip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ConfirmDialogComponent from 'app/shared-components/ConfirmDialogComponent/index';
import EditIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import PlayArrowOutlined from '@mui/icons-material/PlayArrowOutlined';
import Pause from '@mui/icons-material/Pause';
// import Pause from '@mui/icons-material/Pause';
import useDataStore from '../../store/useDataStore';
import _ from 'lodash';
import { toast } from 'react-toastify';
import { deleteMovieResource, playAudioApi, stopAudioApi } from '../../constants/api';
import { IMovie } from 'app/services/utils/public_types';
import LoadingComponent from 'app/shared-components/LoadingComponent';
import { ErrorType1 } from '../../constants/types';
import { ICrew } from '../../store/type';

interface PropsType {
    movie: ICrew;
}

function MovieListItem(props: PropsType) {
    const { movie } = props
    const { t } = useTranslation("SETTINGS");
    const navigate = useNavigate()
    const insertMovie = useDataStore(st => st.insertMovie);
    const deleteMovie = useDataStore(st => st.deleteMovie);
    const setLoadingMsg = useDataStore(st => st.setLoadingMsg);
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [loading, setLoading] = useState(false);
    const [played, setPlayed] = useState(false);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const open = Boolean(anchorEl);


    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    const handleClickEditCamera = (e) => {
        e.stopPropagation();
        navigate('edit/' + movie.id);
        handleCloseMenu()
    }
    const handleClickPlay = (e) => {
        e.stopPropagation();
        setLoading(true)
        playAudioApi(movie.id)
            .then(async () => {
                setPlayed(true)
                setLoading(false)
                toast.success('The operation was successful',{
                                        style: {
                                            direction: "ltr",
                                            textAlign: "left",
                                        }
                                    })
            }).catch(err => {
                setPlayed(false)
                setLoading(false)
                if (err.code == 'ERR_NETWORK' || err.code == 'ERR_BAD_REQUEST') {
                    toast.error('Connection to the server is not established',{
                                        style: {
                                            direction: "ltr",
                                            textAlign: "left",
                                        }
                                    })
                } else if (err.response) {

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
                    // toast.error('Connection to the server is not established')
                } else {
                    toast.error('Unknown error',{
                                        style: {
                                            direction: "ltr",
                                            textAlign: "left",
                                        }
                                    })
                }
            })
    }
    const handleClickStop = (e) => {
        e.stopPropagation();
        setLoading(true)
        stopAudioApi(movie.id)
            .then(async () => {
                setPlayed(false)
                setLoading(false)
                toast.success('The operation was successful',{
                                        style: {
                                            direction: "ltr",
                                            textAlign: "left",
                                        }
                                    })
            }).catch(err => {
                setPlayed(false)
                setLoading(false)
                if (err.code == 'ERR_NETWORK' || err.code == 'ERR_BAD_REQUEST') {
                    toast.error('Connection to the server is not established',{
                                        style: {
                                            direction: "ltr",
                                            textAlign: "left",
                                        }
                                    })
                } else if (err.response) {

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
                    // toast.error('Connection to the server is not established')
                } else {
                    toast.error('Unknown error',{
                                        style: {
                                            direction: "ltr",
                                            textAlign: "left",
                                        }
                                    })
                }
            })
    }

    const handleDeleteCamera = () => {
        setOpenConfirmDialog(false);
        setLoading(true)
        deleteMovieResource(movie.id)
            .then(async () => {
                setOpenConfirmDialog(false);
                setLoading(false)
                document.getElementById(String(movie.id))?.execAnimation('animated zoomOutUp').then(re => {
                    deleteMovie(movie)
                })
                toast.success('The operation was successful',{
                                        style: {
                                            direction: "ltr",
                                            textAlign: "left",
                                        }
                                    })
            }).catch(err => {
                // console.log('err',err);

                setLoading(false)

                if (err.code == 'ERR_NETWORK' || err.code == 'ERR_BAD_REQUEST') {
                    toast.error('Connection to the server is not established',{
                                        style: {
                                            direction: "ltr",
                                            textAlign: "left",
                                        }
                                    })
                } else if (err.response) {

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
                    // toast.error('Connection to the server is not established')
                } else {
                    toast.error('Unknown error',{
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

    return (
        <>
            <div className={clsx(classes.cameraListItem, classes.row)}
                id={`${movie.id}`}
            >

                <div className={classes.cell} style={{ textAlign: 'center' }}>
                    {movie.title}
                </div>
                <div className={classes.cell} style={{ textAlign: 'center' }}>
                    {movie.country}
                </div>
                <div className={classes.cell} style={{ textAlign: 'center' }}>
                    {movie.city}
                </div>


                <div className={classes.cell} data-hidden-dashboard>
                    {
                        played ?
                            <IconButton onClick={handleClickStop} color='info'>
                                <Pause fontSize="small" />
                            </IconButton>
                            :
                            <IconButton onClick={handleClickPlay} color='info'>
                                <PlayArrowOutlined fontSize="small" />
                            </IconButton>
                    }
                </div>
                {/* <div className={classes.cell} data-hidden-dashboard>
                    <IconButton onClick={handleClickEditCamera} color='info'>
                        <EditIcon fontSize="small" />
                    </IconButton>
                </div> */}
                <div className={classes.cell} data-hidden-dashboard>
                    <IconButton onClick={onClickDeleteCamera}>
                        <DeleteOutlineOutlinedIcon fontSize="small" color='error' />
                    </IconButton>
                </div>
            </div >
            <ConfirmDialogComponent
                onOkClick={handleDeleteCamera}
                message={t('DELETE_CAMERA_CONFIRM_MSG')}
                open={openConfirmDialog}
                onClose={() => setOpenConfirmDialog(false)}
            />
            <LoadingComponent
                loading={loading}
                message={'.We are performing an operation, please wait'}
            />
        </>
    )
}

export default MovieListItem