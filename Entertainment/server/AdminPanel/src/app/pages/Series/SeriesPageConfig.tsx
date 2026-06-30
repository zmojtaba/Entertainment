import { authRoles } from "app/auth"
import Series from "./SeriesPage"


const SeriesPageConfig = {
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
            path: "/series/*",
            element: <Series />,
            // title: "license_Plate_Reader",
        },
    ]
}

export default SeriesPageConfig
