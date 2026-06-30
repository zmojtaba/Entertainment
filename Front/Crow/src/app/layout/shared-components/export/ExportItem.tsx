import { Details, ItemImage, StyledExportItem } from "./styledComponents"
import { ExportItem as ExportItemType } from "app/features/exports/types"
import Typography from "@mui/material/Typography"
import JsonIcon from "./JsonIcon"
import { Box, ClickAwayListener, TextField } from "@mui/material"
import Checkbox from "@mui/material/Checkbox"
import { Dispatch, SetStateAction } from "react"
import { deselectItem, editExportName, selectItem } from "app/features/exports/exportsSlice"
import { useAppDispatch, useAppSelector } from "app/store/hooks"
import { openDialog } from "app/store/core/dialogSlice"

interface Props {
  data: ExportItemType;
  editableId: string | null;
  setEditableId: Dispatch<SetStateAction<string | null>>;
}

const ExportItem = (props: Props) => {
  
  const dispatch = useAppDispatch()
  
  const { editableId, setEditableId } = props
  const {
    id,
    title,
    data,
    type
  } = props.data
  
  const {
    selectedExportItems,
    selectMode
  } = useAppSelector(state => state.exports)
  
  const isSelected: boolean = selectedExportItems.findIndex(item => item === id) > -1
  const isEditing: boolean = editableId === id
  
  const changeEditable = () => {
    setEditableId(id)
  }
  
  const changeTitle = (event) => {
    const changedExport = {
      id,
      newTitle: event.target.value
    }
    dispatch(editExportName(changedExport))
  }
  
  const clickAwayHandler = () => {
    setEditableId(null)
  }
  
  const selectHandler = () => {
    if (selectMode)
      if (isSelected)
        dispatch(deselectItem(id))
      else
        dispatch(selectItem(id))
  }
  
  const showInModal = () => {
    if (type === "IMAGE")
      dispatch(openDialog({
        children: <Box><img src={data} /></Box>
      }))
  }
  
  return (
    <StyledExportItem
      elevation={0}
    >
      <ItemImage
        onClick={selectMode ? selectHandler : showInModal}
        sx={{
          borderColor: theme => selectMode ? !isSelected ? theme.palette.background.default : theme.palette.primary.dark : theme.palette.background.default,
          cursor: type === "IMAGE" ? "pointer" : "default"
        }}
      >
        {
          type === "IMAGE" ?
            <img src={data} />
            :
            <JsonIcon sx={{ fontSize: "5rem" }} />
        }
        
        {
          selectMode &&
          <Box
            sx={{
              position: "absolute",
              top: 0,
              right: 0
            }}
          >
            <Checkbox
              checked={selectedExportItems.findIndex(item => item === id) > -1}
              onChange={selectHandler}
            />
          </Box>
        }
      </ItemImage>
      
      <Details sx={{ pb: isEditing ? 0 : 2 }}>
        {
          isEditing ?
            <ClickAwayListener onClickAway={clickAwayHandler}>
              <TextField
                value={title}
                size={"small"}
                fullWidth
                onChange={changeTitle}
              />
            </ClickAwayListener>
            :
            <Typography onDoubleClick={changeEditable}>{title}</Typography>
        }
      </Details>
    
    </StyledExportItem>
  )
}

export default ExportItem