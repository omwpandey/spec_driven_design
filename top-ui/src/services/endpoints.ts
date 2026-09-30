// Centralized API Endpoints
export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    PROFILE: '/auth/profile',
  },
  ACTIVITY: {
    BASE: '/activities',
    TYPES: '/activity-types',
    SETUP: '/activity-setup',
    /** Post Service Follow Up (PSFU) maintenance page data (WCRM010309). */
    PSFU: '/psfu-activity',
  },
  CUSTOMER: {
    BASE: '/customers',
    SEARCH: '/customers/search',
  },
  VEHICLE: {
    BASE: '/vehicles',
    SEARCH: '/vehicles/search',
  },
  DEALER: {
    BASE: '/dealers',
    BRANCHES: '/dealers/branches',
  },
  COMMON: {
    LOOKUP: '/lookups',
    CHANNELS: '/channels',
    REPAIR_CODES: '/repair-codes',
    /** Shared code-master combo/lookup search (GET with a `filter` query param). */
    CODE_MASTER_PROCESS_SEARCH: '/cmn/v1/code-master-process/search',
  },
  WCRM010200:{
    /** Dealer Activity List search (onLoad + Search button). GET with query params. */
    SEARCH: 'crm/v1/wcrm010200/search',
    /** Activity Name auto-suggestion lookup. GET with a JSON `filter` query param. */
    SUGGESTION_LIST: 'crm/v1/wcrm010200-suggestion-list/search',
    COMBO_1_ACTIVITY_TYPE: {
        /** Shared combo/lookup search for dropdowns (discriminated by comboType). */
        SEARCH: 'crm/v1/wcrm010200-activity-type-combo/search',
      }
  },
  
  BRANCH_HOLIDAY: {
    /** Working-day calendar for a branch/month/year (GET with params). */
    CALENDAR: '/branch-holidays/calendar',
    /** Create / delete a single branch holiday. */
    BASE: '/branch-holidays',
    /** Copy holidays from a source month/year to a target branch/month/year. */
    COPY: '/branch-holidays/copy',
  },
  CALL_CENTER: {
    /** Call-center staff list for a branch. */
    STAFF: '/call-center/staff',
    /** Daily availability (GET with params, POST to save). */
    DAILY: '/call-center/availability/daily',
    /** Monthly availability (GET with params, POST to save). */
    MONTHLY: '/call-center/availability/monthly',
  },
  // wcrm010301 - Tmt Activity Maintenance
  WCRM010301: {
    /** Onload screen data for PM/TMT activity maintenance. POST/GET search with filter payload. */
    SEARCH: '/crm/v1/wcrm010301/search',
    /** Save PM/TMT activity maintenance data. */
    SAVE: '/crm/v1/wcrm010301/save',
    /** Repair / inspection catalogue list for PM/TMT activity maintenance. */
    REPAIR_INSPECTION: '/srv/v1/wcrm010301/repair-inspection-list',
  },
 
  TMT_ACTIVITY_MAINTENANCE: {
    CONTACT_PROCESS: '/tmt-activity-maintenance/contact-process',
    CONTACT_CHANNEL: '/tmt-activity-maintenance/contact-channel',
    REPAIR_INSPECTION: '/srv/v1/wcrm010301/repair-inspection-list',
  },
} as const;
