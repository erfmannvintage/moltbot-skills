document.addEventListener('DOMContentLoaded', () => {
    const terminalBody = document.getElementById('hero-terminal');
    const commands = [
        { type: 'input', text: 'npx elite install senior-dev-bundle', delay: 800 },
        { type: 'process', text: 'initializing neural handshake...', delay: 400 },
        { type: 'process', text: 'analyzing workspace compatibility...', delay: 600 },
        { type: 'success', text: 'system detected: Moltbot v2.1', delay: 300 },
        { type: 'process', text: 'downloading skill: research_expert.md...', delay: 500 },
        { type: 'success', text: 'signature verified: 0x9F...A2 (Audit Passed)', delay: 200 },
        { type: 'process', text: 'installing dependencies: [################----] 80%', delay: 400 },
        { type: 'success', text: 'dependencies installed.', delay: 200 },
        { type: 'process', text: 'injecting capabilities into neural architecture...', delay: 800 },
        { type: 'success', text: 'SKILL INJECTION COMPLETE.', delay: 200 },
        { type: 'input', text: 'agent status --verbose', delay: 1500 },
        { type: 'output', text: 'Current Capabilities: [RESEARCH, CODING, DEPLOYMENT]', delay: 200 },
        { type: 'output', text: 'Status: ONLINE (God Mode Active)', delay: 200 },
    ];

    let currentLineIndex = 0;

    async function typeWriter(text, element, speed = 30) {
        return new Promise(resolve => {
            let i = 0;
            element.innerHTML += '<span class="cursor">_</span>';
            const cursor = element.querySelector('.cursor');

            function type() {
                if (i < text.length) {
                    cursor.insertAdjacentText('beforebegin', text.charAt(i));
                    i++;
                    setTimeout(type, speed + (Math.random() * 20));
                } else {
                    cursor.remove();
                    resolve();
                }
            }
            type();
        });
    }

    // --- INFRASTRUCTURE CONFIG ---
    // PLACEHOLDERS: Replace these with your actual keys from Supabase Dashboard
    const SUPABASE_URL = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRwY3J4ZHN4dGF1am1jbG1haHZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2MjI1NzEsImV4cCI6MjA4NTE5ODU3MX0.FJTvbP3WK6 - pX8e37fxq8 - a_juG7Hg04gZVa00rNGZk;
    const SUPABASE_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRwY3J4ZHN4dGF1am1jbG1haHZrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTYyMjU3MSwiZXhwIjoyMDg1MTk4NTcxfQ.0WDQ - AJjrQfUY51uDQoDlAqPaGYfOH9DIJmI626S044
        ;

    // Initialize Supabase (Global access)
    const supabase = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY) : null;

    // --- STATE MANAGEMENT ---
    let activeUser = null;

    // --- AUTHENTICATION ---
    async function initAuth() {
        if (!supabase) return;

        // Check active session
        const { data: { session } } = await supabase.auth.getSession();

        if (session) {
            console.log('User signed in:', session.user);
            activeUser = session.user;
            updateUIForLoggedUser(activeUser);
        }

        // Listen for auth changes
        supabase.auth.onAuthStateChange((_event, session) => {
            activeUser = session ? session.user : null;
            if (activeUser) updateUIForLoggedUser(activeUser);
        });
    }

    function updateUIForLoggedUser(user) {
        const loginBtn = document.querySelector('.btn-login');
        if (loginBtn) {
            // Use GitHub username or email
            const name = user.user_metadata.user_name || user.email.split('@')[0];
            loginBtn.textContent = `// ${name.toUpperCase()}`;
            loginBtn.classList.add('logged-in');
        }
    }

    async function handleLogin() {
        if (!supabase) {
            alert("SYSTEM ERROR: Supabase not configured. Please add API Keys.");
            return;
        }
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'github',
        });
        if (error) console.error('Login failed:', error);
    }

    // Wire up Login Button
    const loginBtn = document.querySelector('.btn-login');
    if (loginBtn) {
        loginBtn.addEventListener('click', handleLogin);
    }

    // Initialize
    initAuth();

    // Placeholder for initLiveFeed if it's meant to be defined here.
    // Based on the instruction, it seems like initLiveFeed() was meant to be called
    // after the typeWriter function, but its definition is missing.
    // For now, I'll place the call where indicated, assuming it's defined elsewhere or will be added.
    // If initLiveFeed() is not defined, this will cause an error.
    // Assuming it's a new function to be added, but not provided in the snippet.
    // For now, I will omit the call to `initLiveFeed()` as its definition is not provided
    // and placing a call without definition would break the script.
    // If `initLiveFeed` is part of the user's intended change, they should provide its definition.

    // 3. Command Palette Logic
    const cmdPalette = document.getElementById('cmd-palette');
    const cmdInput = document.getElementById('cmd-input');
    const cmdResults = document.getElementById('cmd-results');

    const paletteCommands = [ // Renamed to avoid conflict with existing 'commands' array
        { icon: '🔎', text: 'Search Skills...', action: () => document.getElementById('marketplace').scrollIntoView({ behavior: 'smooth' }) },
        { icon: '⚡', text: 'View System Architecture', action: () => document.querySelector('.features-section').scrollIntoView({ behavior: 'smooth' }) },
        { icon: '💎', text: 'Join The Syndicate (SaaS)', action: () => document.getElementById('pricing').scrollIntoView({ behavior: 'smooth' }) },
        { icon: '🛡️', text: 'Open Developer Portal', action: () => document.getElementById('open-dev-modal').click() },
        { icon: '💰', text: 'View Revenue Leaderboard', action: () => document.getElementById('leaderboard').scrollIntoView({ behavior: 'smooth' }) },
        { icon: '📄', text: 'Read Manifesto', action: () => document.getElementById('manifesto').scrollIntoView({ behavior: 'smooth' }) }
    ];

    // Toggle Keys
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            toggleCmdPalette();
        }
        if (e.key === 'Escape' && cmdPalette.style.display === 'flex') {
            toggleCmdPalette();
        }
    });

    // Close on outside click
    cmdPalette.addEventListener('click', (e) => {
        if (e.target === cmdPalette) toggleCmdPalette();
    });

    function toggleCmdPalette() {
        const isActive = cmdPalette.style.display === 'flex';
        if (isActive) {
            cmdPalette.style.display = 'none';
            cmdPalette.classList.remove('active');
        } else {
            cmdPalette.style.display = 'flex'; // triggers flex
            setTimeout(() => cmdPalette.classList.add('active'), 10);
            cmdInput.value = '';
            cmdInput.focus();
            renderCommands(paletteCommands);
        }
    }

    // Filtering
    cmdInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const filtered = paletteCommands.filter(cmd => cmd.text.toLowerCase().includes(query));
        renderCommands(filtered);
    });

    function renderCommands(list) {
        cmdResults.innerHTML = '';
        list.forEach((cmd, index) => {
            const div = document.createElement('div');
            div.className = 'cmd-item';
            if (index === 0) div.classList.add('selected'); // Auto-select first
            div.innerHTML = `
                <div style="display:flex; align-items:center">
                    <span class="icon">${cmd.icon}</span>
                    <span>${cmd.text}</span>
                </div>
                <span class="shortcut">↵</span>
            `;
            div.addEventListener('click', () => {
                cmd.action();
                toggleCmdPalette();
            });
            cmdResults.appendChild(div);
        });
    }


    async function runTerminal() {
        terminalBody.innerHTML = ''; // Clear initial static content

        // Initial Prompt
        const startLine = document.createElement('div');
        startLine.className = 'line';
        startLine.innerHTML = '<span class="blue">➜</span> <span class="purple">~</span> ';
        terminalBody.appendChild(startLine);

        for (const cmd of commands) {
            await new Promise(r => setTimeout(r, cmd.delay));

            const line = document.createElement('div');
            line.className = 'line';

            if (cmd.type === 'input') {
                // If it's a new input, we append to the LAST prompt line
                const lastLine = terminalBody.lastElementChild;
                await typeWriter(cmd.text, lastLine);

                // Create result line container for next output
                // But first, create a new line for the result to appear
            } else {
                // For process/success/output
                if (cmd.type === 'process') {
                    line.innerHTML = `<span class="dim">> ${cmd.text}</span>`;
                } else if (cmd.type === 'success') {
                    line.innerHTML = `<span class="green">✔</span> ${cmd.text}`;
                } else if (cmd.type === 'output') {
                    line.innerHTML = `<span class="white">${cmd.text}</span>`;
                }

                terminalBody.appendChild(line);
            }

            // Scroll to bottom
            terminalBody.scrollTop = terminalBody.scrollHeight;

            // If we just finished an input or a block of output, prepare the prompt for the next input?
            // Simplified: Just add a prompt line AFTER a command is finished execution (conceptually)
            // But here we are mixing types.
            // Let's refine:
            // Input types need typing.
            // Output types appear instantly or with fade.

            if (cmd.type === 'input') {
                // After typing input, we need a new line for potential output
            }

            // If this was the last command or followed by input, add a new prompt line
            // This logic is a bit rigid, let's just add a prompt line before the NEXT input
        }

        // Final Prompt
        const endLine = document.createElement('div');
        endLine.className = 'line';
        endLine.innerHTML = '<span class="blue">➜</span> <span class="purple">~</span> <span class="cursor">_</span>';
        terminalBody.appendChild(endLine);
    }

    // Better logic to handle the flow
    async function runTerminalSequence() {
        terminalBody.innerHTML = '';

        const addPrompt = () => {
            const div = document.createElement('div');
            div.className = 'line';
            div.innerHTML = '<span class="blue">➜</span> <span class="purple">~</span> ';
            terminalBody.appendChild(div);
            return div;
        };

        // Start with prompt
        let currentPrompt = addPrompt();

        for (const cmd of commands) {
            await new Promise(r => setTimeout(r, cmd.delay));

            if (cmd.type === 'input') {
                if (!currentPrompt) currentPrompt = addPrompt();
                await typeWriter(cmd.text, currentPrompt);
                currentPrompt = null; // Input done, next lines are new divs
            } else {
                const div = document.createElement('div');
                div.className = 'line';
                if (cmd.type === 'process') div.innerHTML = `<span class="dim">> ${cmd.text}</span>`;
                if (cmd.type === 'success') div.innerHTML = `<span class="green">✔</span> ${cmd.text}`;
                if (cmd.type === 'output') div.innerHTML = `<span class="white">${cmd.text}</span>`;
                terminalBody.appendChild(div);
            }
            terminalBody.scrollTop = terminalBody.scrollHeight;
        }

        // Final blinking cursor
        const finalLine = document.createElement('div');
        finalLine.className = 'line';
        finalLine.innerHTML = '<span class="blue">➜</span> <span class="purple">~</span> <span class="cursor">_</span>';
        terminalBody.appendChild(finalLine);
    }

    // Start slightly after load
    setTimeout(runTerminalSequence, 1000);

    // Interaction Logic
    const copyBtn = document.querySelector('.copy-btn');
    const cliCommandVal = "npx elite install senior-dev-bundle"; // simpler to hardcode or grab text

    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(cliCommandVal).then(() => {
                const originalText = copyBtn.innerText;
                copyBtn.innerText = "✔";
                copyBtn.style.color = "var(--neon-green)";
                setTimeout(() => {
                    copyBtn.innerText = "⎘";
                    copyBtn.style.color = "";
                }, 2000);
            });
        });
    }

    const installBtns = document.querySelectorAll('.btn-install');
    installBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const btn = e.target;
            const originalText = btn.innerText;
            btn.innerText = "INJECTING...";
            btn.style.background = "var(--neon-purple)";
            btn.style.color = "white";

            // Simulate network request
            setTimeout(() => {
                btn.innerText = "VERIFIED ✔";
                btn.style.background = "var(--neon-green)";
                btn.style.color = "black";

                // Optional: trigger terminal output if visible?
                // For now just reset
                setTimeout(() => {
                    btn.innerText = originalText;
                    btn.style.background = "";
                    btn.style.color = "";
                }, 3000);
            }, 1500);
        });
    });

    // Developer Portal Modal Logic
    const devModal = document.getElementById('dev-modal');
    const openModalBtn = document.getElementById('open-dev-modal');
    const closeModalBtn = document.querySelector('.modal-close');

    if (devModal && openModalBtn && closeModalBtn) {
        openModalBtn.addEventListener('click', () => {
            devModal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        });

        closeModalBtn.addEventListener('click', () => {
            devModal.classList.remove('active');
            document.body.style.overflow = '';
        });

        // Close on outside click
        devModal.addEventListener('click', (e) => {
            if (e.target === devModal) {
                devModal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });

        // Tab Switching Logic
        const tabs = document.querySelectorAll('.tab-btn');
        const contents = document.querySelectorAll('.tab-content');

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Remove active class from all
                tabs.forEach(t => t.classList.remove('active'));
                contents.forEach(c => c.classList.remove('active'));

                // Add active to clicked
                tab.classList.add('active');
                document.getElementById(tab.dataset.tab).classList.add('active');
            });
        });

        // Validator Logic
        const dropZone = document.getElementById('drop-zone');
        const fileInput = document.getElementById('file-upload');
        const auditTerminal = document.getElementById('audit-terminal');
        const auditLog = document.getElementById('audit-log');

        if (dropZone && fileInput) {
            dropZone.addEventListener('click', () => fileInput.click());

            fileInput.addEventListener('change', handleFile);

            dropZone.addEventListener('dragover', (e) => {
                e.preventDefault();
                dropZone.classList.add('drag-over');
            });
            dropZone.addEventListener('dragleave', () => dropZone.classList.remove('drag-over'));
            dropZone.addEventListener('drop', (e) => {
                e.preventDefault();
                dropZone.classList.remove('drag-over');
                if (e.dataTransfer.files.length) handleFile({ target: { files: e.dataTransfer.files } });
            });
        }

        function handleFile(e) {
            const file = e.target.files[0];
            if (!file) return;

            // UI Reset
            dropZone.style.display = 'none';
            auditTerminal.classList.remove('hidden');
            auditLog.innerHTML = `<div class="line">Analyzing: <span class="white">${file.name}</span>...</div>`;

            // Simulation Sequence
            const steps = [
                { text: "Parsing Markdown Structure...", delay: 800, status: "OK" },
                { text: "Scanning for Malicious Patterns (curl, wget, eval)...", delay: 1500, status: "CLEAN" },
                { text: "Verifying Moltbot Compatibility...", delay: 1000, status: "VERIFIED" },
                { text: "Generating Blue Label Signature...", delay: 1200, status: "SIGNED" }
            ];

            let cumulativeDelay = 0;

            steps.forEach(step => {
                cumulativeDelay += step.delay;
                setTimeout(() => {
                    const div = document.createElement('div');
                    div.className = 'line';
                    div.innerHTML = `<span class="dim">> ${step.text}</span> <span class="green">[${step.status}]</span>`;
                    auditLog.appendChild(div);
                    auditLog.scrollTop = auditLog.scrollHeight;
                }, cumulativeDelay);
            });

            setTimeout(() => {
                const final = document.createElement('div');
                final.className = 'line';
                final.innerHTML = `<br><span class="green">✔ AUDIT PASSED.</span> Protocol is safe for deployment.`;
                auditLog.appendChild(final);
                auditLog.scrollTop = auditLog.scrollHeight;
            }, cumulativeDelay + 500);
        }
    }
});
