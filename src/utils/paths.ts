import { compile } from 'path-to-regexp';

import { EXPORT_ROUTE_PATHS } from '../constants/paths';

export function getExportListUrl(): string {
  return EXPORT_ROUTE_PATHS.EXPORT_LIST;
}

export function getExportFormUrl(params: {
  exportId: string | number;
}): string {
  return compile(EXPORT_ROUTE_PATHS.EXPORT_FORM)(params);
}
