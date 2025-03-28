import { backendErrorsMap } from "../../utils/backendErrorsMap";

export type BackendError = {
  message: keyof typeof backendErrorsMap;
  key?: string;
};
