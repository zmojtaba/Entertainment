import React from "react"
import { FieldHookConfig, useField } from "formik"
import {
  alpha,
  FormControl,
  InputBase,
  InputLabel,
  MenuItem,
  Select,
  SelectProps,
  styled,
  SxProps,
  TextField,
  TextFieldProps,
  Theme,
  Typography
} from "@mui/material"

const StyledLabel = styled(InputLabel)(({ theme }) => ({
  fontWeight: 500,
  fontSize: "1.23em",
  marginTop: 0,
  marginLeft: 5,
  "&.MuiInputLabel-root.Mui-focused": {
    color: theme.palette.text.primary
  }
}))

const BootstrapInput = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-notchedOutline": {
    border: 0
  },
  "& .MuiFormHelperText-root": {
    marginTop: 8
  },
  "& .MuiOutlinedInput-root": {
    border: `1px solid ${theme.palette.primary.main}`,
    transition: theme.transitions.create([
      "border-color",
      "background-color",
      "border-width"
    ])
  },
  "& .MuiOutlinedInput-root.Mui-focused": {
    borderColor: theme.palette.primary.main,
    backgroundColor:
      theme.palette.mode === "light"
        ? alpha(theme.palette.primary.main, 0.15)
        : "#2b2b2b"
  },
  "& .MuiTypography-root": {
    color: theme.palette.text.primary
  },
  "& .MuiInputBase-input": {
    position: "relative",
    fontSize: "1em",
    width: "100%",
    padding: "6px 6px"
  },
  "& .MuiInputAdornment-root": {
    marginLeft: 0
  }
}))
const BootstarpBase = styled(InputBase)(({ theme }) => ({
  "label + &": {
    marginTop: theme.spacing(3)
  },
  "& .MuiInputBase-input": {
    position: "relative",
    border: "1px solid #ced4da",
    fontSize: "1em",
    width: "100%",
    padding: "6px 6px",
    transition: theme.transitions.create(["border-color", "box-shadow"]),
    borderColor: theme.palette.primary.main,
    borderRadius: 7,
    "&:focus": {
      borderRadius: 7,
      
      borderColor: theme.palette.primary.main,
      backgroundColor:
        theme.palette.mode === "light"
          ? alpha(theme.palette.primary.main, 0.15)
          : "#2b2b2b"
    },
    "& .MuiOutlinedInput-root.Mui-focused": {
      borderColor: theme.palette.primary.main,
      backgroundColor:
        theme.palette.mode === "light"
          ? alpha(theme.palette.primary.main, 0.15)
          : "#2b2b2b"
    },
    "& .MuiTypography-root": {
      color: theme.palette.text.primary
    }
  }
}))

export function YInput(
  props: Partial<TextFieldProps> & { rootSx?: SxProps<Theme> }
) {
  const { rootSx, ...inputProps } = props
  return (
    <FormControl
      sx={{
        mt: 0,
        mb: 0,
        display: "flex",
        ...rootSx
      }}
      fullWidth={!!inputProps.fullWidth}
      variant="standard"
      margin="dense"
    >
      <StyledLabel shrink>{inputProps.label}</StyledLabel>
      <BootstrapInput
        {...inputProps}
        label={undefined}
        dir="auto"
        sx={{
          ...props.sx,
          "label + &": { marginTop: inputProps.label ? 3 : 0 }
        }}
      />
    </FormControl>
  )
}

type YSelectProps = {
  label?: string
  options:
    | { label: string; value: string | number | boolean | null }[]
    | string[]
  rootSx?: SxProps<Theme>
  helperText?: string
} & Partial<SelectProps>

export const YSelect: React.FC<YSelectProps> = (props: YSelectProps) => {
  const { rootSx, ...rest } = props
  
  return (
    <FormControl
      sx={{
        mt: props.label ? 1.3 : 0,
        mb: 0,
        ...props.rootSx,
        ".MuiPopover-root": {
          zIndex: 130000000000000000000000000
        }
      }}
      margin="dense"
    >
      <StyledLabel
        sx={{
          transform: "translate(0px, -11px) scale(0.75)"
        }}
        shrink
      >
        {props.label}
      </StyledLabel>
      <Select
        {...rest}
        input={<BootstarpBase />}
        label={null}
        id={props.label}
        size="small"
        sx={{
          ...props.sx,
          "label + &": {
            marginTop: props.label ? 1.5 : 0
          }
        }}
      >
        {props.options.map((o) => (
          <MenuItem
            key={typeof o === "string" ? o : o.value}
            value={typeof o === "string" ? o : o.value}
          >
            {typeof o === "string" ? o : o.label}
          </MenuItem>
        ))}
      </Select>
      {props.helperText && (
        <Typography fontSize="0.9em" sx={{ mt: 1, ml: 1 }} color="error.main">
          {props.helperText}
        </Typography>
      )}
    </FormControl>
  )
}

type CustomFieldProps = {
  label: string
  multiline?: boolean
  type?: string
  rows?: number
} & FieldHookConfig<string>

export const YTextField: React.FC<CustomFieldProps> = ({
                                                         label,
                                                         type,
                                                         style,
                                                         ...props
                                                       }) => {
  const [field] = useField(props)
  
  return (
    <TextField
      size="small"
      style={{ ...style }}
      type={type || undefined}
      label={label}
      multiline={props.multiline || false}
      rows={props.rows}
      variant="outlined"
      {...field}
    />
  )
}

const StyledSelect = styled("div")(({ theme }) => ({
  height: "43px",
  width: "100%",
  border: "1px solid",
  borderColor: theme.palette.primary.main,
  display: "inline-flex",
  alignItems: "center",
  marginTop: theme.spacing(1.2)
}))

const SelectContainer = styled("div")(({ theme }) => ({
  width: "100%",
  marginTop: theme.spacing(2.5),
  textAlign: "left"
}))

export function SelectField(props: any) {
  return (
    <SelectContainer>
      <StyledLabel style={{ fontSize: ".87em", textAlign: "right" }}>
        {props.label}
      </StyledLabel>
      <StyledSelect {...props}>{props.children}</StyledSelect>
      {props.error && (
        <Typography
          sx={{ marginTop: "8px", marginLeft: "14px" }}
          color="error"
          variant="caption"
        >
          {props.error}
        </Typography>
      )}
    </SelectContainer>
  )
}

export default SelectField
