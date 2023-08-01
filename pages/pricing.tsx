import { useUser } from './UserContext';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import Link from 'next/link';

const Pricing = ({ plans }: { plans: any }) => {
  const { user, login, isLoading } = useUser();
  const showSubscribeButton = !!user && !user!.is_subscribed;
  const showCreateButton = !user;
  const showManageButton = !!user && user!.is_subscribed;

  const processSubscription = (planId: string) => async () => {
    const { data } = await axios.get(`/api/subscription/${planId}`);
    const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY!);

    await stripe!.redirectToCheckout({
      sessionId: data.id,
    });
  };

  return (
    <div className='mt-36 flex justify-center items-center mx-auto gap-x-10'>
      {plans.map((plan: any) => {
        return (
          <div key={plan.id} className='border rounded-lg p-10'>
            <h2 className='font-bold'>{plan.name}</h2>
            <p className='text-gray-500'>
              ${plan.price / 100} {plan.interval !== '' ? `/ ${plan.interval}` : ''}
            </p>

            {!isLoading && (
              <div className='mt-5 '>
                {showSubscribeButton && (
                  <button
                    onClick={processSubscription(plan.id)}
                    className='border bg-blue-900 text-white px-5 py-2 font-bold'
                  >
                    Subscribe
                  </button>
                )}
                {showCreateButton && (
                  <button
                    onClick={login}
                    className='border bg-blue-900 text-white px-5 py-2 font-bold'
                  >
                    Create an account
                  </button>
                )}
                {showManageButton && (
                  <Link
                    href='/dashboard'
                    className='border bg-blue-900 text-white px-5 py-2 font-bold'
                  >
                    Manage my subscription
                  </Link>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export const getStaticProps = async () => {
  const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

  const { data: prices } = await stripe.prices.list();

  const plans = await Promise.all(
    prices
      .filter((price: any) => price.active)
      .map(async (price: any) => {
        const product = await stripe.products.retrieve(price.product);
        return {
          id: price.id,
          name: product.name,
          price: price.unit_amount,
          interval: price.recurring?.interval || '',
          currency: price.currency,
        };
      })
  );

  const sortedPlans = plans.sort((a: any, b: any) => a.price - b.price);

  return {
    props: {
      plans: sortedPlans,
    },
  };
};

export default Pricing;
