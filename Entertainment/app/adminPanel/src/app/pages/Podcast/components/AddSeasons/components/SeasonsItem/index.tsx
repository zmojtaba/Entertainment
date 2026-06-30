import React, { useState } from 'react'
import classes from './style.module.scss'
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import {
    alpha, Autocomplete, Chip, Dialog, DialogActions, DialogContent,
    DialogTitle, Divider, IconButton, InputLabel, Stack,
    TextField,
    Tooltip
} from '@mui/material'
import { useNavigate } from 'react-router-dom';
import ConfirmDialogComponent from 'app/shared-components/ConfirmDialogComponent/index';
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined';
import VideocamOffOutlinedIcon from '@mui/icons-material/VideocamOffOutlined';
import EditIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import _ from 'lodash';
import { toast } from 'react-toastify';
import ToastMsg from 'app/shared-components/ToastMsg';
import { convertToRelativeTime } from 'app/services/utils/validatorsAndHelpers';
import TheatersIcon from '@mui/icons-material/Theaters';
import { ISeasons, ISeries } from 'app/pages/Series/store/type';
import useDataStore from 'app/pages/Series/store/useDataStore';
import ErrorComponent from 'app/shared-components/ErrorComponent';
import CloseIcon from "@mui/icons-material/Close";
import Dropzone from 'react-dropzone/.';
import DropzoneFile from 'app/shared-components/Dropzone';
import { formatBytes } from 'app/pages/Moves/constants/utils';
import imageMp4 from 'assets/images/icon/mp4.png'
import { LoadingButton } from '@mui/lab';
import { deleteSeasonApi, deleteEpizod, uploadVideoSeries } from 'app/pages/Series/constants/api';

interface PropsType {
    seasons: ISeasons;
}

function SeasonsListItem(props: PropsType) {
    const { seasons } = props
    const { t } = useTranslation("SETTINGS");
    const navigate = useNavigate()
    const insertMovie = useDataStore(st => st.insertMovie);
    const deleteEpisod = useDataStore(st => st.deleteEpisod);
    const deleteSeason = useDataStore(st => st.deleteSeason);
    const setLoadingMsg = useDataStore(st => st.setLoadingMsg);
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [openConfirmDialogSeason, setOpenConfirmDialogSeason] = useState(false);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [openDialogUploadFile, setOpenDialogUploadFile] = useState(false);
    const [loading, setLoading] = useState(false)
    const open = Boolean(anchorEl);
    const [selectedPoster, setSelectedPoster] = useState<File | null>(null);
    const [progress, setProgress] = useState('0 of 0');
    const [episodId, setEpisodId] = useState('');
    // const isRunning = camera.ffmpegStatus?.status?.toLocaleUpperCase() === CAMERA_STATUS.RUNNING

    // const sortTagsWithUsedItem = _.sortBy(camera.tags, (tag) => {
    //     const index = camera?.usedTag?.indexOf(tag.name);
    //     return index === -1 ? Infinity : index
    // })

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    const handleClickAddSeasons = (e) => {
        e.stopPropagation();
        setOpenDialogUploadFile(true)
        // navigate('seasons/' + seasons.id);
        // handleCloseMenu()
    }
    const handleClickEditCamera = (e) => {
        e.stopPropagation();
        navigate('edit/' + seasons.id);
        handleCloseMenu()
    }



    const onClickDeleteCamera = (e) => {
        e.stopPropagation();
        setOpenConfirmDialogSeason(true);
    }

    const handleClose = () => {
        setOpenDialogUploadFile(false)
    }
  



    const onDropImage = (files: File[]) => {
        if (!files[0]) return;
        setSelectedPoster(files[0])
        // setErrors({ ...errors, poster: '' })
    }
    const handleUploadFile = (files: File[]) => {
        setLoading(true)
        uploadVideoSeries(selectedPoster!, seasons.id,(progress) => {
            setProgress(progress)
        }).then(async res => {
            await window.wait()
            setLoading(false)
            toast.success('The operation was successful')
            insertMovie(res.data)
            setSelectedPoster(null)
        })
            .catch(err => {
                setLoading(false)
                toast.error('Error upload video')
            })
    }


    const handleDeleteItem = (e, episod: string) => {
        e.stopPropagation();
        setOpenConfirmDialog(true);
        setEpisodId(episod)
        // handleCloseMenu()
    }
    const handleDeleteEndItem = () => {
        setOpenConfirmDialog(false);
        deleteEpizod(seasons.id, episodId)
            .then(res => {
                document.getElementById(String(episodId))?.execAnimation('animated zoomOutUp').then(re => {
                    deleteEpisod(seasons.id, episodId)
                })
                toast.success('The operation was successful')
            })
            .catch(err => {
                toast.error('Error deleting episode')
            })
     
    }
    const handleDeleteSeason = () => {
        setOpenConfirmDialogSeason(false);
        deleteSeasonApi(seasons.id)
            .then(res => {
                document.getElementById(String(seasons.id))?.execAnimation('animated zoomOutUp').then(re => {
                    deleteSeason(seasons.id)
                })
                toast.success('The operation was successful')
            })
            .catch(err => {
                toast.error('Error deleting episode')
            })
    }

    return (
        <>
            <div className={clsx(classes.cameraListItem, classes.row)}
                id={`${seasons.id}`}
            >

                <div className={classes.cell} style={{ textAlign: 'center' }}>
                    {`Seasons ${seasons.seasonNumber}`}
                </div>

                <div className={classes.cell} data-hidden-dashboard>
                    <IconButton onClick={handleClickAddSeasons} color='info'>
                        <TheatersIcon fontSize="small" />
                    </IconButton>
                </div>

                <div className={classes.cell} data-hidden-dashboard>
                    <IconButton onClick={onClickDeleteCamera}>
                        <DeleteOutlineOutlinedIcon fontSize="small" color='error' />
                    </IconButton>
                </div>
            </div >
            <ConfirmDialogComponent
                onOkClick={handleDeleteSeason}
                message={'Are you sure you want to delete this item'}
                open={openConfirmDialogSeason}
                onClose={() => setOpenConfirmDialogSeason(false)}
            />

            {/* ------------------------------------------------------------------ */}
            <Dialog
                open={openDialogUploadFile}
                fullWidth
                maxWidth={'sm'}
                sx={{ height: 'auto' }}
            // className={classes.custom}
            // PaperProps={{ className: isSpinning ? classes.customModal : '' }}
            >

                <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: .8, pr: 1, fontSize: '1.4rem' }}>
                    <p>
                        {'Seasons List'}
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
                                        seasons?.episodes?.map((episod, index) => (
                                            <div className={classes.item} id={`${episod.id}`}>
                                                {
                                                    <span>{`Episoda ${episod.episodeNumber}`}</span>
                                                }
                                                <IconButton onClick={(e) => handleDeleteItem(e, episod.id)}
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
                                        <DropzoneFile validFormats={['.mp4']}
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
                {/* <DialogActions > */}
                {/* <div className={classes.actions} >
                        <div className={classes.getInfo}>
                            <LoadingButton sx={{ minWidth: 100 }}
                                onClick={handleSaveCamera}
                                color='success'
                                variant='contained'
                                disabled={isErrors}
                                loading={loading}
                            >
                                {'Save'}
                            </LoadingButton>
                        </div>
                    </div> */}
                {/* </DialogActions> */}

                <ConfirmDialogComponent
                    onOkClick={handleDeleteEndItem}
                    message={'Are you sure you want to delete this item'}
                    open={openConfirmDialog}
                    onClose={() => setOpenConfirmDialog(false)}
                />
            </Dialog >
        </>
    )
}

export default SeasonsListItem