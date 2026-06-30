import { authRoles } from "app/auth"
import PodcastsList from "./PodcastPage"


const PodcastPageConfig = {
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
            path: "/podcasts/*",
            element: <PodcastsList />,
            // title: "license_Plate_Reader",
        },
    ]
}

export default PodcastPageConfig
