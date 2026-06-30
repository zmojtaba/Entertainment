import React, { useState } from 'react'
import classes from './style.module.scss'
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { Chip, IconButton, Tooltip } from '@mui/material';
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
import { convertToRelativeTime } from 'app/services/utils/validatorsAndHelpers';
import { IMagazin } from '../../store/type';
import { setLoading } from 'app/store/core/loadingSlice';
import { ErrorType1 } from '../../constants/types';
import { deleteMagazinResource } from '../../constants/api';
import moment from 'moment'

interface PropsType {
    movie: IMagazin;
}

function MovieListItem(props: PropsType) {
    const { movie } = props
    const { t } = useTranslation("SETTINGS");
    const navigate = useNavigate()
    const insertMovie = useDataStore(st => st.insertMovie);
    const deleteMovie = useDataStore(st => st.deleteMovie);
    const setLoadingMsg = useDataStore(st => st.setLoadingMsg);
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
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


    const handleDeleteCamera = () => {

        setOpenConfirmDialog(false);
        setLoading(true)
        deleteMagazinResource(movie.id)
            .then(async () => {
                setOpenConfirmDialog(false);
                setLoading(false)
                document.getElementById(String(movie.id))?.execAnimation('animated zoomOutUp').then(re => {
                    deleteMovie(movie)
                })
                toast.success('The operation was successful', {
                            style: {
                                direction: "ltr",
                                textAlign: "left",
                            }
                        })
            }).catch(err => {
                console.log('err', err);

                setLoading(false)

                if (err.code == 'ERR_NETWORK' || err.code == 'ERR_BAD_REQUEST') {
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
                                <Chip label={movie.languages[0]} />
                            }
                        </div>
                    </Tooltip>
                </div>

                <div className={classes.cell}
                    style={{ textAlign: 'center' }}
                    data-hidden-dashboard>
                    <Tooltip title={

                        movie?.genres?.map((tag, index) => (
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

                <div className={classes.cell} style={{ textAlign: 'center' }}>
                    {moment.unix(movie?.publishedDate).format('MM-DD-YYYY')}
                </div>


                <div className={classes.cell}
                    style={{ textAlign: 'center' }}
                    data-hidden-dashboard>
                    <div className={classes.tags}>
                        <Chip label={movie?.publisher?.name} />
                    </div>
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
                message={t('Are you sure you want to delete this magazin? There is no way to undo it if you delete it')}
                open={openConfirmDialog}
                onClose={() => setOpenConfirmDialog(false)}
            />
        </>
    )
}

export default MovieListItem