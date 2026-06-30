import AppLoading from "@core/components/AppLoading"
import PropTypes from "prop-types"
import { PropsWithChildren, Suspense } from "react"

/**
 * React Suspense defaults
 * For to Avoid Repetition
 */

interface PropsType extends PropsWithChildren {
  delay?: number
}

function AppSuspense(props: PropsType) {
  const { delay = 0, children } = props
  return (
    <Suspense fallback={<AppLoading delay={delay} />}>
      {children}
    </Suspense>
  )
}


export default AppSuspense
