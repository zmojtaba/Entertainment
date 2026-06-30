import React, { ReactNode, useEffect, useRef, useState } from "react"
import $ from "jquery"
import { toast } from "react-toastify"
//@ts-ignore
import domtoimage from "dom-to-image-improved"
import {
  Box,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  TextField,
  Tooltip as MuiToolTip,
  Zoom
} from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import SaveIcon from "@mui/icons-material/Save"
import DownloadIcon from "@mui/icons-material/Download"
import CameraAltIcon from "@mui/icons-material/CameraAlt"
import i18n from "i18next"
import { useTranslation } from "react-i18next"
import ReactCrop, { Crop } from "react-image-crop"
import "react-image-crop/dist/ReactCrop.css"
import { CancelOutlined, Check, Print } from "@mui/icons-material"
import CropIcon from "@mui/icons-material/Crop"
import { closeModal } from "app/store/snapShot"
import { useAppDispatch } from "app/store/hooks"
import ResetIcon from "@mui/icons-material/RotateLeft"
import { LoadingButton } from "@mui/lab"

/*
@Auhtor morgan
  all right reserved :/
*/
interface snapshotButtonPropsType {
  onClick(e: React.MouseEvent<HTMLElement, MouseEvent>): void;
  title?: string;
  style?: {};
}
export function SnapShotButton(props: snapshotButtonPropsType) {
  const { t } = useTranslation("hamrah")
  const { onClick, title, style } = props
  return (
    <MuiToolTip title={title ? title : t("W620")}>
      <IconButton
        disableRipple
        className="snap-shot hidden-print"
        onClick={onClick}
        sx={{ p: 0.5, ...style }}
      >
        <CameraAltIcon sx={{ fonSize: 12 }} />
        <CircularProgress
          size={21}
          className="muiLoader"
          sx={{ display: "none" }}
          color="success"
        />
      </IconButton>
    </MuiToolTip>
  )
}

SnapShotButton.defaultProps = {
  style: {}
}
//end shotButton


export type SHOT_MODE = "MAP" | "CHART"

export const SnapshotCreator = (
  e: React.MouseEvent<HTMLElement, MouseEvent>,
  shotMode?: SHOT_MODE
): Promise<string> => {
  return new Promise((resolve) => {
    e.stopPropagation()
    const { currentTarget: shotButton } = e
    let screenElement: JQuery<HTMLElement>
    let leafletControlContainer: JQuery<HTMLElement>
    screenElement = $(shotButton).parents(".panel").find(".panel-body")
    if (shotMode === "CHART") {
      screenElement = $(shotButton)
        .parents(".panel")
        .find(".panel-body")
        .find("canvas")
    }
    
    $(shotButton).children(".muiLoader").css("display", "block")
    $(shotButton).children().first().css("display", "none")
    
    setTimeout(() => {
      if (shotMode === "MAP") {
        screenElement = $(shotButton).parents(".leaflet-container")
        leafletControlContainer = $(shotButton)
          .parents(".leaflet-container")
          .find(".leaflet-control-container, .panelContainer")
          .hide()
      }
      domtoimage
        .toPng(screenElement[0], {
          bgcolor: "white",
          width: screenElement[0].clientWidth,
          height: screenElement[0].clientHeight
        })
        .then(function(dataUrl: string) {
          resolve(dataUrl)
          if (leafletControlContainer) leafletControlContainer.show()
          $(shotButton).children(".muiLoader").css("display", "none")
          $(shotButton).find(".snap-shot .fa-camera").show()
          $(shotButton).css("pointer-events", "").find("#loading").remove()
          $(shotButton).children().first().css("display", "block")
        })
        .then(() => {
        })
        .catch(function(error) {
          console.log(error)
          const msg = i18n.t("hamrah:W622")
          toast.error(msg, {
            autoClose: 4000,
            closeOnClick: true,
            pauseOnHover: true
          })
          $(shotButton).css("pointer-events", "").find("#loading").remove()
          $(shotButton).children(".muiLoader").css("display", "none")
          $(shotButton).children().first().css("display", "block")
        })
    }, 500)
  })
}


interface propsType {
  croppable?: boolean;
  id?: number;
  date?: string;
  description: string;
  image: string;
  onUpdateEnd?(snapshot: snapshot): void
  printable?: boolean;
  setCroppedImage?: React.Dispatch<React.SetStateAction<string>>;
  showMapLegend?: boolean;
  title?: ReactNode;
}
interface snapshot {
  captureDate: string,
  description: string,
  snapshot: string,
  id: number,
  formattedCaptureDate?: string;
}

export default function SnapShotDialog(props: propsType) {
  const {
    croppable,
    id,
    date,
    printable,
    setCroppedImage,
    showMapLegend,
    title,
    onUpdateEnd
  } = props
  
  const { t } = useTranslation("hamrah")
  const [crop, setCrop] = useState<Crop>()
  const [description, setTexAreaValue] = useState("")
  const [image, setImage] = useState<string | null>("")
  const [cropping, setCropping] = useState<boolean>(false)
  const imageRef = useRef<any>(null)
  const dispatch = useAppDispatch()
  const [loading, setLoading] = useState(false)
  const [firsImage, setFirsImage] = useState("")
  const [showReset, setShowReset] = useState(false)
  
  const startCrop = () => {
    setCropping(true)
  }
  const cancelCrop = () => {
    setCropping(false)
  }
  
  const applyCrop = () => {
    if (crop) {
      let canvas = document.createElement("canvas")
      let context = canvas.getContext("2d")
      let imageObj = new Image()
      canvas.width = crop.width
      canvas.height = crop.height
      imageObj.onload = () => {
        console.log(
          imageObj.naturalWidth,
          imageObj.naturalHeight,
          imageObj.width,
          imageObj.height
        )
        const scaleX = imageObj.naturalWidth / imageRef.current.width
        const scaleY = imageObj.naturalHeight / imageRef.current.height
        console.log("scale x", scaleX, "scale y", scaleY)
        if (context) {
          context.drawImage(
            imageObj,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            crop.width,
            crop.height
          )
          setCropping(false)
        }
        const imageData = canvas.toDataURL("image/jpeg", 1)
        setCroppedImage?.(imageData)
        setImage(imageData)
        setShowReset(true)
      }
      if (image) imageObj.src = image
    }
  }
  
  useEffect(() => {
    if (cropping) {
      if (typeof crop === "undefined") {
        if (imageRef.current)
          setCrop({
            unit: "px",
            width: imageRef.current.width / 2,
            height: imageRef.current.height / 2,
            x: imageRef.current.width / 4,
            y: imageRef.current.height / 4
          })
      }
    }
  }, [cropping])
  
  useEffect(() => {
    setImage(props.image)
    setFirsImage(props.image)
    setTexAreaValue(props.description)
  }, [props.image, props.description])
  
  const handleInputFile = function(e: React.ChangeEvent<HTMLInputElement>) {
    let el = e.currentTarget
    if (
      el.files &&
      el.files[0] &&
      el.files[0].type &&
      el.files[0].type.toString().indexOf("image") === 0
    ) {
      let reader = new FileReader()
      reader.onload = function(res) {
        if (res.target && typeof res.target.result === "string")
          setImage(res.target.result)
      }
      reader.readAsDataURL(el.files[0])
    }
  }
  
  const handleSaveSnapShot = () => {
    setLoading(true)
    // getSnapshotResource()
    //   .put<snapshot>("/snapshot/snapshot",
    //     {
    //       captureDate: new Date(date || Date.now()).toISOString(),
    //       description: description,
    //       snapshot: image,
    //       id: id || null
    //     },
    //     {
    //       headers: {
    //         "Content-Type": "application/json; charset=UTF-8"
    //       }
    //     }
    //   )
    //   .then((res) => {
    //     toast.success<string>(t("W621"))
    //     setTimeout(() => {
    //       handleCloseModal()
    //       onUpdateEnd?.(res.data)
    //       setLoading(false)
    //     }, 700)
    //   })
    //   .catch((error) => {
    //     if (error && error.response.status === 413) {
    //       toast.error<string>(t("W630"))
    //     } else {
    //       toast.error<string>(t("W622"))
    //     }
    //     setLoading(false)
    //   })
  }
  
  const handleCloseModal = () => {
    dispatch(closeModal())
  }
  
  const handleDownload = () => {
    if (image) {
      let downloadLink = document.createElement("a")
      downloadLink.setAttribute("href", image)
      downloadLink.setAttribute("download", description.split(/\n/)[0])
      downloadLink.click()
      downloadLink.remove()
    }
  }
  
  const handleResetCroping = () => {
    cancelCrop()
    setImage(firsImage)
    setShowReset(false)
    
  }
  
  return (
    <Dialog
      id={"snapshot-dialog"}
      sx={{ zIndex: 8000 }}
      fullWidth={true}
      maxWidth="lg"
      open={true}
      onClose={handleCloseModal}
      TransitionComponent={Zoom}
      TransitionProps={{
        timeout: 500
      }}
      keepMounted
    >
      <DialogTitle sx={{ displayPrint: "none", pt: 0.5, pb: 0, px: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Box
            component={"span"}
            sx={{
              marginRight: "10px",
              fontSize: ".8em",
              mr: "auto"
            }}
          >
            {t("W620")}
          </Box>
          {croppable &&
            (!cropping ? (
              <IconButton onClick={startCrop} title={t("W87")}>
                <CropIcon fontSize="small" />
              </IconButton>
            ) : (
              <>
                <IconButton
                  onClick={cancelCrop}
                  title={t("W24_1")}
                >
                  <CancelOutlined fontSize="small" />
                </IconButton>
                <IconButton onClick={applyCrop} title={t("W88")}>
                  <Check fontSize="small" />
                </IconButton>
              </>
            ))}
          {printable && (
            <IconButton
              onClick={() => {
                if (!cropping) {
                  window.print()
                }
              }}
              disabled={cropping}
            >
              <MuiToolTip title={t("W77")}>
                <Print fontSize="small" />
              </MuiToolTip>
            </IconButton>
          )}
          {image && (<>
              <IconButton onClick={handleDownload}>
                <DownloadIcon fontSize="small" />
              </IconButton>
              <IconButton onClick={handleResetCroping} disabled={!showReset}>
                <MuiToolTip title={t("RESET")}>
                  <ResetIcon fontSize="small" />
                </MuiToolTip>
              </IconButton>
            </>
          )}
          <IconButton onClick={handleCloseModal}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </DialogTitle>
      <Divider sx={{ displayPrint: "none" }} />
      <DialogContent
        className="dialog-content"
        sx={{
          height: "calc(75vh - 60px)",
          pb: 0
        }}
      >
        <Box
          sx={{
            height: 1,
            ".ReactCrop__child-wrapper": { height: "100%" }
          }}
        >
          {title}
          <Box
            sx={[{
              display: "flex",
              height: showMapLegend ? 0.7 : 1,
              justifyContent: "center"
            }, (!croppable && !cropping) ? { alignItems: "center" } : {}]}
          >
            {croppable && cropping && image && (
              <ReactCrop
                crop={crop}
                onChange={(c) => setCrop(c)}
                style={{ maxHeight: "100%" }}
              >
                <img
                  ref={imageRef}
                  src={image ?? ""}
                  alt={"snapShotImage"}
                  style={{
                    height: "100%"
                  }}
                />
              </ReactCrop>
            )}
            {(!croppable || (croppable && !cropping)) && image && (
              <img
                src={image ?? ""}
                alt={"snapShotImage"}
                style={{
                  cursor: "zoom-in",
                  maxHeight: "100%"
                }}
                onClick={(e) => {
                  let popupWin = window.open("", "_blank")
                  popupWin!.document.open()
                  popupWin!.document.write(
                    `<img src='${e.currentTarget.src}' />`
                  )
                  popupWin!.document.close()
                }}
              />
            )}
            
            {!image && (
              <div
                id="imageSelector"
                style={{
                  cursor: "pointer",
                  display: "flex",
                  height: "100%",
                  justifyContent: "space-around"
                }}
                title={t("W486")}
                onClick={(e) => {
                  $(e.currentTarget)
                    .parent()
                    .find("input[type=file]")
                    .trigger("click")
                }}
              >
                <i
                  className="fal fa-plus-square"
                  style={{
                    alignSelf: "center",
                    fontSize: "9vw",
                    opacity: 0.1
                  }}
                />
              </div>
            )}
            <input
              type="file"
              hidden={true}
              accept="image/x-png,image/gif,image/jpeg"
              onChange={(e) => handleInputFile(e)}
            />
          </Box>
         
        </Box>
      </DialogContent>
      <DialogActions
        sx={{
          display: "unset"
        }}
      >
        <Divider sx={{ displayPrint: "none", mt: 2 }} />
        <TextField
          multiline
          fullWidth
          onChange={({ target: { value } }) => setTexAreaValue(value)}
          value={description}
          minRows={1}
          maxRows={2}
          inputProps={{
            maxLength: 10000,
            style: {
              outline: 0
            }
          }}
          label={t("W92")}
          placeholder={t("W92")}
          sx={{ mt: 2 }}
        />
        <Box
          sx={{
            display: "flex",
            displayPrint: "none",
            justifyContent: "center",
            mt: 1
          }}
        >
          <LoadingButton
            endIcon={<SaveIcon />}
            onClick={handleSaveSnapShot}
            id="saveSnapshot"
            variant="contained"
            color="info"
            size="large"
            loading={loading}
            disabled={!image}
          >
            {t("W368")}
          </LoadingButton>
        </Box>
      </DialogActions>
    </Dialog>
  )
}
