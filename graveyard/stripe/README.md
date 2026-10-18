# Stripe — Graveyard

Stripe checkout and webhook routes were removed before launch. Reviving them requires:

1. Restore `lib/stripe.ts` and `lib/stripe-products.ts` from this folder
2. Restore `app/api/stripe/checkout/route.ts` and `app/api/stripe/webhook/route.ts` from `graveyard/api-stripe/`
3. Re-add `stripe` and `@stripe/stripe-js` to `package.json`
4. Set `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, and price env vars in Vercel
5. Update `Courses.ts`: add `productKey` field back and wire it to the checkout route
6. Update `Entitlements.ts`: the webhook creates entitlements on successful payment
7. Test: checkout flow, webhook delivery, entitlement creation, lesson gate enforcement
