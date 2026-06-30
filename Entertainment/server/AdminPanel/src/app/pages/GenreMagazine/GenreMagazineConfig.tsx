import { authRoles } from "app/auth"
import Magazine from "./GenreMagazine"


const GenerMagazinePageConfig = {
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
            path: "genreMagazine/*",
            element: <Magazine />,
            // title: "license_Plate_Reader",
        },
    ]
}

export default GenerMagazinePageConfig
