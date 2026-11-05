import { request, type ResponseBody } from '@tager/admin-services';

import {
  type StrategyType,
  type ExportCreatePayload,
  type ExportType,
} from '../typings/model';

export function getExportList(params?: {
  pageNumber?: number;
  pageSize?: number;
}): Promise<ResponseBody<Array<ExportType>>> {
  return request.get({ path: '/admin/tager/export', params });
}

export function getStrategies(): Promise<ResponseBody<Array<StrategyType>>> {
  return request.get({ path: '/admin/tager/export/strategies' });
}

export function createExport(
  payload: ExportCreatePayload
): Promise<ResponseBody<ExportType>> {
  return request.post({ path: '/admin/tager/export', body: payload });
}
