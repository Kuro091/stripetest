import { supabase } from '@/utils/supabase';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useUser } from './UserContext';

const Logout = () => {
  const { logout } = useUser();

  useEffect(() => {
    logout();
  }, [logout]);

  return <h1>Logging out...</h1>;
};

export default Logout;
