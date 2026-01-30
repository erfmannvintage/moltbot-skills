# Moltbot Skills - Developer Documentation

## Quick Start

```bash
# Clone the repository
git clone https://github.com/your-org/moltbot-skills.git
cd moltbot-skills

# Install dependencies
npm install

# Start local development server
npm run dev
# OR
python -m http.server 3000
```

---

## Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [Netlify CLI](https://docs.netlify.com/cli/get-started/)
- [Supabase Account](https://supabase.com/)
- GitHub OAuth App (optional)
- Google Cloud Console (optional)

---

## Environment Variables

Create these in **Netlify Dashboard → Site Settings → Environment Variables**:

### Required
| Variable | Description |
|----------|-------------|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (for functions) |

### LemonSqueezy (Payments)
| Variable | Description |
|----------|-------------|
| `LEMON_SQUEEZY_API_KEY` | LemonSqueezy API key |
| `LEMON_SQUEEZY_SIGNING_SECRET` | Webhook signing secret |

### OAuth Providers
| Variable | Description |
|----------|-------------|
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GITHUB_CLIENT_ID` | GitHub OAuth app client ID |

---

## Database Setup

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Copy URL and anon key to environment variables

### 2. Run Migrations

In Supabase SQL Editor, run the migration file:

```sql
-- Copy contents of db/migration.sql and run
```

**Or run via CLI:**
```bash
npx supabase db push
```

### 3. Critical Tables

| Table | Purpose |
|-------|---------|
| `user_profiles` | Customer/developer accounts |
| `skills` | Marketplace skill listings |
| `skill_submissions` | Developer skill submissions |
| `user_skill_library` | User's purchased skills |
| `developer_payouts` | Payout requests |

### 4. Security Scan Column Migration

Run this in Supabase SQL Editor to add security scanning support:

```sql
-- Add security_scan column for storing elite scan results
ALTER TABLE skill_submissions 
ADD COLUMN IF NOT EXISTS security_scan JSONB;

-- Add supporting columns
ALTER TABLE skill_submissions 
ADD COLUMN IF NOT EXISTS slug TEXT,
ADD COLUMN IF NOT EXISTS tier_required TEXT DEFAULT 'free',
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS tags TEXT[],
ADD COLUMN IF NOT EXISTS content TEXT,
ADD COLUMN IF NOT EXISTS file_url TEXT,
ADD COLUMN IF NOT EXISTS submitted_at TIMESTAMPTZ DEFAULT NOW();

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_submissions_security_status 
ON skill_submissions ((security_scan->>'status'));

CREATE INDEX IF NOT EXISTS idx_submissions_status 
ON skill_submissions (status);
```

---

## Authentication Setup

### Supabase Auth Providers

1. Go to **Supabase Dashboard → Authentication → Providers**
2. Enable desired providers:

#### GitHub
1. Create OAuth App at [github.com/settings/developers](https://github.com/settings/developers)
2. Set callback URL: `https://YOUR-PROJECT.supabase.co/auth/v1/callback`
3. Copy Client ID and Secret to Supabase

#### Google
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create OAuth 2.0 credentials
3. Add authorized redirect URI: `https://YOUR-PROJECT.supabase.co/auth/v1/callback`
4. Copy Client ID and Secret to Supabase

#### Email/Password
1. Enable in Supabase Auth settings
2. Configure email templates if desired

---

## Deployment

### Netlify Deployment

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Link to site
netlify link

# Deploy preview
netlify deploy

# Deploy production
netlify deploy --prod
```

### Environment Variables Checklist

Before deploying, ensure all environment variables are set in Netlify:

- [ ] `VITE_SUPABASE_URL`
- [ ] `VITE_SUPABASE_ANON_KEY`
- [ ] `SUPABASE_SERVICE_ROLE_KEY`
- [ ] `LEMON_SQUEEZY_SIGNING_SECRET` (if using payments)

---

## Netlify Functions

### Location
All serverless functions are in:
```
netlify/functions/integrations_v2/
```

### Available Functions

| Function | Endpoint | Purpose |
|----------|----------|---------|
| `skill-scanner` | `/.netlify/functions/integrations_v2/skill-scanner` | Elite security scanning |
| `lemon-webhook` | `/.netlify/functions/integrations_v2/lemon-webhook` | Payment webhooks |

### Testing Functions Locally

```bash
# Start Netlify dev server
netlify dev

# Functions available at localhost:8888/.netlify/functions/
```

---

## Security Scanner

The skill scanner validates all uploads with 11 security layers:

1. Shell injection detection
2. Credential harvesting patterns
3. System access attempts
4. Network exfiltration
5. Code obfuscation
6. Cryptominer signatures
7. Dangerous HTML/XSS
8. Backdoor patterns
9. URL safety
10. Hidden payload detection
11. Markdown structure validation

### Scan Results

| Status | Meaning |
|--------|---------|
| `PASSED` | Clean, proceeds to pending review |
| `FLAGGED` | Suspicious, needs manual review |
| `REJECTED` | Critical threat, blocked |

---

## File Structure

```
moltbot-skills/
├── index.html              # Main page
├── black-market.html       # Black Market page
├── admin.html              # Admin dashboard (TBD)
├── script.js               # Main JavaScript
├── styles.css              # All CSS styles
├── db/
│   ├── migration.sql       # Database migrations
│   └── schema_v2.sql       # Full schema reference
├── netlify/
│   └── functions/
│       └── integrations_v2/
│           ├── skill-scanner.ts
│           └── lemon-webhook.ts
└── netlify.toml            # Netlify config
```

---

## Common Issues

### "skill_submissions" column doesn't exist
Run the security scan migration above.

### Auth not working locally
Use `netlify dev` instead of `python -m http.server` for full functionality.

### Functions returning 500
Check Netlify function logs: **Netlify Dashboard → Functions → Logs**

---

## Support

- GitHub Issues: [github.com/your-org/moltbot-skills/issues](https://github.com/your-org/moltbot-skills/issues)
- Documentation: This file + inline code comments
