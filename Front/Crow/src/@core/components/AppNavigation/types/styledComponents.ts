import { alpha, styled } from "@mui/material/styles"
import ListItem from "@mui/material/ListItem"
import ListItemButton from "@mui/material/ListItemButton"
import {  List } from "@mui/material"

export const NavGroupContainer = styled(List, {
  shouldForwardProp: (props) => props !== "itemPadding"
})<{ open: Boolean, level: number }>
  (({ theme, open, level, ...props }) => ({
    height: 40,
    width: "100%",
    borderRadius: "6px",
    gap: 20,
    display: 'flex',
    paddingLeft: open ? level ? level * 10 + 6 : 15 : 3,
    paddingRight: '5px',
    justifyContent: 'center',
    color: alpha(theme.palette.text.primary, 0.7),
    "&:hover": {
      backgroundColor: alpha(theme.palette.divider, 0.03),
      color: theme.palette.text.primary
    },
    fontWeight: 600,
    letterSpacing: "0.025em",
    "& .icon": {
      color: theme.palette.primary.dark,
    },
  }))

export const NavCollapseContainer = styled(ListItem, {
  shouldForwardProp: (prop) => prop !== "nestedLevel"
})<{ nestedLevel: number }>(({ theme, nestedLevel }) => {
  return ({
    height: 40,
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    borderRadius: "6px",
    margin: "0 0 4px 0",
    color: alpha(theme.palette.text.primary, 0.7),
    cursor: "pointer",
    textDecoration: "none!important",
    "&:hover": {
      color: theme.palette.text.primary
    },
    "&.active": {
      color: theme.palette.text.primary,
      backgroundColor:
        theme.palette.mode === "light"
          ? "rgba(0, 0, 0, .05)!important"
          : "rgba(255, 255, 255, .1)!important",
      pointerEvents: "none",
      transition: "border-radius .15s cubic-bezier(0.4,0.0,0.2,1)",
      "& > .fuse-list-item-text-primary": {
        color: "inherit"
      }

    },
    "& >.fuse-list-item-icon": {
      color: nestedLevel === 0 ? theme.palette.primary.dark : "inherit"
    },
    "& > .fuse-list-item-text": {
      // marginLeft: 12
    }
  })
})

export const NavItemContainer = styled(ListItemButton, {
  shouldForwardProp: (prop) => prop !== "nestedLevel"
})<{ nestedLevel: number }>(({ theme, nestedLevel, }) => {
  return ({
    height: 40,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: nestedLevel ? nestedLevel * 10 + 2 : 0,
    paddingRight: 0,
    width: "100%",
    borderRadius: "6px",
    margin: "0 0 4px 0",
    color: alpha(theme.palette.text.primary, 0.7),
    cursor: "pointer",
    textDecoration: "none!important",
    "&:hover": {
      color: theme.palette.text.primary
    },
    "&.active": {
      color: theme.palette.text.primary,
      backgroundColor:
        theme.palette.mode === "light"
          ? "rgba(0, 0, 0, .05)!important"
          : "rgba(255, 255, 255, .1)!important",
      pointerEvents: "none",
      transition: "border-radius .15s cubic-bezier(0.4,0.0,0.2,1)",
      "& > .fuse-list-item-text-primary": {
        color: "inherit"
      }

    },
    "& >.fuse-list-item-icon": {
      color: theme.palette.primary.dark
    },
    "& > .fuse-list-item-text": {
      textAlign: 'start',
    }
  })
})


export const NavLinkContainer = styled(ListItemButton, {
  shouldForwardProp: (props) => props !== "itemPadding"
})<{ itemPadding: number }>(({ theme, ...props }) => ({
  height: 40,
  width: "100%",
  borderRadius: "6px",
  margin: "0 0 4px 0",
  paddingRight: 12,
  paddingLeft: props.itemPadding > 80 ? 80 : props.itemPadding,
  "&.active": {
    backgroundColor: `${theme.palette.secondary.main}!important`,
    color: `${theme.palette.secondary.contrastText}!important`,
    pointerEvents: "none",
    transition: "border-radius .15s cubic-bezier(0.4,0.0,0.2,1)",
    "& > .fuse-list-item-text-primary": {
      color: "inherit"
    },
    "& > .fuse-list-item-icon": {
      color: "inherit"
    }
  },
  "& > .fuse-list-item-icon": {
    // marginRight: 12
  },
  "& > .fuse-list-item-text": {},
  color: theme.palette.text.primary,
  textDecoration: "none!important"
}))