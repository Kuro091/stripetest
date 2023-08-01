// NextJS _app component

import { AppProps } from 'next/app';
import '@/styles/globals.css';
import Provider from './UserContext';
import Nav from '@/components/nav';

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <Provider>
      <Nav />
      <Component {...pageProps} />
    </Provider>
  );
};

export default MyApp;
