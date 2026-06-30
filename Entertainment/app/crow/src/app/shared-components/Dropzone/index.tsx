import { CSSProperties, useMemo } from 'react';
import { Chip, Theme, darken, useTheme } from '@mui/material';
import { useDropzone } from 'react-dropzone';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import _ from 'lodash';
import NoteAddOutlinedIcon from '@mui/icons-material/NoteAddOutlined';
import './i18n'

const getDropBoxBorderColor = ({ palette }: Theme, status: Record<string, boolean>) => {
    let color = palette.divider;
    if (status.isFocused)
        color = palette.info.light
    if (status.isDragAccept)
        color = palette.success.light
    if (status.isDragReject)
        color = palette.error.light
    return color
}

interface PropsType {
    onDropFiles(files: File[]): void,
    validFormats: string[];
    style?: CSSProperties;
    icon?: typeof NoteAddOutlinedIcon
}

export default function DropzoneFile(props: PropsType) {
    const { onDropFiles, validFormats, icon } = props
    const theme = useTheme()
    // const { t } = useTranslation("DROPZON")
    const _icon = icon ?? NoteAddOutlinedIcon

    const onDropRejected = () => {
        toast.warning<string>("INVALID_FORMAT")
    }

    const {
        getRootProps,
        getInputProps,
        isFocused,
        isDragAccept,
        isDragReject,
    } = useDropzone({
        accept: _.transform(validFormats, (obj, item) => {
            obj[item] = []
        }, {}),
        multiple: false,
        onDropAccepted: onDropFiles,
        onDropRejected,
    });

    const style: CSSProperties = useMemo(() => ({
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        padding: '10px',
        borderWidth: 2,
        borderRadius: 2,
        borderStyle: 'dashed',
        backgroundColor: darken(theme.palette.background.paper, .01),
        color: isFocused ? theme.palette.text.primary : theme.palette.text.disabled,
        outline: 'none',
        transition: 'border .24s ease-in-out',
        textAlign: 'center',
        lineHeight: '2em',
        cursor: 'pointer',
        borderColor: getDropBoxBorderColor(theme, {
            isFocused,
            isDragAccept,
            isDragReject
        }),
        ...props?.style
    }), [isFocused, isDragAccept, isDragReject, theme, props?.style])


    return (
        <div {...getRootProps({ style })}>
            <input {...getInputProps()} />
            <_icon
                sx={{ fontSize: isFocused ? '4rem' : '3rem', transition: 'all .4s ease' }}
                color={isFocused ? 'info' : 'inherit'}
            />
            <h6>{'Drag & Drop'}
                <br />
                {'Select File'}
            </h6>

            <div style={{
                fontSize: '.8em',
                direction: 'ltr'
            }}>
                {"Acceptable format"}
                <div style={{
                    display: 'flex',
                    columnGap: 6,
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    {validFormats.map(f => (
                        <Chip key={f} label={f} size='small' />
                    ))}
                </div>
            </div>
        </div >
    )
}
