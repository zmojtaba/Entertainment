import { authRoles } from "app/auth"
import BookList from "./BookPage"


const BookPageConfig = {
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
            path: "/books/*",
            element: <BookList />,
            // title: "license_Plate_Reader",
        },
    ]
}

export default BookPageConfig
