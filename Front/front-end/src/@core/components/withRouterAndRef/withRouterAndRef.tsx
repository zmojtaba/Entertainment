import { Component, forwardRef } from "react"
import withRouter from "@core/components/withRouter"

const withRouterAndRef = (WrappedComponent) => {
  class InnerComponentWithRef extends Component {
    props: any
    
    render() {
      const { forwardRef: _forwardRef, ...rest } = this.props
      return <WrappedComponent {...rest} ref={_forwardRef} />
    }
  }
  
  const ComponentWithRouter = withRouter(InnerComponentWithRef, {
    withRef: true
  })
  return forwardRef<any, any>((props, ref) => (
    <ComponentWithRouter {...props} forwardRef={ref} />
  ))
}

export default withRouterAndRef
