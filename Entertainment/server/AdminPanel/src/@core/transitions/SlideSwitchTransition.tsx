import React, { ReactNode, useState } from "react"
import { CSSTransition, SwitchTransition } from "react-transition-group"
import classes from "./styles.module.scss"

type Props = {
  orientation: Orientation
  steps: string[]
  activeStep: string
  children: ReactNode | ReactNode[]
}

type Orientation = "vertical" | "horizontal"

type TransDirection = "left" | "right" | "top" | "bottom"

const getInitialDir = (orientation: Orientation): TransDirection => {
  if (orientation === "horizontal") return "left"
  else return "bottom"
}

const getTransDir = (
  steps: string[],
  activeStep: string,
  orientation: Orientation
): TransDirection => {
  const activeIndex = steps.indexOf(activeStep)
  switch (orientation) {
    case "horizontal":
      return activeIndex < steps.length - 1 ? "left" : "right"
    case "vertical":
      return activeIndex < steps.length - 1 ? "bottom" : "top"
  }
}

const SlideSwitchTransition = (props: Props) => {
  
  const { activeStep, steps, orientation, children } = props
  
  const [transDir, setTransDir] = useState<TransDirection>(getInitialDir(orientation))
  
  return (
    <div className={classes.container}>
      
      <SwitchTransition mode="out-in">
        <CSSTransition
          key={activeStep}
          addEndListener={(node, done) => {
            node.addEventListener("transitionend", done, false)
            setTransDir(getTransDir(steps, activeStep, orientation))
          }}
          classNames={`slide-${orientation}-${transDir}`}
        >
          <div className="w-full h-full relative translate-y-0">
            {children}
          </div>
        </CSSTransition>
      </SwitchTransition>
    </div>
  )
}

export default SlideSwitchTransition
