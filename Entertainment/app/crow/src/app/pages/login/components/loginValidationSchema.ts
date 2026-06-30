import * as yup from "yup"

export const usernameValidationSchema = yup.object().shape({
  username: yup.string().required("Please enter Username")
})

export const passwordValidationSchema=yup.object().shape({
  password:yup.string().min(4,"Password must be at least 4 characters long")
})

