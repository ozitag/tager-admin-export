import { CustomRouteConfig } from '@tager/admin-layout';

import ExportList from '../views/ExportList';
import ExportForm from '../views/ExportForm';

import { EXPORT_ROUTE_PATHS } from './paths';

export const EXPORT_LIST_ROUTE: CustomRouteConfig = {
  path: EXPORT_ROUTE_PATHS.EXPORT_LIST,
  component: ExportList,
  name: 'Export List',
  meta: {
    getBreadcrumbs: (route, t) => [
      { url: '/', text: t('export:home') },
      { url: route.path, text: t('export:export') },
    ],
  },
};

export const EXPORT_FORM_ROUTE: CustomRouteConfig = {
  path: EXPORT_ROUTE_PATHS.EXPORT_FORM,
  component: ExportForm,
  name: 'Export Form',
  meta: {
    getBreadcrumbs: (route, t) => [
      { url: '/', text: t('export:home') },
      { url: EXPORT_LIST_ROUTE.path, text: t('export:export') },
      { url: route.path, text: t('export:newExport') },
    ],
  },
};
