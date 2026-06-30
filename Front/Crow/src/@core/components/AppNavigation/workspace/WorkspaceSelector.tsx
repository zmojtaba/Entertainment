import { styled } from "@mui/material/styles"
import Typography from "@mui/material/Typography"
import workspaceConfig from "./WorkspaceConfig"
import { useAppDispatch, useAppSelector } from "app/store/hooks"
import { RectButton, StyledPopover } from "../styledComponents"
import { Fragment, useState } from "react"
import { setActiveWorkSpace } from "app/store/workspace/workspaceSlice"
import { alpha, Box, Divider } from "@mui/material"

const Root = styled(RectButton)(({ theme }) => ({
  minWidth: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: 5
}))

const Logo = styled("img")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  border: "2px solid",
  borderRadius: 7,
  padding: 4,
  borderColor: theme.palette.mode === "dark" ? theme.palette.primary.dark : theme.palette.primary.main,
  backgroundColor: theme.palette.mode === "dark" ? alpha("#ffffff", 0.9) : "unset"
}))

const WorkspaceSelector = () => {
  
  const dispatch = useAppDispatch()
  const { active: activeWorkspace } = useAppSelector(state => state.workspace)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  
  const handleSetWorkspace = (workspace) => {
    dispatch(setActiveWorkSpace(workspace))
    setAnchorEl(null)
  }
  
  return (
    <>
      <Root onClick={handleClick}>
        <Logo
          className="logo-icon w-[38px] h-[38px]"
          src={`assets/images/logos/${activeWorkspace?.logo}`}
          alt="logo"
        />
        
        <Typography className="logo-text text-13 leading-none mx-1.5 font-500" color="text.secondary">
          {activeWorkspace?.title}
        </Typography>
      </Root>
      
      <StyledPopover
        id="workspace-select"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        {workspaceConfig.map((_item, i) => (
          <Fragment key={i}>
            <Box sx={{ py: 0.3, px: 1 }}>
              <RectButton onClick={() => handleSetWorkspace(_item)} sx={{ p: 0.7 }}>
                <img
                  className="logo-icon w-[30px] "
                  src={`assets/images/logos/${_item?.logo}`}
                  alt="logo"
                />
              </RectButton>
            </Box>
            
            <Divider orientation="vertical" flexItem />
          </Fragment>
        ))}
      
      </StyledPopover>
    </>
  )
}

export default WorkspaceSelector
