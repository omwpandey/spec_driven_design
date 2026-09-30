/**
 * LogoutButton — signs the user out of Microsoft Entra ID and clears the
 * mirrored access token from localStorage.
 */

import React from 'react';
import { Button } from '@components/common';
import { useMsal } from '@azure/msal-react';
import { useAppDispatch } from '@store';
import { logout } from '@store/slices/authSlice';

interface LogoutButtonProps {
  label?: string;
  variant?: 'text' | 'outlined' | 'contained';
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ label = 'Logout', variant = 'outlined' }) => {
  const { instance } = useMsal();
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    // Clear local Redux/localStorage state first, then redirect to Entra logout.
    dispatch(logout());
    void instance.logoutRedirect();
  };

  return (
    <Button variant={variant} color="inherit" onClick={handleLogout}>
      {label}
    </Button>
  );
};

export default LogoutButton;
