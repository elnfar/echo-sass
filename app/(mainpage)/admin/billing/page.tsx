import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import { stripe } from "@/lib/stripe";
import { getUserSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
const DOMAIN = `$https://${process.env.NEXT_PUBLIC_VERCEL_URL}` || 'http://localhost:3000'

async function createCheckoutSession(data:FormData) {
  'use server'
  const user = await getUserSession();

  const lookup = data.get('lookup_key') as string

  const prices = await stripe.prices.list({

    lookup_keys: [lookup],
    expand: ['data.product'],
  });
  const session = await stripe.checkout.sessions.create({
    billing_address_collection: 'auto',
    line_items: [
      {
        price: prices.data[0].id,
        // For metered billing, do not pass quantity
        quantity: 1,

      },
    ],
    subscription_data: {
      metadata: {
        tenantId: user.tenant.id
      }
    },
    mode: 'subscription',
    success_url: `http://localhost:3000/admin/billing/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `http://localhost:3000/admin/billing?canceled=true`,
})
redirect(session.url || '')
}


async function createPortal() {
  'use server'

  const user = await getUserSession();
  const tenant = await prisma.tenant.findUnique({
    where: {
      id:user.tenant.id
    }
  })

  if(!tenant?.stripeCustomerId) throw new Error();

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: tenant.stripeCustomerId,
    return_url: `http://localhost:3000/admin/billing`,
  });

  redirect(portalSession.url);
}




export default async function Billing() {


  const user = await getUserSession();

  const tenant = await prisma.tenant.findUnique({
    where: {
      id:user.tenant.id
    }
  })

    return (
      <div>
          <h1 className="text-3xl mb-4">Billing</h1>

          {
            tenant?.plan === 'FREE' ? (
              <div>
                <FreePlan/>
                <Upgrade/>
              </div>
            ):(
              <ProPlan/>
            )
          }

          {tenant?.expirationDate && tenant.plan === 'PRO' && (
            <div>Your subscription will expire on {tenant.expirationDate.toLocaleDateString()}</div>
          )}

      </div>
    )
  }



function FreePlan() {
  return (
    <div>
      <h1>Free Plan Here</h1>
        <p>This is your current plan</p>
    </div>
  )
}
function Upgrade() {
  return (
    <div>
      <h1>Upgrade to Pro</h1>
      <p>Unlock all the unique features</p>

    <div className="grid grid-cols-2 items-center py-12">
      <form action={createCheckoutSession}>
        <h1>Montly Plan for just $1</h1>
          <input type="hidden" name="lookup_key" value="pro-monthly" />
            <Button type="submit">Upgrade</Button>
        </form>

        <form action={createCheckoutSession}>
          <h1>Yearly plan with for $10</h1>
          <input type="hidden" name="lookup_key" value="yearly-pro" />
            <Button type="submit">Upgrade</Button>
        </form>
       </div>
    </div>
  )
}
function ProPlan() {
  return (
    <div>
      <h1>You are a pro member!</h1>
      <form action={createPortal}>
          <Button type="submit">Manage</Button>
      </form>
    </div>
  )
}