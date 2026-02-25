import { authRoles } from "app/auth"
import Tracks from "./TrackPage"


const TrackPageConfig = {
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
            path: "/tracks/*",
            element: <Tracks />,
            // title: "license_Plate_Reader",
        },
    ]
}

export default TrackPageConfig
