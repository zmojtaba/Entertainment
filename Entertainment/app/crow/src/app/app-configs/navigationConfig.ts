import { authRoles } from "app/auth"
import { NavigationItem } from "./types"
import './navigation-i18n'

/* < ----------------------------- Artificial Intelligence Tools--------------------------------> */
const navigationConfig: NavigationItem[] = [

  {
    id: "Import_Files",
    title: "Crew",
    // translate: "Import Files",
    type: "item",
    auth: authRoles.crew,
    icon: "upload-file-icon",
    url: "/crews",
  },


]
export default navigationConfig
