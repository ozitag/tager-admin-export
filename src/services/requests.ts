import { request, ResponseBody } from '@tager/admin-services';

import {
  StrategyType,
  ExportCreatePayload,
  ExportType,
} from '../typings/model';

export function getExportList(params?: {
  pageNumber?: number;
  pageSize?: number;
}): Promise<ResponseBody<Array<ExportType>>> {
  return request.get({ path: '/admin/tager/export', params });
}

export function getStrategyList(): Promise<ResponseBody<Array<StrategyType>>> {
  return request.get({ path: '/admin/tager/export/strategies' });
}

export function createExport(
  payload: ExportCreatePayload
): Promise<ResponseBody<ExportType>> {
  return request.post({ path: '/admin/tager/export', body: payload });
}
