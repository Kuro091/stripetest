import { supabase } from '@/utils/supabase';
import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
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

    
    const {
      //@ts-ignore
      data: { stripe_customer },
    } = await supabase.from('profile').select('stripe_customer').eq('id', user?.id).single();

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2022-11-15',
    });

    const session = await stripe.billingPortal.sessions.create({
      customer: stripe_customer,
      return_url: `${process.env.NEXT_PUBLIC_URL}/dashboard`,
    });

    res.send({ url: session.url });
  } else {
    // make sure you handle this case!
    return;
  }
};

export default handler;
