import { memo } from "react"
import Divider from "@mui/material/Divider"
import NavVerticalCollapse from "./types/NavCollapse"
import NavGroup from "./types/NavGroup"
import NavVerticalItem from "./types/NavItem"
import NavVerticalLink from "./types/NavLink"
import AppNavItem, { registerComponent } from "./AppNavItem"
import { inputGlobalStyles, StyledList } from "./styledComponents"
import { NavigationItem } from "app/app-configs/types"

registerComponent("vertical-group", NavGroup)
registerComponent("vertical-collapse", NavVerticalCollapse)
registerComponent("vertical-item", NavVerticalItem)
registerComponent("vertical-link", NavVerticalLink)
registerComponent("vertical-divider", () => <Divider className="my-2" />)

type Props = {
  navigation: NavigationItem[]
  onItemClick: (item: NavigationItem) => void
}


const AppNavigation = (props: Props) => {
  const {
    navigation,
    onItemClick
  } = props

  if (navigation.length > 0) {
    return (
      <>
        {inputGlobalStyles}
        <StyledList disablePadding 
          className={"navigation whitespace-nowrap px-1.5 flex items-center flex-col "} >
          {
            navigation.map((_item) => (
              <AppNavItem
                key={_item.id}
                type={`vertical-${_item.type}`}
                item={_item}
                nestedLevel={0}
                onItemClick={onItemClick}
              />
            ))
          }
        </StyledList>
      </>
    )
  }
  return null
}

export default memo(AppNavigation)


