import { FileType } from '@tager/admin-services';

interface HistoryType {
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
}

export interface ExportCreatePayload {
  strategy: string;
  filename: string;
  format: string;
}
