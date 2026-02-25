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
import { deleteResource } from '../../constants/api';
import { ErrorType1 } from '../../constants/types';

interface PropsType {
    movie: IMagazin;
}

function MovieListItem(props: PropsType) {
    const { movie } = props
    const { t } = useTranslation("SETTINGS");
    const navigate = useNavigate()
    const deleteMovie = useDataStore(st => st.deleteMovie);
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
        setLoading(true)
        setOpenConfirmDialog(false);
        deleteResource(movie.id).then(async res => {
            await window.wait()
            document.getElementById(String(movie.id))?.execAnimation('animated zoomOutUp').then(re => {
                deleteMovie(movie)
            })
        }).catch(err => {
            if (err.code == 'ERR_NETWORK') {
                toast.error('Connection to the server is not established')
            } else if (err.response) {
                const errorData: ErrorType1 = err.response.data
                // console.log("Error", errorData.validationErrors)
                if (errorData.validationErrors) {
                    toast.error(errorData.validationErrors.at(-1)?.errorMessage)
                } else {
                    toast.error(errorData.detail)
                }
                // toast.error('Connection to the server is not established')
            } else {
                toast.error('Unknown error')
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
                        movie?.language?.map((tag, index) => (
                            <Chip label={tag} key={index} />
                        ))
                    }>
                        <div className={classes.tags}>
                            {
                                movie?.language?.length &&
                                <Chip label={movie.language[0]} />
                            }
                        </div>
                    </Tooltip>
                </div>

                <div className={classes.cell}
                    style={{ textAlign: 'center' }}
                    data-hidden-dashboard>
                    <Tooltip title={
                        movie?.genres?.map((tag, index) => (
                            <Chip label={tag.title ??tag} key={index} />
                        ))
                    }>
                        <div className={classes.tags}>
                            {
                                movie.genres.length &&
                                <Chip label={movie.genres[0].title ?? movie.genres[0]} />
                            }
                        </div>
                    </Tooltip>
                </div>

                <div className={classes.cell}
                    style={{ textAlign: 'center' }}
                    data-hidden-dashboard>
                    <div className={classes.tags}>
                        <Chip label={movie?.singer?.name} />
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
                message={t('Are you sure you want to delete this Track? There is no way to undo it if you delete it')}
                open={openConfirmDialog}
                onClose={() => setOpenConfirmDialog(false)}
            />
        </>
    )
}

export default MovieListItem