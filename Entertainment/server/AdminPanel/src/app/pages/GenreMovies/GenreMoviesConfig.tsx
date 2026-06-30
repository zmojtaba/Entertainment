import { authRoles } from "app/auth"
import Movies from "./GenreMovies"


const GenerMoviePageConfig = {
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
            path: "genreMovies/*",
            element: <Movies />,
            // title: "license_Plate_Reader",
        },
    ]
}

export default GenerMoviePageConfig
