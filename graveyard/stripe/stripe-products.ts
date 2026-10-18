// Keys here must match the product_id values used in the entitlements table.
// Each value reads from an env var that Bobby adds in Vercel.
// Add a new entry here for every new Stripe product.
export const STRIPE_PRODUCTS: Record<string, string> = {
  pro_membership: process.env.STRIPE_PRICE_PRO_MEMBERSHIP ?? "",
  course_behavior_foundations:
    process.env.STRIPE_PRICE_COURSE_BEHAVIOR_FOUNDATIONS ?? "",
};

export type ProductKey = keyof typeof STRIPE_PRODUCTS;
