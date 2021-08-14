import { OptionType } from '@tager/admin-ui';

export interface FormValues {
  strategy: OptionType | null;
  filename: string;
  format: OptionType | null;
  delimiter: OptionType | null;
}
