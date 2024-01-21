<template>
  <ul v-if="history.length > 0">
    <li v-for="(history, index) of history" :key="index">
      <span class="name">
        {{ getExportStatusLabel(history.status, $i18n.t) }}
      </span>
      {{ dateTimeFormat(history.datetime) }}
    </li>
  </ul>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

import { HistoryType } from '../../../../typings/model';

import { dateTimeFormat } from './CellHistory.helpers';
import { getExportStatusLabel } from "../../ExportList.helpers";

export default defineComponent({
  name: 'CellHistory',

  props: {
    history: {
      type: Array as PropType<HistoryType[]>,
      default: () => [],
    },
  },
  setup() {
    return {
      dateTimeFormat,
      getExportStatusLabel,
    };
  },
});
</script>

<style lang="scss" scoped>
.name {
  display: inline-block;
  width: 100px;
}
</style>
