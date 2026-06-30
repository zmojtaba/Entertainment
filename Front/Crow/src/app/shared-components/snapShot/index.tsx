import React from "react"
import SnapShotDialog, { SHOT_MODE, SnapshotCreator } from "./SnapShotDialog"
import { useAppDispatch, useAppSelector } from "app/store/hooks"
import { initialStateType, loadShotData } from "app/store/snapShot"

export { SnapShotButton } from "./SnapShotDialog"
export type { snapShotFnType } from "app/services/utils/public_types"

interface paramsType extends Omit<Partial<initialStateType>, "openModal"> {
  event?: React.MouseEvent<HTMLElement, MouseEvent>,
  shotMode?: SHOT_MODE,
  description: string
}

type returnType = [initialStateType | {}, (params: paramsType) => void]

/**use this hook for snapShot elements
 **set shotData true if  you need snapShot redux state
 */
export const useSnapShot = (shotData = false): returnType => {
  const dispatch = useAppDispatch()
  const snapShot = shotData ? useAppSelector(state => state.snapShot) : {}
  
  const setSnapShot = async (params: paramsType) => {
    let { event, shotMode, image, ...otherParams } = params
    if (event)
      image = await SnapshotCreator(event, shotMode)
    if (image !== undefined)
      dispatch(loadShotData({ ...otherParams, image }))
  }
  return [snapShot, setSnapShot]
}

export default () => {
  const shotState = useAppSelector(state => state.snapShot)
  const { openModal, ...props } = shotState
  
  return (
    openModal ?
      <SnapShotDialog  {...props} />
      : null
  )
}
