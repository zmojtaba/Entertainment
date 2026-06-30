import React, { useState } from 'react'
import classes from './style.module.scss'
import clsx from 'clsx';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import {
    Dialog, DialogActions, DialogContent,
    DialogTitle, Divider, IconButton,
    Tooltip
} from '@mui/material'
import ConfirmDialogComponent from 'app/shared-components/ConfirmDialogComponent/index';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { toast } from 'react-toastify';
import TheatersIcon from '@mui/icons-material/Theaters';
import { ISeasons, ISeries } from 'app/pages/Series/store/type';
import useDataStore from 'app/pages/Series/store/useDataStore';
import ErrorComponent from 'app/shared-components/ErrorComponent';
import CloseIcon from "@mui/icons-material/Close";
import DropzoneFile from 'app/shared-components/Dropzone';
import imageMp4 from 'assets/images/icon/mp4.png'
import subtitle from 'assets/images/icon/subtitle.png'
import { deleteSeasonApi, deleteEpizod, AddEpisoda } from 'app/pages/Series/constants/api';
import { LoadingButton } from '@mui/lab';

interface PropsType {
    seasons: ISeasons;
    series: ISeries
}

function SeasonsListItem(props: PropsType) {
    const { seasons, series } = props
    const insertMovieEposid = useDataStore(st => st.insertMovieEposid);
    const deleteEpisod = useDataStore(st => st.deleteEpisod);
    const deleteSeason = useDataStore(st => st.deleteSeason);
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [openConfirmDialogSeason, setOpenConfirmDialogSeason] = useState(false);
    const [openDialogUploadFile, setOpenDialogUploadFile] = useState(false);
    const [loading, setLoading] = useState(false)
    const [selectedPoster, setSelectedPoster] = useState<File | null>(null);
    const [selectedSubtitle, setSelectedSubtitle] = useState<File | null>(null);
    const [progress, setProgress] = useState('0 of 0');
    const [episodId, setEpisodId] = useState('');


    // console.log("movie,", (series?.seasons?.at(-1)!.seasonNumber ? series?.seasons?.at(-1)?.seasonNumber! + 1 : 1))

    // const handleCloseMenu = () => {
    //     setAnchorEl(null);
    // };

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
    const onDropSubtitle = (files: File[]) => {
        if (!files[0]) return;
        setSelectedSubtitle(files[0])
        // setErrors({ ...errors, poster: '' })
    }
    const handleUploadFile = () => {
        setLoading(true)
        AddEpisoda(selectedPoster!, series, seasons, selectedSubtitle, (progress) => {
            setProgress(progress)
        }).then(async res => {
            await window.wait()
            setLoading(false)
            insertMovieEposid(series, res.data)
            setSelectedPoster(null)
            setSelectedSubtitle(null)
            toast.success('The operation was successful')
            // setOpenDialogUploadFile(false)
        })
            .catch(err => {
                setLoading(false)
                if (err.code === 'ERR_NETWORK') {
                    toast.error('Connection to the server is not established')
                } else if (err.response) {
                    toast.error(err.response.data.detail)
                } else {
                    toast.error('Unknown error')
                }
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
                    toast.success('The operation was successful')
                })
            })
            .catch(err => {
                if (err.code === 'ERR_NETWORK') {
                    toast.error('Connection to the server is not established')
                } else if (err.response) {
                    toast.error(err.response.data.detail)
                } else {
                    toast.error('Unknown error')
                }
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
                sx={{ height: 'auto', direction: 'ltr !important' }}
            // className={classes.custom}
            // PaperProps={{ className: isSpinning ? classes.customModal : '' }}
            >

                <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: .8, pr: 1, fontSize: '1.4rem' }}>
                    <p>
                        {'Episoda List'}
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
                                            <div className={classes.item} key={index} id={`${episod.id}`}>
                                                <IconButton onClick={(e) => handleDeleteItem(e, episod.id)}
                                                    disabled={loading}
                                                    sx={{ ml: 'auto', cursor: 'pointer' }}>
                                                    <DeleteOutlineOutlinedIcon color='error' fontSize="small" />
                                                </IconButton>
                                                {
                                                    <span>{`Episoda ${episod.episodeNumber}`}</span>
                                                }

                                            </div>
                                        ))
                                    }
                                </div>
                                <Divider orientation="vertical" variant="middle" flexItem />
                                <div className={classes.right}>
                                    <div className={classes.up}>
                                        {
                                            selectedPoster ?
                                                <div className={classes.showFile} >
                                                    <div className={classes.file}>
                                                        <img src={imageMp4} />
                                                        <div className={classes.fileInfo}>
                                                            <span>{selectedPoster?.name}</span>
                                                            {/* <span>{'gggggggggggggggggggggggggggggggggggggggggg'}</span> */}
                                                            <span>{progress}</span>
                                                        </div>
                                                    </div>
                                                    <Tooltip title='Select New video'>
                                                        <IconButton onClick={() => setSelectedPoster(null)}>
                                                            <AutorenewIcon fontSize='small' />
                                                        </IconButton>
                                                    </Tooltip>
                                                </div>
                                                :

                                                <DropzoneFile validFormats={['.mp4']}
                                                    style={{ cursor: loading ? 'not-allowed' : 'pointer', pointerEvents: loading ? 'none' : 'all' }}
                                                    // style={{ borderColor: Boolean(errors['poster']) ? 'red' : 'lightgray' }}
                                                    onDropFiles={onDropImage} />
                                        }

                                    </div>
                                    <div className={classes.down}>
                                        {
                                            selectedSubtitle ?
                                                <div className={classes.showFile} >
                                                    <div className={classes.file}>
                                                        <img src={subtitle} />
                                                        <div className={classes.fileInfo}>
                                                            <span>{selectedSubtitle?.name}</span>
                                                            {/* <span>{progress}</span> */}
                                                        </div>
                                                    </div>
                                                    <Tooltip title='Select New video'>
                                                        <IconButton onClick={() => setSelectedSubtitle(null)}>
                                                            <AutorenewIcon fontSize='small' />
                                                        </IconButton>
                                                    </Tooltip>
                                                </div>
                                                :

                                                <DropzoneFile validFormats={['.vtt']}
                                                    style={{ cursor: loading ? 'not-allowed' : 'pointer', pointerEvents: loading ? 'none' : 'all' }}
                                                    // style={{ borderColor: Boolean(errors['poster']) ? 'red' : 'lightgray' }}
                                                    onDropFiles={onDropSubtitle} />
                                        }
                                    </div>
                                </div>
                            </div>
                    }
                </DialogContent>
                <DialogActions >
                    <LoadingButton sx={{ width: '100%' }}
                        onClick={handleUploadFile}
                        color='success'
                        variant='contained'
                        size='small'
                        disabled={!selectedPoster || !selectedSubtitle}
                        loading={loading}
                    >
                        {'Upload'}
                    </LoadingButton>
                </DialogActions>

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