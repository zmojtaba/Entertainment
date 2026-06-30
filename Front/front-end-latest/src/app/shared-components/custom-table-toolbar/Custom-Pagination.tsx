import react, { useState } from 'react'
import { useTranslation } from "react-i18next";
import { languageId } from "app/store/i18nSlice";
import { useAppSelector } from 'app/store/hooks';
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
    Divider,
    TextField
} from '@mui/material';
import {
    gridPageSizeSelector,
    useGridApiContext,
    gridPageCountSelector,
    gridPageSelector,
    useGridSelector,
    gridPaginationModelSelector,
} from "@mui/x-data-grid";
import '../Pagination/i18n'


/*
@Author morgan 
  all right reserved :/
*/
interface PropsType {
    showPaginationInfo: boolean;
    showGoto: boolean;
    showPageSize: boolean;
    rowsPerPageOptions: number[];
    boundaryCount: number;
}

const CustomPagination = (props: PropsType) => {
    const { t: translatedWords } = useTranslation("PAGINATION");
    const language = useAppSelector(({ i18n }) => i18n.language);
    const apiRef = useGridApiContext();
    const page = useGridSelector(apiRef, gridPageSelector);
    let defaultPageSize = gridPageSizeSelector(apiRef)
    const pageSize = props.rowsPerPageOptions.includes(defaultPageSize) ? defaultPageSize : props.rowsPerPageOptions[0];
    const totalRows = apiRef.current.getRowsCount()
    const pageCount = Math.ceil(totalRows / pageSize);
    const [goto, setGoto] = useState(page + 1)

    const handlePageSizeChange = (newPageSize: number) => {
        apiRef.current.setPageSize(newPageSize)
    }
    const handleGotoPage = (e: react.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Enter' || e.keyCode === 13) {
            apiRef.current.setPage(goto - 1)
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
        <Stack direction={'row'}
            sx={{
                px: 1,
                direction: 'rtl',
                flex: 1,
                '& hr': {
                    mx: 1
                },
            }} alignItems='center' justifyContent={'space-between'}>
            <Pagination
                boundaryCount={props.boundaryCount}
                sx={{ direction: 'ltr !important' }}
                variant="text"
                shape="rounded"
                page={page + 1}
                count={pageCount}
                onChange={(event: React.ChangeEvent<unknown>, value: number) => {
                    apiRef.current.setPage(value - 1);
                    setGoto(value)
                }}
                renderItem={(props2) => (
                    <PaginationItem
                        components={{
                            previous: () => (
                                <Box sx={pageItemStyle}>
                                    {language === languageId.ENGLISH ? translatedWords('PREV') : translatedWords('NEXT')}
                                    <ArrowBackIosNewOutlinedIcon
                                        sx={{ fontSize: "13px", mx: .5 }}
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
                                fontSize: 14,
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
            <Box sx={{ mr: 'auto', display: 'flex', alignItems: 'center' }}>
                {props.showPaginationInfo &&
                    <Box sx={{ mr: 'auto', wordSpacing: '.2em', textAlign: 'left', px: 2 }} className='pagination-info'>
                        {translatedWords('SHOWING')}
                        {" "}
                        {page * pageSize + 1}
                        {" "}
                        {translatedWords('FROM')}
                        {" "}
                        {Math.min((page + 1) * pageSize, totalRows)}
                        {" "}
                        {translatedWords('TO')}
                        {" "}
                        {totalRows}
                        {" "}
                        {translatedWords('RECORDS')}
                    </Box>
                }
                {props.showPaginationInfo && <Divider orientation="vertical" variant="middle" flexItem />}
                {props.showGoto &&
                    <>
                        <TextField
                            size='small'
                            type={'number'}
                            sx={{ maxWidth: 70, }}
                            value={goto}
                            onChange={(e) => setGoto(Number(e.target.value))}
                            onKeyDown={handleGotoPage}
                            label={translatedWords('GOTO')}
                            inputProps={{
                                min: 1
                            }}
                        />
                        <Divider orientation="vertical" variant="middle" flexItem />
                    </>
                }
                {props.showPageSize &&
                    <Box sx={{ minWidth: 120, display: 'flex', alignItems: 'center', columnGap: 2 }} >
                        <Select
                            value={pageSize.toString()}
                            onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                            size="small"
                        >
                            {props.rowsPerPageOptions.map(value => (
                                <MenuItem value={value} key={value.toString()}>
                                    {value}
                                </MenuItem>
                            ))
                            }
                        </Select>
                        <FormHelperText>{translatedWords('RECORD_PER_PAGE')}</FormHelperText>
                    </Box>
                }
            </Box>
        </Stack >
    );
}

export default CustomPagination
CustomPagination.defaultProps = {
    showPaginationInfo: true,
    showGoto: true,
    showPageSize: true,
    rowsPerPageOptions: [10, 25, 50, 100],
    boundaryCount: 4
}
