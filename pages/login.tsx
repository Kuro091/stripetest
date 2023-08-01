import { useEffect } from 'react';
import { useUser } from './UserContext';

const Login = () => {
  const { login } = useUser();

  useEffect(() => {
    login();
  }, [login]);

  return <h1 className='italic text-gray-600'>Loginning in...</h1>;
};

export default Login;
