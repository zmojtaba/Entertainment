import QuickPanel from "app/layout/shared-components/quickPanel/QuickPanel"
import { memo } from "react"
import Exports from "app/layout/shared-components/export/Exports"

function RightSideLayout1() {
  return (
    <>
      <QuickPanel />
      <Exports />
    </>
  )
}

export default memo(RightSideLayout1)
