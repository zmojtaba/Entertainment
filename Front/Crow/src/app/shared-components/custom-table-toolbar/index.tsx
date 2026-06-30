import { Component, PropsWithChildren } from "react"
import i18n from "i18next"
import {
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarFilterButton,
  GridToolbarQuickFilter,
  useGridApiContext
} from "@mui/x-data-grid"
import { Box, ButtonGroup, Divider, InputAdornment, TextField } from "@mui/material"
import ExportComponentToolbar from "./Export-component"
import { RedirectToolbar } from "./RedirectToolbar"
import CustomButton from "./CustomButton"
import SearchIcon from "@mui/icons-material/Search"

/*
@Author morgan 
  all right reserved :/
*/
const _defaultProps = {
  showAdvancedExport: false,
  onExportAllDataFromRemote: () => {
  },
  showQuickFilter: false,
  showColumnButton: true,
  showFilterButton: false,
  showDensityButton: true,
  showDisplayButton: false,
  showCustomButton: false,
  quickFilterProps: {},
  fileName: "export-data",
  withoutSelected: false,
  isRemote: false,
  showAdvancedSearchInput: false,
  exportOnlyVisibleColumns: false,
  onAdvancedSearchInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  }
}

export type CustomTableToolbarProps = PropsWithChildren<typeof _defaultProps & {
  showColumnButton: boolean,
  customButtonProps?: {
    icon: JSX.Element,
    title: string,
    onClick(api?: ReturnType<typeof useGridApiContext>): void,
    margin?: number
  },
}>

class CustomToolbar extends Component<CustomTableToolbarProps> {
  static defaultProps = _defaultProps

  render() {
    const {
      fileName,
      onExportAllDataFromRemote,
      showAdvancedExport,
      quickFilterProps,
      showQuickFilter,
      showColumnButton,
      showFilterButton,
      showDensityButton,
      showDisplayButton,
      showCustomButton,
      isRemote,
      showAdvancedSearchInput,
      onAdvancedSearchInputChange,
      customButtonProps,
      withoutSelected,
      children,
      exportOnlyVisibleColumns,
      ...rootProps
    } = this.props

    return (
      <>
        <GridToolbarContainer
          sx={{ mx: customButtonProps ? customButtonProps.margin : 4, py: 1, displayPrint: "none" }}>
          <ButtonGroup sx={{ mr: "auto" }} size="small" color={"info"}>
            {showColumnButton && <GridToolbarColumnsButton />}
            {showFilterButton && <GridToolbarFilterButton />}
            {showDensityButton && <GridToolbarDensitySelector />}
            {showAdvancedExport && (
              <ExportComponentToolbar
                fileName={fileName}
                onExportAllFromRemote={onExportAllDataFromRemote}
                isRemote={isRemote}
                withoutSelected={withoutSelected}
                exportOnlyVisibleColumns={exportOnlyVisibleColumns}
              />
            )}


            {showCustomButton && customButtonProps && <CustomButton {...customButtonProps} />}
          </ButtonGroup>
          {children}
          {showQuickFilter && <Box sx={{ mx: 3 }}><GridToolbarQuickFilter {...quickFilterProps} /> </Box>}
          {showAdvancedSearchInput &&
            <TextField size="small" type={"text"}
              onChange={(e) => {
                onAdvancedSearchInputChange(e)
              }}
              variant="standard"
              placeholder={i18n.t(`hamrah:W50`) + "..."}
              sx={{ mx: 2 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                )
              }}
            />
          }
        </GridToolbarContainer>
        <Divider sx={{ displayPrint: "none" }} />
      </>
    )
  }
}

export default CustomToolbar
