import { useState } from "react"
import { useAppDispatch, useAppSelector } from "app/store/hooks"
import { Container, ContentContainer, StyledDrawer } from "./styledComponents"
import { closeDrawer, switchToNormalMode } from "app/features/exports/exportsSlice"
import ExportItem from "./ExportItem"
import ExportHeader from "./ExportHeader"
import Typography from "@mui/material/Typography"
import { useTranslation } from "react-i18next"

const Exports = () => {
  
  const dispatch = useAppDispatch()
  const { t } = useTranslation("layout")
  
  const {
    isOpen,
    exportItems
  } = useAppSelector((state) => state.exports)
  
  const [editableId, setEditableId] = useState<string | null>(null)
  
  const closeHandler = () => {
    dispatch(closeDrawer())
    dispatch(switchToNormalMode())
  }
  
  return (
    <StyledDrawer
      anchor={"right"}
      open={isOpen}
      onClose={closeHandler}
    >
      <Container>
        <ExportHeader />
        
        {
          exportItems.length > 0 ?
            <ContentContainer>
              {
                exportItems.map(item =>
                  <ExportItem
                    data={item}
                    editableId={editableId}
                    setEditableId={setEditableId}
                    key={item.id}
                  />
                )
              }
            </ContentContainer>
            :
            <Typography
              sx={{
                textAlign: "center",
                fontSize: "1.5rem",
                mt: 4
              }}
            >
              {t("NO_DATA")}
            </Typography>
        }
      
      </Container>
    </StyledDrawer>
  )
}


export default Exports