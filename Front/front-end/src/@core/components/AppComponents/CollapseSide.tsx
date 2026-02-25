import { ReactNode } from "react"
import { MenuOpen } from "@mui/icons-material"
import { styled, useTheme } from "@mui/material/styles"
import Box from "@mui/material/Box"
import Card from "@mui/material/Card"
import ClickAwayListener from "@mui/material/ClickAwayListener"
import Collapse from "@mui/material/Collapse"
import IconButton from "@mui/material/IconButton"
import { AnimatePresence, motion } from "framer-motion"

const StyledLine = styled(motion.line)(({ theme }) => ({
  stroke: theme.palette.primary.main
}))

interface Props {
  rightComponent?: ReactNode;
  leftComponent?: ReactNode;
  onExited?: () => void;
  detailIsOpen: boolean;
  closeSide?: () => void;
  sideWidth?: string;
  // maxWidth?: string
  hideIcon?: boolean;
  awayListener?: boolean;
  unmountOnExit?: boolean;
}

const CollapseSide = (props: Props) => {
  const {
    rightComponent,
    leftComponent,
    onExited,
    detailIsOpen,
    closeSide,
    sideWidth,
    hideIcon = false,
    awayListener = true,
    // maxWidth,
    unmountOnExit
  } = props
  
  const theme = useTheme()
  const position = theme.direction === "ltr" ? { right: 0 } : { left: 0 }
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { delay: 0.1 } }}
      className="flex min-h-full w-full"
    >
      <ClickAwayListener
        onClickAway={closeSide ? () => awayListener && closeSide() : () => {
        }}
      >
        <Card className="flex grow max-h-full w-full shadow-0">
          <Box
            sx={(theme) => ({
              display: "flex",
              flexDirection: "column",
              maxHeight: "100%",
              justifyContent: "center",
              width: sideWidth,
              // maxWidth: sideWidth || '520px',
              // minWidth: '350px',
              overflow: "overlay",
              position: "relative"
            })}
          >
            {rightComponent}
            <svg
              style={{
                position: "absolute",
                width: 5,
                height: "100%",
                ...position
              }}
            >
              <AnimatePresence>
                {detailIsOpen && (
                  <StyledLine
                    initial={{
                      pathLength: 0
                    }}
                    animate={{
                      pathLength: 1,
                      transition: { duration: 0.5, delay: 0.25 }
                    }}
                    exit={{
                      pathLength: 0,
                      transition: { duration: 0.3, delay: 0.1 }
                    }}
                    x1={0}
                    y1={0}
                    x2={0}
                    y2="100%"
                    strokeWidth={4}
                  />
                )}
              </AnimatePresence>
            </svg>
          </Box>
          <Collapse
            orientation="horizontal"
            in={detailIsOpen}
            onExited={onExited}
            timeout={300}
            unmountOnExit={unmountOnExit}
          >
            <Box
              className={`relative h-full flex-col justify-center`}
              sx={(theme) => ({
                width: sideWidth,
                // maxWidth: '520px',
                // minWidth: maxWidth || '350px',
                overflow: "overlay"
              })}
            >
              <>
                {!hideIcon && (
                  <IconButton
                    onClick={() => closeSide && closeSide()}
                    color="primary"
                    size="small"
                    sx={{ position: "absolute", top: 3, left: 3, zIndex: 5 }}
                  >
                    <MenuOpen sx={{ transform: "rotate(180deg)" }} color="primary" />
                  </IconButton>
                )}
                {leftComponent}
              </>
            </Box>
          </Collapse>
        </Card>
      </ClickAwayListener>
    </motion.div>
  )
}

export default CollapseSide
