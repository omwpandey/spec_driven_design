/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly TOPS_API_BASE_URL: string;
  readonly TOPS_APP_NAME: string;
  readonly TOPS_APP_VERSION: string;
  /** When 'true', modules load data from local JSON mocks instead of the API. */
  readonly TOPS_USE_MOCK_DATA: string;
  /** When 'true', require Microsoft Entra sign-in to access the application. */
  readonly TOPS_ENABLE_AUTH: string;

  // Microsoft Entra ID (Azure AD) / MSAL
  readonly TOPS_AUTH_ID: string;
  readonly TOPS_TENANT_ID: string;
  readonly TOPS_REDIRECT_URL: string;
  readonly TOPS_POST_LOGOUT_REDIRECT_URI: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
