import AppUtils from "@core/utils";
import AppContext from "app/AppContext";
import { Component } from "react";
import { connect } from "react-redux";
import { matchRoutes, Navigate, NavigateFunction } from "react-router-dom";
import withRouter from "@core/components/withRouter";
import settingsConfig from "app/app-configs/settingsConfig";

type Props = {
  location: Location
  userRole: string[]
  navigate: NavigateFunction
  children: any
  setRedirectUrl: (url: string) => void
  defaultRedirectUrl: string
}

type State = {
  accessGranted: boolean
  routes: any
  redirectUrl?: string
}

class Authorization extends Component<Props, State> {
  defaultLoginRedirectUrl: string;

  constructor(props, context) {
    super(props);
    const { routes } = context;
    this.state = {
      redirectUrl: "/",
      accessGranted: true,
      routes
    };
    this.defaultLoginRedirectUrl = settingsConfig.loginRedirectUrl || "/";
  }

  static getDerivedStateFromProps(props, state) {
    // console.log("state",state)
    const { location, userRole } = props;
    const { pathname } = location;
    const matchedRoutes = matchRoutes(state.routes, pathname);
    const matched = matchedRoutes ? matchedRoutes[0] : false;
    return {
      accessGranted: matched ? AppUtils.hasPermission((matched as any).route.auth, userRole) : true
    };
  }

  componentDidMount() {
    if (!this.state.accessGranted) {
      this.redirectRoute();
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextState.accessGranted !== this.state.accessGranted;
  }

  componentDidUpdate() {
    if (!this.state.accessGranted) {
      this.redirectRoute();
    }
  }

  redirectRoute() {
    const { location, userRole, navigate, setRedirectUrl, defaultRedirectUrl } = this.props;
    // console.log("this.props",this.props)
    const { pathname } = location;
    const loginRedirectUrl = settingsConfig.loginRedirectUrl ?? this.defaultLoginRedirectUrl;

    /*
        User is guest
        Redirect to Login Page
        */

    if (!userRole || userRole.length === 0) {
      navigate({
        pathname: "/login",
        search: location.search,
      });
      //************ */
      // navigate(0) //to fix react router bug which prevents render of new uri component when the last portion of url changes
      //************ */

      settingsConfig.loginRedirectUrl = pathname;
    } else {
      /* 
        User is member
        User must be on unAuthorized page or just logged in
        Redirect to dashboard or loginRedirectUrl
        */
      let currentSearch = new URLSearchParams(location.search)
      currentSearch.delete('fallbackUrl');

      setTimeout(() => {
        navigate({
          pathname: loginRedirectUrl,
          search: currentSearch.toString(),
        });
      }, 400)
      settingsConfig.loginRedirectUrl = this.defaultLoginRedirectUrl;
    }
  }

  render() {
    return this.state.accessGranted ? (
      <>{this.props.children}</>
    ) : (
      <Navigate
        to={this.props.location.pathname !== "/login" ? "/login" : "/"}
      /> //to fix react router bug - solution #2
    )
  }
}

function mapStateToProps({ auth }): { userRole: string[] } {
  return {
    userRole: auth.user.role
  };
}

Authorization.contextType = AppContext;

export default withRouter(connect(mapStateToProps)(Authorization));
