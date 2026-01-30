-- =============================================
-- MOLTBOT SKILLS - MIGRATION SCRIPT
-- Run this if you already have the base tables
-- =============================================

-- =============================================
-- USER PROFILES TABLE (Customers & Developers)
-- =============================================
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users,
    email TEXT,
    display_name TEXT,
    avatar_url TEXT,
    github_username TEXT,
    bio TEXT,
    website_url TEXT,
    
    -- Account Type
    account_type TEXT DEFAULT 'customer', -- 'customer' | 'developer' | 'admin'
    is_verified_developer BOOLEAN DEFAULT false,
    
    -- Subscription Tier: 'free' | 'syndicate' | 'blackmarket'
    subscription_tier TEXT DEFAULT 'free',
    subscription_status TEXT DEFAULT 'active', -- 'active' | 'cancelled' | 'expired'
    subscription_started_at TIMESTAMPTZ,
    subscription_ends_at TIMESTAMPTZ,
    lemon_customer_id TEXT,
    lemon_subscription_id TEXT,
    
    -- Developer Stats
    total_earnings DECIMAL(10,2) DEFAULT 0,
    pending_payout DECIMAL(10,2) DEFAULT 0,
    lifetime_downloads INT DEFAULT 0,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON user_profiles;

CREATE POLICY "Users can view their own profile"
    ON user_profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON user_profiles FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
    ON user_profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

-- =============================================
-- SUBSCRIPTION TIERS REFERENCE TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS subscription_tiers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    price_gbp DECIMAL(10,2) NOT NULL,
    price_type TEXT DEFAULT 'monthly', -- 'monthly' | 'lifetime' | 'free'
    lemon_product_id TEXT,
    lemon_variant_id TEXT,
    features JSONB,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed tier data
INSERT INTO subscription_tiers (id, name, price_gbp, price_type, features)
VALUES 
    ('free', 'FREE_AGENT', 0, 'free', '{"skill_limit": 3, "downloads_per_month": 5, "support": "community", "black_market_access": false}'::jsonb),
    ('syndicate', 'SYNDICATE', 19, 'monthly', '{"skill_limit": -1, "downloads_per_month": -1, "support": "priority", "black_market_access": false, "early_access": true}'::jsonb),
    ('blackmarket', 'BLACK_MARKET', 79, 'lifetime', '{"skill_limit": -1, "downloads_per_month": -1, "support": "vip", "black_market_access": true, "early_access": true, "lifetime_updates": true}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
    price_gbp = EXCLUDED.price_gbp,
    features = EXCLUDED.features;

-- =============================================
-- USER SKILL LIBRARY (Purchased/Installed Skills)
-- =============================================
CREATE TABLE IF NOT EXISTS user_skill_library (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users NOT NULL,
    skill_id UUID REFERENCES skills,
    skill_name TEXT, -- Denormalized for quick display
    purchase_type TEXT DEFAULT 'single', -- 'single' | 'subscription' | 'blackmarket'
    purchase_price DECIMAL(10,2) DEFAULT 0,
    lemon_order_id TEXT,
    installed_version TEXT,
    is_active BOOLEAN DEFAULT true,
    installed_at TIMESTAMPTZ DEFAULT NOW(),
    last_updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE user_skill_library ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own library" ON user_skill_library;
DROP POLICY IF EXISTS "Users can insert into their own library" ON user_skill_library;

CREATE POLICY "Users can view their own library"
    ON user_skill_library FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert into their own library"
    ON user_skill_library FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- =============================================
-- ENHANCED SKILLS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    short_description TEXT,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL DEFAULT 0,
    category TEXT DEFAULT 'dev',
    icon TEXT DEFAULT '💻',
    is_verified BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    is_top_seller BOOLEAN DEFAULT false,
    is_blackmarket_only BOOLEAN DEFAULT false,
    tier_required TEXT DEFAULT 'free', -- 'free' | 'syndicate' | 'blackmarket'
    downloads_count INT DEFAULT 0,
    avg_rating NUMERIC(2,1) DEFAULT 0,
    rating_count INT DEFAULT 0,
    author_id UUID REFERENCES auth.users,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add missing columns individually for safety (if table already existed)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='skills' AND column_name='short_description') THEN
        ALTER TABLE skills ADD COLUMN short_description text;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='skills' AND column_name='is_top_seller') THEN
        ALTER TABLE skills ADD COLUMN is_top_seller boolean DEFAULT false;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='skills' AND column_name='avg_rating') THEN
        ALTER TABLE skills ADD COLUMN avg_rating numeric(2,1) DEFAULT 0;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='skills' AND column_name='is_blackmarket_only') THEN
        ALTER TABLE skills ADD COLUMN is_blackmarket_only boolean DEFAULT false;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='skills' AND column_name='tier_required') THEN
        ALTER TABLE skills ADD COLUMN tier_required text DEFAULT 'free';
    END IF;
END $$;

-- =============================================
-- SKILL SUBMISSIONS TABLE (for Developer Portal)
-- =============================================
CREATE TABLE IF NOT EXISTS skill_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    developer_id UUID REFERENCES auth.users NOT NULL,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    short_description TEXT,
    full_description TEXT,
    file_content TEXT,
    file_hash TEXT,
    status TEXT DEFAULT 'pending', -- 'pending' | 'reviewing' | 'approved' | 'rejected'
    reviewed_at TIMESTAMPTZ,
    reviewer_notes TEXT,
    content_hash TEXT,
    tier_target TEXT DEFAULT 'free', -- 'free' | 'syndicate' | 'blackmarket'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE skill_submissions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist, then recreate
DROP POLICY IF EXISTS "Developers can view their own submissions" ON skill_submissions;
DROP POLICY IF EXISTS "Developers can insert their own submissions" ON skill_submissions;
DROP POLICY IF EXISTS "Developers can update pending submissions" ON skill_submissions;

CREATE POLICY "Developers can view their own submissions"
    ON skill_submissions FOR SELECT
    USING (auth.uid() = developer_id);

CREATE POLICY "Developers can insert their own submissions"
    ON skill_submissions FOR INSERT
    WITH CHECK (auth.uid() = developer_id);

CREATE POLICY "Developers can update pending submissions"
    ON skill_submissions FOR UPDATE
    USING (auth.uid() = developer_id AND status = 'pending');

-- =============================================
-- SKILL PURCHASES TABLE (for checkout tracking)
-- =============================================
CREATE TABLE IF NOT EXISTS skill_purchases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    buyer_id UUID REFERENCES auth.users NOT NULL,
    skill_id UUID REFERENCES skills,
    skill_name TEXT,
    amount_paid DECIMAL(10, 2) DEFAULT 0,
    currency TEXT DEFAULT 'GBP',
    lemon_order_id TEXT,
    status TEXT DEFAULT 'pending', -- 'pending' | 'completed' | 'refunded'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE skill_purchases ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own purchases" ON skill_purchases;
DROP POLICY IF EXISTS "Users can insert their own purchases" ON skill_purchases;

CREATE POLICY "Users can view their own purchases"
    ON skill_purchases FOR SELECT
    USING (auth.uid() = buyer_id);

CREATE POLICY "Users can insert their own purchases"
    ON skill_purchases FOR INSERT
    WITH CHECK (auth.uid() = buyer_id);

-- =============================================
-- DEVELOPER PAYOUTS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS developer_payouts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    developer_id UUID REFERENCES auth.users NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'GBP',
    status TEXT DEFAULT 'pending', -- 'pending' | 'processing' | 'paid' | 'failed'
    payout_method TEXT DEFAULT 'stripe', -- 'stripe' | 'paypal' | 'crypto'
    payout_reference TEXT,
    requested_at TIMESTAMPTZ DEFAULT NOW(),
    processed_at TIMESTAMPTZ,
    notes TEXT
);

ALTER TABLE developer_payouts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Developers can view their own payouts" ON developer_payouts;
DROP POLICY IF EXISTS "Developers can request payouts" ON developer_payouts;

CREATE POLICY "Developers can view their own payouts"
    ON developer_payouts FOR SELECT
    USING (auth.uid() = developer_id);

CREATE POLICY "Developers can request payouts"
    ON developer_payouts FOR INSERT
    WITH CHECK (auth.uid() = developer_id);

-- =============================================
-- DEVELOPER EARNINGS LOG (per-sale tracking)
-- =============================================
CREATE TABLE IF NOT EXISTS developer_earnings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    developer_id UUID REFERENCES auth.users NOT NULL,
    skill_id UUID REFERENCES skills,
    purchase_id UUID REFERENCES skill_purchases,
    gross_amount DECIMAL(10,2) NOT NULL,
    platform_fee DECIMAL(10,2) NOT NULL,
    net_amount DECIMAL(10,2) NOT NULL, -- 70% revenue share
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE developer_earnings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Developers can view their own earnings" ON developer_earnings;

CREATE POLICY "Developers can view their own earnings"
    ON developer_earnings FOR SELECT
    USING (auth.uid() = developer_id);

-- =============================================
-- SEED SOME INITIAL SKILLS (optional)
-- =============================================
-- Uncommented for immediate demonstration:

INSERT INTO skills (title, short_description, description, price, category, icon, is_verified, downloads_count, avg_rating, rating_count, tier_required)
VALUES 
('FullStack_Architect_v9', 'Generate production-ready Next.js apps.', 'Complete Next.js boilerplate generator with authentication and database integration.', 49, 'dev', '💻', true, 2400, 4.8, 127, 'free'),
('Financial_Analyst_Pro', 'Professional grade financial modeling.', 'Generate P&L statements, cash flow analysis, and investor reports with a single prompt.', 79, 'business', '📊', true, 3200, 5.0, 156, 'syndicate'),
('Market_Research_Agent', 'Multi-source research with citations.', 'Synthesizes data from academic and social sources with fact-checking logic.', 39, 'research', '🔍', true, 5100, 4.7, 412, 'free'),
('Life_Coach_AI', 'Zen-mode habits and mental clarity.', 'Personalized wellness coaching, habit tracking, and cognitive behavioral tools.', 29, 'personal', '🧘', true, 1200, 4.6, 89, 'free'),
('Dating_Profile_Optimizer', 'Swipe right on your future.', 'Bio optimization, photo analysis, and conversational openers for modern apps.', 19, 'personal', '💘', true, 850, 4.5, 64, 'free'),
('Black_Ops_Negotiator', 'Elite deal-closing intelligence.', 'Advanced psychological frameworks for high-stakes negotiations. Restricted access.', 149, 'business', '🎯', true, 320, 4.9, 28, 'blackmarket'),
('Zero_Day_Debugger', 'Find vulnerabilities before they find you.', 'Security-first code analysis with exploit detection. Black Market exclusive.', 199, 'dev', '🔓', true, 180, 5.0, 15, 'blackmarket')
ON CONFLICT DO NOTHING;

-- =============================================
-- SECURITY SCANNER UPDATES
-- =============================================

-- Add security_scan column to skill_submissions for storing scan results
ALTER TABLE skill_submissions 
ADD COLUMN IF NOT EXISTS security_scan JSONB;

-- Add additional columns for frontend compatibility
ALTER TABLE skill_submissions 
ADD COLUMN IF NOT EXISTS slug TEXT,
ADD COLUMN IF NOT EXISTS tier_required TEXT DEFAULT 'free',
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS tags TEXT[],
ADD COLUMN IF NOT EXISTS content TEXT,
ADD COLUMN IF NOT EXISTS file_url TEXT,
ADD COLUMN IF NOT EXISTS submitted_at TIMESTAMPTZ DEFAULT NOW();

-- Update status enum to include 'flagged' for security review
-- Note: In Postgres, we add constraints via comments/documentation
-- Valid statuses: 'pending' | 'flagged' | 'reviewing' | 'approved' | 'rejected'

-- Index for faster security status queries
CREATE INDEX IF NOT EXISTS idx_submissions_security_status 
ON skill_submissions ((security_scan->>'status'));

-- Index for flagged submissions queries
CREATE INDEX IF NOT EXISTS idx_submissions_status 
ON skill_submissions (status);
