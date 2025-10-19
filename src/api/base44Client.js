import { createClient } from '@base44/sdk';
// import { getAccessToken } from '@base44/sdk/utils/auth-utils';

// Create a client with authentication required
export const base44 = createClient({
  appId: "68f4de2adce48c292b5e7c40", 
  requiresAuth: true // Ensure authentication is required for all operations
});
