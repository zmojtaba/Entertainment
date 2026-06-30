import * as yup from "yup"

export const usernameValidationSchema = yup.object().shape({
  username: yup.string().required("Please enter a username ")
})

export const passwordValidationSchema=yup.object().shape({
  password:yup.string().min(8,"Password must be at least 8 characters long ")
})

