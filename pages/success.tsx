import { useUser } from './UserContext';

const Success = () => {
  const { user } = useUser();

  return (
    <div className='text-6xl flex flex-1 min-h-screen items-center justify-center'>Success</div>
  );
};

export default Success;
