import { useUser } from '@/pages/UserContext';
import Link from 'next/link';
import React from 'react';

const Nav = () => {
  const { user } = useUser();

  return (
    <nav className='px-10 py-5 flex gap-x-10 font-medium text-lg border border-b-2'>
      <Link href='/'>Home</Link>
      {!!user && (
        <Link href='/dashboard' className='ml-2'>
          Dashboard
        </Link>
      )}
      <Link href='/pricing'>Pricing</Link>
      <div className='ml-auto'>
        {user ? <Link href='/logout'>Logout</Link> : <Link href='/login'>Login</Link>}
      </div>
    </nav>
  );
};

export default Nav;
