import { useState } from 'react'
import classes from './style.module.scss'
import {
    alpha, Autocomplete, AutocompleteChangeReason, Chip, Dialog, DialogActions, DialogContent,
    DialogTitle, IconButton, InputLabel, Stack, TextField
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from 'react-router-dom';
import { AddGenerList } from '../../constants/api';
import ErrorComponent from 'app/shared-components/ErrorComponent';
import { LoadingButton } from '@mui/lab';
import useDataStore from '../../store/useDataStore';
import LoadingComponent from 'app/shared-components/LoadingComponent';
import { toast } from 'react-toastify';
import { ErrorType1 } from '../../constants/types';

function CreateNewGener() {
    const errorLoadingMovies = useDataStore(st => st.errorLoadingMovies)
    const genreList = useDataStore(st => st.genreList)
    const insertGenre = useDataStore(st => st.insertMovie)
    const [geners, setGeners] = useState<string[]>([])
    const [loading, setLoading] = useState(false)
    const [isError, setIserror] = useState(false)
    const [errorDuplicateGenre, setErrorDuplicateGenre] = useState(false)
    const { t } = useTranslation('SETTINGS')
    const navigate = useNavigate()

    const handleChangeTag = (newValue, reason: AutocompleteChangeReason) => {
        const values: string[] = newValue.map(item =>item);
        switch (reason) {
            case 'createOption':
                const duplicate = geners.findIndex(g => g == values.at(-1))
                const duplicateGenreList = genreList.findIndex(g => g == values.at(-1))
                if (duplicate == - 1 && duplicateGenreList == -1) {
                    setGeners(values);
                    setErrorDuplicateGenre(false);
                } else {
                    setErrorDuplicateGenre(true)
                }
                break;

            case 'removeOption':
                setGeners(values);
                break;

            case 'clear':
                setGeners([]);
                break;
        }
    }

    const handleSaveCamera = () => {
        setLoading(true)
        AddGenerList(geners)
            .then(async res => {
                insertGenre(geners.map(g => g))
                await window.wait()
                setLoading(false)
                toast.success('The operation was successful', {
                    style: {
                        direction: "ltr",
                        textAlign: "left",
                    }
                })
                handleClose()
            })
            .catch(err => {
                setLoading(false)
                setIserror(true)
                if (err.code == 'ERR_NETWORK') {
                    toast.error('Connection to the server is not established', {
                        style: {
                            direction: "ltr",
                            textAlign: "left",
                        }
                    })
                } else if (err.response) {
                    const errorData: ErrorType1 = err.response.data
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

    const handleClose = () => {
        navigate('/genreMagazine/genres');
    };

    return (
        <Dialog
            open
            fullWidth
            maxWidth={'sm'}
            sx={{ direction: 'ltr' }}
        >
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', py: .5, pr: 1, fontSize: '1.4rem' }}>
                <p>
                    {
                        t('Add Genre')
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
                                                        gap: '2px',
                                                    },

                                                }}
                                                options={[]}
                                                value={geners || []}

                                                onChange={(_, newValue, reason) => {
                                                    handleChangeTag(newValue, reason)
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
                                                            key={option}
                                                            size="small"
                                                            label={option}
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
                                                        placeholder="Type Genre , Enter"
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
                <div className={classes.actionBox} >
                    <div >
                        {
                            errorDuplicateGenre &&
                            <span>{'This genre exists.'}</span>
                        }
                    </div>
                    <div className={classes.actions} >
                        <LoadingButton sx={{ minWidth: 70 }}
                            onClick={handleSaveCamera}
                            color='success'
                            variant='contained'
                            disabled={geners?.length! == 0 || isError || errorDuplicateGenre}
                            loading={loading}
                        >
                            {'Save'}
                        </LoadingButton>
                    </div>
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