import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { buffer } from 'micro';
import { getServiceSupabase } from '@/utils/supabase';

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2022-11-15',
  });

  const signature = req.headers['stripe-signature']!;
  const signatureSecret = process.env.STRIPE_SIGNING_SECRET!;
  const reqBuffer = await buffer(req);

  let event;

  try {
    event = stripe.webhooks.constructEvent(reqBuffer, signature, signatureSecret);
  } catch (err) {
    console.log(err);
    return res.status(400).send(`Webhook Error: ${err}`);
  }

  const supabase = getServiceSupabase();

  switch (event.type) {
    case 'customer.subscription.updated':
      await supabase
        .from('profile')
        .update({
          is_subscribed: true,
          interval: (event.data.object as any).items.data[0].plan.interval,
        })
        .eq('stripe_customer', (event.data.object as any).customer);
      break;
    case 'customer.subscription.deleted':
      await supabase
        .from('profile')
        .update({
          is_subscribed: false,
          interval: null,
        })
        .eq('stripe_customer', (event.data.object as any).customer);
  }


  res.send({ type: event.type });
};

export default handler;
