import type { RouteRecordRaw } from 'vue-router';

import ExportList from '../views/ExportList';
import ExportForm from '../views/ExportForm';

import { EXPORT_ROUTE_PATHS } from './paths';

export const EXPORT_LIST_ROUTE: RouteRecordRaw = {
  path: EXPORT_ROUTE_PATHS.EXPORT_LIST,
  component: ExportList,
  name: 'Export List',
  meta: {
    getBreadcrumbs: (route, i18n) => [
      { url: '/', text: i18n.t('export:home') },
      { url: route.path, text: i18n.t('export:export') },
    ],
  },
};

export const EXPORT_FORM_ROUTE: RouteRecordRaw = {
  path: EXPORT_ROUTE_PATHS.EXPORT_FORM,
  component: ExportForm,
  name: 'Export Form',
  meta: {
    getBreadcrumbs: (route, i18n) => [
      { url: '/', text: i18n.t('export:home') },
      { url: EXPORT_LIST_ROUTE.path, text: i18n.t('export:export') },
      { url: route.path, text: i18n.t('export:newExport') },
    ],
  },
};
