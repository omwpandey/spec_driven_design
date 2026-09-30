/**
 * TOPSCRM Static Default Values
 * 
 * These serve as FALLBACK values when API data is unavailable.
 * Every display value should follow the pattern:
 *   apiValue ?? defaultValue
 * 
 * When API integration is ready, these values will only appear
 * while loading or if the API call fails.
 */

export const APP_DEFAULTS = {
  // Dealer & Branch
  dealer: {
    code: 'TBC',
    name: 'T.BANGKOK CENTRAL',
  },
  branch: {
    code: 'BKK-001',
    name: 'Bangna',
  },

  // User
  user: {
    id: 'USR001',
    name: 'Somchai Michai',
    initials: 'SM',
    email: 'somchai@toyota.com',
    role: 'Admin',
    position: 'Senior Agent',
  },

  // System
  system: {
    language: 'en' as const,
    appName: 'TOYOTA TopsCRM',
  },

  // Summary Cards (Activity Setup)
  activitySummary: {
    totalVehicles: 60000,
    totalIndividualCustomers: 55231,
    individualPercentage: '85%',
    totalCorporateCustomers: 5231,
    corporatePercentage: '15%',
  },
} as const;

export const activityTypeOptions = [
  { value: 'periodic_maintenance', labelKey: 'periodic_maintenance' },
  { value: 'additional_rejected', labelKey: 'additional_rejected' },
  { value: 'dcm_vehicle', labelKey: 'dcm_vehicle' },
  { value: 'tcfr', labelKey: 'tcfr' },
  { value: 'ssc_csc', labelKey: 'ssc_csc' },
  { value: 'body_paint', labelKey: 'body_paint' },
  { value: 'bp_insurance', labelKey: 'bp_insurance' },
  { value: 'post_service', labelKey: 'post_service_followup' },
];
