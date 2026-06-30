import { LoadingButtonProps } from "@mui/lab"

export type StatusButtonProps = Partial<LoadingButtonProps> & {
  isSuccess: boolean;
  isError: boolean;
  successMessage?: string;
  defaultText?: string;
  failureText?: string;
};

export type ColorValues =
  | "inherit"
  | "primary"
  | "secondary"
  | "success"
  | "error"
  | "info"
  | "warning"
  | undefined;
