import { type TranslateFunction } from '@tager/admin-services';

import { type ExportStatus } from '../../typings/model';

export function getExportStatusLabel(
  status: ExportStatus,
  t: TranslateFunction
): string {
  switch (status) {
    case 'CREATED':
      return t('export:statusCreated');
    case 'IN_PROGRESS':
      return t('export:statusInProgress');
    case 'COMPLETED':
      return t('export:statusCompleted');
    case 'FAILURE':
      return t('export:statusFailure');
    default:
      return 'Unknown';
  }
}
