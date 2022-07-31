<template>
  <PageLayout :sidebar-menu-list="sidebarMenuList">
    <router-view/>
  </PageLayout>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {MenuItemType, PageLayout} from "@tager/admin-layout";
import {ViewListIcon} from "@tager/admin-ui";
import {getExportListUrl} from '../utils/paths';
import {useI18n} from "@tager/admin-services";

export default defineComponent({
  name: 'App',
  components: {
    PageLayout,
  },
  setup() {
    const i18n = useI18n();

    const sidebarMenuList: Array<MenuItemType> = [
      {
        id: 'exportAndImport',
        text: i18n.t('export:export'),
        icon: ViewListIcon,
        children: [{text: i18n.t('export:export'), url: getExportListUrl()}],
      },
    ];

    return {
      sidebarMenuList,
    };
  },
});
</script>

<style scoped lang="scss"></style>
