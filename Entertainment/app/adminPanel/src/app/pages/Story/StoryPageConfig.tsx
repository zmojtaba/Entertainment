import { authRoles } from "app/auth"
import Storys from "./StoryPage"


const StoryPageConfig = {
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
            path: "/storys/*",
            element: <Storys />,
            // title: "license_Plate_Reader",
        },
    ]
}

export default StoryPageConfig
