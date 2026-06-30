import { IconButton, Menu, MenuItem, ListItemButton, Tooltip } from '@mui/material'
import React from 'react'
import $ from 'jquery'
import { DataFormats } from "app/constants";
import exportFromJSON, { ExportType } from "export-from-json";
import domtoimage from "dom-to-image-improved";
import { toast } from 'react-toastify';
import { useTranslation } from "react-i18next";
import WidgetsIcon from '@mui/icons-material/Widgets';
import CustomNestedMenuItem from 'app/shared-components/CustomNestedMenuItem'
import CircularProgress from '@mui/material/CircularProgress';
import './i18n'

enum FileFormat {
    "json" = "json",
    "xml" = "xml",
    "csv" = "csv",
    "txt" = "txt",
    "xls" = "xls",
    "pdf" = "pdf",
}
const ImageFormat = ['Svg', 'Png', 'Jpeg']


interface PropsType {
    data: {}[];
    shotElementId: string
}

export default function (props: PropsType) {
    const { t } = useTranslation("DATA_EXPORTER");
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const [loadingPrint, setloadingPrint] = React.useState(false)
    const { data, shotElementId } = props


    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleExport = (format: FileFormat) => {
        if (data.length)
            exportFromJSON({
                data,
                exportType: format as ExportType,
            });
    }

    const handleDownloadImage = (format: string) => {
        let screenElement: JQuery<HTMLElement> = $(`#${shotElementId}`)
        if (screenElement) {
            domtoimage?.[`to${format}`]?.(screenElement[0], {
                bgcolor: "white",
                width: screenElement[0].offsetWidth + 50,
                height: screenElement[0].offsetHeight + 50,
            }).then(function (dataUrl: string) {
                var link = document.createElement('a');
                link.download = 'activityChart';
                link.href = dataUrl;
                link.click();
            })
        } else
            toast.warning('cant find Shot-element')
    }

    const handlePrint = () => {
        setloadingPrint(true)
        let screenElement: JQuery<HTMLElement> = $(`#${shotElementId}`)
        if (screenElement.length) {
            domtoimage.toPng(screenElement[0], {
                bgcolor: "white",
                width: screenElement[0].offsetWidth + 50,
                height: screenElement[0].offsetHeight + 50,
            }).then((dataUrl: string) => {
                if (dataUrl) {
                    const imageContainer = document.createElement('div')
                    var img = new Image();
                    img.src = dataUrl;
                    imageContainer.appendChild(img)
                    imageContainer.printMe()
                    setTimeout(() => {
                        setloadingPrint(false)
                    }, 1200)
                }
            })
        } else {
            setloadingPrint(false)
        }
    }


    return (
        <>
            <IconButton
                onClick={handleClick}
                sx={[open ? { transform: 'rotate(180deg)', } : null,
                {
                    transition: 'all .5s ease',
                    marginRight: 'auto'
                }
                ]}
                disabled={!data.length}
                color='info'
            >
                <Tooltip title={t('EXPORT')}>
                    <WidgetsIcon />
                </Tooltip>
            </IconButton>

            <Menu
                id="chart-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
            >
                <CustomNestedMenuItem label={t("EXPORT_DATA")} parentMenuOpen={open} >
                    {DataFormats.map(format => (
                        <MenuItem onClick={() => handleExport(FileFormat[format.value])}
                            key={format.label} divider sx={{ textAlign: 'right' }}
                            dense >
                            {format.label}
                        </MenuItem>
                    ))
                    }
                </CustomNestedMenuItem>
                <CustomNestedMenuItem label={t("SAVE_IMAGE")} parentMenuOpen={open} >
                    {ImageFormat.map(format => (
                        <MenuItem onClick={() => handleDownloadImage(format)}
                            key={format} divider sx={{ textAlign: 'right' }}
                            dense >
                            {format}
                        </MenuItem>
                    ))}
                </CustomNestedMenuItem>
                <ListItemButton onClick={handlePrint} sx={{ textAlign: 'right', fontSize: '1.2rem' }} >
                    {t('PRINT')}
                    {loadingPrint && <CircularProgress sx={{ ml: 'auto' }} color="secondary" size={15} />}
                </ListItemButton>
            </Menu >
        </>
    )
}
