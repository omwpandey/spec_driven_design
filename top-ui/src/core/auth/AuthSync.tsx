/**
 * AuthSync — invisible component that runs the useEntraAuth bridge so MSAL
 * account state is continuously mirrored into the Redux auth slice. Mount it
 * once beneath the MSAL and Redux providers, before route guards are rendered.
 */

import { useEntraAuth } from './useEntraAuth';

const AuthSync: React.FC = () => {
  useEntraAuth();
  return null;
};

export default AuthSync;
