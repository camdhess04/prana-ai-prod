import { useState, useEffect } from 'react';
import { getCurrentUser, fetchAuthSession } from '@aws-amplify/auth';

export const useAmplifyUser = () => {
  const [user, setUser] = useState<any>(null);
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        const authSession = await fetchAuthSession();
        setUser(currentUser);
        setSession(authSession);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  return { user, session, loading, error };
}; 