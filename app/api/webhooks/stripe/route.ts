import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { headers } from 'next/headers'
import { db } from '@/lib/firebase'
import { doc, updateDoc } from 'firebase/firestore'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const headersList = await headers()
    const signature = headersList.get('stripe-signature')

    if (!signature) {
      return NextResponse.json(
        { error: 'No signature found' },
        { status: 400 }
      )
    }

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      )
    }

    // Handle the event
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionChange(event.data.object as Stripe.Subscription)
        break
      case 'customer.subscription.deleted':
        await handleSubscriptionCancellation(event.data.object as Stripe.Subscription)
        break
      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object as Stripe.Invoice)
        break
      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.Invoice)
        break
      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}

async function handleSubscriptionChange(subscription: Stripe.Subscription) {
  const userId = subscription.metadata.userId
  const status = subscription.status
  const priceId = subscription.items.data[0].price.id

  if (!userId) {
    console.error('No userId in subscription metadata')
    return
  }

  try {
    const userRef = doc(db, 'users', userId)
    
    // Determine role based on price ID
    let role: 'pro' | 'elite' = 'pro'
    if (priceId.includes('elite')) {
      role = 'elite'
    }

    // Update user role based on subscription status
    if (status === 'active' || status === 'trialing') {
      await updateDoc(userRef, {
        role: role,
        subscriptionId: subscription.id,
        subscriptionStatus: status,
        maxPredictions: role === 'pro' ? 1000 : 10000,
        updatedAt: new Date(),
      })
      console.log(`Updated user ${userId} to ${role} role`)
    }
  } catch (error) {
    console.error('Error updating user subscription:', error)
  }
}

async function handleSubscriptionCancellation(subscription: Stripe.Subscription) {
  const userId = subscription.metadata.userId

  if (!userId) {
    console.error('No userId in subscription metadata')
    return
  }

  try {
    const userRef = doc(db, 'users', userId)
    await updateDoc(userRef, {
      role: 'free',
      subscriptionId: null,
      subscriptionStatus: 'canceled',
      maxPredictions: 2,
      updatedAt: new Date(),
    })
    console.log(`Downgraded user ${userId} to free role`)
  } catch (error) {
    console.error('Error downgrading user subscription:', error)
  }
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  const subscription = invoice.subscription as Stripe.Subscription
  if (subscription) {
    await handleSubscriptionChange(subscription)
  }
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  const subscription = invoice.subscription as Stripe.Subscription
  if (subscription) {
    const userId = subscription.metadata.userId
    
    if (userId) {
      try {
        const userRef = doc(db, 'users', userId)
        await updateDoc(userRef, {
          subscriptionStatus: 'past_due',
          updatedAt: new Date(),
        })
        console.log(`Marked user ${userId} subscription as past due`)
      } catch (error) {
        console.error('Error updating user payment status:', error)
      }
    }
  }
}