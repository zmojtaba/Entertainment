import { useTimeout } from "@core/hooks"
import LinearProgress from "@mui/material/LinearProgress"
import Typography from "@mui/material/Typography"
import PropTypes from "prop-types"
import { useState } from "react"
import clsx from "clsx"

function AppLoading({ delay = false }) {
  const [showLoading, setShowLoading] = useState(!delay)

  useTimeout(() => {
    setShowLoading(true)
  }, delay)

  return (
    <div
      className={clsx(
        "flex flex-1 flex-col items-center justify-center p-3",
        !showLoading && "hidden"
      )}
    >
      <Typography className="text-13 sm:text-20 mb-2" color="textSecondary">
        در حال بارگذاری ...
      </Typography>
      <LinearProgress
        className="w-24 sm:w-40 max-w-full rounded-0.125"
        color="secondary"
      />
    </div>
  )
}

AppLoading.propTypes = {
  delay: PropTypes.oneOfType([PropTypes.number, PropTypes.bool])
};

export default AppLoading
