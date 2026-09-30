/**
 * Module Registry
 * 
 * Single source of truth for all modules in the application.
 * Both the router and sidebar are generated from this registry.
 * 
 * Adding a new module:
 * 1. Add entry here
 * 2. Create the page component
 * 3. Add translation keys
 * 
 * The router and sidebar auto-update — no manual wiring needed.
 */

import { ModuleManifest } from './types';

/**
 * Helper to create a simple module with a single page child.
 * Reduces boilerplate for the common pattern of:
 * parent module (sidebar entry) -> single child (page component)
 */
const createSimpleModule = (
  id: string,
  path: string,
  labelKey: string,
  icon: string,
  component: string,
  options?: { permission?: string },
): ModuleManifest => ({
  id,
  path,
  labelKey,
  icon,
  showInSidebar: true,
  ...(options?.permission && { permission: options.permission }),
  children: [
    {
      id: `${id}-main`,
      path: '',
      labelKey,
      component,
      showInSidebar: false,
    },
  ],
});

export const moduleRegistry: ModuleManifest[] = [
  {
    id: 'dashboard',
    path: '',
    labelKey: 'nav_dashboard',
    icon: 'Home',
    showInSidebar: true,
  },
  {
    id: 'activity-setup',
    path: 'activity-setup',
    labelKey: 'nav_activity_setup',
    icon: 'CalendarMonth',
    showInSidebar: true,
    children: [
      {
        id: 'activity-list',
        path: 'list',
        labelKey: 'nav_activity_list',
        component: '@modules/activity-setup/WCRM010200-DealerActivityList/dealerActivityListPage',
        showInSidebar: true,
      },
      {
        id: 'activity-add',
        path: 'add',
        labelKey: 'nav_activity_add',
        component: '@modules/activity-setup/WCRM010201-DealerActivityMaintenance-PM/activitySetupPage',
        permission: 'ACTIVITY_ADD',
      },
      {
        id: 'activity-edit',
        path: 'edit/:id',
        labelKey: 'nav_activity_edit',
        component: '@modules/activity-setup/WCRM010201-DealerActivityMaintenance-PM/activitySetupPage',
        permission: 'ACTIVITY_EDIT',
      },
      {
        id: 'activity-view',
        path: 'view/:id',
        labelKey: 'nav_activity_view',
        component: '@modules/activity-setup/WCRM010201-DealerActivityMaintenance-PM/activitySetupPage',
        permission: 'ACTIVITY_VIEW',
      },
      {
        id: 'activity-custom',
        path: 'custom',
        labelKey: 'nav_activity_setup',
        component: '@modules/activity-setup/TmtActivityCustom/TmtActivityCustomPage',
        showInSidebar: true,
      },
      {
        id: 'tmt-activity',
        path: 'pm',
        labelKey: 'tmt_activity_maintenance',
        component: '@modules/activity-setup/pages/TmtPmActivityPage/pages',
        showInSidebar: true,
      },
      {
        id: 'call-center-group-mang',
        path: 'tmt',
        labelKey: 'nav_call_center_group_mang',
        component: '@modules/activity-setup/TmtActivityCustom/TmtActivityCustomPage',
        showInSidebar: true,
      },
      {
        id: 'assign-call-center-staff-to-group',
        path: 'tmt',
        labelKey: 'nav_assign_call_center_staff_to_group',
        component: '@modules/activity-setup/TmtActivityCustom/TmtActivityCustomPage',
        showInSidebar: true,
      },
    ],
  },
  createSimpleModule(
    'customer-data-check', 'customer-data-check', 'nav_customer_data_check',
    'People', '@modules/customer/pages/CustomerListPage', { permission: 'CUSTOMER_VIEW' },
  ),
  createSimpleModule(
    'call-center', 'call-center', 'nav_call_center',
    'PhoneCallback', '@modules/call-center/pages/CallCenterPage',
  ),
  createSimpleModule(
    'today-customer', 'today-customers', 'nav_today_customer',
    'People', '@modules/today-customer/pages/TodayCustomerPage',
  ),
  createSimpleModule(
    'repair-bay', 'repair-bay', 'nav_repair_bay',
    'Build', '@modules/repair-bay/pages/RepairBayPage',
  ),
  createSimpleModule(
    'incoming-call', 'incoming-calls', 'nav_incoming_call',
    'PhoneCallback', '@modules/incoming-call/pages/IncomingCallPage',
  ),
  createSimpleModule(
    'outgoing-call', 'outgoing-calls', 'nav_outgoing_call',
    'PhoneForwarded', '@modules/outgoing-call/pages/OutgoingCallPage',
  ),
  createSimpleModule(
    'data-verification', 'data-verification', 'nav_data_verification',
    'FactCheck', '@modules/data-verification/pages/DataVerificationPage',
  ),
  createSimpleModule(
    'appointments', 'appointments', 'nav_appointments',
    'EventNote', '@modules/appointments/pages/AppointmentsPage',
  ),
  {
    id: 'service-follow',
    path: 'service-follow-up',
    labelKey: 'nav_service_follow',
    icon: 'SupportAgent',
    showInSidebar: true,
    children: [
      {
        id: 'follow-list',
        path: '',
        labelKey: 'nav_follow_list',
        component: '@modules/service-follow/pages/ServiceFollowPage',
        showInSidebar: true,
      },
      {
        id: 'follow-confirm',
        path: 'confirm',
        labelKey: 'nav_follow_confirm',
        component: '@modules/service-follow/pages/ServiceFollowConfirmPage',
        showInSidebar: true,
      },
    ],
  },
  createSimpleModule(
    'service-confirm', 'service-confirmation', 'nav_service_confirm',
    'CheckCircle', '@modules/service-confirm/pages/ServiceConfirmPage',
  ),
  createSimpleModule(
    'post-service', 'post-service', 'nav_post_service',
    'Assignment', '@modules/post-service/pages/PostServicePage',
  ),
  createSimpleModule(
    'inactive', 'inactive-customers', 'nav_inactive',
    'PersonOff', '@modules/inactive/pages/InactivePage',
  ),
  createSimpleModule(
    'news', 'news', 'nav_news',
    'Newspaper', '@modules/news/pages/NewsPage',
  ),
  createSimpleModule(
    'settings', 'settings', 'nav_settings',
    'Settings', '@modules/settings/pages/SettingsPage',
  ),
  {
    id: 'demo',
    path: 'demo',
    labelKey: 'nav_demo',
    icon: 'Widgets',
    showInSidebar: false,
  },
];

/**
 * Get sidebar items from the registry (only those with showInSidebar: true)
 */
export const getSidebarItems = () =>
  moduleRegistry
    .filter((m) => m.showInSidebar)
    .map((m) => ({
      id: m.id,
      labelKey: m.labelKey,
      icon: m.icon,
      path: m.children ? undefined : `/${m.path}`,
      children: m.children
        ?.filter((c) => c.showInSidebar)
        .map((c) => ({
          id: c.id,
          labelKey: c.labelKey,
          path: `/${m.path}${c.path ? '/' + c.path : ''}`,
        })),
    }));

/**
 * Get all flat routes from the registry for router generation
 */
export const getRouteConfigs = (): { path: string; component: string; permission?: string }[] => {
  const routes: { path: string; component: string; permission?: string }[] = [];

  moduleRegistry.forEach((mod) => {
    if (mod.children) {
      mod.children.forEach((child) => {
        routes.push({
          path: `${mod.path}${child.path ? '/' + child.path : ''}`,
          component: child.component,
          permission: child.permission || mod.permission,
        });
      });
    }
  });

  return routes;
};

/**
 * Dev-mode integrity check: find sidebar paths that have no matching route
 */
export const validateRouteIntegrity = (): string[] => {
  const routePaths = new Set(getRouteConfigs().map((r) => '/' + r.path));
  const missingRoutes: string[] = [];

  moduleRegistry.forEach((mod) => {
    if (mod.children) {
      mod.children
        .filter((c) => c.showInSidebar)
        .forEach((child) => {
          const fullPath = '/' + mod.path + (child.path ? '/' + child.path : '');
          if (!routePaths.has(fullPath)) {
            missingRoutes.push(`${mod.id} -> ${child.id}: ${fullPath}`);
          }
        });
    } else if (mod.showInSidebar && mod.path) {
      if (!routePaths.has('/' + mod.path)) {
        missingRoutes.push(`${mod.id}: /${mod.path}`);
      }
    }
  });

  return missingRoutes;
};
