import { Handler } from "@netlify/functions";

export const handler: Handler = async (event, context) => {
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    try {
        const { content, skillName } = JSON.parse(event.body || "{}");

        if (!content) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "No content provided for scanning" }),
            };
        }

        const issues: string[] = [];
        const lowerContent = content.toLowerCase();

        // Check for dangerous commands
        const dangerousCommands = ["curl", "wget", "eval(", "exec(", "system("];
        dangerousCommands.forEach((cmd) => {
            if (lowerContent.includes(cmd.toLowerCase())) {
                issues.push(`Dangerous command detected: ${cmd}`);
            }
        });

        // Check for potential API key exposure (simple regex for long hex or alphanumeric strings)
        const apiKeyRegex = /[a-fA-F0-9]{32,}/g;
        if (apiKeyRegex.test(content)) {
            issues.push("Potential API key or secret detected.");
        }

        // Check for external API calls
        if (lowerContent.includes("fetch(") || lowerContent.includes("axios")) {
            issues.push("External network calls detected. Ensure all endpoints are documented.");
        }

        // Check for prompt injection patterns
        if (lowerContent.includes("ignore all previous instructions") || lowerContent.includes("you are now a")) {
            issues.push("Potential prompt injection sequences detected.");
        }

        const passed = issues.length === 0;

        return {
            statusCode: 200,
            body: JSON.stringify({
                passed,
                issues,
                scanId: "SEC-" + Math.random().toString(36).substring(2, 9).toUpperCase(),
                timestamp: new Date().toISOString(),
                skillName: skillName || "unknown_skill"
            }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Failed to scan skill" }),
        };
    }
};
