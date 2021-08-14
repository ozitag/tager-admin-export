import { computed } from '@vue/composition-api';

import { OptionType } from '@tager/admin-ui';
import { FieldUnion, universalFieldUtils } from '@tager/admin-dynamic-field';

import { ExportCreatePayload, StrategyType } from '../../typings/model';

import { FormValues } from './ExportForm.types';

export function convertExportFormValuesToCreationPayload(
  values: FormValues,
  templateValues: Array<FieldUnion>
): ExportCreatePayload {
  return {
    strategy: values.strategy?.value ?? '',
    filename: values.filename,
    format: values.format?.value ?? '',
    delimiter: values.delimiter?.value ?? '',
    params: templateValues.map((field) => ({
      name: field.config.name,
      value: universalFieldUtils.getOutgoingValue(field),
    })),
  };
}

export function convertStrategiesToStrategyOptionList(
  strategies: Array<StrategyType>
): Array<OptionType> {
  return strategies.map((strategy) => ({
    label: strategy.name,
    value: strategy.id,
  }));
}

export const formatOptionList = [
  { value: 'CSV', label: 'CSV' },
  { value: 'XLS', label: 'XLS' },
  { value: 'XML', label: 'XML' },
  { value: 'YAML', label: 'YAML' },
  { value: 'JSON', label: 'JSON' },
  { value: 'TXT', label: 'TXT' },
];

export function isCSVFormat(format: string): boolean {
  return format === 'CSV';
}
