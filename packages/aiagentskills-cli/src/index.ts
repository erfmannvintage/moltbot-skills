#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

const API_BASE = 'https://aiagentskillsmd.com/.netlify/functions';
const VERSION = '1.0.0';

const program = new Command();

// ASCII Art Banner
const banner = `
${chalk.cyan('╔═══════════════════════════════════════════════════════════╗')}
${chalk.cyan('║')}  ${chalk.bold.green('AI_AGENT_SKILLS')} ${chalk.dim('// Skill Injection System')}            ${chalk.cyan('║')}
${chalk.cyan('║')}  ${chalk.dim('v' + VERSION)}                                                ${chalk.cyan('║')}
${chalk.cyan('╚═══════════════════════════════════════════════════════════╝')}
`;

program
    .name('aiagentskills')
    .description('CLI tool to inject AI Agent Skills into your AI agents')
    .version(VERSION);

// Inject command
program
    .command('inject <skill-name>')
    .description('Download and inject a skill into your current project')
    .option('-o, --output <path>', 'Output path for the skill file', './')
    .option('-f, --format <format>', 'Output format: md, txt, json', 'md')
    .option('--cursor', 'Add to .cursorrules file')
    .option('--windsurf', 'Add to .windsurfrules file')
    .action(async (skillName: string, options: any) => {
        console.log(banner);

        const spinner = ora(`Fetching skill: ${chalk.cyan(skillName)}`).start();

        try {
            // Fetch skill from API
            const response = await fetch(`${API_BASE}/raw-skill/${skillName}`);

            if (!response.ok) {
                spinner.fail(chalk.red(`Skill not found: ${skillName}`));
                process.exit(1);
            }

            const content = await response.text();
            const skillId = response.headers.get('X-Skill-ID') || skillName;
            const verified = response.headers.get('X-Skill-Verified') === 'true';

            spinner.succeed(chalk.green(`Skill fetched: ${skillName}`));

            if (verified) {
                console.log(chalk.green('  ✓ Verified skill'));
            }

            // Determine output path
            const filename = `${skillName.replace(/[^a-z0-9-]/gi, '_')}.${options.format}`;
            let outputPath = path.join(options.output, filename);

            // Handle special flags
            if (options.cursor) {
                outputPath = '.cursorrules';
                const existingContent = fs.existsSync(outputPath)
                    ? fs.readFileSync(outputPath, 'utf-8') + '\n\n'
                    : '';
                fs.writeFileSync(outputPath, existingContent + content);
                console.log(chalk.green(`  ✓ Added to .cursorrules`));
            } else if (options.windsurf) {
                outputPath = '.windsurfrules';
                const existingContent = fs.existsSync(outputPath)
                    ? fs.readFileSync(outputPath, 'utf-8') + '\n\n'
                    : '';
                fs.writeFileSync(outputPath, existingContent + content);
                console.log(chalk.green(`  ✓ Added to .windsurfrules`));
            } else {
                fs.writeFileSync(outputPath, content);
                console.log(chalk.green(`  ✓ Saved to ${outputPath}`));
            }

            console.log(`\n${chalk.dim('Skill ID:')} ${skillId}`);
            console.log(`${chalk.dim('Source:')} aiagentskillsmd.com\n`);

        } catch (error: any) {
            spinner.fail(chalk.red(`Error: ${error.message}`));
            process.exit(1);
        }
    });

// List command
program
    .command('list')
    .description('List available skills')
    .option('-c, --category <category>', 'Filter by category')
    .action(async (options: any) => {
        console.log(banner);

        const spinner = ora('Fetching skills catalog...').start();

        try {
            // This would need a catalog endpoint
            spinner.info(chalk.yellow('Skills catalog coming soon. Visit https://aiagentskillsmd.com to browse.'));
        } catch (error: any) {
            spinner.fail(chalk.red(`Error: ${error.message}`));
        }
    });

// Search command
program
    .command('search <query>')
    .description('Search for skills')
    .action(async (query: string) => {
        console.log(banner);

        const spinner = ora(`Searching for: ${query}`).start();

        try {
            spinner.info(chalk.yellow(`Search coming soon. Visit https://aiagentskillsmd.com/search?q=${encodeURIComponent(query)}`));
        } catch (error: any) {
            spinner.fail(chalk.red(`Error: ${error.message}`));
        }
    });

// MCP setup command
program
    .command('mcp-setup')
    .description('Configure MCP for Claude Desktop')
    .action(async () => {
        console.log(banner);

        console.log(chalk.cyan('\n⚡ MCP Configuration Setup\n'));

        // Detect OS and config path
        const platform = os.platform();
        let configPath: string;

        switch (platform) {
            case 'win32':
                configPath = path.join(os.homedir(), 'AppData', 'Roaming', 'Claude', 'claude_desktop_config.json');
                break;
            case 'darwin':
                configPath = path.join(os.homedir(), 'Library', 'Application Support', 'Claude', 'claude_desktop_config.json');
                break;
            default:
                configPath = path.join(os.homedir(), '.config', 'Claude', 'claude_desktop_config.json');
        }

        console.log(chalk.dim('Config location:'), configPath);

        const mcpConfig = {
            mcpServers: {
                aiagentskills: {
                    command: 'npx',
                    args: ['aiagentskills-mcp'],
                    env: {
                        SKILLS_API: 'https://aiagentskillsmd.com/.netlify/functions'
                    }
                }
            }
        };

        // Check if config exists
        if (fs.existsSync(configPath)) {
            console.log(chalk.yellow('\nExisting config found. Add this to your mcpServers:'));
        } else {
            console.log(chalk.yellow('\nNo config found. Create the file with:'));
        }

        console.log(chalk.green('\n' + JSON.stringify(mcpConfig, null, 2)));

        console.log(chalk.dim('\n\nAfter adding, restart Claude Desktop to load the MCP server.'));
    });

// Info command
program
    .command('info')
    .description('Show CLI information')
    .action(() => {
        console.log(banner);
        console.log(chalk.cyan('Commands:'));
        console.log('  inject <skill>  Download and inject a skill');
        console.log('  list            List available skills');
        console.log('  search <query>  Search for skills');
        console.log('  mcp-setup       Configure MCP for Claude');
        console.log('\n' + chalk.dim('Website: https://aiagentskillsmd.com'));
        console.log(chalk.dim('Docs: https://docs.aiagentskillsmd.com'));
    });

program.parse();
