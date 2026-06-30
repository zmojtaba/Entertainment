import { createContext } from "react"
import { RouteItem } from "./app-configs/routesConfig"

const AppContext = createContext<{ routes?: RouteItem[] }>({})

export default AppContext
