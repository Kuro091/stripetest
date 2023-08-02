import { useUser } from './UserContext';

const Cancelled = () => {
  const { user } = useUser();

  return (
    <div className='text-6xl flex flex-1 min-h-screen items-center justify-center'>Cancelled</div>
  );
};

export default Cancelled;
