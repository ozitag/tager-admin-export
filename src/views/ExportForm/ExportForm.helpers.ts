import { OptionType } from '@tager/admin-ui';

import { ExportCreatePayload } from '../../typings/model';

export type FormValues = {
  strategy: OptionType | null;
  filename: string;
  format: OptionType | null;
};

export function convertExportFormValuesToCreationPayload(
  values: FormValues
): ExportCreatePayload {
  return {
    strategy: values.strategy?.value ?? '',
    filename: values.filename,
    format: values.format?.value ?? '',
  };
}
