import NavLinkAdapter from "@core/components/NavLinkAdapter"
import React, { useMemo } from "react"
import AppNavItem from "../AppNavItem"
import { NavGroupContainer } from "./styledComponents"
import { NavComponentsProps } from "./types"
import { Box, Collapse, Icon, ListItemIcon, ListItemText } from "@mui/material"
import ExpandMore from '@mui/icons-material/ExpandMore';
import { useAppSelector } from "app/store/hooks"
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';

const NavGroup = (props: NavComponentsProps) => {
  const {
    item,
    nestedLevel,
    onItemClick
  } = props

  const navbar = useAppSelector(({ fuse }) => fuse.navbar)
  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  return useMemo(
    () => (
      <>
        <NavGroupContainer
          //@ts-ignore
          component={item.url ? NavLinkAdapter : "nav"}
          to={item.url}
          level={nestedLevel + 1}
          role="button"
          onClick={handleClick}
          open={navbar.open}>

          <ListItemIcon
            className=" fuse-list-item-icon min-w-0 text-25" >
            {item.icon &&
              <Icon className="icon "
                color="inherit" >
                {item.icon}
              </Icon>
            }

          </ListItemIcon>
          {(navbar.open || !navbar.foldedOpen) &&
            <>
              <ListItemText className="fuse-list-subheader-text text-12"
                primary={item.title} classes={{ primary: "font-500 fuse-list-item-text-primary" }} />
              {!open ? <KeyboardArrowLeftIcon /> : <ExpandMore />}
            </>
          }
        </NavGroupContainer>
        {
          (item.children && navbar.open) &&
          <Collapse in={open} timeout="auto" sx={{ width: '100%' }} unmountOnExit>
            {
              item.children &&
              <>
                {item.children.map((_item) => (
                  <AppNavItem
                    key={_item.id}
                    type={`vertical-${_item.type}`}
                    item={_item}
                    nestedLevel={nestedLevel + 1}
                    onItemClick={onItemClick}
                  />
                ))}
              </>
            }
          </Collapse >
        }
      </>
    ),
    [item, nestedLevel, onItemClick, navbar, open]
  )
}
export default NavGroup
