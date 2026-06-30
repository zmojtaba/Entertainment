import NavLinkAdapter from "@core/components/NavLinkAdapter"
import { alpha } from "@mui/material/styles"
import Icon from "@mui/material/Icon"
import ListItem from "@mui/material/ListItem"
import ListItemText from "@mui/material/ListItemText"
import clsx from "clsx"
import { useMemo, useState } from "react"
import NavItem from "../AppNavItem"
import { StyledMenu } from "../styledComponents"
import { useTheme } from "@mui/material"
import { ArrowDropUp } from "@mui/icons-material"
import Tooltip from "@mui/material/Tooltip"
import { NavCollapseContainer } from "./styledComponents"
import { NavComponentsProps } from "./types"

const NavCollapse = (props: NavComponentsProps) => {
  const {
    item,
    nestedLevel,
    onItemClick
  } = props

  const theme = useTheme()

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const open = Boolean(anchorEl)
  const itempadding = nestedLevel > 0 ? 28 + nestedLevel * 16 : 12

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return useMemo(
    () => (
      <>
        <NavCollapseContainer
          //@ts-ignore
          button
          component={item.url ? NavLinkAdapter : "li"}
          className="fuse-list-item"
          onClick={handleClick}
          to={item.url}
          nestedLevel={nestedLevel}
          role="button"
        >
          {item.icon && (
            <Tooltip title={item.title} placement="top">
              <Icon
                className={clsx("fuse-list-item-icon text-22 shrink-0", item.iconClass)}
                color="action"
              >
                {item.icon}
              </Icon>
            </Tooltip>
          )}

          <ArrowDropUp
            fontSize="inherit"
            color="inherit"
            sx={{
              position: "absolute",
              top: 0,
              right: '35%',
              // transform: theme.direction === "rtl" ? "rotate(225deg)" : "rotate(135deg)",
              // transform:  "rotate(225deg)",
              fontSize: "15px",
              color: theme => alpha(theme.palette.text.secondary, 0.5)
            }}
          />
        </NavCollapseContainer>

        {
          item.children && (
            <StyledMenu
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center'
              }}
              transformOrigin={{
                vertical: 200,
                horizontal: 'center'
              }}
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              className={"text-20"}
            >
              <ListItem
                sx={{
                  display: "flex",
                  columnGap: 1,
                  color: "primary.dark",
                  mb: "8px",
                  borderBottom: "1px solid",
                  borderColor: "primary.light",
                  py: 0.5
                }}
              >
                {
                  item.icon &&
                  <Icon
                    className={clsx("fuse-list-item-icon text-20 shrink-0", item.iconClass)}
                    color="inherit"
                  >
                    {item.icon}
                  </Icon>
                }

                <ListItemText
                  className="fuse-list-item-text"
                  primary={item.title}
                  classes={{ primary: "text-[0.65em] font-500" }}
                />
              </ListItem>

              {
                item.children.map((_item) =>
                  <NavItem
                    key={_item.id}
                    type={`vertical-${_item.type}`}
                    item={_item}
                    nestedLevel={nestedLevel + 1}
                    onItemClick={onItemClick}
                  />
                )
              }
            </StyledMenu>
          )}
      </>
    ),
    [
      item.children,
      item.icon,
      item.iconClass,
      item.title,
      item.url,
      itempadding,
      nestedLevel,
      onItemClick,
      open
    ]
  )
}

export default NavCollapse
