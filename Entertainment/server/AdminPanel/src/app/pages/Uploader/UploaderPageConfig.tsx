import { authRoles } from "app/auth"
import UserList from "./UploaderPage"


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
            path: "/uploader",
            element: <UserList />,
            // title: "license_Plate_Reader",
        },
    ]
}

export default UserPageConfig
