import React, { Dispatch, SetStateAction } from "react"
import { DragDropContext, Draggable, Droppable, DropResult } from "react-beautiful-dnd"
import Box from "@mui/material/Box"
import { useAppSelector } from "app/store/hooks"
import { selectCurrLangDir } from "app/store/i18nSlice"
import { useTheme } from "@mui/material/styles"
import Typography from "@mui/material/Typography"
import CloseIcon from "@mui/icons-material/Close"
import { IconButton } from "@mui/material"
import Tooltip from "@mui/material/Tooltip"
import { useTranslation } from "react-i18next"

interface Props {
  deletable?: boolean;
  ids: string[];
  items: { [index: string]: any; name: string }[];
  sequenced?: boolean;
  setItems: Dispatch<SetStateAction<{ [index: string]: any; name: string }[]>>;
}

const removeElementFromArray = (selected, index) => {
  const ReorderSelected = [...selected]
  ReorderSelected.splice(index, 1)
  return ReorderSelected
}

export const ReorderableItems: React.FC<Props> = (props) => {
  const { t: translatedWords } = useTranslation("hamrah")
  const langDirection = useAppSelector(selectCurrLangDir)
  const theme = useTheme()
  
  const { deletable, ids, items, sequenced, setItems } = props
  
  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result
    if (source && destination) {
      if (source.droppableId === destination.droppableId) {
        const ReorderSelectedIds = [...items]
        const [movedItem] = ReorderSelectedIds.splice(source.index, 1)
        ReorderSelectedIds.splice(destination.index, 0, movedItem)
        setItems(ReorderSelectedIds)
      }
    }
  }
  
  return items.length !== 0 ? (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable
        droppableId="reorderable-container"
        type="PATTERN"
        direction={"horizontal"}
      >
        {(provided, snapshot) => {
          return (
            <Box
              ref={provided.innerRef}
              {...provided.droppableProps}
              sx={{
                backgroundColor: snapshot.isDraggingOver
                  ? "primary.main"
                  : theme.palette.background.default,
                border:
                  theme.palette.mode === "dark"
                    ? "1px solid rgba(255, 255, 255, 0.4)"
                    : "1px solid rgba(0,0,0,0.3)",
                borderRadius: "7px",
                direction: langDirection,
                display: "flex",
                mt: 0.5,
                px: 1,
                pt: 1,
                width: "100%",
                overflow: "scroll",
                flex: 1
              }}
            >
              {items.map((selectedItem, index) => (
                <Draggable
                  draggableId={ids.map((id) => "" + selectedItem[id]).join("-")}
                  index={index}
                  key={ids.map((id) => "" + selectedItem[id]).join("-")}
                >
                  {(provided, snapshot) => (
                    <Box
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      sx={{
                        backgroundColor: snapshot.isDragging
                          ? "secondary.main"
                          : theme.palette.background.paper,
                        border:
                          theme.palette.mode === "dark"
                            ? "1px solid rgba(255, 255, 255, 0.3)"
                            : "1px solid rgba(0,0,0,0.3)",
                        borderRadius: "7px",
                        flexShrink: 0,
                        m: 0.5
                      }}
                    >
                      {sequenced && (
                        <Typography sx={{ display: "inline-block", p: 1 }}>
                          {index + 1}
                        </Typography>
                      )}
                      <Typography
                        sx={{
                          borderLeft: sequenced
                            ? theme.palette.mode === "dark"
                              ? "1px solid rgba(255, 255, 255, 0.3)"
                              : "1px solid rgba(0,0,0,0.3)"
                            : "unset",
                          borderRight: deletable
                            ? theme.palette.mode === "dark"
                              ? "1px solid rgba(255, 255, 255, 0.3)"
                              : "1px solid rgba(0,0,0,0.3)"
                            : "unset",
                          display: "inline-block",
                          p: 1
                        }}
                      >
                        {selectedItem.name}
                      </Typography>
                      {deletable && (
                        <Tooltip title={translatedWords("W25")} placement="top">
                          <IconButton
                            sx={{ p: 0.5 }}
                            onClick={() =>
                              setItems(removeElementFromArray(items, index))
                            }
                          >
                            <CloseIcon sx={{ fontSize: "1.4rem" }} />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </Box>
          )
        }}
      </Droppable>
    </DragDropContext>
  ) : null
}
