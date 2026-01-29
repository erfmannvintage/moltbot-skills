-- =============================================
-- MOLTBOT SKILLS MARKETPLACE - EXTENDED SCHEMA v2
-- =============================================
-- This extends the base schema with tables for:
-- Developer accounts, categories, purchases, affiliates, payouts

-- =============================================
-- SKILL CATEGORIES
-- =============================================
CREATE TABLE skill_categories (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    icon TEXT,
    color TEXT DEFAULT '#ffffff',
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed categories
INSERT INTO skill_categories (name, slug, description, icon, color, display_order) VALUES
('Development', 'dev', 'Coding, debugging, and software architecture', '💻', '#2979FF', 1),
('Business', 'business', 'Strategy, operations, and financial analysis', '📊', '#00c896', 2),
('Marketing', 'marketing', 'Content creation, SEO, and social media', '📢', '#ff6496', 3),
('Creative', 'creative', 'Writing, design, and art direction', '🎨', '#ffc832', 4),
('Data', 'data', 'Analytics, visualization, and machine learning', '📈', '#64c8ff', 5),
('Productivity', 'productivity', 'Automation and workflow optimization', '⚡', '#96ff96', 6),
('Research', 'research', 'Deep research and fact-checking', '🔍', '#c896ff', 7),
('Engineering', 'engineering', 'DevOps, infrastructure, and systems', '⚙️', '#9664ff', 8),
('Customer', 'customer', 'Support, engagement, and success', '🤝', '#ffb464', 9),
('Security', 'security', 'Auditing, compliance, and penetration testing', '🛡️', '#ff3264', 10);

-- =============================================
-- DEVELOPER ACCOUNTS
-- =============================================
CREATE TABLE developer_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users NOT NULL UNIQUE,
    codename TEXT NOT NULL UNIQUE,
    github_url TEXT,
    bio TEXT,
    avatar_url TEXT,
    
    -- Payout Configuration
    payout_method TEXT DEFAULT 'stripe', -- 'stripe', 'paypal', 'crypto'
    stripe_account_id TEXT,
    paypal_email TEXT,
    crypto_wallet TEXT,
    
    -- Revenue Share (intro offer: 70%, after 3 months: 60%)
    revenue_share_percent INT DEFAULT 70,
    intro_period_ends_at TIMESTAMPTZ,
    
    -- Verification
    is_verified BOOLEAN DEFAULT FALSE,
    verified_at TIMESTAMPTZ,
    
    -- Stats
    total_earnings DECIMAL(12, 2) DEFAULT 0,
    total_sales INT DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT valid_payout_method CHECK (payout_method IN ('stripe', 'paypal', 'crypto'))
);

-- RLS for developer accounts
ALTER TABLE developer_accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Developers can view their own account"
    ON developer_accounts FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Developers can update their own account"
    ON developer_accounts FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Developers can insert their own account"
    ON developer_accounts FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- =============================================
-- EXTENDED SKILLS TABLE
-- =============================================
-- Add category_id to existing skills table
ALTER TABLE skills ADD COLUMN IF NOT EXISTS category_id INT REFERENCES skill_categories(id);
ALTER TABLE skills ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;
ALTER TABLE skills ADD COLUMN IF NOT EXISTS short_description TEXT;
ALTER TABLE skills ADD COLUMN IF NOT EXISTS time_saved_hours INT DEFAULT 0;
ALTER TABLE skills ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE;
ALTER TABLE skills ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending'; -- pending, approved, rejected

-- =============================================
-- SKILL PURCHASES
-- =============================================
CREATE TABLE skill_purchases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    buyer_id UUID REFERENCES auth.users NOT NULL,
    skill_id BIGINT REFERENCES skills(id) NOT NULL,
    developer_id UUID REFERENCES developer_accounts(id) NOT NULL,
    
    -- Payment Details
    amount DECIMAL(10, 2) NOT NULL,
    platform_fee DECIMAL(10, 2) NOT NULL,
    developer_payout DECIMAL(10, 2) NOT NULL,
    
    -- Lemon Squeezy / Stripe
    payment_provider TEXT DEFAULT 'lemonsqueezy',
    external_order_id TEXT,
    external_customer_id TEXT,
    
    -- Affiliate Attribution
    affiliate_id UUID REFERENCES affiliate_links(id),
    affiliate_commission DECIMAL(10, 2) DEFAULT 0,
    
    -- Status
    status TEXT DEFAULT 'completed', -- completed, refunded
    refunded_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE skill_purchases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own purchases"
    ON skill_purchases FOR SELECT
    USING (auth.uid() = buyer_id);

-- =============================================
-- AFFILIATE LINKS
-- =============================================
CREATE TABLE affiliate_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users NOT NULL,
    
    -- Link Details
    code TEXT NOT NULL UNIQUE, -- e.g., "NEO2024"
    url TEXT GENERATED ALWAYS AS ('https://moltbotskills.com/?ref=' || code) STORED,
    
    -- Commission (20% of first sale)
    commission_percent INT DEFAULT 20,
    cookie_days INT DEFAULT 30,
    
    -- Stats
    clicks INT DEFAULT 0,
    conversions INT DEFAULT 0,
    total_earned DECIMAL(12, 2) DEFAULT 0,
    
    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE affiliate_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own affiliate links"
    ON affiliate_links FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own affiliate links"
    ON affiliate_links FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- =============================================
-- PAYOUTS
-- =============================================
CREATE TABLE payouts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    developer_id UUID REFERENCES developer_accounts(id) NOT NULL,
    
    -- Payout Details
    amount DECIMAL(12, 2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    payout_method TEXT NOT NULL,
    
    -- External Reference
    stripe_transfer_id TEXT,
    paypal_batch_id TEXT,
    crypto_tx_hash TEXT,
    
    -- Status
    status TEXT DEFAULT 'pending', -- pending, processing, completed, failed
    processed_at TIMESTAMPTZ,
    failed_reason TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE payouts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Developers can view their own payouts"
    ON payouts FOR SELECT
    USING (
        developer_id IN (
            SELECT id FROM developer_accounts WHERE user_id = auth.uid()
        )
    );

-- =============================================
-- NEWSLETTER SUBSCRIBERS
-- =============================================
CREATE TABLE newsletter_subscribers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL UNIQUE,
    
    -- Source tracking
    source TEXT DEFAULT 'website', -- website, affiliate, checkout
    referrer TEXT,
    
    -- Status
    is_verified BOOLEAN DEFAULT FALSE,
    verified_at TIMESTAMPTZ,
    unsubscribed_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Allow anyone to subscribe (public insert)
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can subscribe to newsletter"
    ON newsletter_subscribers FOR INSERT
    WITH CHECK (TRUE);

-- =============================================
-- SYSTEM LOGS (for monitoring)
-- =============================================
CREATE TABLE system_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type TEXT NOT NULL,
    source TEXT,
    details JSONB,
    severity TEXT DEFAULT 'info', -- debug, info, warning, error
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- FUNCTIONS & TRIGGERS
-- =============================================

-- Auto-update developer revenue share after 3 months
CREATE OR REPLACE FUNCTION update_revenue_share()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.intro_period_ends_at IS NULL THEN
        NEW.intro_period_ends_at := NEW.created_at + INTERVAL '3 months';
    END IF;
    
    -- After intro period, reduce to 60%
    IF NOW() > NEW.intro_period_ends_at AND NEW.revenue_share_percent = 70 THEN
        NEW.revenue_share_percent := 60;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_revenue_share
    BEFORE INSERT OR UPDATE ON developer_accounts
    FOR EACH ROW
    EXECUTE FUNCTION update_revenue_share();

-- Auto-increment download count on purchase
CREATE OR REPLACE FUNCTION increment_downloads()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE skills 
    SET downloads_count = downloads_count + 1 
    WHERE id = NEW.skill_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_purchase_increment_downloads
    AFTER INSERT ON skill_purchases
    FOR EACH ROW
    EXECUTE FUNCTION increment_downloads();

-- =============================================
-- SKILL SUBMISSIONS (Developer-submitted skills awaiting review)
-- =============================================
CREATE TABLE skill_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    developer_id UUID REFERENCES auth.users NOT NULL,
    
    -- Skill Details
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    short_description TEXT,
    file_content TEXT, -- Markdown content of the skill file
    
    -- Review Status
    status TEXT DEFAULT 'pending', -- pending, in_review, approved, rejected
    reviewed_at TIMESTAMPTZ,
    reviewer_notes TEXT,
    
    -- SHA-256 Hash of file content
    content_hash TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE skill_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Developers can view their own submissions"
    ON skill_submissions FOR SELECT
    USING (auth.uid() = developer_id);

CREATE POLICY "Developers can insert their own submissions"
    ON skill_submissions FOR INSERT
    WITH CHECK (auth.uid() = developer_id);

CREATE POLICY "Developers can update pending submissions"
    ON skill_submissions FOR UPDATE
    USING (auth.uid() = developer_id AND status = 'pending');
