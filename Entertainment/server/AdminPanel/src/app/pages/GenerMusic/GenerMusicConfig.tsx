import { authRoles } from "app/auth"
import GenerMusic from "./GenerMusic"


const GenerMusicPageConfig = {
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
            path: "genreMusic/*",
            element: <GenerMusic />,
            // title: "license_Plate_Reader",
        },
    ]
}

export default GenerMusicPageConfig
