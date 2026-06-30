import { JSX } from "react"
import { NavigationItem } from "app/app-configs/types"

const components = {}

export function registerComponent(name: string, Component: (props: any) => JSX.Element) {
  components[name] = Component
}

type Props = {
  type: string
  item: NavigationItem
  nestedLevel: number
  onItemClick: (item: NavigationItem) => void
}

const AppNavItem = (props: Props) => {
  const Component = components[props.type]

  if (Component) {
    return <Component {...props} />
  }
  return null
}

export default AppNavItem
