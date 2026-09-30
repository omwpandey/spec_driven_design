import React, { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { MainLayout } from '@components/layout';
import { ErrorBoundary } from '@components/common';
import { RouteGuard } from '@core/auth';

// Public authorization error page
const UnauthorizedPage = lazy(() => import('@core/auth/pages/UnauthorizedPage'));

// Lazy loaded pages
const Dashboard = lazy(() => import('@modules/dashboard/DashboardPage'));
const DlrActivitySetupPage = lazy(() => import('@modules/activity-setup/WCRM010201-DealerActivityMaintenance-PM/activitySetupPage'));
const DlrActivityListPage = lazy(() => import('@modules/activity-setup/WCRM010200-DealerActivityList/dealerActivityListPage'));
const TmtActivityCustomPage = lazy(() => import('@modules/activity-setup/TmtActivityCustom/TmtActivityCustomPage'));
const TmtPmActivityPage = lazy(() => import('@/modules/activity-setup/WCRM010301-TmtActivityMaintenance/TmtPmActivityPage'));
const TmtActivityMaintenancePage = lazy(() => import('@modules/activity-setup/WCRM010309-PostServiceFollowUpByTmt/tmtActivityMaintenancePage'));
const DemoPage = lazy(() => import('@modules/demo/DemoPage'));

// Note: we intentionally render no fallback spinner here. The single
// full-screen loader is owned by <RouteChangeLoader /> in MainLayout, so the
// lazy chunk loads behind that overlay. Rendering a spinner here too would
// show two loaders at once during navigation.
const withSuspense = (Component: React.LazyExoticComponent<React.ComponentType>) => (
  <ErrorBoundary level="page">
    <Suspense fallback={null}>
      <Component />
    </Suspense>
  </ErrorBoundary>
);

export const router = createBrowserRouter([
  // Public authorization error route
  {
    path: '/unauthorized',
    element: withSuspense(UnauthorizedPage),
  },
  // Protected application routes (require authentication)
  {
    element: <RouteGuard />,
    children: [
      {
        path: '/',
        element: <MainLayout />,
        errorElement: (
          <ErrorBoundary level="app">
            <></>
          </ErrorBoundary>
        ),
        children: [
          {
            index: true,
            element: withSuspense(Dashboard),
          },
          {
            path: 'activity-setup/dlr-activity-maintenance',
            element: withSuspense(DlrActivitySetupPage),
          },
      {
        path: 'activity-setup/list',
        element: withSuspense(DlrActivityListPage),
      },
          {
            path: 'activity-setup/add',
            element: withSuspense(DlrActivitySetupPage),
          },
          {
            path: 'activity-setup/edit/:id',
            element: withSuspense(DlrActivitySetupPage),
          },
          {
            path: 'activity-setup/view/:id',
            element: withSuspense(DlrActivitySetupPage),
          },
          {
            path: 'activity-setup/tmt',
            element: withSuspense(TmtActivityCustomPage),
          },
          {
        path: 'activity-setup/pm',
        element: withSuspense(TmtPmActivityPage),
      },
      {
        path: 'activity-setup/tmt-activity-maintenance',
        element: withSuspense(TmtActivityMaintenancePage),
      },
      {
            path: 'activity-setup/custom',
            element: withSuspense(TmtActivityCustomPage),
          },
          {
            path: 'demo',
            element: withSuspense(DemoPage),
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
