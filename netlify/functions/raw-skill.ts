import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export const handler: Handler = async (event) => {
    // CORS headers for raw content
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Content-Type': 'text/markdown; charset=utf-8',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
    };

    // Handle preflight
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 204, headers, body: '' };
    }

    // Only allow GET
    if (event.httpMethod !== 'GET') {
        return {
            statusCode: 405,
            headers: { ...headers, 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Method not allowed' }),
        };
    }

    try {
        // Get skill ID or slug from path
        // Expected format: /.netlify/functions/raw-skill/skill-name or ?id=uuid
        const pathParts = event.path.split('/');
        const skillSlug = pathParts[pathParts.length - 1];
        const skillId = event.queryStringParameters?.id;

        if (!skillSlug && !skillId) {
            return {
                statusCode: 400,
                headers: { ...headers, 'Content-Type': 'application/json' },
                body: JSON.stringify({ error: 'Skill ID or slug required' }),
            };
        }

        // Fetch skill from database
        let query = supabase
            .from('skills')
            .select('id, title, description, content, category, version, creator_id, is_verified');

        if (skillId) {
            query = query.eq('id', skillId);
        } else {
            // Try to match by slug (title converted to lowercase with hyphens)
            query = query.ilike('title', skillSlug.replace(/-/g, ' '));
        }

        const { data: skill, error } = await query.single();

        if (error || !skill) {
            return {
                statusCode: 404,
                headers: { ...headers, 'Content-Type': 'application/json' },
                body: JSON.stringify({ error: 'Skill not found' }),
            };
        }

        // If skill has content stored, return it
        if (skill.content) {
            // Increment download count
            await supabase.rpc('increment_skill_downloads', { skill_id: skill.id });

            return {
                statusCode: 200,
                headers: {
                    ...headers,
                    'X-Skill-ID': skill.id,
                    'X-Skill-Version': skill.version || '1.0.0',
                    'X-Skill-Verified': String(skill.is_verified || false),
                },
                body: skill.content,
            };
        }

        // Generate markdown from skill data if no content stored
        const markdown = generateSkillMarkdown(skill);

        // Increment download count
        await supabase.rpc('increment_skill_downloads', { skill_id: skill.id });

        return {
            statusCode: 200,
            headers: {
                ...headers,
                'X-Skill-ID': skill.id,
                'X-Skill-Version': skill.version || '1.0.0',
                'X-Skill-Verified': String(skill.is_verified || false),
            },
            body: markdown,
        };

    } catch (error) {
        console.error('Raw skill error:', error);

        return {
            statusCode: 500,
            headers: { ...headers, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                error: 'FETCH_FAILED',
                details: 'Unable to retrieve skill content.',
            }),
        };
    }
};

// Generate skill markdown from database record
function generateSkillMarkdown(skill: any): string {
    return `# ${skill.title}

## Description
${skill.description || 'No description provided.'}

## Category
${skill.category || 'general'}

## Version
${skill.version || '1.0.0'}

---

## Instructions

You are now enhanced with the **${skill.title}** skill.

${skill.description || ''}

## Usage

Apply this skill to enhance your capabilities in the ${skill.category || 'general'} domain.

---

*Skill ID: ${skill.id}*
*Verified: ${skill.is_verified ? 'Yes' : 'Pending'}*
*Source: AI Agent Skills Marketplace (aiagentskillsmd.com)*
`;
}
