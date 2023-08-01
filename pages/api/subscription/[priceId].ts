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
      data: { stripe_customer },
    } = await supabase.from('profile').select('stripe_customer').eq('id', user?.id).single();

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2022-11-15',
    });

    const { priceId } = req.query;


    const session = await stripe.checkout.sessions.create({
      customer: stripe_customer,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{
        price: priceId as string,
        quantity: 1,
      }],
      success_url: `${process.env.NEXT_PUBLIC_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/cancelled`,
    });

    res.send({ id: session.id });
  } else {
    // make sure you handle this case!
    return;
  }
};

export default handler;
