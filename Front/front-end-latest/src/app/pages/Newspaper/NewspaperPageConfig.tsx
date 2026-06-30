import { authRoles } from "app/auth"
import Newspapers from "./NewspaperPage"


const NewspaperPageConfig = {
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
            path: "/newspapers/*",
            element: <Newspapers />,
            // title: "license_Plate_Reader",
        },
    ]
}

export default NewspaperPageConfig
