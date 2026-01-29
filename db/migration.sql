-- =============================================
-- MOLTBOT SKILLS - MIGRATION SCRIPT
-- Run this if you already have the base tables
-- =============================================

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
    file_content TEXT,
    status TEXT DEFAULT 'pending',
    reviewed_at TIMESTAMPTZ,
    reviewer_notes TEXT,
    content_hash TEXT,
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
    skill_id TEXT,
    skill_name TEXT,
    amount_paid DECIMAL(10, 2) DEFAULT 0,
    status TEXT DEFAULT 'pending',
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
-- SEED SOME INITIAL SKILLS (optional)
-- =============================================
-- Uncommented for immediate demonstration:

INSERT INTO skills (title, short_description, description, price, category, icon, is_verified, downloads_count, avg_rating, rating_count)
VALUES 
('FullStack_Architect_v9', 'Generate production-ready Next.js apps.', 'Complete Next.js boilerplate generator with authentication and database integration.', 49, 'dev', '💻', true, 2400, 4.8, 127),
('Financial_Analyst_Pro', 'Professional grade financial modeling.', 'Generate P&L statements, cash flow analysis, and investor reports with a single prompt.', 79, 'business', '📊', true, 3200, 5.0, 156),
('Market_Research_Agent', 'Multi-source research with citations.', 'Synthesizes data from academic and social sources with fact-checking logic.', 39, 'research', '🔍', true, 5100, 4.7, 412),
('Life_Coach_AI', 'Zen-mode habits and mental clarity.', 'Personalized wellness coaching, habit tracking, and cognitive behavioral tools.', 29, 'personal', '🧘', true, 1200, 4.6, 89),
('Dating_Profile_Optimizer', 'Swipe right on your future.', 'Bio optimization, photo analysis, and conversational openers for modern apps.', 19, 'personal', '💘', true, 850, 4.5, 64)
ON CONFLICT DO NOTHING;
