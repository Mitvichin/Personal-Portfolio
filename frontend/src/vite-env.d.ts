/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

import { CSRF_TOKEN_COOKIE_NAME } from './utils/constants';
declare global {
  interface Window {
    [CSRF_TOKEN_COOKIE_NAME]?: string;
  }
}
