import { authRoles } from "app/auth"
import UserList from "./UserPage"


const UserPageConfig = {
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
            path: "/users/*",
            element: <UserList />,
            // title: "license_Plate_Reader",
        },
    ]
}

export default UserPageConfig
