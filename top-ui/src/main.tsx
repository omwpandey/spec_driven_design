import React from 'react';
import ReactDOM from 'react-dom/client';
import AppProviders from './app/providers/AppProviders';
import { initMsal } from '@core/auth';
import './index.css';

if (window.location.pathname === '/index.html') {
  window.history.replaceState(
    window.history.state,
    '',
    `/${window.location.search}${window.location.hash}`,
  );
}

const root = ReactDOM.createRoot(document.getElementById('root')!);

// Process the Entra redirect before rendering protected routes. A failed
// callback must not fall through to RouteGuard and start another redirect.
void initMsal()
  .then(() => {
    root.render(
    <React.StrictMode>
      <AppProviders />
    </React.StrictMode>
    );
  })
  .catch((error: unknown) => {
    // eslint-disable-next-line no-console
    console.error('[MSAL] Authentication initialization failed:', error);
    root.render(
      <main role="alert" style={{ fontFamily: 'sans-serif', margin: '3rem auto', maxWidth: 640, padding: '0 1rem' }}>
        <h1>Sign-in could not be completed</h1>
        <p>
          Microsoft Entra rejected the authentication callback. Verify that this app URL is registered as a
          Single-page application (SPA) redirect URI in the Entra app registration.
        </p>
      </main>,
    );
  });
