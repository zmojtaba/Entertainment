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
            path: "/movies/*",
            element: <Movies />,
            // title: "license_Plate_Reader",
        },
    ]
}

export default MoviePageConfig
