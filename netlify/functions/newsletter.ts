import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

interface NewsletterPayload {
    email: string;
    source?: string;
    referrer?: string;
}

export const handler: Handler = async (event) => {
    // CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json',
    };

    // Handle preflight
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 204, headers, body: '' };
    }

    // Only allow POST
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' }),
        };
    }

    try {
        const payload: NewsletterPayload = JSON.parse(event.body || '{}');

        // Validate email
        if (!payload.email || !isValidEmail(payload.email)) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Valid email is required' }),
            };
        }

        // Normalize email
        const email = payload.email.toLowerCase().trim();

        // Check if already subscribed
        const { data: existing } = await supabase
            .from('newsletter_subscribers')
            .select('id, unsubscribed_at')
            .eq('email', email)
            .single();

        if (existing && !existing.unsubscribed_at) {
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    success: true,
                    message: 'ALREADY_CONNECTED',
                }),
            };
        }

        // If previously unsubscribed, resubscribe
        if (existing?.unsubscribed_at) {
            const { error } = await supabase
                .from('newsletter_subscribers')
                .update({ unsubscribed_at: null })
                .eq('id', existing.id);

            if (error) throw error;

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    success: true,
                    message: 'LINK_REESTABLISHED',
                }),
            };
        }

        // Insert new subscriber
        const { error } = await supabase
            .from('newsletter_subscribers')
            .insert({
                email,
                source: payload.source || 'website',
                referrer: payload.referrer || event.headers.referer || null,
            });

        if (error) throw error;

        // Log the event
        await supabase.from('system_logs').insert({
            event_type: 'newsletter_subscribe',
            source: 'newsletter_function',
            details: { email, source: payload.source },
            severity: 'info',
        });

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                message: 'LINK_ESTABLISHED',
            }),
        };
    } catch (error) {
        console.error('Newsletter error:', error);

        // Log error
        await supabase.from('system_logs').insert({
            event_type: 'newsletter_error',
            source: 'newsletter_function',
            details: { error: String(error) },
            severity: 'error',
        });

        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: 'TRANSMISSION_FAILED',
                details: 'Unable to establish connection. Retry later.',
            }),
        };
    }
};

// Email validation helper
function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
