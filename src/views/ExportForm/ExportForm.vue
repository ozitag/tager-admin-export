<template>
  <page :title="$t('export:newExport')" :is-content-loading="isContentLoading">
    <form novalidate @submit.prevent>
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

      <DynamicField
        v-for="field of templateValues"
        :key="field.config.name"
        :field="field"
      />
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
import {
  DynamicField,
  FieldConfigUnion,
  FieldUnion,
  universalFieldUtils,
} from '@tager/admin-dynamic-field';

import { createExport, getStrategies } from '../../services/requests';
import { getExportListUrl } from '../../utils/paths';
import { replaceFileExtension } from '../../utils/common';

import {
  convertExportFormValuesToCreationPayload,
  convertStrategiesToStrategyOptionList,
  formatOptionList,
  isCSVFormat,
} from './ExportForm.helpers';
import { FormValues } from './ExportForm.types';

export default defineComponent({
  name: 'ExportForm',
  components: { DynamicField, FormFooter },
  setup(props, context) {
    const { t } = useTranslation(context);

    /** Strategies */

    const [
      fetchStrategies,
      { data: strategies, loading: isStrategiesLoading },
    ] = useResource({
      fetchResource: getStrategies,
      initialValue: [],
      context,
      resourceName: 'Strategies',
    });

    const strategyOptionList = computed<Array<OptionType>>(() =>
      convertStrategiesToStrategyOptionList(strategies.value)
    );

    onMounted(() => {
      fetchStrategies();
    });

    /** Delimiter **/

    const delimiterOptionList = computed<Array<OptionType>>(() => [
      { value: ',', label: t('export:comma') },
      { value: ';', label: t('export:semicolon') },
    ]);

    /** Form state */

    const defaultExtension = formatOptionList[0];
    const defaultDelimiter = delimiterOptionList.value[0];

    const errors = ref<Record<string, string>>({});
    const values = ref<FormValues>({
      strategy: null,
      filename: `export.${defaultExtension.value.toLowerCase()}`,
      format: defaultExtension,
      delimiter: defaultDelimiter,
    });
    const isSubmitting = ref<boolean>(false);
    const templateValues = ref<Array<FieldUnion>>([]);

    function updateTemplateValues() {
      const selectedStrategy = strategies.value.find(
        (strategy) => strategy.id === values.value.strategy?.value
      );

      const fieldTemplateList: Array<FieldConfigUnion> =
        selectedStrategy?.fields ?? [];

      templateValues.value = fieldTemplateList.map((fieldConfig) =>
        universalFieldUtils.createFormField(fieldConfig, null)
      );
    }

    watch(
      () => values.value.strategy,
      () => {
        updateTemplateValues();
      }
    );

    onMounted(() => {
      updateTemplateValues();
    });

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
        values.value,
        templateValues.value
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

    const isContentLoading = computed<boolean>(() => isStrategiesLoading.value);

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
      templateValues,
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
