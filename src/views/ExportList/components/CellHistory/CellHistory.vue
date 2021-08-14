<template>
  <ul v-if="history.length > 0">
    <li v-for="(history, index) of history" :key="index">
      <span class="name">
        {{ history.status }}
      </span>
      {{ dateTimeFormat(history.datetime) }}
    </li>
  </ul>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@vue/composition-api';

import { HistoryType } from '../../../../typings/model';

import { Props } from './CellHistory.types';
import { dateTimeFormat } from './CellHistory.helpers';

export default defineComponent<Props>({
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
