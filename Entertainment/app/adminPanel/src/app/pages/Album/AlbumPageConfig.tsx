import { authRoles } from "app/auth"
import Albums from "./AlbumPage"


const AlbumPageConfig = {
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
            path: "/albums/*",
            element: <Albums />,
            // title: "license_Plate_Reader",
        },
    ]
}

export default AlbumPageConfig
