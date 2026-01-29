-- =============================================
-- MOLTBOT SKILLS - MIGRATION SCRIPT
-- Run this if you already have the base tables
-- =============================================

-- Add new columns to existing skills table (if they don't exist)
DO $$ 
BEGIN
    -- Add short_description
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='skills' AND column_name='short_description') THEN
        ALTER TABLE skills ADD COLUMN short_description text;
    END IF;
    
    -- Add category
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='skills' AND column_name='category') THEN
        ALTER TABLE skills ADD COLUMN category text DEFAULT 'dev';
    END IF;
    
    -- Add icon
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='skills' AND column_name='icon') THEN
        ALTER TABLE skills ADD COLUMN icon text DEFAULT '💻';
    END IF;
    
    -- Add is_featured
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='skills' AND column_name='is_featured') THEN
        ALTER TABLE skills ADD COLUMN is_featured boolean DEFAULT false;
    END IF;
    
    -- Add is_top_seller
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='skills' AND column_name='is_top_seller') THEN
        ALTER TABLE skills ADD COLUMN is_top_seller boolean DEFAULT false;
    END IF;
    
    -- Add roi_hours_saved
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='skills' AND column_name='roi_hours_saved') THEN
        ALTER TABLE skills ADD COLUMN roi_hours_saved int DEFAULT 0;
    END IF;
    
    -- Add avg_rating
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='skills' AND column_name='avg_rating') THEN
        ALTER TABLE skills ADD COLUMN avg_rating numeric(2,1) DEFAULT 0;
    END IF;
    
    -- Add rating_count
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='skills' AND column_name='rating_count') THEN
        ALTER TABLE skills ADD COLUMN rating_count int DEFAULT 0;
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
-- Uncomment if you want demo data:
/*
INSERT INTO skills (title, short_description, price, category, icon, is_verified, downloads_count, avg_rating, rating_count, author_id)
SELECT 'FullStack_Architect_v9', 'Generate production-ready Next.js apps.', 49, 'dev', '💻', true, 2400, 4.8, 127, id
FROM profiles LIMIT 1
ON CONFLICT DO NOTHING;
*/
