// ELITE SKILL SECURITY SCANNER
// Multi-layer security validation for skill uploads
// No stone left unturned - comprehensive threat detection

import { Handler } from '@netlify/functions';

// ===========================================
// THREAT SIGNATURE DATABASE
// ===========================================

// Shell injection patterns
const SHELL_INJECTION_PATTERNS = [
    /rm\s+-rf\s+[\/~]/gi,
    /rm\s+--no-preserve-root/gi,
    /curl\s+.*\|\s*sh/gi,
    /curl\s+.*\|\s*bash/gi,
    /wget\s+.*\|\s*sh/gi,
    /wget\s+.*\|\s*bash/gi,
    /chmod\s+777/gi,
    /chmod\s+\+x\s+.*&&.*sh/gi,
    /mkfs\./gi,
    /dd\s+if=.*of=/gi,
    /:\(\)\{\s*:\|:\&\s*\};:/g, // Fork bomb
    />\s*\/dev\/sd[a-z]/gi,
    /echo\s+.*>\s*\/etc\//gi,
    /sudo\s+rm/gi,
    /pkill\s+-9/gi,
    /killall\s+-9/gi,
];

// Credential harvesting patterns
const CREDENTIAL_PATTERNS = [
    /password\s*[:=]\s*['"][^'"]+['"]/gi,
    /api[_-]?key\s*[:=]\s*['"][^'"]+['"]/gi,
    /secret[_-]?key\s*[:=]\s*['"][^'"]+['"]/gi,
    /access[_-]?token\s*[:=]\s*['"][^'"]+['"]/gi,
    /auth[_-]?token\s*[:=]\s*['"][^'"]+['"]/gi,
    /private[_-]?key\s*[:=]/gi,
    /BEGIN\s+(RSA|DSA|EC|OPENSSH)\s+PRIVATE\s+KEY/gi,
    /aws[_-]?secret[_-]?access[_-]?key/gi,
    /AKIA[0-9A-Z]{16}/g, // AWS Access Key ID
    /sk-[a-zA-Z0-9]{48}/g, // OpenAI API Key pattern
    /ghp_[a-zA-Z0-9]{36}/g, // GitHub Personal Access Token
    /xox[baprs]-[0-9a-zA-Z-]+/g, // Slack tokens
];

// System access patterns
const SYSTEM_ACCESS_PATTERNS = [
    /process\.env\[/gi,
    /process\.env\./gi,
    /require\s*\(\s*['"]child_process['"]\s*\)/gi,
    /require\s*\(\s*['"]fs['"]\s*\)/gi,
    /require\s*\(\s*['"]os['"]\s*\)/gi,
    /require\s*\(\s*['"]net['"]\s*\)/gi,
    /import\s+.*from\s+['"]child_process['"]/gi,
    /import\s+.*from\s+['"]fs['"]/gi,
    /exec\s*\(/gi,
    /execSync\s*\(/gi,
    /spawn\s*\(/gi,
    /eval\s*\(/gi,
    /new\s+Function\s*\(/gi,
    /Function\s*\(/gi,
    /__dirname/gi,
    /__filename/gi,
    /fs\.(read|write|unlink|rmdir|mkdir|chmod)/gi,
    /child_process\./gi,
];

// Network exfiltration patterns
const NETWORK_EXFIL_PATTERNS = [
    /fetch\s*\(\s*['"]https?:\/\/[^'"]*\.(ru|cn|kp|ir)\//gi,
    /XMLHttpRequest/gi,
    /new\s+WebSocket\s*\(/gi,
    /navigator\.sendBeacon/gi,
    /document\.cookie/gi,
    /localStorage\./gi,
    /sessionStorage\./gi,
    /indexedDB/gi,
];

// Obfuscation patterns
const OBFUSCATION_PATTERNS = [
    /\\x[0-9a-fA-F]{2}/g, // Hex escapes
    /\\u[0-9a-fA-F]{4}/g, // Unicode escapes
    /atob\s*\(/gi, // Base64 decode
    /btoa\s*\(/gi, // Base64 encode
    /String\.fromCharCode/gi,
    /charCodeAt/gi,
    /unescape\s*\(/gi,
    /decodeURIComponent\s*\(/gi,
    /\[["']constructor["']\]/gi, // Constructor access obfuscation
];

// Cryptominer patterns
const CRYPTOMINER_PATTERNS = [
    /coinhive/gi,
    /cryptonight/gi,
    /monero/gi,
    /stratum\+tcp/gi,
    /xmrig/gi,
    /minergate/gi,
    /cryptoloot/gi,
    /webminer/gi,
    /coin-?hive/gi,
    /crypto-?loot/gi,
];

// Malware domain blocklist (sample - would be much larger in production)
const MALWARE_DOMAINS = [
    'malware.com',
    'phishing.net',
    'evil.ru',
    'hack.cn',
    'cryptominer.io',
    'keylogger.net',
    'botnet.org',
    'ransomware.xyz',
    'trojan.cc',
    'exploit.kit',
];

// Dangerous HTML patterns
const DANGEROUS_HTML_PATTERNS = [
    /<script[\s>]/gi,
    /<\/script>/gi,
    /javascript:/gi,
    /vbscript:/gi,
    /on(load|error|click|mouseover|mouseout|submit|focus|blur|change|keyup|keydown)\s*=/gi,
    /<iframe[\s>]/gi,
    /<object[\s>]/gi,
    /<embed[\s>]/gi,
    /<form[\s>]/gi,
    /<input[\s>]/gi,
    /data:text\/html/gi,
    /data:application\/javascript/gi,
    /<meta\s+http-equiv/gi,
    /<base[\s>]/gi,
    /<link\s+rel=["']import/gi,
];

// Backdoor patterns
const BACKDOOR_PATTERNS = [
    /reverse\s*shell/gi,
    /bindshell/gi,
    /meterpreter/gi,
    /netcat\s+-[el]/gi,
    /nc\s+-[el]/gi,
    /python\s+-c.*socket/gi,
    /perl\s+-e.*socket/gi,
    /php\s+-r.*fsockopen/gi,
    /bash\s+-i.*\/dev\/tcp/gi,
    /powershell.*-e\s+/gi,
    /IEX\s*\(/gi, // PowerShell invoke-expression
];

// ===========================================
// SCANNER RESULT TYPES
// ===========================================

interface ScanResult {
    status: 'PASSED' | 'FLAGGED' | 'REJECTED';
    riskScore: number; // 0-100
    threats: ThreatReport[];
    warnings: string[];
    metadata: {
        fileSize: number;
        lineCount: number;
        codeBlockCount: number;
        urlCount: number;
        scanDuration: number;
    };
}

interface ThreatReport {
    category: string;
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    pattern: string;
    location: string;
    description: string;
}

// ===========================================
// SCANNER FUNCTIONS
// ===========================================

function extractCodeBlocks(content: string): { language: string; code: string; lineNumber: number }[] {
    const codeBlocks: { language: string; code: string; lineNumber: number }[] = [];
    const regex = /```(\w*)\n([\s\S]*?)```/g;
    let match;

    while ((match = regex.exec(content)) !== null) {
        const lineNumber = content.substring(0, match.index).split('\n').length;
        codeBlocks.push({
            language: match[1] || 'unknown',
            code: match[2],
            lineNumber
        });
    }

    // Also check for inline code that might contain threats
    const inlineRegex = /`([^`]+)`/g;
    while ((match = inlineRegex.exec(content)) !== null) {
        const lineNumber = content.substring(0, match.index).split('\n').length;
        codeBlocks.push({
            language: 'inline',
            code: match[1],
            lineNumber
        });
    }

    return codeBlocks;
}

function extractUrls(content: string): { url: string; lineNumber: number }[] {
    const urls: { url: string; lineNumber: number }[] = [];
    const regex = /https?:\/\/[^\s\])"'<>]+/gi;
    let match;

    while ((match = regex.exec(content)) !== null) {
        const lineNumber = content.substring(0, match.index).split('\n').length;
        urls.push({
            url: match[0],
            lineNumber
        });
    }

    return urls;
}

function scanPatterns(
    content: string,
    patterns: RegExp[],
    category: string,
    severity: ThreatReport['severity'],
    description: string
): ThreatReport[] {
    const threats: ThreatReport[] = [];

    for (const pattern of patterns) {
        const regex = new RegExp(pattern.source, pattern.flags);
        let match;

        while ((match = regex.exec(content)) !== null) {
            const lineNumber = content.substring(0, match.index).split('\n').length;
            threats.push({
                category,
                severity,
                pattern: match[0].substring(0, 50) + (match[0].length > 50 ? '...' : ''),
                location: `Line ${lineNumber}`,
                description
            });

            // Prevent infinite loops on zero-width matches
            if (match.index === regex.lastIndex) {
                regex.lastIndex++;
            }
        }
    }

    return threats;
}

function checkUrlSafety(urls: { url: string; lineNumber: number }[]): ThreatReport[] {
    const threats: ThreatReport[] = [];

    for (const { url, lineNumber } of urls) {
        try {
            const parsed = new URL(url);
            const hostname = parsed.hostname.toLowerCase();

            // Check against malware domains
            for (const domain of MALWARE_DOMAINS) {
                if (hostname.includes(domain)) {
                    threats.push({
                        category: 'MALWARE_DOMAIN',
                        severity: 'CRITICAL',
                        pattern: url.substring(0, 50),
                        location: `Line ${lineNumber}`,
                        description: `URL points to known malicious domain: ${domain}`
                    });
                }
            }

            // Check for suspicious TLDs
            const suspiciousTlds = ['.ru', '.cn', '.kp', '.ir', '.tk', '.ml', '.ga', '.cf'];
            for (const tld of suspiciousTlds) {
                if (hostname.endsWith(tld)) {
                    threats.push({
                        category: 'SUSPICIOUS_DOMAIN',
                        severity: 'MEDIUM',
                        pattern: url.substring(0, 50),
                        location: `Line ${lineNumber}`,
                        description: `URL uses suspicious TLD: ${tld}`
                    });
                }
            }

            // Check for IP addresses instead of domains
            if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(hostname)) {
                threats.push({
                    category: 'IP_ADDRESS_URL',
                    severity: 'MEDIUM',
                    pattern: url.substring(0, 50),
                    location: `Line ${lineNumber}`,
                    description: 'URL uses IP address instead of domain name'
                });
            }

            // Check for data URLs
            if (url.startsWith('data:')) {
                threats.push({
                    category: 'DATA_URL',
                    severity: 'HIGH',
                    pattern: url.substring(0, 50),
                    location: `Line ${lineNumber}`,
                    description: 'Data URL detected - potential payload embedding'
                });
            }

        } catch (e) {
            // Invalid URL - might be obfuscated
            threats.push({
                category: 'MALFORMED_URL',
                severity: 'LOW',
                pattern: url.substring(0, 50),
                location: `Line ${lineNumber}`,
                description: 'Malformed or obfuscated URL'
            });
        }
    }

    return threats;
}

function validateMarkdownStructure(content: string): { valid: boolean; warnings: string[] } {
    const warnings: string[] = [];

    // Check for required sections
    if (!content.includes('#')) {
        warnings.push('No headers found - skill should have clear sections');
    }

    // Check for binary data
    if (/[\x00-\x08\x0E-\x1F]/.test(content)) {
        warnings.push('Binary data detected in content');
    }

    // Check for excessive code blocks (potential payload hiding)
    const codeBlockCount = (content.match(/```/g) || []).length / 2;
    if (codeBlockCount > 20) {
        warnings.push(`Excessive code blocks detected (${codeBlockCount})`);
    }

    // Check for balanced markdown
    const openBrackets = (content.match(/\[/g) || []).length;
    const closeBrackets = (content.match(/\]/g) || []).length;
    if (Math.abs(openBrackets - closeBrackets) > 5) {
        warnings.push('Unbalanced brackets detected');
    }

    return { valid: warnings.length === 0, warnings };
}

function checkEncodingPatterns(content: string): ThreatReport[] {
    const threats: ThreatReport[] = [];

    // Check for base64 encoded strings that might be payloads
    const base64Regex = /[A-Za-z0-9+/]{50,}={0,2}/g;
    let match;

    while ((match = base64Regex.exec(content)) !== null) {
        // Try to decode and check for suspicious content
        try {
            const decoded = Buffer.from(match[0], 'base64').toString('utf-8');

            // Check if decoded content contains threats
            const hasThreats = SHELL_INJECTION_PATTERNS.some(p => p.test(decoded)) ||
                SYSTEM_ACCESS_PATTERNS.some(p => p.test(decoded));

            if (hasThreats) {
                const lineNumber = content.substring(0, match.index).split('\n').length;
                threats.push({
                    category: 'HIDDEN_PAYLOAD',
                    severity: 'CRITICAL',
                    pattern: match[0].substring(0, 30) + '...',
                    location: `Line ${lineNumber}`,
                    description: 'Base64 encoded malicious payload detected'
                });
            }
        } catch (e) {
            // Not valid base64, ignore
        }
    }

    return threats;
}

function calculateRiskScore(threats: ThreatReport[]): number {
    let score = 0;

    for (const threat of threats) {
        switch (threat.severity) {
            case 'CRITICAL':
                score += 30;
                break;
            case 'HIGH':
                score += 20;
                break;
            case 'MEDIUM':
                score += 10;
                break;
            case 'LOW':
                score += 5;
                break;
        }
    }

    return Math.min(100, score);
}

// ===========================================
// MAIN SCANNER FUNCTION
// ===========================================

async function scanSkillContent(content: string, fileName: string): Promise<ScanResult> {
    const startTime = Date.now();
    const threats: ThreatReport[] = [];
    const warnings: string[] = [];

    // Pre-validation
    if (!content || content.length === 0) {
        return {
            status: 'REJECTED',
            riskScore: 100,
            threats: [{
                category: 'EMPTY_CONTENT',
                severity: 'HIGH',
                pattern: '',
                location: 'File',
                description: 'Empty file submitted'
            }],
            warnings: [],
            metadata: {
                fileSize: 0,
                lineCount: 0,
                codeBlockCount: 0,
                urlCount: 0,
                scanDuration: Date.now() - startTime
            }
        };
    }

    // File size check (500KB max)
    const fileSize = Buffer.byteLength(content, 'utf8');
    if (fileSize > 500 * 1024) {
        return {
            status: 'REJECTED',
            riskScore: 100,
            threats: [{
                category: 'FILE_TOO_LARGE',
                severity: 'HIGH',
                pattern: `${(fileSize / 1024).toFixed(2)}KB`,
                location: 'File',
                description: 'File exceeds maximum size limit of 500KB'
            }],
            warnings: [],
            metadata: {
                fileSize,
                lineCount: content.split('\n').length,
                codeBlockCount: 0,
                urlCount: 0,
                scanDuration: Date.now() - startTime
            }
        };
    }

    // Extract components
    const codeBlocks = extractCodeBlocks(content);
    const urls = extractUrls(content);
    const lineCount = content.split('\n').length;

    // LAYER 1: Shell injection scan
    threats.push(...scanPatterns(
        content,
        SHELL_INJECTION_PATTERNS,
        'SHELL_INJECTION',
        'CRITICAL',
        'Potential shell command injection detected'
    ));

    // LAYER 2: Credential harvesting scan
    threats.push(...scanPatterns(
        content,
        CREDENTIAL_PATTERNS,
        'CREDENTIAL_EXPOSURE',
        'HIGH',
        'Potential credential or API key exposure detected'
    ));

    // LAYER 3: System access scan
    threats.push(...scanPatterns(
        content,
        SYSTEM_ACCESS_PATTERNS,
        'SYSTEM_ACCESS',
        'HIGH',
        'Attempt to access system resources detected'
    ));

    // LAYER 4: Network exfiltration scan
    threats.push(...scanPatterns(
        content,
        NETWORK_EXFIL_PATTERNS,
        'NETWORK_EXFIL',
        'HIGH',
        'Potential data exfiltration pattern detected'
    ));

    // LAYER 5: Obfuscation scan
    threats.push(...scanPatterns(
        content,
        OBFUSCATION_PATTERNS,
        'OBFUSCATION',
        'MEDIUM',
        'Code obfuscation technique detected'
    ));

    // LAYER 6: Cryptominer scan
    threats.push(...scanPatterns(
        content,
        CRYPTOMINER_PATTERNS,
        'CRYPTOMINER',
        'CRITICAL',
        'Cryptocurrency miner reference detected'
    ));

    // LAYER 7: Dangerous HTML scan
    threats.push(...scanPatterns(
        content,
        DANGEROUS_HTML_PATTERNS,
        'DANGEROUS_HTML',
        'HIGH',
        'Dangerous HTML/JavaScript pattern detected'
    ));

    // LAYER 8: Backdoor scan
    threats.push(...scanPatterns(
        content,
        BACKDOOR_PATTERNS,
        'BACKDOOR',
        'CRITICAL',
        'Backdoor or reverse shell pattern detected'
    ));

    // LAYER 9: URL safety check
    threats.push(...checkUrlSafety(urls));

    // LAYER 10: Encoding/hidden payload check
    threats.push(...checkEncodingPatterns(content));

    // LAYER 11: Structure validation
    const structureCheck = validateMarkdownStructure(content);
    warnings.push(...structureCheck.warnings);

    // Calculate risk score
    const riskScore = calculateRiskScore(threats);

    // Determine status
    let status: ScanResult['status'];
    if (threats.some(t => t.severity === 'CRITICAL')) {
        status = 'REJECTED';
    } else if (riskScore >= 30 || threats.some(t => t.severity === 'HIGH')) {
        status = 'FLAGGED';
    } else {
        status = 'PASSED';
    }

    return {
        status,
        riskScore,
        threats,
        warnings,
        metadata: {
            fileSize,
            lineCount,
            codeBlockCount: codeBlocks.length,
            urlCount: urls.length,
            scanDuration: Date.now() - startTime
        }
    };
}

// ===========================================
// NETLIFY FUNCTION HANDLER
// ===========================================

const handler: Handler = async (event) => {
    // CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json'
    };

    // Handle preflight
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    // Only accept POST
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        const { content, fileName } = JSON.parse(event.body || '{}');

        if (!content) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Content is required' })
            };
        }

        // Run the security scan
        const result = await scanSkillContent(content, fileName || 'unknown.md');

        // Log for monitoring (in production, send to logging service)
        console.log(`[SECURITY_SCAN] File: ${fileName}, Status: ${result.status}, Risk: ${result.riskScore}, Threats: ${result.threats.length}`);

        if (result.status === 'REJECTED') {
            console.warn(`[REJECTED] ${fileName}:`, result.threats.map(t => t.category).join(', '));
        }

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: result.status !== 'REJECTED',
                ...result
            })
        };

    } catch (error) {
        console.error('[SECURITY_SCAN_ERROR]', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Security scan failed' })
        };
    }
};

export { handler };
