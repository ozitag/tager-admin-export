<template>
  <page :title="$t('export:newExport')" :is-content-loading="isContentLoading">
    <form novalidate @submit.prevent>
      <template>
        <form-field-select
          v-model="values.strategy"
          :options="strategyOptionList"
          :error="errors.strategy"
          :label="$t('export:exportType')"
          name="exportType"
        />

        <div class="field">
          <form-field
            v-model="values.filename"
            :error="errors.filename"
            :label="$t('export:filename')"
            name="filename"
          />

          <form-field-select
            v-model="values.format"
            :options="formatOptionList"
            :error="errors.format"
            :label="$t('export:format')"
            name="format"
          />

          <div />

          <form-field-select
            v-if="shouldDisplayDelimiter"
            v-model="values.delimiter"
            :options="delimiterOptionList"
            :error="errors.delimiter"
            :label="$t('export:delimiter')"
            name="delimiter"
          />
        </div>
      </template>
    </form>

    <template v-slot:footer>
      <FormFooter
        :back-href="getExportListUrl()"
        :on-submit="submitForm"
        :is-submitting="isSubmitting"
        :is-creation="true"
      />
    </template>
  </page>
</template>

<script lang="ts">
import { defineComponent, watch } from '@vue/composition-api';
import { computed, onMounted, ref } from '@vue/composition-api';

import { convertRequestErrorToMap, useResource } from '@tager/admin-services';
import {
  OptionType,
  TagerFormSubmitEvent,
  FormFooter,
  useTranslation,
} from '@tager/admin-ui';

import { createExport, getStrategyList } from '../../services/requests';
import { getExportListUrl } from '../../utils/paths';
import { replaceFileExtension } from '../../utils/common';

import {
  convertExportFormValuesToCreationPayload,
  FormValues,
} from './ExportForm.helpers';

export default defineComponent({
  name: 'ExportForm',
  components: { FormFooter },
  setup(props, context) {
    const { t } = useTranslation(context);

    /** Strategies */

    const [
      fetchStrategyList,
      { data: strategyList, loading: isStrategyListLoading },
    ] = useResource({
      fetchResource: getStrategyList,
      initialValue: [],
      context,
      resourceName: 'Strategy List',
    });

    const strategyOptionList = computed<Array<OptionType>>(() =>
      strategyList.value.map<OptionType>((strategy) => ({
        value: strategy.id,
        label: strategy.name,
      }))
    );

    onMounted(() => {
      fetchStrategyList();
    });

    /** Format **/

    const formatOptionList = computed<Array<OptionType>>(() => [
      { value: 'CSV', label: 'CSV' },
      { value: 'XLS', label: 'XLS' },
      { value: 'XML', label: 'XML' },
      { value: 'YAML', label: 'YAML' },
      { value: 'JSON', label: 'JSON' },
      { value: 'TXT', label: 'TXT' },
    ]);

    function isCSVFormat(format: string): boolean {
      return format === 'CSV';
    }

    /** Delimiter **/

    const delimiterOptionList = computed<Array<OptionType>>(() => [
      { value: ',', label: t('export:comma') },
      { value: ';', label: t('export:semicolon') },
    ]);

    /** Form state */

    const defaultExtension = formatOptionList.value[0];
    const defaultDelimiter = delimiterOptionList.value[0];

    const errors = ref<Record<string, string>>({});
    const values = ref<FormValues>({
      strategy: null,
      filename: `export.${defaultExtension.value.toLowerCase()}`,
      format: defaultExtension,
      delimiter: defaultDelimiter,
    });
    const isSubmitting = ref<boolean>(false);

    const shouldDisplayDelimiter = ref<boolean>(
      isCSVFormat(values.value.format?.value ?? '')
    );

    watch(
      () => values.value.format,
      () => {
        const newExtension = values.value.format?.value.toLowerCase();

        values.value.filename = replaceFileExtension(
          values.value.filename,
          newExtension || ''
        );

        shouldDisplayDelimiter.value = isCSVFormat(
          values.value.format?.value ?? ''
        );
      }
    );

    function submitForm(event: TagerFormSubmitEvent) {
      isSubmitting.value = true;

      const creationPayload = convertExportFormValuesToCreationPayload(
        values.value
      );

      createExport(creationPayload)
        .then(() => {
          errors.value = {};

          if (
            event.type === 'create' ||
            event.type === 'save' ||
            event.type === 'create_exit' ||
            event.type === 'save_exit'
          ) {
            context.root.$router.push(getExportListUrl());
          }

          context.root.$toast({
            variant: 'success',
            title: t('export:success'),
            body: t('export:createdSuccessMessage'),
          });
        })
        .catch((error) => {
          console.error(error);
          errors.value = convertRequestErrorToMap(error);
          context.root.$toast({
            variant: 'danger',
            title: t('export:error'),
            body: t('export:createdErrorMessage'),
          });
        })
        .finally(() => {
          isSubmitting.value = false;
        });
    }

    /** Is content loading **/

    const isContentLoading = computed<boolean>(
      () => isStrategyListLoading.value
    );

    return {
      values,
      errors,
      isSubmitting,
      submitForm,
      getExportListUrl,
      strategyOptionList,
      formatOptionList,
      delimiterOptionList,
      isContentLoading,
      shouldDisplayDelimiter,
    };
  },
});
</script>

<style lang="scss" scoped>
.field {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  column-gap: 20px;
}
</style>
