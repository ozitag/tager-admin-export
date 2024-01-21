<template>
  <Page
    :title="$i18n.t('export:export')"
    :header-buttons="[
      {
        text: $i18n.t('export:newExport'),
        href: getExportFormUrl({ exportId: 'create' }),
      },
    ]"
  >
    <DataTable
      :column-defs="columnDefs"
      :row-data="rowData"
      :loading="isRowDataLoading"
      :error-message="errorMessage"
      :pagination="{
        pageSize,
        pageCount,
        pageNumber,
        disabled: isRowDataLoading,
      }"
      :use-search="false"
      @change="handleChange"
    >
      <template #cell(history)="{ row }">
        <CellHistory :history="row.history" />
      </template>
    </DataTable>
  </Page>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';

import { useI18n } from '@tager/admin-services';
import { Page } from '@tager/admin-layout';
import {
  type ColumnDefinition,
  DataTable,
  useDataTable,
} from '@tager/admin-ui';

import { getExportList } from '../../services/requests';
import { ExportType } from '../../typings/model';
import { getExportFormUrl } from '../../utils/paths';

import { CellHistory } from './components/CellHistory';
import { getExportStatusLabel } from './ExportList.helpers';

export default defineComponent({
  name: 'ExportList',
  components: {
    Page,
    CellHistory,
    DataTable,
  },
  setup() {
    const { t } = useI18n();

    const {
      fetchEntityList: fetchExportList,
      isLoading: isExportListLoading,
      rowData: exportList,
      errorMessage,
      searchQuery,
      handleChange,
      pageSize,
      pageCount,
      pageNumber,
    } = useDataTable<ExportType>({
      fetchEntityList: (params) =>
        getExportList({
          pageNumber: params.pageNumber,
          pageSize: params.pageSize,
        }),
      initialValue: [],
      resourceName: 'Export list',
      pageSize: 100,
    });

    onMounted(() => {
      fetchExportList();
    });

    const columnDefs: Array<ColumnDefinition<ExportType>> = [
      {
        id: 1,
        name: 'ID',
        field: 'id',
        width: '50px',
      },
      {
        id: 2,
        name: t('export:status'),
        field: 'status',
        width: '120px',
        format: ({row}) => getExportStatusLabel(row.status, t)
      },
      {
        id: 3,
        name: t('export:type'),
        field: 'strategy',
        width: '200px',
        options: {
          maxLength: 24,
        },
      },
      {
        id: 4,
        name: t('export:params'),
        field: 'params',
        type: 'key-value',
        format: ({ row }) => {
          const result: any[] = [];

          Object.keys(row.params).forEach((param) => {
            result.push({
              key: param,
              value: row.params[param],
            });
          });

          return result;
        },
      },
      {
        id: 5,
        name: t('export:message'),
        field: 'message',
        width: '200px',
      },
      {
        id: 6,
        name: t('export:log'),
        field: 'history',
        width: '300px',
      },
      {
        id: 7,
        name: t('export:file'),
        field: 'file',
        type: 'file',
        width: '100px',
        style:{
          textAlign: 'center'
        },
        headStyle:{
          textAlign: 'center'
        }
      },
    ];

    return {
      columnDefs,
      getExportFormUrl,
      rowData: exportList,
      isRowDataLoading: isExportListLoading,
      errorMessage: errorMessage,
      searchQuery,
      handleChange,
      pageSize,
      pageCount,
      pageNumber,
    };
  },
});
</script>
