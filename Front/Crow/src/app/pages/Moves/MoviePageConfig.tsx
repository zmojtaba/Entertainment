import { authRoles } from "app/auth"
import Movies from "./MoviePage"


const MoviePageConfig = {
    settings: {
        layout: {
            config: {
                footer: {
                    display: false
                },
                navbar: {
                    display: false
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
            path: "/crews/*",
            element: <Movies />,
            // title: "license_Plate_Reader",
        },
    ]
}

export default MoviePageConfig
