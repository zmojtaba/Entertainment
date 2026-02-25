import React, { useEffect, useState } from 'react'
import classes from './style.module.scss'
import { alpha, Autocomplete, Chip, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, InputLabel, Stack, TextField } from '@mui/material'
import { useTranslation } from 'react-i18next'
import ArrowLeftRoundedIcon from '@mui/icons-material/ArrowLeftRounded';
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from 'react-router-dom';
import { AddGenerList, getGenerList } from '../../constants/api';
import ErrorComponent from 'app/shared-components/ErrorComponent';
import { LoadingButton } from '@mui/lab';
import { truncate } from 'lodash';
import useDataStore from '../../store/useDataStore';
import { IGenersItem } from '../../store/type';
import LoadingComponent from 'app/shared-components/LoadingComponent';
import { toast } from 'react-toastify';

function CreateNewGener() {
    const genres = useDataStore(st => st.movieRefrenceData?.genres)
    const errorLoadingMovies = useDataStore(st => st.errorLoadingMovies)
    const [geners, setGeners] = useState<IGenersItem[]>([])
    const [loading, setLoading] = useState(false)
    const [isError, setIserror] = useState(false)

    const { t } = useTranslation('SETTINGS')
    const navigate = useNavigate()

    // console.log("movieRefrenceData", genres);

    useEffect(() => {
        setGeners(genres!)
    }, [])

    const handleChangeTag = (newValue) => {
        const processedValue: IGenersItem[] = (newValue as (string | IGenersItem)[])
            .map(item => typeof item === 'string' ? { title: item } : item);
        setGeners(processedValue);
    }
    const handleSaveCamera = () => {
        setLoading(true)
        AddGenerList(geners)
            .then(async res => {
                await window.wait()
                setLoading(false)
                toast.success('The operation was successful')
            })
            .catch(err => {
                setLoading(false)
                setIserror(true)
                toast.error('The operation was successful')
            })
    }

    const handleClose = () => {
        navigate('/series/series');
    };
    return (
        <Dialog
            open
            fullWidth
            maxWidth={'sm'}
        // sx={{ height: '200px' }}
        // className={classes.custom}
        // PaperProps={{ className: isSpinning ? classes.customModal : '' }}
        >

            <DialogTitle sx={{ display: 'flex', alignItems: 'center', py: .5, pr: 1, fontSize: '1.4rem' }}>
                <p>
                    {
                        t('Add Gener')
                    }
                </p>
                <p style={{ fontSize: '1.6rem', fontWeight: 600 }} >
                    {/* <ArrowLeftRoundedIcon color="action" fontSize="large" /> */}
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
                    minHeight: '200px',
                    overflowY: 'auto',
                    position: 'relative'
                }}>
                {
                    isError || errorLoadingMovies ?
                        <ErrorComponent
                            error
                            // errorMessage={t(errorLoadingMovies ? 'Faild load geners list' : 'CAMERA_NOT_FOUND')}
                            errorMessage={t(true ? 'Faild load geners list' : 'CAMERA_NOT_FOUND')}
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

                                <Stack spacing={1} >

                                    <Stack spacing={3}
                                        direction={'row'}
                                        sx={{ '>div': { flex: 1 } }}>
                                        <Stack spacing={0.5} >
                                            <InputLabel >
                                                {t('Geners')}
                                            </InputLabel>
                                            <Autocomplete
                                                multiple
                                                freeSolo
                                                sx={{
                                                    '& .MuiAutocomplete-inputRoot': {
                                                        alignItems: 'flex-start',
                                                        alignContent: 'flex-start',
                                                        flexWrap: 'wrap',
                                                        paddingTop: '8px',
                                                        overflowY: 'auto',
                                                        minHeight: '250px',
                                                        maxHeight: '400px',
                                                        gap: '5px',
                                                    },

                                                }}
                                                options={[]}
                                                value={geners || []}
                                                onChange={(_, newValue, reason) => {
                                                    if (reason === 'clear') {
                                                        setGeners([])
                                                    } else {
                                                        handleChangeTag(newValue)
                                                    }
                                                }}
                                                size="small"
                                                filterSelectedOptions
                                                 componentsProps={{
                                                    popper: {
                                                        dir: 'ltr'
                                                    }
                                                }}
                                                renderTags={(value, getTagProps) =>
                                                    value.map((option, index) => (
                                                        <Chip
                                                            {...getTagProps({ index })}
                                                            key={option.title}
                                                            size="small"
                                                            label={option.title}
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
                                                        size="small"
                                                        placeholder="Type name Actors,Enter"
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
                    {/* <div className={classes.getInfo}> */}
                    <LoadingButton sx={{ minWidth: 70 }}
                        onClick={handleSaveCamera}
                        color='success'
                        variant='contained'
                        disabled={geners?.length! == 0 || isError}
                        loading={loading}
                    >
                        {'Save'}
                    </LoadingButton>
                    {/* </div> */}
                </div>
            </DialogActions>

            <LoadingComponent
                loading={Boolean(loading)}
                message={'Saving, please wait'}
            />
        </Dialog >
    )
}

export default CreateNewGener