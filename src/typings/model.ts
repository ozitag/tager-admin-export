import { FileType } from '@tager/admin-services';
import {
  FieldConfigUnion,
  FieldShortType,
  OutgoingValueUnion,
} from '@tager/admin-dynamic-field';

export interface HistoryType {
  readonly datetime: string;
  readonly status: string;
}

export interface ExportType {
  readonly id: number;
  readonly strategy: string;
  readonly status: string;
  readonly message: string | null;
  readonly history: Array<HistoryType>;
  readonly file: FileType | null;
}

export interface StrategyType {
  id: string;
  name: string;
  fields: Array<FieldConfigUnion>;
}

export interface ExportCreatePayload {
  strategy: string;
  filename: string;
  format: string;
  delimiter: string;
  params: Array<FieldShortType<OutgoingValueUnion>>;
}
