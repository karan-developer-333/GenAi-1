'use client';

import { useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import api from '@/lib/api';
import { InternalAxiosRequestConfig } from 'axios';

/**
 * ApiAuthHandler handles setting the authentication token for all axios requests.
 * It uses Clerk's useAuth hook and syncs the token with lib/api instance.
 */
export default function ApiAuthHandler() {
  const { getToken, isLoaded, isSignedIn } = useAuth();

  useEffect(() => {
    if (!isLoaded) return;

    // Use an interceptor to inject the token dynamically for every request
    const interceptor = api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
      try {
        if (isSignedIn) {
          const token = await getToken();
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }
      } catch (error) {
        console.error("Error setting api token in interceptor:", error);
      }
      return config;
    });

    return () => {
      api.interceptors.request.eject(interceptor);
    };
  }, [isLoaded, isSignedIn, getToken]);

  return null;
}
