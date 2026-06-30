import { authRoles } from "app/auth"
import Story from "./GenerStory"


const GenerStoryPageConfig = {
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
            },

        }
    },
    auth: authRoles.admin,
    routes: [
        {
            path: "genreStory/*",
            element: <Story />,
            // title: "license_Plate_Reader",
        },
    ]
}

export default GenerStoryPageConfig
