import React, { useState } from 'react'
import classes from './style.module.scss'
import clsx from 'clsx';
import { IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ConfirmDialogComponent from 'app/shared-components/ConfirmDialogComponent/index';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import useDataStore from '../../store/useDataStore';
import _ from 'lodash';
import { toast } from 'react-toastify';
import { deleteMovieResource } from '../../constants/api';
import LoadingComponent from 'app/shared-components/LoadingComponent';
import { ErrorType1 } from '../../constants/types';

interface PropsType {
    genre: string;
}

function MovieListItem(props: PropsType) {
    const { genre } = props
    const deleteMovie = useDataStore(st => st.deleteMovie);
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [loading, setLoading] = useState(false);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    // console.log('genredddddddddddddddddddddddd', genre);
    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    const handleDeleteCamera = () => {
        setOpenConfirmDialog(false);
        setLoading(true)
        deleteMovieResource(genre)
            .then(async () => {
                await window.wait()
                setLoading(false)
                document.getElementById(String(genre))?.execAnimation('animated zoomOutUp').then(re => {
                    deleteMovie(genre)
                })
                toast.success('The operation was successful', {
                    style: {
                        direction: "ltr",
                        textAlign: "left",
                    }
                })
            }).catch(err => {
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
                id={`${genre}`}>

                <div className={classes.cell} style={{ textAlign: 'start' }}>
                    {genre}
                </div>

                <div className={classes.cell}  >
                    <IconButton onClick={onClickDeleteCamera}>
                        <DeleteOutlineOutlinedIcon fontSize="small" color='error' />
                    </IconButton>
                </div>
            </div >
            <ConfirmDialogComponent
                onOkClick={handleDeleteCamera}
                message={'Are you sure you want to delete this Genre? There is no way to undo it if you delete it'}
                open={openConfirmDialog}
                onClose={() => setOpenConfirmDialog(false)}
            />
            <LoadingComponent
                loading={loading}
                message={'We are performing an operation, please wait.'}
            />
        </>
    )
}

export default MovieListItem