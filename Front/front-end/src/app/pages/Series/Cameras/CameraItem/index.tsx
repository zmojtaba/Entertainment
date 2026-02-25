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
import { ISeries } from '../../store/type';
import TheatersIcon from '@mui/icons-material/Theaters';
import { deleteSeriesApi } from '../../constants/api';

interface PropsType {
    movie: ISeries;
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

    const handleClickAddSeasons = (e) => {
        e.stopPropagation();
        navigate('seasons/' + movie.id);
        handleCloseMenu()
    }
    const handleClickEditCamera = (e) => {
        e.stopPropagation();
        navigate('edit/' + movie.id);
        handleCloseMenu()
    }


    const handleDeleteCamera = () => {
        // setOpenConfirmDialog(false);
        // document.getElementById(String(movie.id))?.execAnimation('animated zoomOutUp').then(re => {
        //     deleteMovie(movie)
        // })
        setLoadingMsg('PLEASE_WAIT')
        deleteSeriesApi(movie.id)
            .then(async () => {
                setLoadingMsg('')
                setOpenConfirmDialog(false);
                document.getElementById(String(movie.id))?.execAnimation('animated zoomOutUp').then(re => {
                    deleteMovie(movie)
                })
            }).catch(err => {
                let convertMessage = ''
                if (err.response) {
                    convertMessage = (err.response.data as string).replace('.', '').replaceAll(' ', '_').toLocaleUpperCase()
                } else {
                    convertMessage = err.message
                }
                toast.error(
                    <ToastMsg
                        msg={t(convertMessage)}
                    />);
                setLoadingMsg('')
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

                <Tooltip title={movie.description}>
                    <div className={classes.cell} >
                        {movie.description?.slice(0, 30)}
                        {movie.description?.length > 30 && '...'}
                    </div>
                </Tooltip>
                <div className={classes.cell} style={{ textAlign: 'center' }}>
                    {`${movie.imdbRating} `}
                </div>

                <div className={clsx(classes.cell, classes.direction)} style={{ textAlign: 'center' }} data-hidden-dashboard>
                    {movie.ageGroup}
                </div>

                <div className={classes.cell}
                    style={{ textAlign: 'center' }}
                    data-hidden-dashboard>
                    <Tooltip title={
                        movie?.language?.map((tag, index) => (
                            <Chip label={tag} key={index} />
                        ))
                    }>
                        <div className={classes.tags}>
                            {
                                movie?.language?.length &&
                                <Chip label={movie?.language[0]} />
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
                message={t('DELETE_CAMERA_CONFIRM_MSG')}
                open={openConfirmDialog}
                onClose={() => setOpenConfirmDialog(false)}
            />
        </>
    )
}

export default MovieListItem