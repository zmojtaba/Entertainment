import React from "react"
import IconButton from "@mui/material/IconButton"
import Box from "@mui/material/Box"
import FormGroup from "@mui/material/FormGroup"
import FormControlLabel from "@mui/material/FormControlLabel"
import Checkbox from "@mui/material/Checkbox"
import { HeaderContainer, Title } from "./styledComponents"
import { useTranslation } from "react-i18next"
import Stack from "@mui/material/Stack"
import SearchIcon from "@mui/icons-material/Search"
import DownloadIcon from "@mui/icons-material/Download"
import DeleteIcon from "@mui/icons-material/Delete"
import ClearIcon from "@mui/icons-material/Clear"
import CheckBoxOutlinedIcon from "@mui/icons-material/CheckBoxOutlined"
import { useAppDispatch, useAppSelector } from "app/store/hooks"
import {
  closeDrawer,
  deleteExports,
  deselectAllItems,
  selectAllItems,
  switchToNormalMode,
  switchToSelectMode
} from "app/features/exports/exportsSlice"
import { showMessage } from "../../../store/core/messageSlice"


const ExportHeader = () => {
  
  const dispatch = useAppDispatch()
  const { t } = useTranslation("layout")
  
  const {
    selectMode,
    selectedExportItems,
    exportItems
  } = useAppSelector(state => state.exports)
  
  const closeHandler = () => dispatch(closeDrawer())
  
  const checkClickHandler = () => {
    if (selectMode)
      dispatch(switchToNormalMode())
    else
      dispatch(switchToSelectMode())
  }
  
  const deleteHandler = () => {
    dispatch(deleteExports())
  }
  
  const selectAll = (event) => {
    if (event.target.checked)
      dispatch(selectAllItems())
    else
      dispatch(deselectAllItems())
  }
  
  const download = () => {
    
    console.log("selectedExportItems", selectedExportItems)
    console.log("exportItems", exportItems)
    
    if (selectedExportItems.length > 0) {
      if (selectedExportItems.length === 1) {
        const link = document.createElement("a")
        const foundItem = exportItems.findIndex(file => file.id === selectedExportItems[0])
        if (foundItem > -1) {
          link.href = exportItems[foundItem].data
          link.download = exportItems[foundItem].title
          link.click()
          link.remove()
        }
      }
      else {
        // type code later
      }
      
    }
    else {
      dispatch(
        showMessage({
          message: t("SELECT_ONCE_FILE"),
          variant: "error"
        })
      )
    }
    
  }
  
  return (
    <HeaderContainer>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%"
        }}
      >
        <Title>{t("STORED")}</Title>
        
        <IconButton onClick={closeHandler}>
          <ClearIcon />
        </IconButton>
      </Box>
      
      {
        exportItems.length > 0 &&
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%"
          }}
        >
          <Box>
            {
              selectMode &&
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedExportItems.length === exportItems.length}
                      onChange={selectAll}
                    />
                  }
                  label={t("SELECT_ALL")} />
              </FormGroup>
            }
          </Box>

          <Stack direction={"row"} py={"1px"}>
            <IconButton
              sx={{
                color: theme => selectMode ? theme.palette.primary.main : theme.palette.text.secondary
              }}
              onClick={checkClickHandler}
            >
              <CheckBoxOutlinedIcon />
            </IconButton>

            <IconButton onClick={deleteHandler}>
              <DeleteIcon />
            </IconButton>

            <IconButton>
              <DownloadIcon onClick={download} />
            </IconButton>

            <IconButton>
              <SearchIcon />
            </IconButton>
          </Stack>
        </Box>
      }
    </HeaderContainer>
  )
}

export default ExportHeader