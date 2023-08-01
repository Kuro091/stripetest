import { getServiceSupabase } from '@/utils/supabase';
import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if(req.query.API_ROUTE_SECRET != process.env.API_ROUTE_SECRET) {
    return res.status(401).send({ message: 'Unauthorized' });
  }  
  
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", 
      {
        apiVersion: '2022-11-15',
      }
    );

    const customer = await stripe.customers.create({
        email: req.body.record.email,
    });
    const supabase = getServiceSupabase();

    await supabase.from('profile').update({ stripe_customer: customer.id }).eq('id', req.body.record.id);  

    res.send({ message: `customer created ${customer.id}` });
}

export default handler;