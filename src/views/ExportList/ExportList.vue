<template>
  <page
    :title="$t('export:export')"
    :header-buttons="[
      {
        text: $t('export:newExport'),
        href: getExportFormUrl({ exportId: 'create' }),
      },
    ]"
  >
    <data-table
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
      <template v-slot:cell(history)="{ row }">
        <CellHistory :history="row.history" />
      </template>
    </data-table>
  </page>
</template>

<script lang="ts">
import { defineComponent, onMounted } from '@vue/composition-api';

import {
  ColumnDefinition,
  useDataTable,
  useTranslation,
} from '@tager/admin-ui';

import { getExportList } from '../../services/requests';
import { ExportType } from '../../typings/model';
import { getExportFormUrl } from '../../utils/paths';

import { CellHistory } from './components/CellHistory';

export default defineComponent({
  name: 'ExportList',
  components: { CellHistory },
  setup(props, context) {
    const { t } = useTranslation(context);

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
      context,
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
        style: { width: '50px', textAlign: 'center' },
        headStyle: { width: '50px', textAlign: 'center' },
      },
      {
        id: 2,
        name: t('export:type'),
        field: 'strategy',
        style: { width: '15%' },
        headStyle: { width: '15%' },
      },
      {
        id: 3,
        name: t('export:status'),
        field: 'status',
        style: { width: '15%' },
        headStyle: { width: '15%' },
      },
      {
        id: 4,
        name: t('export:message'),
        field: 'message',
      },

      {
        id: 5,
        name: t('export:log'),
        field: 'history',
        style: { width: '25%' },
        headStyle: { width: '25%' },
      },
      {
        id: 6,
        name: t('export:file'),
        field: 'file',
        type: 'file',
        style: { width: '150px', textAlign: 'center' },
        headStyle: { width: '150px', textAlign: 'center' },
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
