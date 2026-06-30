import Icon from "@mui/material/Icon"
import ListItemText from "@mui/material/ListItemText"
import clsx from "clsx"
import { useMemo } from "react"
import { NavLinkContainer } from "./styledComponents"
import { NavComponentsProps } from "./types"

const NavLink = (props: NavComponentsProps) => {
  const {
    item,
    nestedLevel,
    onItemClick
  } = props

  const itemPadding = nestedLevel > 0 ? 28 + nestedLevel * 16 : 12

  return useMemo(
    () => (
      <NavLinkContainer
        //@ts-ignore
        component="a"
        href={item.url}
        target={item.target ? item.target : "_blank"}
        className="fuse-list-item"
        onClick={() => onItemClick && onItemClick(item)}
        role="button"
        itemPadding={itemPadding}
      >
        {
          item.icon &&
          <Icon
            className={clsx("fuse-list-item-icon text-[1.25rem] shrink-0", item.iconClass)}
            color="action"
          >
            {item.icon}
          </Icon>
        }

        <ListItemText
          className="fuse-list-item-text"
          primary={item.title}
          classes={{ primary: "text-[0.75rem] fuse-list-item-text-primary" }}
        />
      </NavLinkContainer>
    ),
    [item, itemPadding, onItemClick]
  )
}

export default NavLink
