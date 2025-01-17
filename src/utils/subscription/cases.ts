// Apple Pay
export const appleNegativeCases = [
    'EXPIRED',
    'EXPIRED:VOLUNTARY',
    'EXPIRED:PRODUCT_NOT_FOR_SALE',
    'EXPIRED:BILLING_RETRY',
    'REFUND',
    'EXPIRED:PRICE_INCREASE',
    'REVOKE',
    'GRACE_PERIOD_EXPIRED',
]

export const applePositiveCases = [
    'OFFER_REDEEMED',
    'OFFER_REDEEMED:INITIAL_BUY',
    'OFFER_REDEEMED:RESUBSCRIBE',
    'OFFER_REDEEMED:UPGRADE',
    'OFFER_REDEEMED:DOWNGRADE',
    'SUBSCRIBED:INITIAL_BUY',
    'SUBSCRIBED:RESUBSCRIBE',
    'DID_RENEW',
]

// Google Pay
// export const googleNegativeCases = [
//   'SUBSCRIPTION_REVOKED(12)',
//   'SUBSCRIPTION_EXPIRED(13)',
//   'SUBSCRIPTION_PENDING_PURCHASE_CANCELED(20)',
// ];

export const googleNegativeCases = [12, 13, 20]

export const googleAcknowledgementCases = [
    4, //  SUBSCRIPTION_PURCHASED
    2, //SUBSCRIPTION_RENEWED
    1, //SUBSCRIPTION_RECOVERED
    7, //SUBSCRIPTION_RESTARTED
]
