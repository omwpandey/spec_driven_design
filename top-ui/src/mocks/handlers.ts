/**
 * MSW (Mock Service Worker) Handlers
 *
 * Shared mock API handlers used by both:
 * - Unit/integration tests (via setupServer)
 * - Browser-based development (via setupWorker)
 *
 * Every module should add its handlers here for realistic API testing.
 */

import { http, HttpResponse, delay } from 'msw';
import {
  buildMockSearchResponse,
  buildMockActivityNameSuggestions,
  type ActivitySearchRequest,
  type ActivityNameSuggestionRequest,
} from '@/modules/activity-setup/WCRM010200-DealerActivityList/dealerActivityList.type';

const BASE_URL = '/api';

// ===== AUTH HANDLERS =====
const authHandlers = [
  http.post(`${BASE_URL}/auth/login`, async ({ request }) => {
    await delay(300);
    const body = await request.json() as { username: string; password: string };

    if (body.username === 'admin' && body.password === 'admin') {
      return HttpResponse.json({
        success: true,
        data: {
          user: {
            id: 'USR001',
            name: 'Somchai Michai',
            email: 'somchai@toyota.com',
            role: 'Admin',
            permissions: ['ACTIVITY_VIEW', 'ACTIVITY_ADD', 'ACTIVITY_EDIT', 'ACTIVITY_DELETE'],
            dealerCode: 'TBC',
            dealerName: 'T.BANGKOK CENTRAL',
            branchCode: 'BKK-001',
            branchName: 'Bangna',
          },
          accessToken: 'mock-access-token-12345',
          refreshToken: 'mock-refresh-token-67890',
        },
      });
    }

    return HttpResponse.json(
      { success: false, error: { code: 'AUTH_FAILED', message: 'Invalid credentials' } },
      { status: 401 }
    );
  }),

  http.post(`${BASE_URL}/auth/refresh`, async () => {
    await delay(100);
    return HttpResponse.json({
      accessToken: 'mock-refreshed-token-' + Date.now(),
    });
  }),
];

// ===== ACTIVITY SETUP HANDLERS =====
const activitySetupHandlers = [
  http.get(`${BASE_URL}/activity-setup`, async () => {
    await delay(200);
    return HttpResponse.json({
      success: true,
      data: {
        summary: {
          totalVehicles: 60000,
          totalIndividualCustomers: 55231,
          individualPercentage: '85%',
          totalCorporateCustomers: 5231,
          corporatePercentage: '15%',
        },
        activityTypes: [
          { value: 'periodic_maintenance', label: 'Periodic Maintenance' },
          { value: 'additional_rejected', label: 'Additional Rejected Job' },
          { value: 'dcm_vehicle', label: 'DCM Vehicle' },
        ],
        customerTypes: [
          { value: 'individual', label: 'Individual' },
          { value: 'corporate', label: 'Corporate' },
          { value: 'all', label: 'All' },
        ],
        formData: {
          activityType: 'periodic_maintenance',
          activityId: 'PM260001',
          activityName: 'Periodic Maintenance 20,000',
          activityDescription: '20,000 km periodic maintenance service',
          customerType: 'all',
          suppressDays: 90,
        },
      },
    });
  }),

  // WCRM010200 Dealer Activity List — onLoad + search.
  // Thin pass-through: all filtering, pagination and response shaping live in
  // dealerActivityList.data.ts (buildMockSearchResponse).
  http.get(`${BASE_URL}/wcrm010200/search`, async ({ request }) => {
    await delay(200);
    const params = new URL(request.url).searchParams;
    const query = JSON.parse(params.get('filter') ?? '{}') as {
      filter?: Partial<ActivitySearchRequest['filter']>;
      sortFields?: ActivitySearchRequest['sortFields'];
    };
    const filter = query.filter ?? {};
    const searchRequest: ActivitySearchRequest = {
      filter: {
        dealerId: filter.dealerId ?? '',
        branchId: filter.branchId ?? '',
        activityId: filter.activityId ?? '',
        activityType: filter.activityType ?? '',
        activityName: filter.activityName ?? '',
      },
      sortFields: query.sortFields ?? [],
      page: Number(params.get('page') ?? 0),
      size: Number(params.get('size') ?? 10),
    };
    return HttpResponse.json(buildMockSearchResponse(searchRequest));
  }),

  // WCRM010200 Activity Name auto-suggestions. Filters the mock activity names
  // by the `filter.activityName` query and returns { data: { suggestions } }.
  http.post(`${BASE_URL}/v1/wcrm010200/activity-name-suggestions`, async ({ request }) => {
    await delay(150);
    const body = (await request.json()) as ActivityNameSuggestionRequest;
    const suggestions = buildMockActivityNameSuggestions(body?.filter?.activityName ?? '');
    return HttpResponse.json({ success: true, data: { suggestions } });
  }),

  http.post(`${BASE_URL}/activities`, async ({ request }) => {
    await delay(300);
    const body = await request.json();
    return HttpResponse.json({
      success: true,
      data: body,
      message: 'Activity saved successfully',
    });
  }),

  http.delete(`${BASE_URL}/activities/:id`, async () => {
    await delay(200);
    return HttpResponse.json({
      success: true,
      message: 'Activity deleted successfully',
    });
  }),
];

// ===== WCRM010301 TMT ACTIVITY MAINTENANCE HANDLERS =====
import contactProcessData from './WCRM010301-TmtActivityMaintenance/contactProcess.json';
import contactChannelData from './WCRM010301-TmtActivityMaintenance/contactChannel.json';
import repairInspectionData from './WCRM010301-TmtActivityMaintenance/repairInspection.json';

const tmtActivityMaintenanceHandlers = [
  http.get(`${BASE_URL}/tmt-activity-maintenance/contact-process`, async () => {
    await delay(200);
    return HttpResponse.json({ success: true, data: contactProcessData });
  }),

  http.get(`${BASE_URL}/tmt-activity-maintenance/contact-channel`, async () => {
    await delay(200);
    return HttpResponse.json({ success: true, data: contactChannelData });
  }),

  http.get(`${BASE_URL}/tmt-activity-maintenance/repair-inspection`, async () => {
    await delay(200);
    return HttpResponse.json({ success: true, data: repairInspectionData });
  }),
];

// ===== ERROR SIMULATION HANDLERS (for testing) =====
const errorHandlers = [
  // 500 Error simulation
  http.get(`${BASE_URL}/test/error-500`, async () => {
    await delay(100);
    return HttpResponse.json(
      { success: false, error: { code: 'SERVER_ERR', message: 'Internal server error' } },
      { status: 500 }
    );
  }),

  // 422 Validation Error simulation
  http.post(`${BASE_URL}/test/validation-error`, async () => {
    await delay(100);
    return HttpResponse.json(
      {
        success: false,
        error: {
          code: 'VALIDATION_ERR',
          message: 'Validation failed',
          details: [
            { field: 'email', message: 'Email already exists' },
            { field: 'phone', message: 'Invalid phone format' },
          ],
        },
      },
      { status: 422 }
    );
  }),

  // Timeout simulation
  http.get(`${BASE_URL}/test/timeout`, async () => {
    await delay(35000); // Exceeds 30s timeout
    return HttpResponse.json({ data: 'too late' });
  }),
];

// ===== ALL HANDLERS (export for use in test setup & browser worker) =====
export const handlers = [
  ...authHandlers,
  ...activitySetupHandlers,
  ...tmtActivityMaintenanceHandlers,
  ...errorHandlers,
];
