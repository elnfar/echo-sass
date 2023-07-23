import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import { stripe } from "@/lib/stripe";
import { getUserSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
const DOMAIN = `$https://${process.env.NEXT_PUBLIC_VERCEL_URL}` || 'http://localhost:3000'
export default function Billing() {

  async function createCheckoutSession(data:FormData) {
    
    'use server'

    const lookup = data.get('lookup_key') as string

    const prices = await stripe.prices.list({

      lookup_keys: ['pro-monthly'],
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
      customer: tenant?.stripeCustomerId,
      return_url: `http://localhost:3000/admin/billing`,
    });
  
    redirect(portalSession.url);
  }
  
    return (
      <div>
          <h1 className="text-3xl mb-4">Billing</h1>

            <div>
              <div>
                <h1>Your plan</h1>
                <p>upgrade or downgrade whenever you want!</p>
              </div>

                <div className="flex">
                    Content
                </div>



          <form action={createCheckoutSession}>
          <input type="hidden" name="lookup_key" value="pro-monthly" />
            <Button type="submit">Upgrade</Button>
          </form>
          </div>


          <div>
              <div>
                  <h1>Manage your plan</h1>
                  <p>Manage your plan here</p>
              </div>


          <form action={createPortal}>
            <Button type="submit">Manage</Button>
          </form>
          </div>
      </div>
    )
  }
  