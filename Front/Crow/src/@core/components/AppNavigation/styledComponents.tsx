import { alpha, styled } from "@mui/material/styles"
import List from "@mui/material/List"
import GlobalStyles from "@mui/material/GlobalStyles"
import ButtonBase from "@mui/material/ButtonBase"
import Menu, { MenuProps } from "@mui/material/Menu"
import Popover, { PopoverProps } from "@mui/material/Popover"

export const StyledList = styled(List)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  rowGap: theme.spacing(0.8),
  "& .fuse-list-item": {
    "&:hover": {
      backgroundColor:
        theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(0,0,0,.02)"
    },
    "&:focus:not(.active)": {
      backgroundColor:
        theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.06)" : "rgba(0,0,0,.05)"
    }
  },
  "&.active-square-list": {
    "& .fuse-list-item, & .active.fuse-list-item": {
      width: "100%",
      borderRadius: "0"
    }
  },
  "&.dense": {
    "& .fuse-list-item": {
      paddingTop: 0,
      paddingBottom: 0,
      height: 32,
    }
  }
}))

export const inputGlobalStyles = (
  <GlobalStyles
    styles={(theme) => ({
      ".popper-navigation-list": {
        "& .fuse-list-item": {
          padding: "8px 12px 8px 12px",
          height: 40,
          minHeight: 40,
          "& .fuse-list-item-text": {
            padding: "0 0 0 8px"
          }
        },
        "&.dense": {
          "& .fuse-list-item": {
            minHeight: 32,
            height: 32,
            "& .fuse-list-item-text": {
              padding: "0 0 0 8px"
            }
          }
        }
      }
    })}
  />
)

export const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}

    {...props}
  />
))(({ theme }) => ({

  "& .MuiPaper-root": {
    marginTop: theme.spacing(1),
    minWidth: 180,
    color:
      theme.palette.mode === "light" ? "rgb(55, 65, 81)" : theme.palette.grey[300],
    "& .MuiMenu-list": {
      padding: "0 0 4px 0"
    },
    "& .MuiMenuItem-root": {
      "& .MuiSvgIcon-root": {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5)
      },
      "&:active": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity
        )
      }
    }
  }
}))

export const StyledPopover = styled((props: PopoverProps) => (
  <Popover
    elevation={1}
    anchorOrigin={{
      vertical: "top",
      horizontal: "left"
    }}
    transformOrigin={{
      vertical: "bottom",
      horizontal: "right"
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    color:
      theme.palette.mode === "light" ? "rgb(55, 65, 81)" : theme.palette.grey[300],
    border: "1px solid",
    borderColor: alpha(theme.palette.primary.light, 0.5)
  }
}))

export const RectButton = styled(ButtonBase, {
  shouldForwardProp: (prop) => prop !== "isActive"
})<{ isActive?: boolean }>(({ theme, isActive }) => ({
  display: "flex",
  flexDirection: "column",
  padding: `${theme.spacing(0.1)} 0`,
  borderRadius: 7,
  background: isActive ? alpha(theme.palette.info.light, 0.15) : "none",
  transition: "background 400ms",
  color: theme.palette.text.secondary,
  textTransform: "capitalize", rowGap: theme.spacing(1),
  "&.Mui-disabled": {
    opacity: 0.7,
    mixBlendMode: "luminosity"
  }
}))
