import path from 'path';
import { Plugin } from 'vite';

export const replaceImportMetaUrl = (): Plugin => {
  return {
    name: 'replace-import-meta-url',
    transform(code, id) {
      if (id.endsWith('.tsx') || id.endsWith('.ts')) {
        const relativePath = path
          .relative(process.cwd(), id)
          .replace(/\\/g, '/');

        return code.replace(
          /new URL\(import\.meta\.url\)\.pathname/g,
          JSON.stringify(`/${relativePath}`),
        );
      }
    },
  };
};
