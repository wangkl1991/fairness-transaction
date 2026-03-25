# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install        # install dependencies
npm run dev        # start dev server at http://localhost:3000
npm run build      # production build
npm run lint       # lint
```

## Environment Setup

Copy `.env.local.example` to `.env.local` and fill in your Stripe keys from https://dashboard.stripe.com/apikeys:

```
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

## Architecture

Next.js 15 App Router project with Stripe for one-time payments.

**Payment flow:**
1. User enters an amount on `app/page.tsx`
2. Frontend POSTs to `app/api/create-payment-intent/route.ts`, which calls `stripe.paymentIntents.create()` and returns a `clientSecret`
3. `app/components/CheckoutForm.tsx` renders Stripe's `<PaymentElement>` using the `clientSecret` and calls `stripe.confirmPayment()`
4. Stripe redirects to `app/success/page.tsx`, which retrieves and verifies the PaymentIntent status

**Key files:**
- `app/page.tsx` — amount entry + mounts Stripe Elements
- `app/components/CheckoutForm.tsx` — Stripe payment form
- `app/api/create-payment-intent/route.ts` — server-side PaymentIntent creation
- `app/success/page.tsx` — post-payment confirmation
