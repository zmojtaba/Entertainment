import { NavigationItem } from "app/app-configs/types"

export type NavComponentsProps = {
  item: NavigationItem
  nestedLevel: number
  onItemClick: (item: NavigationItem) => void
}