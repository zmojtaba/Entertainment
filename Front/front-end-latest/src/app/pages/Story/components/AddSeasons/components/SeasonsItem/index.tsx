import React, { useState } from 'react'
import classes from './style.module.scss'
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { Dialog,  DialogContent,
    DialogTitle, Divider, IconButton,
} from '@mui/material'
import { useNavigate } from 'react-router-dom';
import ConfirmDialogComponent from 'app/shared-components/ConfirmDialogComponent/index';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { toast } from 'react-toastify';
import TheatersIcon from '@mui/icons-material/Theaters';
import { ISeasons } from 'app/pages/Series/store/type';
import useDataStore from 'app/pages/Series/store/useDataStore';
import ErrorComponent from 'app/shared-components/ErrorComponent';
import CloseIcon from "@mui/icons-material/Close";
import DropzoneFile from 'app/shared-components/Dropzone';
import imageMp4 from 'assets/images/icon/mp4.png'
import { deleteSeasonApi, deleteEpizod } from 'app/pages/Series/constants/api';
import LoadingButton from 'app/shared-components/LoadingButton';

interface PropsType {
    seasons: ISeasons;
}

function SeasonsListItem(props: PropsType) {
    const { seasons } = props
    const navigate = useNavigate()
    const deleteEpisod = useDataStore(st => st.deleteEpisod);
    const deleteSeason = useDataStore(st => st.deleteSeason);
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [openConfirmDialogSeason, setOpenConfirmDialogSeason] = useState(false);
    const [openDialogUploadFile, setOpenDialogUploadFile] = useState(false);
    const [loading, setLoading] = useState(false)
    const [selectedPoster, setSelectedPoster] = useState<File | null>(null);
    const [progress, setProgress] = useState('0 of 0');
    const [episodId, setEpisodId] = useState('');
    // const isRunning = camera.ffmpegStatus?.status?.toLocaleUpperCase() === CAMERA_STATUS.RUNNING

    // const sortTagsWithUsedItem = _.sortBy(camera.tags, (tag) => {
    //     const index = camera?.usedTag?.indexOf(tag.name);
    //     return index === -1 ? Infinity : index
    // })


    const handleClickAddSeasons = (e) => {
        e.stopPropagation();
        setOpenDialogUploadFile(true)
        // navigate('seasons/' + seasons.id);
        // handleCloseMenu()
    }
    // const handleClickEditCamera = (e) => {
    //     e.stopPropagation();
    //     navigate('edit/' + seasons.id);
    //     handleCloseMenu()
    // }



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
        console.log("dddddddddddddddddddddddddddddddddddd");
        
        // uploadVideoSeries(selectedPoster!, seasons.id, (progress) => {
        //     setProgress(progress)
        // }).then(async res => {
        //     await window.wait()
        //     setLoading(false)
        //     toast.success('The operation was successful')
        //     insertMovie(res.data)
        //     setSelectedPoster(null)
        // })
        //     .catch(err => {
        //         setLoading(false)
        //         toast.error('Error upload video')
        //     })
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

                                                {/* <div className={classes.action}>
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
                                                </div> */}
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