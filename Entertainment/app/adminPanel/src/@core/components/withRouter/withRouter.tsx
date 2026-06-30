import { useLocation, useNavigate } from "react-router-dom"

function withRouter(Child: any, withRef?: any) {
  return (props: any) => {
    const location = useLocation()
    const navigate = useNavigate()
    return <Child {...props} navigate={navigate} location={location} />
  }
}

export default withRouter
