import { supabase } from '@/utils/supabase';
import { useUser } from './UserContext';
import axios from 'axios';
import { useRouter } from 'next/router';

const Dashboard = () => {
  const { user, isLoading } = useUser();
  const router = useRouter();
  const loadPortal = async () => {
    const { data: urlToRedirect } = await axios.get('/api/portal');
    router.push(urlToRedirect.url);
  };

  return (
    <div className='w-full max-w-3xl mx-auto py-16 px-8'>
      {!isLoading && (
        <>
          <h1 className='text-3xl font-bold'>Welcome {user?.email}</h1>
          {user?.is_subscribed && (
            <>
              <p className='text-xl'>
                You are subscribed with a{' '}
                <span className='text-red-800 font-semibold'>{user?.interval}ly</span> subscription
              </p>
              <button
                className='mt-10 bg-slate-900 text-white rounded-md py-2 px-5'
                onClick={loadPortal}
              >
                Manage Stripe&apos;s subscription
              </button>
            </>
          )}
          {!user?.is_subscribed && <p className='text-xl'>You are not subscribed</p>}
        </>
      )}
    </div>
  );
};

export const getServerSideProps = async ({ req, res }: { req: any; res: any }) => {
  const refreshToken = req.cookies['my-refresh-token'];
  const accessToken = req.cookies['my-access-token'];

  if (refreshToken && accessToken) {
    await supabase.auth.setSession({
      refresh_token: refreshToken,
      access_token: accessToken,
    });
    const {
      data: { user },
    } = await supabase.auth.getUser();

    return {
      props: {},
    };
  }

  return {
    redirect: {
      permanent: false,
      destination: '/login',
    },
  };
};

export default Dashboard;
