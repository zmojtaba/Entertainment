import NavLinkAdapter from "@core/components/NavLinkAdapter"
import Icon from "@mui/material/Icon"
import Tooltip from "@mui/material/Tooltip"
import ListItemText from "@mui/material/ListItemText"
import clsx from "clsx"
import { useMemo } from "react"
import { NavItemContainer } from "./styledComponents"
import { NavComponentsProps } from "./types"
import { useAppSelector } from "app/store/hooks"
import { ListItemIcon } from "@mui/material"

const NavItem = (props: NavComponentsProps) => {
  const {
    item,
    nestedLevel,
    onItemClick
  } = props

  const navbar = useAppSelector(({ fuse }) => fuse.navbar)
  const itemPadding = nestedLevel > 0 ? 28 + nestedLevel * 16 : 12

  return useMemo(
    () => (
      <NavItemContainer
        //@ts-ignore        
        component={NavLinkAdapter}
        to={item.url}
        activeClassName="active"
        className="fuse-list-item"
        onClick={() => onItemClick && onItemClick(item)}
        nestedLevel={nestedLevel}
        role="button"
      >
        {
          item.icon &&
          <ListItemIcon className="fuse-list-item-icon text-25 shrink-0 justify-center">
            <Icon
              className={clsx("text-25 shrink-0 ",
                item.iconClass)}
              color="inherit"   >
              {item.icon}
            </Icon>
          </ListItemIcon>
        }

        {
          (navbar.open || !navbar.foldedOpen) &&
          <ListItemText
            className="fuse-list-item-text"
            primary={item.title}
            classes={{ primary: "font-500 fuse-list-item-text-primary" }}
          />
        }
      </NavItemContainer>
    ),
    [item, itemPadding, onItemClick, navbar.open]
  )
}

export default NavItem
