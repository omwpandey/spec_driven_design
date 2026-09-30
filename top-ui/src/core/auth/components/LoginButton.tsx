/**
 * LoginButton — starts a Microsoft Entra ID redirect sign-in.
 */

import React from 'react';
import { Button } from '@components/common';
import { useMsal } from '@azure/msal-react';
import { loginRequest, isEntraAuthEnabled, isEntraConfigured } from '../msalConfig';

interface LoginButtonProps {
  label?: string;
  fullWidth?: boolean;
}

const LoginButton: React.FC<LoginButtonProps> = ({ label = 'Sign in with Microsoft', fullWidth }) => {
  const { instance } = useMsal();

  const handleLogin = () => {
    void instance.loginRedirect(loginRequest);
  };

  return (
    <Button
      variant="contained"
      color="primary"
      onClick={handleLogin}
      disabled={!isEntraAuthEnabled || !isEntraConfigured}
      fullWidth={fullWidth}
    >
      {label}
    </Button>
  );
};

export default LoginButton;
