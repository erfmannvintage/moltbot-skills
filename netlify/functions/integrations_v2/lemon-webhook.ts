// LemonSqueezy Webhook Handler for Moltbot Skills
// This function processes payment webhooks from LemonSqueezy
// Configure the webhook URL in LemonSqueezy: https://your-site.netlify.app/.netlify/functions/lemon-webhook

import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

// Initialize Supabase with service role key for admin access
const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const lemonSigningSecret = process.env.LEMON_SQUEEZY_SIGNING_SECRET || '';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Verify webhook signature from LemonSqueezy
function verifySignature(payload: string, signature: string): boolean {
    if (!lemonSigningSecret) {
        console.warn('LEMON_SQUEEZY_SIGNING_SECRET not set, skipping verification');
        return true; // Allow in development
    }

    const hmac = crypto.createHmac('sha256', lemonSigningSecret);
    const digest = hmac.update(payload).digest('hex');
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
}

// Map LemonSqueezy product IDs to subscription tiers
const PRODUCT_TIER_MAP: Record<string, string> = {
    'YOUR_SYNDICATE_PRODUCT_ID': 'syndicate',
    'YOUR_BLACKMARKET_PRODUCT_ID': 'blackmarket',
    // Add your actual LemonSqueezy product IDs here
};

interface LemonSqueezyWebhook {
    meta: {
        event_name: string;
        custom_data?: {
            user_id?: string;
        };
    };
    data: {
        id: string;
        type: string;
        attributes: {
            status: string;
            user_email: string;
            user_name: string;
            first_order_item?: {
                product_id: number;
                variant_id: number;
            };
            product_id?: number;
            variant_id?: number;
            customer_id: number;
            order_id?: number;
            subscription_id?: number;
            renews_at?: string;
            ends_at?: string;
            created_at: string;
            total?: number;
            total_formatted?: string;
        };
    };
}

const handler: Handler = async (event) => {
    // Only accept POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    const signature = event.headers['x-signature'] || '';
    const body = event.body || '';

    // Verify webhook signature
    if (!verifySignature(body, signature)) {
        console.error('Invalid webhook signature');
        return {
            statusCode: 401,
            body: JSON.stringify({ error: 'Invalid signature' })
        };
    }

    let webhook: LemonSqueezyWebhook;
    try {
        webhook = JSON.parse(body);
    } catch (e) {
        console.error('Failed to parse webhook body:', e);
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Invalid JSON' })
        };
    }

    const eventName = webhook.meta.event_name;
    const customData = webhook.meta.custom_data;
    const userId = customData?.user_id;
    const attributes = webhook.data.attributes;

    console.log(`Processing LemonSqueezy event: ${eventName}`, { userId, status: attributes.status });

    try {
        switch (eventName) {
            case 'order_created':
                await handleOrderCreated(webhook, userId);
                break;

            case 'subscription_created':
                await handleSubscriptionCreated(webhook, userId);
                break;

            case 'subscription_updated':
                await handleSubscriptionUpdated(webhook, userId);
                break;

            case 'subscription_cancelled':
                await handleSubscriptionCancelled(webhook, userId);
                break;

            case 'subscription_expired':
                await handleSubscriptionExpired(webhook, userId);
                break;

            default:
                console.log(`Unhandled event: ${eventName}`);
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ received: true, event: eventName })
        };

    } catch (error) {
        console.error('Webhook processing error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal server error' })
        };
    }
};

// Handle one-time order (Black Market lifetime purchase)
async function handleOrderCreated(webhook: LemonSqueezyWebhook, userId?: string) {
    const attributes = webhook.data.attributes;
    const productId = attributes.first_order_item?.product_id?.toString() ||
        attributes.product_id?.toString() || '';

    const tier = PRODUCT_TIER_MAP[productId];

    if (!tier) {
        console.log(`Unknown product ID: ${productId}`);
        return;
    }

    // Find user by ID or email
    let targetUserId = userId;

    if (!targetUserId && attributes.user_email) {
        const { data: profile } = await supabase
            .from('user_profiles')
            .select('id')
            .eq('email', attributes.user_email)
            .single();

        targetUserId = profile?.id;
    }

    if (!targetUserId) {
        console.error('Could not find user for order:', attributes.user_email);
        return;
    }

    // Update user's subscription tier
    const { error } = await supabase
        .from('user_profiles')
        .update({
            subscription_tier: tier,
            subscription_status: 'active',
            subscription_started_at: new Date().toISOString(),
            subscription_ends_at: tier === 'blackmarket' ? null : undefined, // Lifetime for Black Market
            lemon_customer_id: attributes.customer_id.toString(),
            updated_at: new Date().toISOString()
        })
        .eq('id', targetUserId);

    if (error) {
        console.error('Failed to update user subscription:', error);
        throw error;
    }

    // Record the purchase
    await supabase.from('skill_purchases').insert([{
        buyer_id: targetUserId,
        skill_id: null, // Subscription, not a skill
        amount: (attributes.total || 0) / 100, // Convert cents to pounds
        currency: 'GBP',
        status: 'completed',
        lemon_order_id: webhook.data.id,
        created_at: new Date().toISOString()
    }]);

    console.log(`User ${targetUserId} upgraded to ${tier}`);
}

// Handle subscription creation (Syndicate monthly)
async function handleSubscriptionCreated(webhook: LemonSqueezyWebhook, userId?: string) {
    const attributes = webhook.data.attributes;
    const productId = attributes.product_id?.toString() ||
        attributes.first_order_item?.product_id?.toString() || '';

    const tier = PRODUCT_TIER_MAP[productId] || 'syndicate';

    // Find user
    let targetUserId = userId;

    if (!targetUserId && attributes.user_email) {
        const { data: profile } = await supabase
            .from('user_profiles')
            .select('id')
            .eq('email', attributes.user_email)
            .single();

        targetUserId = profile?.id;
    }

    if (!targetUserId) {
        console.error('Could not find user for subscription:', attributes.user_email);
        return;
    }

    const renewsAt = attributes.renews_at ? new Date(attributes.renews_at) : null;

    await supabase
        .from('user_profiles')
        .update({
            subscription_tier: tier,
            subscription_status: 'active',
            subscription_started_at: new Date().toISOString(),
            subscription_ends_at: renewsAt?.toISOString(),
            lemon_customer_id: attributes.customer_id.toString(),
            lemon_subscription_id: webhook.data.id,
            updated_at: new Date().toISOString()
        })
        .eq('id', targetUserId);

    console.log(`Subscription created for user ${targetUserId}: ${tier}`);
}

// Handle subscription updates (renewals, plan changes)
async function handleSubscriptionUpdated(webhook: LemonSqueezyWebhook, userId?: string) {
    const subscriptionId = webhook.data.id;
    const attributes = webhook.data.attributes;

    // Find user by subscription ID
    const { data: profile } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('lemon_subscription_id', subscriptionId)
        .single();

    if (!profile) {
        console.log('User not found for subscription update:', subscriptionId);
        return;
    }

    const renewsAt = attributes.renews_at ? new Date(attributes.renews_at) : null;

    await supabase
        .from('user_profiles')
        .update({
            subscription_status: attributes.status === 'active' ? 'active' : attributes.status,
            subscription_ends_at: renewsAt?.toISOString(),
            updated_at: new Date().toISOString()
        })
        .eq('id', profile.id);

    console.log(`Subscription updated for user ${profile.id}`);
}

// Handle subscription cancellation
async function handleSubscriptionCancelled(webhook: LemonSqueezyWebhook, userId?: string) {
    const subscriptionId = webhook.data.id;
    const attributes = webhook.data.attributes;

    const { data: profile } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('lemon_subscription_id', subscriptionId)
        .single();

    if (!profile) {
        console.log('User not found for cancellation:', subscriptionId);
        return;
    }

    // Keep access until subscription period ends
    const endsAt = attributes.ends_at ? new Date(attributes.ends_at) : new Date();

    await supabase
        .from('user_profiles')
        .update({
            subscription_status: 'cancelled',
            subscription_ends_at: endsAt.toISOString(),
            updated_at: new Date().toISOString()
        })
        .eq('id', profile.id);

    console.log(`Subscription cancelled for user ${profile.id}, ends at ${endsAt}`);
}

// Handle subscription expiration
async function handleSubscriptionExpired(webhook: LemonSqueezyWebhook, userId?: string) {
    const subscriptionId = webhook.data.id;

    const { data: profile } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('lemon_subscription_id', subscriptionId)
        .single();

    if (!profile) {
        console.log('User not found for expiration:', subscriptionId);
        return;
    }

    // Downgrade to free tier
    await supabase
        .from('user_profiles')
        .update({
            subscription_tier: 'free',
            subscription_status: 'expired',
            lemon_subscription_id: null,
            updated_at: new Date().toISOString()
        })
        .eq('id', profile.id);

    console.log(`Subscription expired for user ${profile.id}, downgraded to free`);
}

export { handler };
