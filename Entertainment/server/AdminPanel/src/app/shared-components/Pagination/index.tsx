import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import ArrowBackIosNewOutlinedIcon from "@mui/icons-material/ArrowBackIosNewOutlined";
import {
    Box,
    Stack,
    Pagination,
    PaginationItem,
    MenuItem,
    FormControl,
    Select,
    FormHelperText,
    SxProps,
    Theme,
} from '@mui/material';
import React, { useState } from 'react'
import { useTranslation } from "react-i18next";
import { languageId } from "app/store/i18nSlice";
import { useAppSelector } from 'app/store/hooks';
import './i18n'


interface propsType {
    onPageChange(page: number): void;
    onPageSizeChange?(page: number): void;
    totalRows: number;
    page: number;
    pageSize: number;
    pageSizeOptions?: number[];
    sx?: SxProps<Theme>
}

const CustomPagination = (props: propsType) => {
    const { t: translatedWords } = useTranslation("PAGINATION");
    const [page, setPage] = useState(props.page)
    const [pageSize, setPageSize] = useState(props.pageSize)
    const language = useAppSelector(({ i18n }) => i18n.language);

    const handlePageChange = (event: React.ChangeEvent<unknown>, newPage: number) => {
        props.onPageChange(newPage - 1)
        //   setPage(newPage - 1)
    }
    React.useEffect(() => {
        setPage(props.page)
        setPageSize(props.pageSize)
    }, [props.page, props.pageSize])

    const handlePageSizeChange = (newPageSize: number) => {
        let newPage = Math.floor((page * pageSize) / newPageSize)
        if (props.totalRows > newPageSize) {
            const totalPage = Math.ceil(props.totalRows / newPageSize)
            if (totalPage <= newPage)
                newPage = newPage - 1
            props?.onPageSizeChange?.(newPageSize)
            props.onPageChange(newPage)
            // setPage(newPage)
            // setPageSize(newPageSize)
        } else {
            props?.onPageSizeChange?.(newPageSize)
            props.onPageChange(0)
            // setPage(0)
            // setPageSize(newPageSize)
        }
    }
    const pageItemStyle = {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        direction: language === languageId.ENGLISH ? 'rtl' : 'ltr',
        height: 40
    };

    return (
        <Stack direction={'row'} alignItems='center' justifyContent={'space-between'} flexWrap='wrap' sx={{ ...props?.sx }}>
            <Box sx={{ wordSpacing: '.2em', textAlign: 'left', px: 2 }} className='pagination-info'>
                {translatedWords('SHOWING')}
                {" "}
                {page * pageSize + 1}
                {" "}
                {translatedWords('TO')}
                {" "}
                {Math.min((page + 1) * pageSize, props.totalRows)}
                {" "}
                {translatedWords('FROM')}
                {" "}
                {props.totalRows}
                {" "}
                {translatedWords('RECORDS')}
            </Box>
            <Pagination
                sx={{ direction: 'ltr !important' }}
                variant="text"
                shape="rounded"
                count={Math.ceil(props.totalRows / pageSize)}
                page={page + 1}
                onChange={handlePageChange}
                renderItem={(props2) => (
                    <PaginationItem
                        components={{
                            previous: () => (
                                <Box sx={pageItemStyle}>
                                    {language === languageId.ENGLISH ? translatedWords('PREV') : translatedWords('NEXT')}
                                    <ArrowBackIosNewOutlinedIcon
                                        sx={{ fontSize: "13px", mx: .5, }}
                                    />
                                </Box>
                            ),
                            next: () => (
                                <Box sx={pageItemStyle}>
                                    <NavigateNextIcon sx={{ fontSize: "22px", mx: 0.5 }} />
                                    {language === languageId.ENGLISH ? translatedWords('NEXT') : translatedWords('PREV')}
                                </Box>
                            ),
                        }}
                        {...props2}
                        sx={[
                            {
                                fontSize: 15,
                                p: 2,
                                margin: 0.2,
                                position: "relative"
                            },
                            props2.selected
                                ? {
                                    background: ({ palette: { mode } }) => 'gray',
                                    '& ::before': {
                                        content: "''",
                                        position: "absolute",
                                        bottom: 0,
                                        left: 0,
                                        width: '100%',
                                        borderBottom: `2px solid #08d8fc `,
                                    }
                                }
                                : {},
                        ]}
                    />
                )}
            />
            {props.pageSizeOptions &&
                <FormControl sx={{ minWidth: 120, display: 'flex', flexDirection: 'row', alignItems: 'center' }} size="small" >
                    <Select
                        value={pageSize.toString()}
                        onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                    >
                        {props.pageSizeOptions.map(value => (
                            <MenuItem value={value} key={value.toString()}>
                                {value}
                            </MenuItem>
                        ))
                        }
                    </Select>
                    <FormHelperText>{translatedWords('RECORD_PER_PAGE')}</FormHelperText>
                </FormControl>
            }
        </Stack >
    );
}

export default CustomPagination
