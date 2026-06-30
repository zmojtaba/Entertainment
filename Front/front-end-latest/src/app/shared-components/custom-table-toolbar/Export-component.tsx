import { toast } from "react-toastify"
import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import { DataFormats } from "app/constants"
import {
  GridApi,
  GridRowId,
  gridColumnFieldsSelector,
  gridSortedRowIdsSelector,
  gridVisibleColumnFieldsSelector,

  useGridApiContext
} from "@mui/x-data-grid"
import _ from "lodash"
import exportFromJSON, { ExportType } from "export-from-json"
import { Button, Menu, MenuItem } from "@mui/material"
import CustomNestedMenuItem from "app/shared-components/CustomNestedMenuItem"
import DownloadIcon from "@mui/icons-material/Download"


interface propsType {
  isRemote?: boolean;
  fileName: string;
  withoutSelected?: boolean;
  exportOnlyVisibleColumns?: boolean;

  onExportAllFromRemote?(): void;
}

export enum FileFormat {
  "json" = "json",
  "xml" = "xml",
  "csv" = "csv",
  "txt" = "txt",
  "sql" = "sql",
  "xls" = "xls",
  "pdf" = "pdf",
}

export default ({ withoutSelected, isRemote, fileName, exportOnlyVisibleColumns, onExportAllFromRemote }: propsType) => {
  const [anchorEl, setAnchorEl] = useState<(EventTarget & Element) | null>(
    null
  )
  const open = Boolean(anchorEl)
  const { t: translatedWords } = useTranslation("general")
  const handleClick = (e: React.MouseEvent) => setAnchorEl(e.currentTarget)
  const handleClose = () => setAnchorEl(null)
  const apiRef = useGridApiContext()

  const getAllRows = () => gridSortedRowIdsSelector(apiRef)
  const getSelectedRows = () => apiRef.current.getSelectedRows()
  //const filteredSortedRowIds = gridFilteredSortedRowIdsSelector(apiRef);

  const getJson = (
    apiRef: React.MutableRefObject<GridApi>,
    mode: "ALL" | "SELECTED"
  ) => {
    let fetchedRowsId: GridRowId[] = []
    if (mode === "SELECTED") {
      getSelectedRows().forEach((i, k) => {
        fetchedRowsId.push(k)
      })
      if (!fetchedRowsId.length) {
        toast.error<string>(translatedWords("SELECT_AT_LEAST_ONE"), { autoClose: 4000 })
        return
      }
    }
    else {
      fetchedRowsId = getAllRows()
      if (!fetchedRowsId.length) {
        toast.error<string>(translatedWords("NO_RECORD_FOUND"), { autoClose: 4000 })
        return
      }
    }
    if (fetchedRowsId.length) {
      let visibleColumnsField = (exportOnlyVisibleColumns ? gridVisibleColumnFieldsSelector : gridColumnFieldsSelector)(apiRef)
      // _.filter(visibleColumnsField, (i) => i == "__check__")
      visibleColumnsField = visibleColumnsField.filter((c) => c !== "__check__");

      const data = fetchedRowsId.map((id) => {
        const row: Record<string, any> = {}
        // console.log("visibleColumnsField", visibleColumnsField)
        visibleColumnsField.forEach((field) => {
          //   const headerName = apiRef.current.getColumnHeaderParams(field).colDef;

          const value = apiRef.current.getCellParams(id, field).formattedValue
          console.log("visibleColumnsField", value)
          row[field] = value ? value : "-"
        })
        return row
      })
      return data
    }
  }

  const dataExporter = (type: FileFormat, mode: "ALL" | "SELECTED") => {
    const jsonString = getJson(apiRef, mode)
    console.log("jsonString", jsonString)
    if (jsonString) {
      exportFromJSON({
        data: jsonString,
        fileName,
        exportType: type as ExportType
      })
    }
  }

  const handleExportData = (type: FileFormat, mode: "ALL" | "SELECTED") => {
    handleClose()
    if (mode === "ALL" && isRemote) {
      // callExportAllRemote
      onExportAllFromRemote?.()
      return
    }
    if (mode === "ALL" && !isRemote) {
      dataExporter(type, "ALL")
      return
    }
    if (mode === "SELECTED") {
      dataExporter(type, "SELECTED")
      return
    }
  }

  return (
    <>
      <Button
        onClick={handleClick}
        startIcon={<DownloadIcon sx={{ fontSize: "17px" }} />}
      >
        {translatedWords("EXPORT")}
      </Button>
      <Menu anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ horizontal: "center", vertical: "bottom" }}
        transformOrigin={{ horizontal: "center", vertical: "top" }}
      >
        <CustomNestedMenuItem
          label={translatedWords("ALL")}
          parentMenuOpen={open}
          ContainerProps={{ style: { direction: "ltr" } }}
        >
          {isRemote ? (
            <MenuItem
              onClick={() => handleExportData(FileFormat["csv"], "ALL")}
            >
              CSV
            </MenuItem>
          ) : (
            DataFormats.map((format) => (
              <MenuItem
                key={format.value}
                onClick={() =>
                  handleExportData(FileFormat[format.value], "ALL")
                }
              >
                {format.label}
              </MenuItem>
            ))
          )}
        </CustomNestedMenuItem>

        {!withoutSelected && <CustomNestedMenuItem
          label={translatedWords("SELECTED")}
          parentMenuOpen={open}
          ContainerProps={{ style: { direction: "ltr" } }}
        >
          {DataFormats.map((format) => (
            <MenuItem
              key={format.value}
              onClick={() =>
                handleExportData(FileFormat[format.value], "SELECTED")
              }
            >
              {format.label}
            </MenuItem>
          ))}
        </CustomNestedMenuItem>}
      </Menu>
    </>
  )
};
