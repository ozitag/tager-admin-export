import { FileType } from '@tager/admin-services';
import {
  FieldConfigUnion,
  FieldShortType,
  OutgoingValueUnion,
} from '@tager/admin-dynamic-field';

export type ExportStatus = 'CREATED' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILURE';

export interface HistoryType {
  readonly datetime: string;
  readonly status: ExportStatus;
}

export interface ExportType {
  readonly id: number;
  readonly strategy: string;
  readonly status: ExportStatus;
  readonly message: string | null;
  readonly history: Array<HistoryType>;
  readonly file: FileType | null;
  readonly params: Record<string, string>;
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
