import TextField from "@mui/material/TextField";
import Icon from "@mui/material/Icon";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import { useState } from "react";
import { submitLogin } from "app/auth/store/loginSlice";
import { useAppDispatch, useAppSelector } from "app/store/hooks";
import { AccountCircle } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { passwordValidationSchema, usernameValidationSchema } from "./components/loginValidationSchema";
import { LoadingButton } from "@mui/lab";
import ToastMsg from "app/shared-components/ToastMsg"
import { toast } from "react-toastify";
import { CircularProgress } from "@mui/material";

type ItemTypes = {
  error: boolean,
  errorText: string
}

type ErrorTypes = {
  username: ItemTypes;
  password: ItemTypes;
}

function JWTLoginTab() {
  const dispatch = useAppDispatch();
  const { loading, success, error: loginError } = useAppSelector(({ auth }) => auth.login);
  // const { t } = useTranslation("LOGIN");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFromData] = useState({
    username: '',
    password: '',
  })
  const [errors, setErrors] = useState<ErrorTypes>({
    username: { error: false, errorText: '' },
    password: { error: false, errorText: '' },
  })

  const changeColor = (errorValue: string | undefined) => {
    return Boolean(errorValue) ? "#f44336 !important" : "white";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const resultUsername = await validationUsername("username", formData.username)
    const resultPassword = await validationPassword("password", formData.password)
    setErrors({
      password: resultPassword,
      username: resultUsername
    })
    if (!resultUsername.error && !resultPassword.error) {
      dispatch(submitLogin({ username: formData.username, password: formData.password }))
        .then((res: any) => {
          console.log(res);
          toast.success(res.data.firstName + '\t' + 'Wellcom', {
            position: "bottom-left",
            autoClose: 100000,
            closeOnClick: true,
            style: {
              direction: "ltr",
              textAlign: "left",
            },
          })
        })
        .catch(error => {
          toast.error(
            error.description.replace('_', ' '),
            {
              style: {
                direction: "ltr",
                textAlign: "left",
              }
            },
            // <ToastMsg
            //   msg={error.description}
            // code={error.name}
            // />
          )
        })
    }
  };

  const validationUsername = async (name: string, value: string) => {
    try {
      await usernameValidationSchema.validate({ [name]: value })
      return { error: false, errorText: '' }
    } catch (err: any) {
      return { error: true, errorText: err?.errors?.join() }
    }
  }
  const validationPassword = async (name: string, value: string) => {
    try {
      await passwordValidationSchema.validate({ [name]: value })
      return { error: false, errorText: '' }
    } catch (err: any) {
      return { error: true, errorText: err?.errors?.join() }
    }
  }

  const handleChangeUserName = async (event) => {
    const { name, value } = event.target
    setFromData({ ...formData, [name]: value })
    const resultUsername = await validationUsername(name, value)
    setErrors((err) => ({ ...err, username: resultUsername }))
  }

  const handleChangePassword = async (event) => {
    const { name, value } = event.target
    setFromData({ ...formData, [name]: value })
    const resultPassword = await validationPassword(name, value)
    setErrors((err) => ({ ...err, password: resultPassword }))
  }



  return (
    <div className="w-full pt-3">
      <form
        className="flex flex-col justify-center w-full"
        onSubmit={handleSubmit}
      >
        <TextField
          id="username"
          name="username"
          className="mb-2"
          type="text"
          label={'UserName'}
          value={formData.username}
          onChange={handleChangeUserName}
          // onBlur={formik.handleBlur}
          error={errors.username.error}
          helperText={errors.username.errorText}

          FormHelperTextProps={{
            sx: {
              color: changeColor(errors.username.errorText),
            }
          }}
          sx={{
            direction: 'ltr',
            '& .MuiInputLabel-asterisk': {
              color: changeColor(errors.username.errorText)
            },
            "& label": {
              color: changeColor(errors.username.errorText),
            },
            "& label.Mui-focused": {
              color: changeColor(errors.username.errorText),
            },
            "& MuiFormLabel-root": {
              color: changeColor(errors.username.errorText),
            },
            "& 	MuiOutlinedInput-root .Mui-error": {
              color: changeColor(errors.username.errorText),
            },
            "& MuiFormLabel-root .Mui-required": {
              color: changeColor(errors.username.errorText),
            },
            "& .MuiInput-underline:after": {
              borderBottomColor: changeColor(errors.username.errorText),
            },
            "& MuiOutlinedInput-input": {
              color: changeColor(errors.username.errorText),
            },
            "& .MuiOutlinedInput-root": {
              borderRadius: '30px',
              "& fieldset": {
                borderColor: changeColor(errors.username.errorText),
              },
              "&:hover fieldset": {
                color: changeColor(errors.username.errorText),
                borderColor: changeColor(errors.username.errorText),
              },
              "&.Mui-focused fieldset": {
                borderColor: changeColor(errors.username.errorText),
              },
            },
          }}
          InputProps={{
            sx: { color: "white" },
            endAdornment: (
              <InputAdornment position="end">
                <AccountCircle sx={{ mx: 1, color: changeColor(errors.username.errorText) }} />
              </InputAdornment>
            ),
          }}
          variant="outlined"
        />

        <TextField
          id="password"
          name="password"
          className="mb-2"
          label={'Password'}
          value={formData.password}
          onChange={handleChangePassword}
          // onBlur={handleBlur}
          error={errors.password.error}
          helperText={errors.password.errorText}
          variant="outlined"
          FormHelperTextProps={{
            sx: {
              color: changeColor(errors.password.errorText),
            }
          }}
          sx={{
            direction: 'ltr',

            '& .MuiInputLabel-asterisk': {
              color: changeColor(errors.password.errorText)
            },
            "& label": {
              color: changeColor(errors.password.errorText),
            },
            "& label.Mui-focused": {
              color: changeColor(errors.password.errorText),
            },
            "& MuiFormLabel-root": {
              color: changeColor(errors.password.errorText),
            },
            "& 	MuiOutlinedInput-root .Mui-error": {
              color: changeColor(errors.password.errorText),
            },
            "& MuiFormLabel-root .Mui-required": {
              color: changeColor(errors.password.errorText),
            },
            "& .MuiInput-underline:after": {
              borderBottomColor: changeColor(errors.password.errorText),
            },
            "& MuiOutlinedInput-input": {

              color: changeColor(errors.password.errorText),
            },
            "& .MuiOutlinedInput-root": {
              borderRadius: '30px',
              "& fieldset": {
                borderColor: changeColor(errors.password.errorText),
              },
              "&:hover fieldset": {
                color: changeColor(errors.password.errorText),
                borderColor: changeColor(errors.password.errorText),
              },
              "&.Mui-focused fieldset": {
                borderColor: changeColor(errors.password.errorText),
              },
            },
          }}
          InputProps={{
            className: "pr-0.25",
            type: showPassword ? "text" : "password",
            sx: { color: "white" },
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  size="small"
                >
                  <Icon
                    className="text-20"
                    color="action"
                    sx={{ mx: 1, color: changeColor(errors.password.errorText) }}
                  >
                    {showPassword ? "visibility" : "visibility_off"}
                  </Icon>
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <LoadingButton
          color={'info'}
          loading={loading}
          type="submit"
          sx={{
            alignSelf: "flex-end", borderRadius: '30px',

            "&.Mui-disabled": {
              backgroundColor: 'rgba(46, 224, 247, .4)',
            },
          }}
          variant="contained"
          className="px-6 mx-auto mt-2"
          loadingIndicator={
            <CircularProgress
              sx={{ color: 'white' }}
              size={20}
            />
          }
        >
          Enter
        </LoadingButton>

      </form>
    </div>
  );
}

export default JWTLoginTab;
