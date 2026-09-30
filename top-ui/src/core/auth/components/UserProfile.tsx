/**
 * UserProfile — shows the signed-in Entra user's name and email.
 * Reads from the MSAL active account (falls back to the first account).
 */

import React from 'react';
import { Avatar } from '@components/common';
import { useMsal } from '@azure/msal-react';
import { useAppSelector } from '@store';

const UserProfile: React.FC = () => {
  const { instance, accounts } = useMsal();
  const account = instance.getActiveAccount() ?? accounts[0];
  const user = useAppSelector((state) => state.auth.user);
  const name = user?.name || account?.name || account?.username;
  const email = user?.email || account?.username;

  if (!name) return null;

  return <Avatar name={name} subtitle={email} showName size="medium" />;
};

export default UserProfile;
