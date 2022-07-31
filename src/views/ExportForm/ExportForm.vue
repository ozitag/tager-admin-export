<template>
  <Page :title="$i18n.t('export:newExport')" :is-content-loading="isContentLoading">
    <form novalidate @submit.prevent>
      <FormFieldSelect
          v-model:value="values.strategy"
          name="exportType"
          :error="errors.strategy"
          :label="$i18n.t('export:exportType')"
          :options="strategyOptionList"
      />

      <div class="field">
        <FormField
            v-model:value="values.filename"
            :error="errors.filename"
            :label="$i18n.t('export:filename')"
            name="filename"
        />

        <FormFieldSelect
            v-model:value="values.format"
            :options="formatOptionList"
            :error="errors.format"
            :label="$i18n.t('export:format')"
            name="format"
        />

        <FormFieldSelect
            v-if="shouldDisplayDelimiter"
            v-model:value="values.delimiter"
            :options="delimiterOptionList"
            :error="errors.delimiter"
            :label="$i18n.t('export:delimiter')"
            name="delimiter"
        />
      </div>
      <DynamicField
          v-for="field of templateValues"
          :key="field.config.name"
          :field="field"
      />
    </form>

    <template #footer>
      <FormFooter
          :back-href="getExportListUrl()"
          @submit="submitForm"
          :is-submitting="isSubmitting"
          :is-creation="true"
      />
    </template>
  </Page>
</template>

<script lang="ts">
import {defineComponent, onMounted, watch, ref, computed} from "vue";
import {useRoute, useRouter} from "vue-router";

import {useI18n, navigateBack, useToast} from '@tager/admin-services';
import {Page} from "@tager/admin-layout";

import {convertRequestErrorToMap, useResource} from '@tager/admin-services';
import {
  OptionType,
  TagerFormSubmitEvent,
  FormFooter, FormField, FormFieldSelect
} from '@tager/admin-ui';
import {
  DynamicField,
  FieldConfigUnion,
  FieldUnion,
  universalFieldUtils,
} from '@tager/admin-dynamic-field';

import {createExport, getStrategies} from '../../services/requests';
import {getExportListUrl} from '../../utils/paths';
import {replaceFileExtension} from '../../utils/common';

import {
  convertExportFormValuesToCreationPayload,
  convertStrategiesToStrategyOptionList,
  formatOptionList,
  isCSVFormat,
} from './ExportForm.helpers';
import {FormValues} from './ExportForm.types';


export default defineComponent({
  name: 'ExportForm',
  components: {
    DynamicField, FormFooter,
    Page, FormField, FormFieldSelect
  },
  setup() {
    const {t} = useI18n();
    const route = useRoute();
    const router = useRouter();
    const toast = useToast();

    /** Strategies */

    const [
      fetchStrategies,
      {data: strategies, loading: isStrategiesLoading},
    ] = useResource({
      fetchResource: getStrategies,
      initialValue: [],
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
      {value: ',', label: t('export:comma')},
      {value: ';', label: t('export:semicolon')},
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
              navigateBack(router, getExportListUrl());
            }

            toast.show({
              variant: 'success',
              title: t('export:success'),
              body: t('export:createdSuccessMessage'),
            });
          })
          .catch((error) => {
            console.error(error);
            errors.value = convertRequestErrorToMap(error);
            toast.show({
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
