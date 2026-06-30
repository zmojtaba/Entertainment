import { authRoles } from "app/auth"
import Magazin from "./MagazinPage"


const MagazinPageConfig = {
    settings: {
        layout: {
            config: {
                footer: {
                    display: false
                },
                navbar: {
                    display: true
                },
                toolbar: {
                    display: true
                }
            }
        }
    },
    auth: authRoles.admin,
    routes: [
        {
            path: "/magazins/*",
            element: <Magazin />,
            // title: "license_Plate_Reader",
        },
    ]
}

export default MagazinPageConfig
