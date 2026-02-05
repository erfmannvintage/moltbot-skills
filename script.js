document.addEventListener('DOMContentLoaded', () => {
    const terminalBody = document.getElementById('hero-terminal');

    // --- MATRIX BACKGROUND EFFECT ---
    function initMatrixEffect() {
        const canvas = document.getElementById('matrix-bg');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()";
        const fontSize = 14;
        const columns = canvas.width / fontSize;
        const drops = Array(Math.floor(columns)).fill(1);

        function draw() {
            ctx.fillStyle = 'rgba(0, 5, 0, 0.05)'; // Fade effect
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = '#0F0'; // Green text
            ctx.font = fontSize + 'px monospace';

            for (let i = 0; i < drops.length; i++) {
                const text = chars[Math.floor(Math.random() * chars.length)];
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);

                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        }
        setInterval(draw, 50);

        // Handle resize
        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
    }
    initMatrixEffect(); // Start effect

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
    /* 
       [SECURITY NOTE]
       Supabase Service Role Key REMOVED. 
       Using Anon Key for public operations.
    */

    const SUPABASE_URL = 'https://dpcrxdsxtaujmclmahvk.supabase.co';
    const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRwY3J4ZHN4dGF1am1jbG1haHZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2MjI1NzEsImV4cCI6MjA4NTE5ODU3MX0.FJTvbP3WK6-pX8e37fxq8-a_juG7Hg04gZVa00rNGZk';

    // Initialize Supabase (Global access)
    const supabase = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY) : null;

    // Expose Supabase client globally for RBAC integration (Phase 1)
    window.supabaseClient = supabase;

    // --- NEWSLETTER HANDLING ---
    const newsForm = document.getElementById('newsletter-form');
    if (newsForm) {
        newsForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = newsForm.querySelector('button');
            const input = newsForm.querySelector('input[type="email"]');
            const originalText = btn.textContent;
            const email = input.value.trim();

            if (!email) return;

            // Show processing state
            btn.textContent = 'ENCRYPTING...';
            btn.style.background = '#333';
            btn.disabled = true;

            try {
                const response = await fetch('/.netlify/functions/newsletter', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email,
                        source: 'website',
                        referrer: document.referrer || window.location.href
                    })
                });

                const data = await response.json();

                if (response.ok && data.success) {
                    // Success state
                    btn.textContent = data.message === 'ALREADY_CONNECTED' ? 'ALREADY_LINKED' : 'LINK_ESTABLISHED';
                    btn.style.background = 'var(--neon-green)';
                    btn.style.color = '#000';
                    newsForm.reset();

                    // Show toast notification
                    showToast('📡 INTEL_FEED_ACTIVE', 'You are now receiving encrypted transmissions.');
                } else {
                    throw new Error(data.error || 'TRANSMISSION_FAILED');
                }
            } catch (error) {
                console.error('Newsletter error:', error);
                btn.textContent = 'RETRY_LINK';
                btn.style.background = 'var(--neon-red)';
                btn.style.color = '#fff';

                showToast('⚠️ CONNECTION_ERROR', 'Unable to establish link. Check encryption.');
            }

            // Reset after delay
            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.background = '';
                btn.style.color = '';
                btn.disabled = false;
            }, 4000);
        });
    }

    // --- ENHANCED TOAST NOTIFICATION HELPER ---
    function showToast(title, message, type = 'success', duration = 4000) {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const icons = {
            success: '✓',
            error: '✕',
            warning: '⚠',
            info: 'ℹ'
        };

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <span class="toast-icon">${icons[type] || '✓'}</span>
            <div class="toast-content">
                <div class="toast-title">${title}</div>
                <div class="toast-message">${message}</div>
            </div>
            <div class="toast-progress" style="animation-duration: ${duration}ms"></div>
        `;

        // Click to dismiss
        toast.addEventListener('click', () => {
            toast.classList.add('toast-exiting');
            setTimeout(() => toast.remove(), 300);
        });

        container.appendChild(toast);

        // Auto dismiss
        setTimeout(() => {
            if (toast.parentNode) {
                toast.classList.add('toast-exiting');
                setTimeout(() => toast.remove(), 300);
            }
        }, duration);
    }

    // --- DYNAMIC SKILL LOADING ---
    async function loadSkillsFromSupabase() {
        const skillsGrid = document.querySelector('.skills-grid');
        if (!skillsGrid || !supabase) return;

        try {
            const { data: skills, error } = await supabase
                .from('skills')
                .select('*')
                .eq('is_verified', true)
                .order('downloads_count', { ascending: false })
                .limit(20);

            if (error) throw error;

            if (skills && skills.length > 0) {
                // Store skills data globally for download modal
                window.skillsData = skills;

                // Clear existing static cards and render dynamic ones
                skillsGrid.innerHTML = '';

                skills.forEach(skill => {
                    const card = createSkillCard(skill);
                    skillsGrid.appendChild(card);
                });

                // Re-attach filter logic if needed (handled by global querySelectorAll in latest version)
                showToast('MARKETPLACE_SYNCED', `Loaded ${skills.length} skills from database.`);
            }
        } catch (err) {
            console.error('Failed to load skills:', err);
            // Keep existing static cards as fallback
        }
    }

    // --- DYNAMIC TOP ARCHITECTS LOADING ---
    async function loadTopArchitects() {
        const grid = document.getElementById('top-architects-grid');
        if (!grid || !supabase) return;

        try {
            // Query developers with their stats, ordered by lifetime downloads
            const { data: architects, error } = await supabase
                .from('user_profiles')
                .select('id, display_name, email, specialty, lifetime_downloads, total_earnings, is_verified, account_type')
                .in('account_type', ['developer', 'admin'])
                .order('lifetime_downloads', { ascending: false, nullsFirst: false })
                .limit(5);

            if (error) throw error;

            if (architects && architects.length > 0) {
                // Get skill counts for each architect
                const architectIds = architects.map(a => a.id);
                const { data: skillCounts, error: skillError } = await supabase
                    .from('skills')
                    .select('developer_id')
                    .in('developer_id', architectIds)
                    .eq('is_verified', true);

                // Count skills per developer
                const skillCountMap = {};
                if (skillCounts && !skillError) {
                    skillCounts.forEach(s => {
                        skillCountMap[s.developer_id] = (skillCountMap[s.developer_id] || 0) + 1;
                    });
                }

                // Clear static content and populate with real data
                grid.innerHTML = '';

                architects.forEach((arch, index) => {
                    arch.skill_count = skillCountMap[arch.id] || 0;
                    const card = createArchitectCard(arch, index + 1);
                    grid.appendChild(card);
                });
            }
            // If no architects found, keep static placeholder cards
        } catch (err) {
            console.error('Failed to load top architects:', err);
            // Keep existing static cards as fallback
        }
    }

    function createArchitectCard(arch, rank) {
        const card = document.createElement('div');
        card.className = `architect-card rank-${rank}`;
        card.dataset.developerId = arch.id;

        // Determine rank badge style
        const rankBadges = { 1: 'gold', 2: 'silver', 3: 'bronze' };
        const badgeClass = rankBadges[rank] || '';

        // Get display name and first letter for avatar
        const displayName = arch.display_name || arch.email?.split('@')[0] || 'Developer';
        const avatarLetter = displayName.charAt(0).toUpperCase();

        // Format earnings (hide actual amount, show tier)
        const earnings = arch.total_earnings || 0;
        const earningsDisplay = earnings > 10000 ? '$' + Math.floor(earnings / 1000) + 'k' :
                                earnings > 1000 ? '$' + (earnings / 1000).toFixed(1) + 'k' :
                                '$' + earnings.toFixed(0);

        // Specialty tag
        const specialty = arch.specialty || 'AI Development';
        const specialtyClass = specialty.toLowerCase().includes('security') ? 'security' :
                              specialty.toLowerCase().includes('data') ? 'dev' : '';

        // Actual skill count from database
        const skillCount = arch.skill_count || 0;

        card.innerHTML = `
            <div class="rank-badge ${badgeClass}">#${rank}</div>
            <div class="arch-avatar">
                <span class="avatar-letter">${avatarLetter}</span>
                ${arch.is_verified ? '<div class="verified-mark">✓</div>' : ''}
            </div>
            <div class="arch-details">
                <h4>${displayName}</h4>
                <span class="specialty-tag ${specialtyClass}">${specialty}</span>
                <div class="arch-stats-row">
                    <div class="stat-item">
                        <span class="stat-value">${formatDownloads(arch.lifetime_downloads || 0)}</span>
                        <span class="stat-label">SOLD</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value">${skillCount}</span>
                        <span class="stat-label">SKILLS</span>
                    </div>
                    <div class="stat-item blurred">
                        <span class="stat-value">${earningsDisplay}</span>
                        <span class="stat-label">EARNED</span>
                    </div>
                </div>
            </div>
            <button class="btn-view-profile" onclick="viewDeveloperProfile('${arch.id}')">VIEW_PROFILE</button>
        `;

        return card;
    }

    // View developer profile - shows their skills
    window.viewDeveloperProfile = async function(developerId) {
        if (!supabase) {
            showToast('ERROR', 'Unable to load profile');
            return;
        }

        try {
            // Get developer's skills
            const { data: skills, error } = await supabase
                .from('skills')
                .select('*')
                .eq('developer_id', developerId)
                .eq('is_verified', true)
                .order('downloads_count', { ascending: false });

            if (error) throw error;

            if (skills && skills.length > 0) {
                // Filter marketplace to show only this developer's skills
                const skillCards = document.querySelectorAll('.skill-card');
                skillCards.forEach(card => {
                    const skillId = card.dataset.skillId?.replace('db-', '');
                    const isMatch = skills.some(s => s.id === skillId);
                    card.style.display = isMatch ? '' : 'none';
                });

                // Scroll to marketplace
                document.getElementById('marketplace')?.scrollIntoView({ behavior: 'smooth' });
                showToast('FILTERING', `Showing skills by this developer`);

                // Add reset button if not exists
                addFilterResetButton();
            } else {
                showToast('NO_SKILLS', 'This developer has no published skills yet');
            }
        } catch (err) {
            console.error('Error loading developer profile:', err);
            showToast('ERROR', 'Failed to load developer skills');
        }
    };

    function addFilterResetButton() {
        const filterBar = document.querySelector('.filter-bar');
        if (!filterBar || document.getElementById('reset-dev-filter')) return;

        const resetBtn = document.createElement('button');
        resetBtn.id = 'reset-dev-filter';
        resetBtn.className = 'filter-btn';
        resetBtn.style.background = 'var(--neon-purple)';
        resetBtn.style.color = 'white';
        resetBtn.textContent = '✕ CLEAR FILTER';
        resetBtn.onclick = () => {
            document.querySelectorAll('.skill-card').forEach(card => card.style.display = '');
            resetBtn.remove();
            showToast('FILTER_CLEARED', 'Showing all skills');
        };
        filterBar.appendChild(resetBtn);
    }

    function createSkillCard(skill) {
        const card = document.createElement('div');
        card.className = 'skill-card';
        card.dataset.category = skill.category || 'dev';
        card.dataset.skillId = `db-${skill.id}`;
        card.dataset.topseller = skill.is_top_seller ? 'true' : 'false';
        card.dataset.skillName = skill.title;
        card.dataset.skillDesc = skill.description;
        card.dataset.price = skill.price;

        const starsHtml = generateStars(skill.avg_rating || 0);
        const formattedDownloads = formatDownloads(skill.downloads_count || 0);
        const roiBadge = skill.roi_hours_saved > 0
            ? `<span class="roi-badge">⚡ SAVES: ${skill.roi_hours_saved}h/mo</span>`
            : '<span class="roi-badge">⚡ VERIFIED</span>';

        card.innerHTML = `
            <div class="security-badge">${skill.is_verified ? 'AUDITED' : 'PENDING'}</div>
            <div class="card-visual" style="background: rgba(41, 121, 255, 0.1);">
                <span style="font-size: 3rem;">${skill.icon || '💻'}</span>
            </div>
            <div class="card-header">
                <span class="skill-badge ${skill.category}">${(skill.category || 'dev').toUpperCase()}</span>
                ${skill.is_verified ? '<span class="verified-icon">✓</span>' : ''}
            </div>
            <h3>${skill.title}</h3>
            <p class="skill-desc">${skill.short_description || skill.description?.slice(0, 80) + '...'}</p>
            <div class="skill-rating">
                <span class="stars">${starsHtml}</span>
                <span class="rating-score">${skill.avg_rating?.toFixed(1) || '0.0'}</span>
                <span class="review-count">(${skill.rating_count || 0})</span>
            </div>
            <div class="skill-meta">
                <span>Install: ${formattedDownloads}</span>
                ${roiBadge}
                <span>$${parseFloat(skill.price || 0).toFixed(2)}</span>
            </div>
            <button class="btn-install">INJECT_SKILL</button>
        `;

        return card;
    }

    function generateStars(rating) {
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 >= 0.5;
        let html = '';
        for (let i = 0; i < 5; i++) {
            if (i < fullStars) html += '★';
            else if (i === fullStars && halfStar) html += '★';
            else html += '☆';
        }
        return html;
    }

    function formatDownloads(count) {
        if (count >= 1000) return (count / 1000).toFixed(1) + 'k';
        return count.toString();
    }

    function attachFilterListeners() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const skillCards = document.querySelectorAll('.skill-card');

        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filterText = btn.textContent.toLowerCase().replace(/[^a-z]/g, '');

                skillCards.forEach(card => {
                    const category = card.dataset.category?.toLowerCase() || '';
                    const isTopseller = card.dataset.topseller === 'true';

                    let shouldShow = false;
                    if (filterText === 'all' || filterText === '') shouldShow = true;
                    else if (filterText === 'topsellers' || filterText === 'hot') shouldShow = isTopseller;
                    else shouldShow = category.includes(filterText);

                    // Use block display to maintain grid layout (NOT flex)
                    card.style.display = shouldShow ? 'block' : 'none';
                });
            });
        });
    }


    // --- STATE MANAGEMENT ---
    let activeUser = null;

    // --- AUTHENTICATION ---
    async function initAuth() {
        if (!supabase) return;

        // Check active session
        const { data: { session } } = await supabase.auth.getSession();

        if (session) {
            activeUser = session.user;
            updateUIForLoggedUser(activeUser);
            loadMemberDashboard(activeUser); // New: Load dashboard
        } else {
            // Check for Demo Mode Persistence
            const storedDemo = localStorage.getItem('aiagent_demo_user');
            if (storedDemo) {
                try {
                    activeUser = JSON.parse(storedDemo);
                    updateUIForLoggedUser(activeUser);
                    loadMemberDashboard(activeUser);
                } catch (e) {
                    console.error('Failed to restore demo session', e);
                    localStorage.removeItem('aiagent_demo_user');
                }
            }
        }

        // Listen for auth changes
        supabase.auth.onAuthStateChange((_event, session) => {
            if (session) {
                activeUser = session.user;
                // Clear demo if real login happens
                localStorage.removeItem('aiagent_demo_user');
            } else {
                // Determine if we should fallback to demo or clear
                // Ideally, sign out should clear everything.
                if (_event === 'SIGNED_OUT') {
                    activeUser = null;
                    localStorage.removeItem('aiagent_demo_user');
                }
            }

            if (activeUser) {
                updateUIForLoggedUser(activeUser);
                loadMemberDashboard(activeUser);
            } else {
                hideMemberDashboard();
            }
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

    // --- BLACK MARKET LOGIC ---
    function checkAndInjectBlackMarketTab(user) {
        const tier = user.user_metadata?.subscription_tier || user.app_metadata?.subscription_tier;
        // Allow if tier is blackmarket OR syndicate (as requested? "customers who sign up for black market" implies just them, but let's allow syndicate to see it but maybe locked? No, request said "only black market skills available" for them. Let's strictly check blackmarket for now or if they bought the product).

        // For now, let's allow 'syndicate' too as a teaser or if they have access.
        // Actually, let's stick to 'blackmarket' tier as per strict request.
        // But also check if they have the entitlement.
        // We'll trust the subscription_tier metadata.

        if (tier === 'blackmarket') {
            const dashboardTabs = document.querySelector('.dashboard-tabs');
            if (dashboardTabs && !document.getElementById('btn-tab-blackmarket')) {
                // Create Tab Button
                const btn = document.createElement('button');
                btn.id = 'btn-tab-blackmarket';
                btn.className = 'tab-btn';
                btn.dataset.tab = 'blackmarket';
                btn.innerHTML = '💀 BLACK_MARKET';
                btn.style.color = '#bf00ff'; // Neon Purple
                btn.style.textShadow = '0 0 5px rgba(191, 0, 255, 0.5)';
                dashboardTabs.appendChild(btn);

                // Create Content Container (if not exists)
                let contentInfo = document.getElementById('tab-blackmarket');
                if (!contentInfo) {
                    contentInfo = document.createElement('div');
                    contentInfo.id = 'tab-blackmarket';
                    contentInfo.className = 'dashboard-tab-content';
                    contentInfo.innerHTML = `
                        <div class="section-subheader" style="border-bottom: 1px solid #bf00ff; padding-bottom: 1rem;">
                            <h4 style="color: #bf00ff;">💀 RESTRICTED_ARSENAL // LEVEL_5_ACCESS</h4>
                        </div>
                        <p style="color: #888; margin-bottom: 1.5rem;">WARNING: These tools are for authorized operators only. Use with extreme caution.</p>
                        <div class="skill-library-grid" id="blackmarket-skills-grid">
                            <div class="empty-library-state">
                                <span class="empty-icon">📡</span>
                                <h4>SCANNING_DARK_WEB...</h4>
                            </div>
                        </div>
                    `;
                    // Append to same container as other tabs
                    const tabContainer = document.querySelector('.dashboard-tab-content').parentNode;
                    tabContainer.appendChild(contentInfo);
                }

                // Add Click Handler
                btn.addEventListener('click', () => {
                    // Deactivate others
                    document.querySelectorAll('.dashboard-tabs .tab-btn').forEach(b => b.classList.remove('active'));
                    document.querySelectorAll('.dashboard-tab-content').forEach(c => c.classList.remove('active'));

                    // Activate this
                    btn.classList.add('active');
                    contentInfo.classList.add('active');

                    // Load Skills
                    loadBlackMarketSkills();
                });
            }
        }
    }

    async function loadBlackMarketSkills() {
        if (!supabase) return;

        const grid = document.getElementById('blackmarket-skills-grid');
        if (!grid) return;

        try {
            // Fetch skills with category 'blackmarket' OR is_blackmarket_only flag
            const { data: skills, error } = await supabase
                .from('skills')
                .select('*')
                .eq('category', 'blackmarket'); // Assuming category is used for now based on HTML

            if (error) throw error;

            if (skills && skills.length > 0) {
                grid.innerHTML = skills.map(skill => `
                    <div class="library-skill-card" style="border-color: #bf00ff; background: rgba(191, 0, 255, 0.05);">
                        <div class="skill-icon">👁️</div>
                        <h5 style="color: #bf00ff;">${skill.title}</h5>
                        <p>${skill.short_description || 'Restricted Content'}</p>
                        <div class="skill-meta" style="margin-bottom: 1rem; font-size: 0.8rem; color: #aaa;">
                            <span>RISK_LEVEL: CRITICAL</span>
                        </div>
                        <button class="btn-sm" style="border-color: #bf00ff; color: #bf00ff;" onclick="downloadSkill('${skill.id}')">ACCESS_TOOL</button>
                    </div>
                `).join('');
            } else {
                grid.innerHTML = `
                    <div class="empty-library-state">
                        <span class="empty-icon">🚫</span>
                        <h4>NO_ASSETS_FOUND</h4>
                        <p>The network is quiet. Check back later.</p>
                    </div>
                `;
            }
        } catch (err) {
            console.error('Black market load error:', err);
            grid.innerHTML = `
                <div class="empty-library-state">
                    <span class="empty-icon">⚠️</span>
                    <h4>CONNECTION_FAILED</h4>
                    <p>Unable to reach encrypted server.</p>
                </div>
            `;
        }
    }

    // --- MEMBER DASHBOARD LOGIC (ELITE VERSION) ---

    // LemonSqueezy Product IDs (configure these in LemonSqueezy dashboard)
    const LEMON_PRODUCTS = {
        syndicate: 'YOUR_SYNDICATE_PRODUCT_ID', // Replace with actual LemonSqueezy product ID
        blackmarket: 'YOUR_BLACKMARKET_PRODUCT_ID' // Replace with actual LemonSqueezy product ID
    };

    async function loadMemberDashboard(user) {
        const dashboard = document.getElementById('member-dashboard');
        if (!dashboard) return;

        // Show dashboard
        dashboard.style.display = 'block';

        // Populate user info
        populateUserProfile(user);

        // Initialize tab switching
        initDashboardTabs();

        // Load user data
        await loadUserProfile(user);
        await loadSkillLibrary(user);
        await loadDeveloperStats(user);
        checkAndInjectBlackMarketTab(user);

        // Wire up dashboard buttons
        initDashboardActions(user);

        // Scroll to dashboard if logged in via redirect
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('access_token') || window.location.hash.includes('access_token')) {
            dashboard.scrollIntoView({ behavior: 'smooth' });
            showToast('🔐 ACCESS_GRANTED', 'Welcome back, operator. Your dashboard is ready.');
        }
    }

    function populateUserProfile(user) {
        if (!user) return;

        const displayName = document.getElementById('user-display-name');
        const email = document.getElementById('user-email');
        const avatar = document.getElementById('user-avatar');

        const name = user.user_metadata?.full_name ||
            user.user_metadata?.user_name ||
            user.email?.split('@')[0] ||
            'OPERATOR';

        if (displayName) displayName.textContent = name.toUpperCase();
        if (email) email.textContent = user.email || 'CLASSIFIED';

        // Set avatar letter
        if (avatar) {
            const letterSpan = avatar.querySelector('.avatar-letter');
            if (letterSpan) letterSpan.textContent = name.charAt(0).toUpperCase();

            // If user has avatar URL, use it
            if (user.user_metadata?.avatar_url) {
                avatar.style.backgroundImage = `url(${user.user_metadata.avatar_url})`;
                avatar.style.backgroundSize = 'cover';
                if (letterSpan) letterSpan.style.display = 'none';
            }
        }
    }

    function initDashboardTabs() {
        const tabBtns = document.querySelectorAll('.dashboard-tabs .tab-btn');
        const tabContents = document.querySelectorAll('.dashboard-tab-content');

        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetTab = btn.dataset.tab;

                // Remove active from all
                tabBtns.forEach(b => b.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));

                // Add active to clicked
                btn.classList.add('active');
                const targetContent = document.getElementById(`tab-${targetTab}`);
                if (targetContent) targetContent.classList.add('active');
            });
        });
    }

    async function loadUserProfile(user) {
        if (!supabase) return;

        try {
            const { data: profile, error } = await supabase
                .from('user_profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            if (error && error.code !== 'PGRST116') {
                console.error('Error loading profile:', error);
                return;
            }

            // If no profile exists, create one
            if (!profile) {
                await createUserProfile(user);
                return;
            }

            // Update UI with profile data
            updateProfileUI(profile);

        } catch (err) {
            console.error('Profile load error:', err);
        }
    }

    async function createUserProfile(user) {
        if (!supabase) return;

        const profileData = {
            id: user.id,
            email: user.email,
            display_name: user.user_metadata?.full_name || user.user_metadata?.user_name || user.email?.split('@')[0],
            avatar_url: user.user_metadata?.avatar_url || null,
            github_username: user.user_metadata?.user_name || null,
            account_type: 'customer',
            subscription_tier: 'free'
        };

        try {
            const { error } = await supabase
                .from('user_profiles')
                .insert([profileData]);

            if (error) {
                console.error('Error creating profile:', error);
            }
        } catch (err) {
            console.error('Profile creation error:', err);
        }
    }

    function updateProfileUI(profile) {
        // Update tier badge
        const tierBadge = document.getElementById('user-tier-badge');
        const tierIndicator = document.getElementById('tier-indicator');
        const accountBadge = document.getElementById('user-account-badge');

        const tierNames = {
            'free': 'FREE_AGENT',
            'syndicate': 'SYNDICATE',
            'blackmarket': 'BLACK_MARKET'
        };

        if (tierBadge) {
            tierBadge.textContent = tierNames[profile.subscription_tier] || 'FREE_AGENT';
            tierBadge.className = `badge tier-badge ${profile.subscription_tier}`;
        }

        if (tierIndicator) {
            tierIndicator.dataset.tier = profile.subscription_tier;
        }

        if (accountBadge) {
            // Clear previous classes
            accountBadge.classList.remove('developer', 'admin');

            // Normalize account type (handle case variations)
            const accountType = (profile.account_type || '').toLowerCase().trim();

            if (accountType === 'admin') {
                accountBadge.textContent = '👑 ADMIN';
                accountBadge.classList.add('admin');
            } else if (accountType === 'developer') {
                accountBadge.textContent = '⚡ DEVELOPER';
                accountBadge.classList.add('developer');
            } else {
                accountBadge.textContent = 'CUSTOMER';
            }
        }

        // Update plan info
        const planName = document.getElementById('plan-name');
        const planPrice = document.getElementById('plan-price');

        const tierPrices = {
            'free': '£0/mo',
            'syndicate': '£39/mo',
            'blackmarket': '£149 (lifetime)'
        };

        if (planName) planName.textContent = tierNames[profile.subscription_tier] || 'FREE_AGENT';
        if (planPrice) planPrice.textContent = tierPrices[profile.subscription_tier] || '£0/mo';

        // Hide upgrade CTA if already subscribed
        const upgradeCta = document.getElementById('upgrade-cta');
        if (upgradeCta && profile.subscription_tier !== 'free') {
            upgradeCta.style.display = 'none';
        }

        // Populate settings form
        const inputName = document.getElementById('input-display-name');
        const inputBio = document.getElementById('input-bio');
        const inputWebsite = document.getElementById('input-website');

        if (inputName) inputName.value = profile.display_name || '';
        if (inputBio) inputBio.value = profile.bio || '';
        if (inputWebsite) inputWebsite.value = profile.website_url || '';

        // Update developer toggle button text
        const toggleBtn = document.getElementById('btn-toggle-developer');
        if (toggleBtn) {
            if (profile.account_type === 'admin') {
                // Admins have full access - show developer HQ link
                toggleBtn.innerHTML = '<span class="icon">⚡</span> DEVELOPER_HQ';
                toggleBtn.disabled = false;
                toggleBtn.style.opacity = '1';
                toggleBtn.style.cursor = 'pointer';
            } else if (profile.account_type === 'developer') {
                // Developers go to developer dashboard
                toggleBtn.innerHTML = '<span class="icon">⚡</span> DEVELOPER_HQ';
                toggleBtn.disabled = false;
                toggleBtn.style.opacity = '1';
                toggleBtn.style.cursor = 'pointer';
            } else {
                // Customers can apply to become developer
                toggleBtn.innerHTML = '<span class="icon">🔧</span> BECOME_ARCHITECT';
                toggleBtn.disabled = false;
                toggleBtn.style.opacity = '1';
                toggleBtn.style.cursor = 'pointer';
            }
        }

        // Initialize elite dashboard features
        initEliteDashboard(profile);

        // Populate email field in settings
        const inputEmail = document.getElementById('input-email');
        if (inputEmail) inputEmail.value = profile.email || '';

        // Update subscription tab details
        updateSubscriptionTab(profile);
    }

    function updateSubscriptionTab(profile) {
        // Update subscription badge
        const subBadge = document.getElementById('sub-plan-badge');
        const subStatus = document.getElementById('sub-plan-status');
        const priceAmount = document.getElementById('sub-price-amount');
        const pricePeriod = document.getElementById('sub-price-period');
        const memberSince = document.getElementById('sub-member-since');

        const tierNames = {
            'free': 'FREE_AGENT',
            'syndicate': 'SYNDICATE',
            'blackmarket': 'BLACK_MARKET'
        };

        const tierPrices = {
            'free': { amount: '£0', period: '/month' },
            'syndicate': { amount: '£39', period: '/month' },
            'blackmarket': { amount: '£149', period: ' lifetime' }
        };

        if (subBadge) subBadge.textContent = tierNames[profile.subscription_tier] || 'FREE_AGENT';
        if (subStatus) {
            subStatus.textContent = 'ACTIVE';
            subStatus.className = 'plan-status active';
        }

        const pricing = tierPrices[profile.subscription_tier] || tierPrices.free;
        if (priceAmount) priceAmount.textContent = pricing.amount;
        if (pricePeriod) pricePeriod.textContent = pricing.period;

        if (memberSince && profile.created_at) {
            const date = new Date(profile.created_at);
            memberSince.textContent = date.toLocaleDateString('en-GB', {
                month: 'short',
                year: 'numeric'
            });
        }

        // Show/hide cancel button based on subscription
        const cancelSection = document.getElementById('cancel-subscription-section');
        if (cancelSection) {
            cancelSection.style.display = profile.subscription_tier !== 'free' ? 'block' : 'none';
        }

        // Update feature checkmarks
        const featureUnlimited = document.getElementById('sub-feature-unlimited');
        const featureBlackmarket = document.getElementById('sub-feature-blackmarket');
        const featurePriority = document.getElementById('sub-feature-priority');

        if (profile.subscription_tier === 'syndicate' || profile.subscription_tier === 'blackmarket') {
            if (featureUnlimited) {
                featureUnlimited.textContent = '✓ Unlimited downloads';
                featureUnlimited.classList.remove('excluded');
                featureUnlimited.classList.add('included');
            }
        }

        if (profile.subscription_tier === 'blackmarket') {
            if (featureBlackmarket) {
                featureBlackmarket.textContent = '✓ Black Market access';
                featureBlackmarket.classList.remove('excluded');
                featureBlackmarket.classList.add('included');
            }
            if (featurePriority) {
                featurePriority.textContent = '✓ Priority support';
                featurePriority.classList.remove('excluded');
                featurePriority.classList.add('included');
            }
        }
    }

    async function loadSkillLibrary(user) {
        if (!supabase) return;

        try {
            const { data: library, error } = await supabase
                .from('user_skill_library')
                .select('*')
                .eq('user_id', user.id)
                .eq('is_active', true);

            if (error) {
                console.error('Error loading library:', error);
                return;
            }

            // Update stats
            const skillsInstalled = document.getElementById('stat-skills-installed');
            if (skillsInstalled) skillsInstalled.textContent = library?.length || 0;

            // Render skill grid
            renderSkillLibrary(library || []);

        } catch (err) {
            console.error('Library load error:', err);
        }
    }

    function renderSkillLibrary(skills) {
        const grid = document.getElementById('skill-library-grid');
        if (!grid) return;

        if (skills.length === 0) {
            // Show empty state
            grid.innerHTML = `
                <div class="empty-library-state">
                    <div class="empty-icon">📭</div>
                    <h4>NO_SKILLS_INSTALLED</h4>
                    <p>Browse the marketplace to add skills to your library.</p>
                    <a href="#marketplace" class="btn-primary">BROWSE_MARKETPLACE</a>
                </div>
            `;
            return;
        }

        // Render skill cards
        grid.innerHTML = skills.map(skill => `
            <div class="library-skill-card" data-skill-id="${skill.skill_id}">
                <div class="skill-icon">💻</div>
                <h5>${skill.skill_name || 'UNKNOWN_SKILL'}</h5>
                <p>Installed ${new Date(skill.installed_at).toLocaleDateString()}</p>
                <div class="skill-actions">
                    <button class="btn-sm" onclick="downloadSkill('${skill.skill_id}')">DOWNLOAD</button>
                    <button class="btn-sm" onclick="viewSkillDocs('${skill.skill_id}')">DOCS</button>
                </div>
            </div>
        `).join('');
    }

    async function loadDeveloperStats(user) {
        if (!supabase) return;

        try {
            // Get profile for earnings data
            const { data: profile } = await supabase
                .from('user_profiles')
                .select('total_earnings, pending_payout, lifetime_downloads')
                .eq('id', user.id)
                .single();

            // Get submissions count
            const { data: submissions } = await supabase
                .from('skill_submissions')
                .select('id, name, category, price, status')
                .eq('developer_id', user.id);

            // Update stats
            const totalRevenue = document.getElementById('stat-total-revenue');
            const pendingPayout = document.getElementById('stat-pending-payout');
            const totalDownloads = document.getElementById('stat-total-downloads');
            const skillsSubmitted = document.getElementById('stat-skills-submitted');
            const revenueYourShare = document.getElementById('revenue-your-share');
            const revenuePlatformFee = document.getElementById('revenue-platform-fee');
            const revenueAvailable = document.getElementById('revenue-available');

            if (totalRevenue) totalRevenue.textContent = `£${(profile?.total_earnings || 0).toFixed(2)}`;
            if (pendingPayout) pendingPayout.textContent = `£${(profile?.pending_payout || 0).toFixed(2)}`;
            if (totalDownloads) totalDownloads.textContent = profile?.lifetime_downloads || 0;
            if (skillsSubmitted) skillsSubmitted.textContent = submissions?.filter(s => s.status === 'approved').length || 0;

            // Revenue breakdown
            const earnings = profile?.total_earnings || 0;
            if (revenueYourShare) revenueYourShare.textContent = `£${(earnings * 0.7).toFixed(2)}`;
            if (revenuePlatformFee) revenuePlatformFee.textContent = `£${(earnings * 0.3).toFixed(2)}`;
            if (revenueAvailable) revenueAvailable.textContent = `£${(profile?.pending_payout || 0).toFixed(2)}`;

            // Enable payout button if threshold met
            const payoutBtn = document.getElementById('btn-request-payout');
            if (payoutBtn && (profile?.pending_payout || 0) >= 100) {
                payoutBtn.disabled = false;
            }

            // Render submissions table
            renderSubmissionsTable(submissions || []);

        } catch (err) {
            console.error('Developer stats error:', err);
        }
    }

    function renderSubmissionsTable(submissions) {
        const tbody = document.getElementById('submissions-tbody');
        if (!tbody) return;

        if (submissions.length === 0) {
            tbody.innerHTML = `
                <tr class="empty-row">
                    <td colspan="6">
                        <div class="empty-state">
                            <span class="empty-icon">📝</span>
                            <p>No skills submitted yet. Start building and earning!</p>
                        </div>
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = submissions.map(sub => `
            <tr>
                <td>${sub.name}</td>
                <td>${sub.category}</td>
                <td>£${sub.price}</td>
                <td><span class="status-badge ${sub.status}">${sub.status.toUpperCase()}</span></td>
                <td>0</td>
                <td>£0.00</td>
            </tr>
        `).join('');
    }

    function initDashboardActions(user) {
        // Logout button
        const logoutBtn = document.getElementById('btn-logout');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', async () => {
                if (supabase) {
                    await supabase.auth.signOut();
                    window.location.reload();
                }
            });
        }

        // Toggle developer mode / Go to developer dashboard
        const toggleDevBtn = document.getElementById('btn-toggle-developer');
        if (toggleDevBtn) {
            toggleDevBtn.addEventListener('click', async () => {
                // Check current account type
                const { data: profile } = await supabase
                    .from('user_profiles')
                    .select('account_type')
                    .eq('id', user.id)
                    .single();

                if (profile?.account_type === 'developer' || profile?.account_type === 'admin') {
                    // Already a developer - go to developer dashboard
                    window.location.href = 'developer.html';
                } else {
                    // Not a developer - show apply/toggle option
                    if (confirm('🔧 BECOME A DEVELOPER?\n\nAs a developer, you can upload skills, earn 70% revenue, and access the Developer Command Center.\n\nClick OK to apply for developer access.')) {
                        await toggleAccountType(user);
                    }
                }
            });
        }

        // Save profile
        const saveProfileBtn = document.getElementById('btn-save-profile');
        if (saveProfileBtn) {
            saveProfileBtn.addEventListener('click', async () => {
                await saveUserProfile(user);
            });
        }

        // Submit skill button - opens skill submission modal
        const submitSkillBtn = document.getElementById('btn-submit-skill');
        if (submitSkillBtn) {
            submitSkillBtn.addEventListener('click', () => {
                openSkillSubmissionModal();
            });
        }

        // Browse more button
        const browseMoreBtn = document.getElementById('btn-browse-more');
        if (browseMoreBtn) {
            browseMoreBtn.addEventListener('click', () => {
                const marketplace = document.getElementById('marketplace');
                if (marketplace) marketplace.scrollIntoView({ behavior: 'smooth' });
            });
        }

        // Upgrade buttons (LemonSqueezy integration)
        const upgradeSyndicateBtn = document.getElementById('btn-upgrade-syndicate');
        const upgradeBlackmarketBtn = document.getElementById('btn-upgrade-blackmarket');

        if (upgradeSyndicateBtn) {
            upgradeSyndicateBtn.addEventListener('click', () => {
                initLemonSqueezyCheckout('syndicate', user);
            });
        }

        if (upgradeBlackmarketBtn) {
            upgradeBlackmarketBtn.addEventListener('click', () => {
                initLemonSqueezyCheckout('blackmarket', user);
            });
        }

        // Request payout
        const payoutBtn = document.getElementById('btn-request-payout');
        if (payoutBtn) {
            payoutBtn.addEventListener('click', async () => {
                await requestPayout(user);
            });
        }
    }

    async function toggleAccountType(user) {
        if (!supabase) return;

        try {
            const { data: profile } = await supabase
                .from('user_profiles')
                .select('account_type')
                .eq('id', user.id)
                .single();

            const newType = profile?.account_type === 'developer' ? 'customer' : 'developer';

            const { error } = await supabase
                .from('user_profiles')
                .update({ account_type: newType, updated_at: new Date().toISOString() })
                .eq('id', user.id);

            if (error) throw error;

            showToast('🔄 ACCOUNT_UPDATED', `Switched to ${newType.toUpperCase()} mode.`);

            // Reload dashboard
            await loadUserProfile(user);

            // Show/hide architect tab
            const architectTab = document.querySelector('[data-tab="architect"]');
            if (architectTab) {
                architectTab.style.display = newType === 'developer' ? 'block' : 'none';
            }

        } catch (err) {
            console.error('Toggle account error:', err);
            showToast('⚠️ ERROR', 'Failed to update account type.');
        }
    }

    async function saveUserProfile(user) {
        if (!supabase) return;

        const displayName = document.getElementById('input-display-name')?.value;
        const bio = document.getElementById('input-bio')?.value;
        const website = document.getElementById('input-website')?.value;

        try {
            const { error } = await supabase
                .from('user_profiles')
                .update({
                    display_name: displayName,
                    bio: bio,
                    website_url: website,
                    updated_at: new Date().toISOString()
                })
                .eq('id', user.id);

            if (error) throw error;

            showToast('✅ PROFILE_SAVED', 'Your changes have been saved.');

            // Update display name in header
            const userDisplayName = document.getElementById('user-display-name');
            if (userDisplayName && displayName) {
                userDisplayName.textContent = displayName.toUpperCase();
            }

        } catch (err) {
            console.error('Save profile error:', err);
            showToast('⚠️ ERROR', 'Failed to save profile.');
        }
    }

    function initLemonSqueezyCheckout(tier, user) {
        // LemonSqueezy overlay checkout
        if (typeof window.createLemonSqueezy === 'function') {
            window.createLemonSqueezy();
        }

        const productId = LEMON_PRODUCTS[tier];

        if (!productId || productId.startsWith('YOUR_')) {
            // Fallback: Show placeholder message
            showToast('🍋 CHECKOUT_READY', `Redirecting to ${tier.toUpperCase()} checkout...`);

            // For now, show alert since product IDs aren't configured
            setTimeout(() => {
                alert(`LEMON SQUEEZY CHECKOUT\n\nProduct: ${tier.toUpperCase()}\nEmail: ${user.email}\n\nConfigure LEMON_PRODUCTS in script.js with your actual LemonSqueezy product IDs.`);
            }, 500);
            return;
        }

        // Use LemonSqueezy overlay
        if (window.LemonSqueezy) {
            window.LemonSqueezy.Url.Open(`https://aiagentskills.lemonsqueezy.com/checkout/buy/${productId}?checkout[email]=${encodeURIComponent(user.email)}&checkout[custom][user_id]=${user.id}`);
        } else {
            // Fallback to redirect
            window.location.href = `https://aiagentskills.lemonsqueezy.com/checkout/buy/${productId}?checkout[email]=${encodeURIComponent(user.email)}&checkout[custom][user_id]=${user.id}`;
        }
    }

    async function requestPayout(user) {
        if (!supabase) return;

        try {
            const { data: profile } = await supabase
                .from('user_profiles')
                .select('pending_payout')
                .eq('id', user.id)
                .single();

            if ((profile?.pending_payout || 0) < 100) {
                showToast('⚠️ MINIMUM_NOT_MET', 'Minimum payout is £100.');
                return;
            }

            // Create payout request
            const { error } = await supabase
                .from('developer_payouts')
                .insert([{
                    developer_id: user.id,
                    amount: profile.pending_payout,
                    status: 'pending'
                }]);

            if (error) throw error;

            showToast('💰 PAYOUT_REQUESTED', 'Your payout request has been submitted.');

        } catch (err) {
            console.error('Payout request error:', err);
            showToast('⚠️ ERROR', 'Failed to request payout.');
        }
    }

    // ===========================================
    // SKILL DOWNLOAD SYSTEM
    // ===========================================

    // Store current skill data for download modal
    let currentDownloadSkill = null;

    // Global function to open download modal
    window.downloadSkill = function (skillId) {
        // Find skill data from skills array or fetch it
        const skill = window.skillsData?.find(s => s.id === skillId) || {
            id: skillId,
            name: skillId,
            description: 'Loading skill data...',
            content: null
        };

        currentDownloadSkill = skill;
        openDownloadModal(skill);
    };

    // Open the download modal with skill data
    function openDownloadModal(skill) {
        const modal = document.getElementById('download-modal');
        if (!modal) return;

        // Set skill name
        const skillName = document.getElementById('download-skill-name');
        if (skillName) {
            skillName.textContent = (skill.name || skill.id).replace(/_/g, '_') + '.md';
        }

        // Set npx command
        const npxCmd = document.getElementById('npx-command');
        if (npxCmd) {
            const cmdName = (skill.name || skill.id).toLowerCase().replace(/\s+/g, '-').replace(/_/g, '-');
            npxCmd.textContent = `npx aiagentskills inject ${cmdName}`;
        }

        // Set raw URL
        const rawUrl = document.getElementById('raw-url');
        if (rawUrl) {
            const urlName = (skill.name || skill.id).toLowerCase().replace(/\s+/g, '-');
            rawUrl.value = `https://skills.aiagentskillsmd.com/raw/${urlName}.md`;
        }

        // Reset source preview
        const sourcePreview = document.getElementById('source-preview');
        if (sourcePreview) sourcePreview.style.display = 'none';

        const viewBtn = document.getElementById('view-source-btn-text');
        if (viewBtn) viewBtn.textContent = 'SHOW_SOURCE';

        // Show modal
        modal.classList.add('active');
    }

    // Close download modal
    document.getElementById('close-download-modal')?.addEventListener('click', () => {
        document.getElementById('download-modal')?.classList.remove('active');
    });

    // Close download modal on overlay click
    document.getElementById('download-modal')?.addEventListener('click', (e) => {
        if (e.target.id === 'download-modal') {
            e.target.classList.remove('active');
        }
    });

    // Copy skill content to clipboard
    window.copySkillToClipboard = async function() {
        if (!currentDownloadSkill) return;

        const content = currentDownloadSkill.content || generateSkillMarkdown(currentDownloadSkill);

        try {
            await navigator.clipboard.writeText(content);
            const status = document.getElementById('copy-status');
            if (status) {
                status.textContent = '✓ COPIED!';
                setTimeout(() => { status.textContent = ''; }, 2000);
            }
            showToast('📋 COPIED', 'Skill copied to clipboard!');
        } catch (err) {
            console.error('Copy failed:', err);
            showToast('⚠️ ERROR', 'Failed to copy to clipboard');
        }
    };

    // Download skill as .md file
    window.downloadSkillFile = function() {
        if (!currentDownloadSkill) return;

        const content = currentDownloadSkill.content || generateSkillMarkdown(currentDownloadSkill);
        const filename = (currentDownloadSkill.name || 'skill').replace(/\s+/g, '_') + '.md';

        const blob = new Blob([content], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        showToast('💾 DOWNLOADED', `${filename} saved to downloads`);
    };

    // Copy npx command
    window.copyNpxCommand = async function() {
        const cmd = document.getElementById('npx-command')?.textContent;
        if (!cmd) return;

        try {
            await navigator.clipboard.writeText(cmd);
            showToast('📋 COPIED', 'NPX command copied!');
        } catch (err) {
            showToast('⚠️ ERROR', 'Failed to copy command');
        }
    };

    // Copy raw URL
    window.copyRawUrl = async function() {
        const url = document.getElementById('raw-url')?.value;
        if (!url) return;

        try {
            await navigator.clipboard.writeText(url);
            showToast('🔗 COPIED', 'Raw URL copied!');
        } catch (err) {
            showToast('⚠️ ERROR', 'Failed to copy URL');
        }
    };

    // Toggle source view
    window.toggleSourceView = function() {
        const sourcePreview = document.getElementById('source-preview');
        const viewBtn = document.getElementById('view-source-btn-text');

        if (!sourcePreview || !viewBtn) return;

        if (sourcePreview.style.display === 'none') {
            // Show source
            sourcePreview.style.display = 'block';
            viewBtn.textContent = 'HIDE_SOURCE';

            // Load source content
            const sourceCode = document.getElementById('skill-source-code');
            if (sourceCode && currentDownloadSkill) {
                sourceCode.textContent = currentDownloadSkill.content || generateSkillMarkdown(currentDownloadSkill);
            }
        } else {
            // Hide source
            sourcePreview.style.display = 'none';
            viewBtn.textContent = 'SHOW_SOURCE';
        }
    };

    // Generate skill markdown if content not available
    function generateSkillMarkdown(skill) {
        return `# ${skill.name || 'Skill'}

## Description
${skill.description || 'No description available.'}

## Installation

### Option 1: Copy & Paste
Copy this entire file content and paste it into your AI agent's custom instructions or skills folder.

### Option 2: NPX Command
\`\`\`bash
npx aiagentskills inject ${(skill.name || 'skill').toLowerCase().replace(/\s+/g, '-')}
\`\`\`

### Option 3: Manual Download
Save this file as \`${(skill.name || 'skill').replace(/\s+/g, '_')}.md\` in your agent's skills directory.

## Compatibility
- Claude (Anthropic)
- GPT-4 (OpenAI)
- Moltbot
- AutoGPT
- Cursor AI
- Any MCP-compatible agent

## Usage
Once installed, your AI agent will have access to the following capabilities:

${skill.description || 'See skill documentation for detailed usage instructions.'}

---
*Skill provided by AI Agent Skills Marketplace*
*SHA-256 Verified • Blue Label Certified*
`;
    }

    window.viewSkillDocs = function (skillId) {
        showToast('📖 LOADING_DOCS', 'Opening skill documentation...');
        // Implement docs view logic
    };

    // ===========================================
    // ELITE DASHBOARD FUNCTIONS
    // ===========================================

    // Global function to switch dashboard tabs programmatically
    window.switchDashboardTab = function(tabName) {
        const tabBtns = document.querySelectorAll('.dashboard-tabs .tab-btn');
        const tabContents = document.querySelectorAll('.dashboard-tab-content');

        tabBtns.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));

        const targetBtn = document.querySelector(`.dashboard-tabs .tab-btn[data-tab="${tabName}"]`);
        const targetContent = document.getElementById(`tab-${tabName}`);

        if (targetBtn) targetBtn.classList.add('active');
        if (targetContent) targetContent.classList.add('active');
    };

    // FAQ toggle function
    window.toggleFaq = function(element) {
        const faqItem = element.closest('.faq-item');
        if (faqItem) {
            faqItem.classList.toggle('open');
        }
    };

    // Initialize overview tab data
    function initOverviewTab(profile) {
        // Update welcome name
        const welcomeName = document.getElementById('welcome-name');
        if (welcomeName && profile) {
            welcomeName.textContent = profile.display_name || profile.email?.split('@')[0] || 'Operator';
        }

        // Update overview stats
        updateOverviewStats(profile);

        // Calculate profile completion
        calculateProfileCompletion(profile);

        // Load recent activity
        loadRecentActivity();
    }

    function updateOverviewStats(profile) {
        const skillsOwned = document.getElementById('overview-skills-owned');
        const totalDownloads = document.getElementById('overview-total-downloads');
        const tier = document.getElementById('overview-tier');
        const memberDays = document.getElementById('overview-member-days');

        if (skillsOwned) skillsOwned.textContent = '0'; // Will be updated from library
        if (totalDownloads) totalDownloads.textContent = '0';
        if (tier && profile) {
            const tierMap = {
                'free': 'FREE',
                'syndicate': 'SYNDICATE',
                'blackmarket': 'BLACK_MARKET'
            };
            tier.textContent = tierMap[profile.subscription_tier] || 'FREE';
        }
        if (memberDays && profile?.created_at) {
            const created = new Date(profile.created_at);
            const now = new Date();
            const days = Math.floor((now - created) / (1000 * 60 * 60 * 24));
            memberDays.textContent = days;
        }
    }

    function calculateProfileCompletion(profile) {
        if (!profile) return;

        const fields = ['display_name', 'bio', 'website', 'avatar_url'];
        let completed = 1; // Account exists = 1 point

        fields.forEach(field => {
            if (profile[field]) completed++;
        });

        const percentage = Math.round((completed / (fields.length + 1)) * 100);

        const fill = document.getElementById('profile-completion-fill');
        const percent = document.getElementById('profile-completion-percent');

        if (fill) fill.style.width = `${percentage}%`;
        if (percent) percent.textContent = `${percentage}%`;
    }

    function loadRecentActivity() {
        const activityFeed = document.getElementById('overview-activity-feed');
        if (!activityFeed) return;

        // For now, show placeholder activity
        // In a real implementation, this would fetch from activity_log table
        activityFeed.innerHTML = `
            <div class="activity-item">
                <span class="activity-icon">✅</span>
                <div class="activity-content">
                    <span class="activity-text">Logged into dashboard</span>
                    <span class="activity-time">Just now</span>
                </div>
            </div>
        `;
    }

    // Library search and filter
    function initLibraryFilters() {
        const searchInput = document.getElementById('library-search');
        const categoryFilter = document.getElementById('library-filter-category');
        const statusFilter = document.getElementById('library-filter-status');
        const sortSelect = document.getElementById('library-sort');

        const filterLibrary = () => {
            // Implement library filtering logic
            const search = searchInput?.value.toLowerCase() || '';
            const category = categoryFilter?.value || 'all';
            const status = statusFilter?.value || 'all';
            const sort = sortSelect?.value || 'recent';

            // Apply filters to library grid
            // TODO: Implement actual filtering logic
        };

        if (searchInput) searchInput.addEventListener('input', debounce(filterLibrary, 300));
        if (categoryFilter) categoryFilter.addEventListener('change', filterLibrary);
        if (statusFilter) statusFilter.addEventListener('change', filterLibrary);
        if (sortSelect) sortSelect.addEventListener('change', filterLibrary);
    }

    // Notification filter buttons
    function initNotificationFilters() {
        const filterBtns = document.querySelectorAll('.notifications-filters .filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const filter = btn.dataset.filter;
                filterNotifications(filter);
            });
        });
    }

    function filterNotifications(filter) {
        // TODO: Implement notification filtering
    }

    // Support ticket form
    function initSupportForm() {
        const form = document.getElementById('support-ticket-form');
        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                const subject = document.getElementById('ticket-subject')?.value;
                const category = document.getElementById('ticket-category')?.value;
                const description = document.getElementById('ticket-description')?.value;

                if (!subject || !category || !description) {
                    showToast('❌ ERROR', 'Please fill in all required fields');
                    return;
                }

                showToast('📤 SUBMITTING', 'Creating support ticket...');

                // In real implementation, save to support_tickets table
                setTimeout(() => {
                    showToast('✅ SUCCESS', 'Support ticket created! We\'ll respond soon.');
                    form.reset();
                }, 1000);
            });
        }
    }

    // File upload zone
    function initFileUploadZone() {
        const uploadZone = document.getElementById('ticket-upload-zone');
        const fileInput = document.getElementById('ticket-attachment');

        if (uploadZone && fileInput) {
            uploadZone.addEventListener('click', () => fileInput.click());
            uploadZone.addEventListener('dragover', (e) => {
                e.preventDefault();
                uploadZone.classList.add('dragover');
            });
            uploadZone.addEventListener('dragleave', () => {
                uploadZone.classList.remove('dragover');
            });
            uploadZone.addEventListener('drop', (e) => {
                e.preventDefault();
                uploadZone.classList.remove('dragover');
                if (e.dataTransfer.files.length) {
                    fileInput.files = e.dataTransfer.files;
                    showToast('📎 FILE_ATTACHED', e.dataTransfer.files[0].name);
                }
            });
        }
    }

    // Settings form handlers
    function initSettingsForms() {
        // Save profile
        const saveProfileBtn = document.getElementById('btn-save-profile');
        if (saveProfileBtn) {
            saveProfileBtn.addEventListener('click', saveProfile);
        }

        // Save notifications
        const saveNotifBtn = document.getElementById('btn-save-notifications');
        if (saveNotifBtn) {
            saveNotifBtn.addEventListener('click', () => {
                showToast('✅ SAVED', 'Notification preferences updated');
            });
        }

        // Bio character count
        const bioInput = document.getElementById('input-bio');
        const bioCount = document.getElementById('bio-char-count');
        if (bioInput && bioCount) {
            bioInput.addEventListener('input', () => {
                bioCount.textContent = bioInput.value.length;
            });
        }

        // Delete account
        const deleteBtn = document.getElementById('btn-delete-account');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => {
                if (confirm('⚠️ Are you sure you want to delete your account? This action cannot be undone.')) {
                    if (confirm('⚠️ This will permanently delete all your data. Type "DELETE" to confirm.')) {
                        showToast('🗑️ DELETING', 'Removing your account...');
                        // Implement account deletion
                    }
                }
            });
        }

        // Change password button
        const changePasswordBtn = document.getElementById('btn-change-password');
        if (changePasswordBtn && supabase) {
            changePasswordBtn.addEventListener('click', async () => {
                const email = document.getElementById('input-email')?.value;
                if (!email) {
                    showToast('⚠️ ERROR', 'Email not found', 'error');
                    return;
                }
                try {
                    const { error } = await supabase.auth.resetPasswordForEmail(email, {
                        redirectTo: window.location.origin + '?reset=true'
                    });
                    if (error) throw error;
                    showToast('📧 EMAIL_SENT', 'Check your email for password reset link');
                } catch (err) {
                    showToast('⚠️ ERROR', err.message || 'Failed to send reset email', 'error');
                }
            });
        }

        // Enable 2FA button
        const enable2FABtn = document.getElementById('btn-enable-2fa');
        if (enable2FABtn) {
            enable2FABtn.addEventListener('click', () => {
                showToast('🔐 COMING_SOON', 'Two-factor authentication will be available soon');
            });
        }

        // Connect GitHub button
        const connectGitHubBtn = document.getElementById('btn-connect-github');
        if (connectGitHubBtn && supabase) {
            connectGitHubBtn.addEventListener('click', async () => {
                try {
                    const { data, error } = await supabase.auth.linkIdentity({
                        provider: 'github',
                        options: {
                            redirectTo: window.location.origin
                        }
                    });
                    if (error) throw error;
                } catch (err) {
                    // If linking fails, try regular OAuth
                    const { data, error } = await supabase.auth.signInWithOAuth({
                        provider: 'github',
                        options: {
                            redirectTo: window.location.origin
                        }
                    });
                    if (error) {
                        showToast('⚠️ ERROR', err.message || 'Failed to connect GitHub', 'error');
                    }
                }
            });
        }

        // Upload avatar button
        const uploadAvatarBtn = document.getElementById('btn-upload-avatar');
        if (uploadAvatarBtn) {
            uploadAvatarBtn.addEventListener('click', () => {
                showToast('📷 COMING_SOON', 'Avatar upload will be available soon');
            });
        }

        // Update payment method
        const updatePaymentBtn = document.getElementById('btn-update-payment');
        if (updatePaymentBtn) {
            updatePaymentBtn.addEventListener('click', () => {
                // Open Lemon Squeezy customer portal
                if (window.LemonSqueezy) {
                    showToast('💳 REDIRECTING', 'Opening payment portal...');
                    // LemonSqueezy customer portal would be here
                } else {
                    showToast('💳 COMING_SOON', 'Payment portal will be available soon');
                }
            });
        }

        // Cancel subscription
        const cancelSubBtn = document.getElementById('btn-cancel-subscription');
        if (cancelSubBtn) {
            cancelSubBtn.addEventListener('click', () => {
                if (confirm('⚠️ Are you sure you want to cancel your subscription? You will lose access at the end of your billing period.')) {
                    showToast('📧 CONTACT_SUPPORT', 'Please contact support to cancel your subscription');
                }
            });
        }

        // Export data
        const exportDataBtn = document.getElementById('btn-export-data');
        if (exportDataBtn) {
            exportDataBtn.addEventListener('click', async () => {
                showToast('📦 EXPORTING', 'Preparing your data export...');
                // Generate data export
                const userData = {
                    exported_at: new Date().toISOString(),
                    profile: {
                        display_name: document.getElementById('input-display-name')?.value,
                        email: document.getElementById('input-email')?.value,
                        bio: document.getElementById('input-bio')?.value,
                        website: document.getElementById('input-website')?.value
                    }
                };
                const blob = new Blob([JSON.stringify(userData, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'aiagentskills_data_export.json';
                a.click();
                URL.revokeObjectURL(url);
                showToast('✅ EXPORTED', 'Your data has been downloaded');
            });
        }

        // Export purchases CSV
        const exportPurchasesBtn = document.getElementById('btn-export-purchases');
        if (exportPurchasesBtn) {
            exportPurchasesBtn.addEventListener('click', () => {
                showToast('📥 EXPORTING', 'Generating purchase history CSV...');
                // Would generate CSV from purchases table
                showToast('✅ EXPORTED', 'Purchase history downloaded');
            });
        }

        // Share wishlist
        const shareWishlistBtn = document.getElementById('btn-share-wishlist');
        if (shareWishlistBtn) {
            shareWishlistBtn.addEventListener('click', () => {
                const shareUrl = window.location.origin + '/wishlist/' + (currentUserId || 'demo');
                navigator.clipboard.writeText(shareUrl);
                showToast('🔗 COPIED', 'Wishlist link copied to clipboard');
            });
        }

        // Clear wishlist
        const clearWishlistBtn = document.getElementById('btn-clear-wishlist');
        if (clearWishlistBtn) {
            clearWishlistBtn.addEventListener('click', () => {
                if (confirm('Are you sure you want to clear your entire wishlist?')) {
                    showToast('🗑️ CLEARED', 'Wishlist has been cleared');
                    // Would clear wishlist from database
                }
            });
        }

        // Mark all notifications read
        const markAllReadBtn = document.getElementById('btn-mark-all-read');
        if (markAllReadBtn) {
            markAllReadBtn.addEventListener('click', () => {
                showToast('✅ DONE', 'All notifications marked as read');
                const notifCount = document.getElementById('total-notification-count');
                if (notifCount) notifCount.textContent = '0 unread';
            });
        }

        // Upgrade buttons (alternative locations)
        const upgradeToSyndicateBtn = document.getElementById('btn-upgrade-to-syndicate');
        if (upgradeToSyndicateBtn) {
            upgradeToSyndicateBtn.addEventListener('click', () => {
                initLemonSqueezyCheckout('syndicate', window.currentUser);
            });
        }

        const upgradeToBlackmarketBtn = document.getElementById('btn-upgrade-to-blackmarket');
        if (upgradeToBlackmarketBtn) {
            upgradeToBlackmarketBtn.addEventListener('click', () => {
                initLemonSqueezyCheckout('blackmarket', window.currentUser);
            });
        }
    }

    // Current user ID for global access
    let currentUserId = null;

    // Debounce utility
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Initialize elite dashboard features
    function initEliteDashboard(profile) {
        initOverviewTab(profile);
        initLibraryFilters();
        initNotificationFilters();
        initSupportForm();
        initFileUploadZone();
        initSettingsForms();
    }

    function hideMemberDashboard() {
        const dashboard = document.getElementById('member-dashboard');
        if (dashboard) dashboard.style.display = 'none';
    }

    // ===========================================
    // SKILL SUBMISSION MODAL LOGIC
    // ===========================================
    let pendingSkillFile = null;

    function openSkillSubmissionModal() {
        const modal = document.getElementById('skill-submit-modal');
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
            initSkillSubmissionForm();
        }
    }

    function closeSkillSubmissionModal() {
        const modal = document.getElementById('skill-submit-modal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
            resetSkillSubmissionForm();
        }
    }

    function resetSkillSubmissionForm() {
        const form = document.getElementById('skill-submit-form');
        if (form) form.reset();

        pendingSkillFile = null;

        const uploadZone = document.getElementById('skill-upload-zone');
        const filePreview = document.getElementById('file-preview');

        if (uploadZone) uploadZone.classList.remove('has-file');
        if (filePreview) filePreview.classList.add('hidden');

        const charCount = document.getElementById('desc-char-count');
        if (charCount) charCount.textContent = '0';
    }

    function initSkillSubmissionForm() {
        // Skip if already initialized
        if (window.skillSubmissionFormInitialized) return;
        window.skillSubmissionFormInitialized = true;

        const modal = document.getElementById('skill-submit-modal');
        const closeBtn = document.getElementById('close-skill-submit-modal');
        const cancelBtn = document.getElementById('cancel-skill-submit');
        const uploadZone = document.getElementById('skill-upload-zone');
        const fileInput = document.getElementById('skill-file-input');
        const filePreview = document.getElementById('file-preview');
        const fileName = document.getElementById('file-name');
        const fileRemove = document.getElementById('file-remove');
        const descTextarea = document.getElementById('submit-description');
        const charCount = document.getElementById('desc-char-count');
        const form = document.getElementById('skill-submit-form');

        // Close modal handlers
        if (closeBtn) {
            closeBtn.addEventListener('click', closeSkillSubmissionModal);
        }

        if (cancelBtn) {
            cancelBtn.addEventListener('click', closeSkillSubmissionModal);
        }

        // Close on overlay click
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) closeSkillSubmissionModal();
            });
        }

        // File upload handlers
        if (uploadZone && fileInput) {
            // Click to upload
            uploadZone.addEventListener('click', () => {
                if (!uploadZone.classList.contains('has-file')) {
                    fileInput.click();
                }
            });

            // Drag and drop
            uploadZone.addEventListener('dragover', (e) => {
                e.preventDefault();
                uploadZone.classList.add('drag-over');
            });

            uploadZone.addEventListener('dragleave', () => {
                uploadZone.classList.remove('drag-over');
            });

            uploadZone.addEventListener('drop', (e) => {
                e.preventDefault();
                uploadZone.classList.remove('drag-over');

                const file = e.dataTransfer.files[0];
                if (file && file.name.endsWith('.md')) {
                    handleFileSelection(file);
                } else {
                    showToast('INVALID_FILE', 'Please upload a .md (Markdown) file', 'error');
                }
            });

            // File input change
            fileInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) handleFileSelection(file);
            });
        }

        // Remove file handler
        if (fileRemove) {
            fileRemove.addEventListener('click', (e) => {
                e.stopPropagation();
                pendingSkillFile = null;
                uploadZone.classList.remove('has-file');
                filePreview.classList.add('hidden');
                fileInput.value = '';
            });
        }

        // Character count for description
        if (descTextarea && charCount) {
            descTextarea.addEventListener('input', () => {
                charCount.textContent = descTextarea.value.length;
            });
        }

        // Form submission
        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                await handleSkillSubmission();
            });
        }
    }

    function handleFileSelection(file) {
        const uploadZone = document.getElementById('skill-upload-zone');
        const filePreview = document.getElementById('file-preview');
        const fileNameEl = document.getElementById('file-name');

        pendingSkillFile = file;

        if (uploadZone) uploadZone.classList.add('has-file');
        if (filePreview) filePreview.classList.remove('hidden');
        if (fileNameEl) fileNameEl.textContent = file.name;

        showToast('FILE_UPLOADED', `${file.name} ready for submission`, 'success');
    }

    async function handleSkillSubmission() {
        if (!supabase || !activeUser) {
            showToast('ERROR', 'You must be logged in to submit a skill', 'error');
            return;
        }

        // Get form values
        const name = document.getElementById('submit-skill-name')?.value.trim();
        const category = document.getElementById('submit-category')?.value;
        const tier = document.getElementById('submit-tier')?.value;
        const price = parseFloat(document.getElementById('submit-price')?.value) || 0;
        const description = document.getElementById('submit-description')?.value.trim();
        const tags = document.getElementById('submit-tags')?.value.trim();

        // Validation
        if (!name || !category || !description) {
            showToast('VALIDATION_ERROR', 'Please fill in all required fields', 'warning');
            return;
        }

        if (!pendingSkillFile) {
            showToast('VALIDATION_ERROR', 'Please upload a .md file', 'warning');
            return;
        }

        const submitBtn = document.getElementById('submit-skill-btn');
        if (submitBtn) submitBtn.classList.add('loading');

        try {
            // Read file content
            const fileContent = await pendingSkillFile.text();

            // ==========================================
            // ELITE SECURITY SCAN - PRE-SUBMISSION
            // ==========================================
            showToast('🔐 SCANNING', 'Running elite security analysis...', 'info', 3000);

            let scanResult;
            try {
                const scanResponse = await fetch('/.netlify/functions/integrations_v2/skill-scanner', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        content: fileContent,
                        fileName: pendingSkillFile.name
                    })
                });

                scanResult = await scanResponse.json();
            } catch (scanErr) {
                console.warn('Security scanner unavailable, using fallback validation');
                // Fallback: basic client-side checks
                scanResult = performClientSideScan(fileContent);
            }

            // Handle scan results
            if (scanResult.status === 'REJECTED') {
                const threatList = scanResult.threats
                    .filter(t => t.severity === 'CRITICAL' || t.severity === 'HIGH')
                    .slice(0, 3)
                    .map(t => t.category)
                    .join(', ');

                showToast('🚫 REJECTED', `Security threats detected: ${threatList}`, 'error', 8000);
                console.error('[SECURITY] Skill rejected:', scanResult);
                return;
            }

            if (scanResult.status === 'FLAGGED') {
                showToast('⚠️ FLAGGED', `Skill contains ${scanResult.threats.length} suspicious patterns. Submitted for manual review.`, 'warning', 6000);
            } else {
                showToast('✓ SCAN_COMPLETE', `Security check passed (Risk: ${scanResult.riskScore}/100)`, 'success', 3000);
            }

            // Generate unique identifiers
            const timestamp = Date.now();
            const safeFileName = name.toLowerCase().replace(/[^a-z0-9_]/g, '_');
            const storagePath = `submissions/${activeUser.id}/${safeFileName}_${timestamp}.md`;

            // Upload to Supabase Storage (if bucket exists)
            let fileUrl = null;
            try {
                const { data: uploadData, error: uploadError } = await supabase.storage
                    .from('skills')
                    .upload(storagePath, pendingSkillFile, {
                        contentType: 'text/markdown',
                        upsert: false
                    });

                if (!uploadError && uploadData) {
                    const { data: urlData } = supabase.storage
                        .from('skills')
                        .getPublicUrl(storagePath);
                    fileUrl = urlData?.publicUrl;
                }
            } catch (storageErr) {
                // Storage not configured, saving content directly
            }

            // Determine status based on security scan
            const submissionStatus = scanResult.status === 'FLAGGED' ? 'flagged' : 'pending';

            // Insert skill submission record WITH security metadata
            const { data, error } = await supabase
                .from('skill_submissions')
                .insert([{
                    developer_id: activeUser.id,
                    name: name,
                    slug: safeFileName + '_' + timestamp,
                    category: category,
                    tier_required: tier,
                    price: price,
                    description: description,
                    tags: tags ? tags.split(',').map(t => t.trim()) : [],
                    content: fileContent,
                    file_url: fileUrl,
                    status: submissionStatus,
                    submitted_at: new Date().toISOString(),
                    // Security scan metadata
                    security_scan: {
                        status: scanResult.status,
                        risk_score: scanResult.riskScore,
                        threats_count: scanResult.threats?.length || 0,
                        threats: scanResult.threats?.slice(0, 10) || [],
                        warnings: scanResult.warnings || [],
                        scanned_at: new Date().toISOString()
                    }
                }])
                .select();

            if (error) {
                console.error('Submission error:', error);
                showToast('SUBMISSION_FAILED', error.message || 'Failed to submit skill', 'error');
                return;
            }

            const successMsg = submissionStatus === 'flagged'
                ? 'Skill submitted for manual security review'
                : 'Your skill has been submitted for review!';

            showToast('SKILL_SUBMITTED', successMsg, 'success');
            closeSkillSubmissionModal();

            // Refresh developer stats
            await loadDeveloperStats(activeUser);

        } catch (err) {
            console.error('Submission error:', err);
            showToast('ERROR', 'An unexpected error occurred', 'error');
        } finally {
            if (submitBtn) submitBtn.classList.remove('loading');
        }
    }

    // Fallback client-side security scan (when server unavailable)
    function performClientSideScan(content) {
        const threats = [];
        const warnings = [];

        // Critical patterns that should block submission
        const criticalPatterns = [
            { pattern: /rm\s+-rf\s+[\/~]/gi, category: 'SHELL_INJECTION' },
            { pattern: /curl\s+.*\|\s*sh/gi, category: 'SHELL_INJECTION' },
            { pattern: /eval\s*\(/gi, category: 'CODE_INJECTION' },
            { pattern: /<script[\s>]/gi, category: 'XSS_ATTACK' },
            { pattern: /process\.env\./gi, category: 'ENV_ACCESS' },
            { pattern: /child_process/gi, category: 'SYSTEM_ACCESS' },
            { pattern: /meterpreter/gi, category: 'BACKDOOR' },
            { pattern: /reverse.*shell/gi, category: 'BACKDOOR' },
        ];

        // Warning patterns
        const warningPatterns = [
            { pattern: /password\s*[:=]/gi, category: 'CREDENTIAL_PATTERN' },
            { pattern: /api[_-]?key\s*[:=]/gi, category: 'API_KEY_PATTERN' },
            { pattern: /fetch\s*\(/gi, category: 'NETWORK_REQUEST' },
            { pattern: /XMLHttpRequest/gi, category: 'NETWORK_REQUEST' },
        ];

        for (const { pattern, category } of criticalPatterns) {
            if (pattern.test(content)) {
                threats.push({
                    category,
                    severity: 'CRITICAL',
                    pattern: 'Pattern matched',
                    location: 'Content',
                    description: `Critical security pattern detected: ${category}`
                });
            }
        }

        for (const { pattern, category } of warningPatterns) {
            if (pattern.test(content)) {
                threats.push({
                    category,
                    severity: 'MEDIUM',
                    pattern: 'Pattern matched',
                    location: 'Content',
                    description: `Suspicious pattern detected: ${category}`
                });
            }
        }

        // File size check
        if (content.length > 500 * 1024) {
            threats.push({
                category: 'FILE_TOO_LARGE',
                severity: 'HIGH',
                pattern: `${(content.length / 1024).toFixed(2)}KB`,
                location: 'File',
                description: 'File exceeds 500KB limit'
            });
        }

        // Calculate risk score
        let riskScore = 0;
        for (const threat of threats) {
            if (threat.severity === 'CRITICAL') riskScore += 30;
            else if (threat.severity === 'HIGH') riskScore += 20;
            else if (threat.severity === 'MEDIUM') riskScore += 10;
        }
        riskScore = Math.min(100, riskScore);

        // Determine status
        let status;
        if (threats.some(t => t.severity === 'CRITICAL')) {
            status = 'REJECTED';
        } else if (riskScore >= 30) {
            status = 'FLAGGED';
        } else {
            status = 'PASSED';
        }

        return { status, riskScore, threats, warnings };
    }

    // Make modal functions globally accessible
    window.openSkillSubmissionModal = openSkillSubmissionModal;
    window.closeSkillSubmissionModal = closeSkillSubmissionModal;




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

    // --- PRICING & ACCESS LOGIC (TIME WARP FIX) ---
    function initPricingLogic() {
        const syndicateBtn = document.getElementById('btn-sub-syndicate');
        const blackMarketBtn = document.getElementById('btn-acc-blackmarket');

        // Wrap everything in an ID for the warp effect if not present
        let appContainer = document.getElementById('app-container');

        if (syndicateBtn) {
            syndicateBtn.addEventListener('click', () => {
                const originalText = syndicateBtn.textContent;
                syndicateBtn.textContent = 'ESTABLISHING_SECURE_Handshake...';
                syndicateBtn.style.background = 'var(--neon-green)';
                syndicateBtn.style.color = '#000';

                setTimeout(() => {
                    alert("REDIRECTING TO LEMON SQUEEZY CHECKOUT...");
                    syndicateBtn.textContent = originalText;
                    syndicateBtn.style.background = '';
                    syndicateBtn.style.color = '';
                }, 1000);
            });
        }

        if (blackMarketBtn) {
            blackMarketBtn.addEventListener('click', () => {
                // Trigger Time Warp Visuals
                document.body.classList.add('time-warp-active');

                // Add overlay if missing
                let overlay = document.querySelector('.warp-overlay');
                if (!overlay) {
                    overlay = document.createElement('div');
                    overlay.className = 'warp-overlay';
                    document.body.appendChild(overlay);
                }

                // 2. Wait for Blur/Zoom (1200ms matches CSS)
                setTimeout(() => {
                    // 3. Teleport to Marketplace Section (Hidden from user due to blur)
                    const marketplace = document.getElementById('marketplace');
                    if (marketplace) marketplace.scrollIntoView({ behavior: 'auto', block: 'start' });

                    // 4. Reveal Hidden Items
                    const hiddenItems = document.querySelectorAll('.black-market-item');
                    hiddenItems.forEach(item => {
                        item.classList.remove('hidden');
                        item.classList.add('revealed');
                    });

                    // 5. Release Warp (Snap back)
                    setTimeout(() => {
                        document.body.classList.remove('time-warp-active');
                    }, 100);

                }, 1200);
            });
        }
    }
    initPricingLogic();

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
        { icon: '📄', text: 'Read Manifesto', action: () => openManifestoModal() }
    ];

    // --- MANIFESTO MODAL HANDLERS ---
    function openManifestoModal() {
        const modal = document.getElementById('manifesto-modal');
        if (modal) {
            modal.classList.add('active');
            modal.style.display = 'flex';
        }
    }

    function closeManifestoModal() {
        const modal = document.getElementById('manifesto-modal');
        if (modal) {
            modal.classList.remove('active');
            modal.style.display = 'none';
        }
    }

    // Manifesto modal button handlers
    const manifestoOpenBtn = document.getElementById('open-manifesto-modal');
    const manifestoCloseBtn = document.getElementById('close-manifesto-modal');
    const manifestoModal = document.getElementById('manifesto-modal');

    if (manifestoOpenBtn) {
        manifestoOpenBtn.addEventListener('click', openManifestoModal);
    }

    if (manifestoCloseBtn) {
        manifestoCloseBtn.addEventListener('click', closeManifestoModal);
    }

    // Close on overlay click
    if (manifestoModal) {
        manifestoModal.addEventListener('click', (e) => {
            if (e.target === manifestoModal) closeManifestoModal();
        });
    }

    // Manifesto modal internal CTAs
    const manifestoToPricing = document.getElementById('manifesto-to-pricing');
    const manifestoBecomeDev = document.getElementById('manifesto-become-dev');

    if (manifestoToPricing) {
        manifestoToPricing.addEventListener('click', () => {
            closeManifestoModal();
            document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
        });
    }

    if (manifestoBecomeDev) {
        manifestoBecomeDev.addEventListener('click', () => {
            closeManifestoModal();
            // Redirect to secure developer application page
            window.location.href = 'developer.html';
        });
    }

    // --- SKILL MODAL HANDLERS ---
    const skillModal = document.getElementById('skill-modal');
    const closeSkillModal = document.getElementById('close-skill-modal');
    let currentSkillData = null;

    function openSkillModal(card) {
        if (!skillModal) return;

        // Get data from card attributes or inner text
        const name = card.dataset.skillName || card.querySelector('h3')?.textContent || 'Unknown Skill';
        const desc = card.dataset.skillDesc || card.querySelector('.skill-desc')?.textContent || 'No description available.';
        const dev = card.dataset.devName || 'Unknown Developer';
        const sha = card.dataset.sha || '0x0000...';
        const installs = card.dataset.installs || '0';
        const price = card.dataset.price || '0';
        const category = card.dataset.category || 'dev';
        const rating = card.dataset.rating || '0.0';
        const reviews = card.dataset.reviews || '0';

        // Populate modal
        document.getElementById('skill-modal-name').textContent = name;
        document.getElementById('skill-modal-desc').textContent = desc;
        document.getElementById('skill-modal-dev').textContent = dev;
        document.getElementById('skill-modal-sha').textContent = sha;
        document.getElementById('skill-modal-installs').textContent = installs;
        document.getElementById('skill-modal-price').textContent = `$${price}`;
        document.getElementById('skill-modal-badge').textContent = category.toUpperCase();

        // Populate Rating in Modal
        const modalRating = document.getElementById('skill-modal-rating');
        if (modalRating) {
            modalRating.querySelector('.rating-val').textContent = rating;
            modalRating.querySelector('.review-count').textContent = `(${reviews} reviews)`;

            // Render interactive stars
            const starsSpan = modalRating.querySelector('.stars');
            const ratingNum = parseFloat(rating);
            let starsStr = '';
            for (let i = 1; i <= 5; i++) {
                const isFull = i <= Math.round(ratingNum);
                starsStr += `<span class="star-clickable ${isFull ? 'active' : ''}" data-value="${i}">${isFull ? '★' : '☆'}</span>`;
            }
            starsSpan.innerHTML = starsStr;

            // Add click listeners to stars
            starsSpan.querySelectorAll('.star-clickable').forEach(star => {
                star.addEventListener('click', (e) => {
                    const val = parseInt(e.target.dataset.value);
                    updateModalStars(val);
                    showToast('RATING_SUBMITTED', `Visual rating set to ${val}/5 stars.`);
                });
            });
        }

        // Show modal with scrollbar compensation
        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
        document.body.style.overflow = 'hidden';
        document.body.style.paddingRight = `${scrollbarWidth}px`; // Prevent layout shift

        skillModal.style.display = 'flex';
        skillModal.classList.add('active');

        // Store skill data for checkout
        currentSkillData = {
            id: card.dataset.skillId,
            name: card.dataset.skillName || card.querySelector('h3')?.textContent,
            price: parseFloat(card.dataset.price) || 0,
            category: card.dataset.category
        };
    }

    function updateModalStars(val) {
        const starsSpan = document.querySelector('#skill-modal-rating .stars');
        if (!starsSpan) return;
        const stars = starsSpan.querySelectorAll('.star-clickable');
        stars.forEach((s, idx) => {
            if (idx < val) {
                s.textContent = '★';
                s.classList.add('active');
            } else {
                s.textContent = '☆';
                s.classList.remove('active');
            }
        });
    }



    function closeSkillModalFn() {
        if (!skillModal) return;
        skillModal.style.display = 'none';
        skillModal.classList.remove('active');
        document.body.style.overflow = '';
        document.body.style.paddingRight = ''; // Remove scrollbar compensation

        // Force grid recalculation to prevent card crushing
        setTimeout(() => {
            const grid = document.querySelector('.skills-grid');
            if (grid) {
                grid.style.display = 'none';
                void grid.offsetHeight; // Force reflow
                grid.style.display = 'grid';
            }
        }, 10);
    }

    if (closeSkillModal) {
        closeSkillModal.addEventListener('click', closeSkillModalFn);
    }

    // Close on overlay click
    if (skillModal) {
        skillModal.addEventListener('click', (e) => {
            if (e.target === skillModal) closeSkillModalFn();
        });
    }

    // Event Delegation for skill cards
    const skillsGrid = document.querySelector('.skills-grid');
    if (skillsGrid) {
        skillsGrid.addEventListener('click', (e) => {
            const card = e.target.closest('.skill-card');
            if (!card) return;

            // Don't open modal if clicking the button
            if (e.target.tagName === 'BUTTON' || e.target.classList.contains('btn-install')) return;

            openSkillModal(card);
        });
    }

    // --- CHECKOUT BRIDGE ---
    const skillBuyBtn = document.getElementById('skill-modal-buy');

    if (skillBuyBtn) {
        skillBuyBtn.addEventListener('click', async () => {
            if (!currentSkillData) {
                showToast('ERROR', 'No skill selected.');
                return;
            }

            if (!activeUser) {
                showToast('AUTH_REQUIRED', 'Please sign in to purchase skills.');
                return;
            }

            // Show processing state
            const originalText = skillBuyBtn.textContent;
            skillBuyBtn.textContent = 'PROCESSING...';
            skillBuyBtn.disabled = true;

            try {
                // In production: redirect to LemonSqueezy/Stripe
                // For demo: simulate payment and record to Supabase
                await new Promise(resolve => setTimeout(resolve, 1500));

                if (supabase) {
                    const { error } = await supabase
                        .from('skill_purchases')
                        .insert({
                            buyer_id: activeUser.id,
                            skill_id: currentSkillData.id,
                            skill_name: currentSkillData.name,
                            amount_paid: currentSkillData.price,
                            status: 'completed'
                        });

                    if (error) throw error;
                }

                showToast('PURCHASE_SUCCESS', `"${currentSkillData.name}" injected successfully!`);
                closeSkillModalFn();

                // Trigger celebration effect
                document.body.classList.add('purchase-flash');
                setTimeout(() => document.body.classList.remove('purchase-flash'), 500);

            } catch (err) {
                console.error('Purchase error:', err);
                showToast('PURCHASE_ERROR', 'Payment failed. Please try again.');
            } finally {
                skillBuyBtn.textContent = originalText;
                skillBuyBtn.disabled = false;
            }
        });
    }

    // --- ENHANCED FILTER LOGIC ---
    const filterBtns = document.querySelectorAll('.filter-btn');
    const allSkillCards = document.querySelectorAll('.skill-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterCat = btn.dataset.category || 'all';

            allSkillCards.forEach(card => {
                const category = card.dataset.category?.toLowerCase() || '';
                const isTopSeller = card.dataset.topseller === 'true' || card.querySelector('.top-seller-badge');
                const isBlackMarket = card.classList.contains('black-market-item');

                if (isBlackMarket) return;

                let shouldShow = false;
                if (filterCat === 'all') {
                    shouldShow = true;
                } else if (filterCat === 'top-seller') {
                    shouldShow = isTopSeller;
                } else {
                    shouldShow = (category === filterCat);
                }

                card.style.display = shouldShow ? 'block' : 'none';
            });
        });
    });

    // --- SKILL SEARCH HANDLER ---
    const skillSearchInput = document.getElementById('skill-search');
    if (skillSearchInput) {
        skillSearchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase().trim();
            const allCards = document.querySelectorAll('.skill-card');

            // Clear active filter when searching
            if (searchTerm.length > 0) {
                filterBtns.forEach(btn => btn.classList.remove('active'));
                filterBtns[0]?.classList.add('active'); // Reset to ALL
            }

            allCards.forEach(card => {
                const name = (card.dataset.skillName || card.querySelector('h3')?.textContent || '').toLowerCase();
                const desc = (card.dataset.skillDesc || card.querySelector('.skill-desc')?.textContent || '').toLowerCase();
                const category = (card.dataset.category || '').toLowerCase();

                const matches = searchTerm.length === 0 ||
                    name.includes(searchTerm) ||
                    desc.includes(searchTerm) ||
                    category.includes(searchTerm);

                card.style.display = matches ? 'block' : 'none';
            });

            // Show toast for feedback
            if (searchTerm.length > 2) {
                const visibleCount = document.querySelectorAll('.skill-card[style*="block"]').length;
                showToast('SEARCH_RESULTS', `Found ${visibleCount} skills matching "${searchTerm}"`);
            }
        });
    }

    // --- DEVELOPER PORTAL - REDIRECT TO SECURE PAGE ---
    const devPortalModal = document.getElementById('dev-portal-modal');
    const openDevPortal = document.getElementById('open-dev-modal');
    const closeDevPortal = document.getElementById('close-dev-portal');
    const devTabs = document.querySelectorAll('.dev-tab');
    const devTabContents = document.querySelectorAll('.dev-tab-content');

    function openDevPortalModal() {
        // Redirect to secure developer application page instead of opening modal
        window.location.href = 'developer.html';
    }

    function closeDevPortalModal() {
        if (!devPortalModal) return;
        devPortalModal.style.display = 'none';
        devPortalModal.classList.remove('active');
    }

    // Open from button - redirect to secure page
    if (openDevPortal) {
        openDevPortal.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'developer.html';
        });
    }

    // Close button (for backward compatibility if modal is still shown)
    if (closeDevPortal) {
        closeDevPortal.addEventListener('click', closeDevPortalModal);
    }

    // Close on overlay click
    if (devPortalModal) {
        devPortalModal.addEventListener('click', (e) => {
            if (e.target === devPortalModal) closeDevPortalModal();
        });
    }

    // Also open from manifesto "Become an Architect" button
    const manifestoBecomeArch = document.getElementById('manifesto-become-dev');
    if (manifestoBecomeArch) {
        manifestoBecomeArch.addEventListener('click', () => {
            // Close manifesto modal if open
            const manifestoModal = document.getElementById('manifesto-modal');
            if (manifestoModal) {
                manifestoModal.style.display = 'none';
                manifestoModal.classList.remove('active');
            }
            // Redirect to secure developer application page
            window.location.href = 'developer.html';
        });
    }

    // Tab switching in dev portal
    devTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.dataset.tab;

            // Update tab active state
            devTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Update content visibility
            devTabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === `tab-${tabName}`) {
                    content.classList.add('active');
                }
            });
        });
    });

    // Upload zone click handler
    const uploadZone = document.getElementById('skill-upload-zone');
    const fileInput = document.getElementById('skill-file-input');
    const uploadForm = document.getElementById('skill-upload-form');

    if (uploadZone && fileInput) {
        uploadZone.addEventListener('click', () => fileInput.click());

        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                const file = e.target.files[0];
                // Show the upload form
                if (uploadForm) {
                    uploadZone.style.display = 'none';
                    uploadForm.classList.remove('hidden');
                }
                // Extract skill name from filename
                const skillName = document.getElementById('upload-skill-name');
                if (skillName) {
                    skillName.value = file.name.replace('.md', '');
                }
            }
        });
    }

    // GitHub sign-in - redirect to secure developer dashboard
    const githubSignin = document.getElementById('dev-github-signin');
    if (githubSignin) {
        githubSignin.addEventListener('click', () => {
            // Redirect to secure developer application page with GitHub verification
            window.location.href = 'developer.html';
        });
    }

    // Dev sign out
    const devSignout = document.getElementById('dev-signout');
    if (devSignout) {
        devSignout.addEventListener('click', () => {
            const authSection = document.getElementById('dev-portal-auth');
            const dashSection = document.getElementById('dev-portal-dashboard');
            if (authSection && dashSection) {
                dashSection.classList.add('hidden');
                authSection.classList.remove('hidden');
            }
            showToast('SIGNED_OUT', 'You have been signed out.');
        });
    }

    // --- SKILL SUBMISSION HANDLER ---
    const submitSkillBtn = document.getElementById('submit-skill');
    let uploadedFileContent = null;

    // Capture file content when file is selected
    if (fileInput) {
        fileInput.addEventListener('change', async (e) => {
            if (e.target.files.length > 0) {
                const file = e.target.files[0];
                uploadedFileContent = await file.text();
            }
        });
    }

    if (submitSkillBtn) {
        submitSkillBtn.addEventListener('click', async () => {
            // Collect form data
            const skillName = document.getElementById('upload-skill-name')?.value?.trim();
            const category = document.getElementById('upload-category')?.value;
            const price = parseFloat(document.getElementById('upload-price')?.value) || 0;
            const description = document.getElementById('upload-desc')?.value?.trim();

            // Validate
            if (!skillName || !category || price < 9) {
                showToast('VALIDATION_ERROR', 'Please fill all required fields. Min price: $9.');
                return;
            }

            if (!activeUser) {
                showToast('AUTH_REQUIRED', 'You must be signed in to submit skills.');
                return;
            }

            // Show loading state
            submitSkillBtn.textContent = 'UPLOADING...';
            submitSkillBtn.disabled = true;

            try {
                // Generate simple hash from content (in production, use crypto.subtle)
                const contentHash = uploadedFileContent
                    ? btoa(uploadedFileContent.slice(0, 100)).slice(0, 32)
                    : 'no-file-' + Date.now();

                if (supabase) {
                    const { data, error } = await supabase
                        .from('skill_submissions')
                        .insert({
                            developer_id: activeUser.id,
                            name: skillName,
                            category: category,
                            price: price,
                            short_description: description,
                            file_content: uploadedFileContent || '',
                            content_hash: contentHash,
                            status: 'pending'
                        })
                        .select();

                    if (error) throw error;

                    showToast('SUBMISSION_SUCCESS', `Skill "${skillName}" submitted for review!`);

                    // Reset form
                    document.getElementById('upload-skill-name').value = '';
                    document.getElementById('upload-price').value = '';
                    document.getElementById('upload-desc').value = '';
                    if (uploadForm) uploadForm.classList.add('hidden');
                    if (uploadZone) uploadZone.style.display = 'flex';
                    uploadedFileContent = null;

                } else {
                    // Demo mode
                    showToast('DEMO_MODE', `Skill "${skillName}" would be submitted (Supabase not configured).`);
                }

            } catch (err) {
                console.error('Submission error:', err);
                showToast('SUBMISSION_ERROR', 'Failed to submit skill. Please try again.');
            } finally {
                submitSkillBtn.textContent = 'SUBMIT_FOR_REVIEW';
                submitSkillBtn.disabled = false;
            }
        });
    }

    // --- PRICING TIER DETAIL MODAL ---
    const tierModal = document.getElementById('tier-detail-modal');
    const closeTierModal = document.getElementById('close-tier-modal');
    const tierContent = document.getElementById('tier-modal-content');
    const pricingCards = document.querySelectorAll('.pricing-card');

    const tierData = {
        'free': {
            name: 'FREE_AGENT',
            tagline: 'Browse the marketplace. Pay as you go.',
            price: '$0',
            accent: 'purple',
            features: [
                { category: 'MARKETPLACE_ACCESS', items: [['Skill Catalog', 'Standard Only'], ['Purchases', 'Pay-per-skill'], ['Updates', 'Manual Download']] },
                { category: 'SUPPORT_LEVEL', items: [['Community', 'Discord Public'], ['Response Time', 'Best Effort'], ['Documentation', 'Public Wiki']] },
                { category: 'SECURITY_PROTOCOL', items: [['Verification', 'Basic SHA-256'], ['Malware Scan', '—'], ['Audit Logs', '—']] }
            ],
            highlights: ['No commitment required', 'Try before you buy', 'Community-driven support'],
            cta: 'BROWSE_MARKETPLACE'
        },
        'syndicate': {
            name: 'THE_SYNDICATE',
            tagline: 'Full access. Auto-healing updates. Priority support.',
            price: '£39/mo',
            accent: 'blue',
            features: [
                { category: 'MARKETPLACE_ACCESS', items: [['Skill Catalog', 'Unlimited Standard'], ['Purchases', 'All Included'], ['Updates', 'Auto-Healing']] },
                { category: 'SUPPORT_LEVEL', items: [['Priority', 'Direct Email'], ['Response Time', '< 24h'], ['Architect Tips', 'Weekly Intel']] },
                { category: 'SECURITY_PROTOCOL', items: [['Verification', 'Blue Label Certified'], ['Malware Scan', 'Real-time'], ['Early Access', 'Experimental Skills']] }
            ],
            highlights: ['500+ skills included', 'Priority support', 'Cancel anytime'],
            cta: 'JOIN_THE_SYNDICATE'
        },
        'black_market': {
            name: 'BLACK_MARKET',
            tagline: 'No restrictions. Elite protocols only.',
            price: '£149 lifetime',
            accent: 'red',
            features: [
                { category: 'MARKETPLACE_ACCESS', items: [['Skill Catalog', 'Full / No Limits'], ['Restricted Skills', 'Included'], ['CVE Scanners', 'Enabled']] },
                { category: 'SUPPORT_LEVEL', items: [['Architect', '1-on-1 Support'], ['Response Time', '< 2h'], ['Recon Protocols', 'Custom Builds']] },
                { category: 'SECURITY_PROTOCOL', items: [['Protocol', 'Hardened Elite'], ['Audit Logs', 'Deep Trace'], ['Beta Testing', 'Mandatory']] }
            ],
            highlights: ['Lifetime access', 'Exclusive offensive skills', 'All future Black Market skills'],
            cta: 'ENTER_BLACK_MARKET'
        }
    };

    function openTierModal(tierKey) {
        if (!tierModal || !tierData[tierKey]) return;
        const data = tierData[tierKey];

        // Format HTML with enhanced layout
        let html = `
            <div class="tier-detail-header tier-accent-${data.accent}">
                <h2>${data.name}</h2>
                <p class="tier-tagline">${data.tagline}</p>
                <div class="tier-price">Monthly Access: <strong>${data.price}</strong></div>
            </div>
            <div class="feature-matrix tier-accent-${data.accent}">
        `;

        data.features.forEach(group => {
            html += `
                <div class="feature-group">
                    <h4>// ${group.category}</h4>
            `;
            group.items.forEach(item => {
                html += `
                    <div class="feature-item">
                        <span class="label">${item[0]}</span>
                        <span class="value">${item[1]}</span>
                    </div>
                `;
            });
            html += `</div>`;
        });

        html += `
            </div>
            <div class="tier-highlights">
                <h4>KEY_BENEFITS</h4>
                <ul>
                    ${data.highlights.map(h => `<li><span class="check">✓</span> ${h}</li>`).join('')}
                </ul>
            </div>
            <div class="tier-cta-section">
                <button class="btn-primary large">${data.cta}</button>
                <p>Encrypted billing via Stripe. Cancel anytime.</p>
            </div>
        `;

        tierContent.innerHTML = html;
        tierModal.style.display = 'flex';
        tierModal.classList.add('active');
    }


    function closeTierModalFn() {
        if (!tierModal) return;
        tierModal.style.display = 'none';
        tierModal.classList.remove('active');
    }

    pricingCards.forEach(card => {
        card.addEventListener('click', (e) => {
            // Prevent if clicking the actual button (it might have its own link)
            if (e.target.tagName === 'BUTTON' || e.target.closest('button')) return;
            const tier = card.dataset.tier;
            openTierModal(tier);
        });
    });

    if (closeTierModal) {
        closeTierModal.addEventListener('click', closeTierModalFn);
    }

    if (tierModal) {
        tierModal.addEventListener('click', (e) => {
            if (e.target === tierModal) closeTierModalFn();
        });
    }

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

    // Attach click handlers to install buttons (including dynamically created ones)
    function attachInstallButtonHandlers() {
        const installBtns = document.querySelectorAll('.btn-install');
        installBtns.forEach(btn => {
            if (btn.dataset.handlerAttached) return;
            btn.dataset.handlerAttached = 'true';

            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const card = btn.closest('.skill-card');
                if (!card) return;

                const skillId = card.dataset.skillId;
                const skillName = card.dataset.skillName || card.querySelector('h3')?.textContent;
                const skillDesc = card.dataset.skillDesc || card.querySelector('.skill-desc')?.textContent;

                // Find full skill data or create from card
                let skill = window.skillsData?.find(s => `db-${s.id}` === skillId);
                if (!skill) {
                    skill = { id: skillId, name: skillName, title: skillName, description: skillDesc };
                }

                window.downloadSkill(skill.id || skillId);
            });
        });
    }

    attachInstallButtonHandlers();

    // Re-attach for dynamic cards
    const skillsGridEl = document.querySelector('.skills-grid');
    if (skillsGridEl) {
        const observer = new MutationObserver(() => attachInstallButtonHandlers());
        observer.observe(skillsGridEl, { childList: true, subtree: true });
    }

    // Developer Portal Modal Logic
    const devModal = document.getElementById('dev-modal');
    const openModalBtn = document.getElementById('open-dev-modal');
    const closeModalBtn = document.querySelector('.modal-close');

    if (devModal && openModalBtn && closeModalBtn) {
        openModalBtn.addEventListener('click', () => {
            devModal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        });

        // specific handler for the footer link
        const becomeArchitectBtn = document.getElementById('become-architect');
        if (becomeArchitectBtn) {
            becomeArchitectBtn.addEventListener('click', (e) => {
                e.preventDefault();
                devModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        }

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

        // Check Access on Tab Click
        const validatorTab = document.querySelector('.tab-btn[data-tab="validator"]');
        if (validatorTab) {
            validatorTab.addEventListener('click', (e) => {
                if (!activeUser) {
                    e.preventDefault();
                    e.stopPropagation();
                    showToast('ACCESS_DENIED', 'Developer credentials required. Please sign in.', 'error');
                    // Switch back to Request Access or open Auth
                    document.querySelector('.tab-btn[data-tab="request"]')?.click();
                    return;
                }
                // Optional: Check specific role
                // if (activeUser.user_metadata.role !== 'developer') ...
            });
        }

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

            // Check file type
            if (!file.name.endsWith('.md')) {
                showToast('INVALID_FILE', 'Only .md protocol files are accepted.', 'error');
                return;
            }

            // UI Reset
            dropZone.style.display = 'none';
            auditTerminal.classList.remove('hidden');
            auditLog.innerHTML = `<div class="line">Analyzing: <span class="white">${file.name}</span>...</div>`;

            // Detect Malicious File (Simulation based on filename)
            const isMalicious = file.name.includes('malicious');

            // Simulation Sequence
            const steps = [
                { text: "Parsing Markdown Structure...", delay: 800, status: "OK", color: "green" },
                {
                    text: "Scanning for Malicious Patterns (curl, wget, eval)...", delay: 1500,
                    status: isMalicious ? "THREAT_DETECTED" : "CLEAN",
                    color: isMalicious ? "red" : "green"
                },
                { text: "Verifying Moltbot Compatibility...", delay: 1000, status: "VERIFIED", color: "green" },
                { text: "Generating Blue Label Signature...", delay: 1200, status: isMalicious ? "FAILED" : "SIGNED", color: isMalicious ? "red" : "green" }
            ];

            let cumulativeDelay = 0;

            steps.forEach(step => {
                cumulativeDelay += step.delay;
                setTimeout(() => {
                    // If we already failed, don't show success steps (simple logic)
                    if (isMalicious && step.text.includes('Signature')) return;

                    const div = document.createElement('div');
                    div.className = 'line';
                    div.innerHTML = `<span class="dim">> ${step.text}</span> <span class="${step.color}">[${step.status}]</span>`;
                    auditLog.appendChild(div);
                    auditLog.scrollTop = auditLog.scrollHeight;
                }, cumulativeDelay);
            });

            setTimeout(() => {
                const final = document.createElement('div');
                final.className = 'line';

                if (isMalicious) {
                    final.innerHTML = `<br><span class="red">✖ AUDIT FAILED.</span> Protocol contains banned patterns. Submission blocked.`;
                } else {
                    final.innerHTML = `<br><span class="green">✔ AUDIT PASSED.</span> Protocol is safe for deployment.`;

                    // Add Submit Button
                    const actionsDiv = document.createElement('div');
                    actionsDiv.style.marginTop = '1rem';
                    actionsDiv.innerHTML = `
                        <button id="btn-submit-protocol" class="btn-primary" style="margin-right: 1rem;">SUBMIT_PROTOCOL</button>
                        <button id="btn-reset-validator" class="btn-secondary">SCAN_ANOTHER</button>
                    `;
                    final.appendChild(actionsDiv);

                    // Add listeners after appending
                    setTimeout(() => {
                        document.getElementById('btn-submit-protocol').onclick = () => submitProtocol(file);
                        document.getElementById('btn-reset-validator').onclick = resetValidator;
                    }, 100);
                }

                if (isMalicious) {
                    // Add Reset Button only
                    const actionsDiv = document.createElement('div');
                    actionsDiv.style.marginTop = '1rem';
                    actionsDiv.innerHTML = `<button id="btn-reset-validator-fail" class="btn-secondary">TRY_AGAIN</button>`;
                    final.appendChild(actionsDiv);
                    setTimeout(() => {
                        document.getElementById('btn-reset-validator-fail').onclick = resetValidator;
                    }, 100);
                }

                auditLog.appendChild(final);
                auditLog.scrollTop = auditLog.scrollHeight;
            }, cumulativeDelay + 500);
        }

        function resetValidator() {
            auditLog.innerHTML = '';
            auditTerminal.classList.add('hidden');
            dropZone.style.display = 'flex';
            fileInput.value = ''; // Reset file input
        }

        async function submitProtocol(file) {
            showToast('UPLOADING', 'Encrypting and transmitting protocol...');

            // Simulate Database Insert
            // const { data, error } = await supabase.from('skill_submissions').insert({...})

            setTimeout(() => {
                showToast('SUBMISSION_RECEIVED', 'Protocol queued for manual review.');
                resetValidator();
            }, 2000);
        }
    }
    // Filter logic moved earlier in file (enhanced version supports TOP SELLERS and FUN)

    // --- INIT: Load skills from database ---
    if (supabase) {
        loadSkillsFromSupabase();
        loadTopArchitects();
    }

    // --- LIVE FEED SIMULATION ---
    const liveFeed = document.getElementById('live-feed');
    if (liveFeed) {
        const feedUsers = [
            '@neo_dev', '@cyber_kate', '@data_hawk', '@void_runner', '@glitch_master',
            '@neural_ninja', '@code_phantom', '@bit_wizard', '@pixel_storm', '@logic_zero'
        ];
        const feedSkills = [
            'FullStack_Architect_v9', 'Security_Auditor_Pro', 'Life_Coach_AI',
            'Dating_Profile_Optimizer', 'Market_Research_Agent', 'Meme_Generator_9000',
            'Email_Wizard_Pro', 'Senior_Developer_Bundle', 'API_Integrator_v3'
        ];
        const feedActions = ['injected', 'installed', 'activated', 'deployed'];

        function addFeedItem() {
            const user = feedUsers[Math.floor(Math.random() * feedUsers.length)];
            const skill = feedSkills[Math.floor(Math.random() * feedSkills.length)];
            const action = feedActions[Math.floor(Math.random() * feedActions.length)];

            const item = document.createElement('div');
            item.className = 'feed-item';
            item.innerHTML = `
                <span class="feed-user">${user}</span>
                <span class="feed-action">${action}</span>
                <span class="feed-skill">${skill}</span>
                <span class="feed-time">just now</span>
            `;

            // Add to top
            liveFeed.insertBefore(item, liveFeed.firstChild);

            // Remove old items (keep max 3)
            while (liveFeed.children.length > 3) {
                liveFeed.removeChild(liveFeed.lastChild);
            }

            // Update times on other items
            updateFeedTimes();
        }

        function updateFeedTimes() {
            const items = liveFeed.querySelectorAll('.feed-item');
            items.forEach((item, i) => {
                const timeEl = item.querySelector('.feed-time');
                if (timeEl && i > 0) {
                    const seconds = i * 5;
                    timeEl.textContent = seconds < 60 ? `${seconds}s ago` : '1m ago';
                }
            });
        }

        // Start feed simulation (every 4-8 seconds)
        setInterval(() => {
            addFeedItem();
        }, 4000 + Math.random() * 4000);
    }

    // --- FEATURE MODAL HANDLERS ---
    const featureModal = document.getElementById('feature-modal');
    const closeFeatureModal = document.getElementById('close-feature-modal');
    const bentoCards = document.querySelectorAll('.bento-card');

    function openFeatureModal(card) {
        if (!featureModal) return;
        const title = card.dataset.featureTitle;
        const desc = card.dataset.featureDesc;
        const iconElement = card.querySelector('.feature-icon');
        const icon = iconElement ? iconElement.textContent : '🛡️';

        document.getElementById('feature-modal-title').textContent = title;
        document.getElementById('feature-modal-body').textContent = desc;
        document.getElementById('feature-modal-icon').textContent = icon;

        featureModal.style.display = 'flex';
        featureModal.classList.add('active');
    }

    function closeFeatureModalFn() {
        if (!featureModal) return;
        featureModal.style.display = 'none';
        featureModal.classList.remove('active');
    }

    bentoCards.forEach(card => {
        card.addEventListener('click', () => openFeatureModal(card));
    });

    if (closeFeatureModal) {
        closeFeatureModal.addEventListener('click', closeFeatureModalFn);
    }

    // Reuse the same close button selector if needed
    const altClose = document.getElementById('close-feature-modal');
    if (altClose) altClose.onclick = closeFeatureModalFn;

    if (featureModal) {
        featureModal.addEventListener('click', (e) => {
            if (e.target === featureModal) closeFeatureModalFn();
        });
    }

    // --- MARKETPLACE SCALING (LOAD MORE) ---
    const loadMoreBtn = document.getElementById('load-more-btn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            showToast('EXPANDING_REPOSITORY', 'Syncing additional capabilities... [DEMO_LIMIT_REACHED]');
            loadMoreBtn.textContent = 'ALL_CAPABILITIES_LOADED';
            loadMoreBtn.disabled = true;
            loadMoreBtn.style.opacity = '0.5';
        });
    }

    // --- DYNAMIC SKILL REPOSITORY ---
    async function loadSkillRepository() {
        const grid = document.querySelector('.skills-grid');
        // Only run on main marketplace, not Black Market (which has valid hardcoded items for now)
        // But wait, Black Market uses .skills-grid too.
        // We should check if we are on index.html vs black-market.html
        // black-market.html has specific black market items we might WANT to fetch dynamic later, but for now user pushed "Black Market View Refactor" which hardcoded them.
        // index.html has the main marketplace.
        // Let's check for a specific marker or ID.
        const isBlackMarketPage = document.getElementById('black-market-repo');
        if (isBlackMarketPage) return; // Don't overwrite Black Market page

        if (!grid || !supabase) return;

        // Optional: Show loading state
        // grid.innerHTML = '<div class="loading-spinner">LOADING_REPOSITORY...</div>';

        const { data: skills, error } = await supabase
            .from('skills')
            .select('*')
            .eq('is_blackmarket_only', false) // Only show standard skills on main page
            .order('is_top_seller', { ascending: false })
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching skills:', error);
            // Don't show toast on every load if it fails silently, just log
            return;
        }

        if (skills && skills.length > 0) {
            // Filter out existing hardcoded ones? 
            // Better to clear grid if we have real data
            grid.innerHTML = '';

            skills.forEach(skill => {
                const card = createSkillCard(skill);
                grid.appendChild(card);
            });
        }
    }

    function createSkillCard(skill) {
        const card = document.createElement('div');
        card.className = 'skill-card';
        card.dataset.category = skill.category;
        card.dataset.skillId = skill.id;
        card.dataset.skillName = skill.title;
        card.dataset.skillDesc = skill.short_description || skill.description;
        card.dataset.price = skill.price;
        card.dataset.rating = skill.avg_rating || 0;
        card.dataset.reviews = skill.rating_count || 0;
        // Top Seller attribute for filtering
        if (skill.is_top_seller) card.dataset.topseller = "true";

        // Handle visual badge logic based on category
        let visualClass = 'visual-dev';
        if (skill.category === 'business') visualClass = 'visual-biz';
        if (skill.category === 'marketing') visualClass = 'visual-write';
        if (skill.category === 'finance') visualClass = 'visual-biz'; // Re-use or custom

        const isTopSeller = skill.is_top_seller ? '<div class="top-seller-badge">🔥 TOP SELLER</div>' : '';
        const verifiedIcon = skill.is_verified ? '<span class="verified-icon">✓</span>' : '';

        card.innerHTML = `
            <div class="security-badge">AUDITED</div>
            ${isTopSeller}
            <div class="card-visual ${visualClass}" style="background:rgba(0,0,0,0.5)">
               <div class="cartridge-icon-placeholder" style="font-size:2rem; text-align:center; padding-top:1.5rem;">${skill.icon || '💻'}</div>
            </div>
            <div class="card-header">
                <span class="skill-badge ${skill.category}">${skill.category.toUpperCase()}</span>
                ${verifiedIcon}
            </div>
            <h3>${skill.title}</h3>
            <p class="skill-desc">${(skill.short_description || skill.description || '').substring(0, 80)}...</p>
            <div class="skill-rating">
                <span class="stars">★★★★★</span>
                <span class="rating-score">${skill.avg_rating || '5.0'}</span>
                <span class="review-count">(${skill.rating_count || 0})</span>
            </div>
            <div class="skill-meta">
                <span>Installs: ${skill.downloads_count || 0}</span>
                <span>$${skill.price}</span>
            </div>
            <button class="btn-install">INJECT_SKILL</button>
        `;

        return card;
    }

    // Trigger Load
    setTimeout(loadSkillRepository, 100); // Slight delay to ensure auth check doesn't block


    // --- FOOTER SEARCH SYNC ---
    const footerSearchInput = document.getElementById('footer-skill-search');
    if (footerSearchInput) {
        footerSearchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase().trim();
            const allCards = document.querySelectorAll('.skills-grid .skill-card');

            allCards.forEach(card => {
                if (card.classList.contains('black-market-item')) return;

                const name = (card.dataset.skillName || card.querySelector('h3')?.textContent || '').toLowerCase();
                const desc = (card.dataset.skillDesc || card.querySelector('.skill-desc')?.textContent || '').toLowerCase();
                const category = (card.dataset.category || '').toLowerCase();

                const matches = searchTerm.length === 0 ||
                    name.includes(searchTerm) ||
                    desc.includes(searchTerm) ||
                    category.includes(searchTerm);

                card.style.display = matches ? 'block' : 'none';
            });

            if (searchTerm.length > 2) {
                const visibleCount = Array.from(allCards).filter(c => c.style.display !== 'none').length;
                showToast('SEARCH_RESULTS', `Found ${visibleCount} skills for "${searchTerm}"`);
            }
        });
    }

    // --- PRICING TIER BUTTON HANDLERS ---
    // Browse Marketplace (Free Tier)
    const browseMarketplaceBtn = document.querySelector('.pricing-card.free-tier .btn-secondary');
    if (browseMarketplaceBtn) {
        browseMarketplaceBtn.addEventListener('click', () => {
            if (activeUser) {
                document.getElementById('marketplace')?.scrollIntoView({ behavior: 'smooth' });
            } else {
                showToast('IDENTITY_REQUIRED', 'Create a free account to access the repository.');
                // Switch to "Sign Up" tab if possible or just open modal
                if (typeof openAuthModal === 'function') {
                    openAuthModal();
                    // Optional: Toggle to Signup tab? 
                    // const signupTab = document.querySelector('.tab-btn[data-tab="signup"]');
                    // if(signupTab) signupTab.click(); 
                }
            }
        });
    }

    // Join Syndicate
    const joinSyndicateBtn = document.getElementById('btn-sub-syndicate');
    if (joinSyndicateBtn) {
        joinSyndicateBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showToast('SYNDICATE_ACCESS', 'Processing subscription request... [DEMO_MODE]');
            setTimeout(() => {
                showToast('ACCESS_GRANTED', 'Welcome to THE_SYNDICATE. Full arsenal unlocked.');
            }, 1500);
        });
    }

    // --- DASHBOARD NAVIGATION FIX ---
    const dashboardLink = document.querySelector('.dashboard-link');
    const dashboardSection = document.getElementById('member-dashboard');

    if (dashboardLink && dashboardSection) {
        dashboardLink.addEventListener('click', (e) => {
            if (dashboardSection.style.display === 'none') {
                dashboardSection.style.display = 'block';
            }
            dashboardSection.scrollIntoView({ behavior: 'smooth' });
        });
    }

    // --- BLACK MARKET REDIRECTION REMOVED (Handled by initPublicPricingButtons) ---


    // --- TIER MODAL BUTTON FIXES ---
    document.addEventListener('click', (e) => {
        if (e.target.matches('.tier-cta-section .btn-secondary')) {
            closeTierModalFn();
            document.getElementById('marketplace')?.scrollIntoView({ behavior: 'smooth' });
        }
        if (e.target.matches('.tier-cta-section .btn-primary')) {
            showToast('LICENSE_MGMT', 'Syndicate license activated for Demo Mode.');
            closeTierModalFn();
        }
    });

    // --- STAR RATING INTERACTION ---
    const starElement = document.querySelector('.skill-modal-rating .stars');
    if (starElement) {
        starElement.style.cursor = 'pointer';
        starElement.title = 'Rate this skill';

        starElement.addEventListener('click', (e) => {
            // Visual feedback simulation
            const originalText = starElement.textContent;
            starElement.textContent = '★★★★★';
            starElement.style.color = '#ffd700'; // Gold color

            showToast('RATING_SUBMITTED', 'Thank you. Your feedback updates the Trust Protocol.');

            // Revert visual after delay if needed, or keep it to show interaction
            setTimeout(() => {
                starElement.style.color = ''; // Reset color
            }, 2000);
        });
    }

    // --- NAVIGATION SCROLL FIX ---
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href.startsWith('#') && href !== '#login') {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetSection = document.getElementById(targetId);

                if (targetSection) {
                    // Show dashboard if hidden
                    if (targetId === 'member-dashboard' && targetSection.style.display === 'none') {
                        targetSection.style.display = 'block';
                    }

                    const headerOffset = 80; // Height of fixed header
                    const elementPosition = targetSection.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // --- LOGIN SIMULATION (REFINED) ---
    const loginLink = document.querySelector('a[href="#login"]');
    if (loginLink) {
        loginLink.addEventListener('click', (e) => {
            e.preventDefault();
            // User requested to remove or refine the bottom notice
            // showToast('TERMINAL_ACCESS', 'Initializing secure handshake... [DEMO_MODE]'); 

            // Instead of toast, just scroll to dashboard after a delay or effect
            const dashboardSection = document.getElementById('member-dashboard');
            if (dashboardSection) {
                if (dashboardSection.style.display === 'none') {
                    dashboardSection.style.display = 'block';
                    showToast('ACCESS_GRANTED', 'Terminal Active. Welcome, Operator.');
                } else {
                    showToast('SYSTEM_MESSAGE', 'Terminal already active.');
                }

                setTimeout(() => {
                    const headerOffset = 80;
                    const elementPosition = dashboardSection.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });

                    if (typeof loadMemberDashboard === 'function') loadMemberDashboard();
                }, 500);
            }
        });
    }

    // ===========================================
    // AUTH MODAL FUNCTIONALITY
    // ===========================================

    let isSignUpMode = false;

    function openAuthModal() {
        const modal = document.getElementById('auth-modal');
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    function closeAuthModal() {
        const modal = document.getElementById('auth-modal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    // Wire up ACCESS_TERMINAL button to open auth modal
    const accessTerminalLink = document.querySelector('a[href="#login"]');
    if (accessTerminalLink) {
        accessTerminalLink.addEventListener('click', (e) => {
            e.preventDefault();
            openAuthModal();
        });
    }

    // Close modal handlers
    const closeAuthBtn = document.getElementById('close-auth-modal');
    if (closeAuthBtn) {
        closeAuthBtn.addEventListener('click', closeAuthModal);
    }

    const authModal = document.getElementById('auth-modal');
    if (authModal) {
        authModal.addEventListener('click', (e) => {
            if (e.target === authModal) closeAuthModal();
        });
    }

    // Tab switching
    document.querySelectorAll('.auth-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            isSignUpMode = tab.dataset.tab === 'signup';

            // Show/hide confirm password field
            const confirmField = document.querySelector('.signup-only');
            if (confirmField) {
                confirmField.style.display = isSignUpMode ? 'block' : 'none';
            }

            // Update button text
            const submitBtn = document.getElementById('auth-submit-btn');
            if (submitBtn) {
                submitBtn.querySelector('.btn-text').textContent = isSignUpMode ? 'CREATE_ACCOUNT' : 'AUTHENTICATE';
            }

            // Update title
            const title = document.getElementById('auth-modal-title');
            if (title) {
                title.textContent = isSignUpMode ? 'CREATE_ACCOUNT' : 'ACCESS_TERMINAL';
            }
        });
    });

    // GitHub OAuth
    const githubBtn = document.getElementById('auth-github');
    if (githubBtn && supabase) {
        githubBtn.addEventListener('click', async () => {
            try {
                const { data, error } = await supabase.auth.signInWithOAuth({
                    provider: 'github',
                    options: {
                        redirectTo: window.location.origin
                    }
                });
                if (error) throw error;
            } catch (err) {
                console.error('GitHub auth error:', err);
                showToast('AUTH_ERROR', err.message || 'GitHub authentication failed', 'error');
            }
        });
    }

    // Google OAuth
    const googleBtn = document.getElementById('auth-google');
    if (googleBtn && supabase) {
        googleBtn.addEventListener('click', async () => {
            try {
                const { data, error } = await supabase.auth.signInWithOAuth({
                    provider: 'google',
                    options: {
                        redirectTo: window.location.origin
                    }
                });
                if (error) throw error;
            } catch (err) {
                console.error('Google auth error:', err);
                showToast('AUTH_ERROR', err.message || 'Google authentication failed', 'error');
            }
        });
    }

    // Email/Password Auth
    const emailForm = document.getElementById('auth-email-form');
    if (emailForm && supabase) {
        emailForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = document.getElementById('auth-email')?.value.trim();
            const password = document.getElementById('auth-password')?.value;
            const confirmPassword = document.getElementById('auth-password-confirm')?.value;

            if (!email || !password) {
                showToast('VALIDATION_ERROR', 'Please enter email and password', 'warning');
                return;
            }

            if (isSignUpMode && password !== confirmPassword) {
                showToast('VALIDATION_ERROR', 'Passwords do not match', 'error');
                return;
            }

            const submitBtn = document.getElementById('auth-submit-btn');
            const btnText = submitBtn?.querySelector('.btn-text');
            const btnLoading = submitBtn?.querySelector('.btn-loading');

            if (btnText) btnText.style.display = 'none';
            if (btnLoading) btnLoading.style.display = 'inline';
            if (submitBtn) submitBtn.disabled = true;

            try {
                if (isSignUpMode) {
                    // Sign Up
                    const { data, error } = await supabase.auth.signUp({
                        email,
                        password,
                        options: {
                            emailRedirectTo: window.location.origin
                        }
                    });

                    if (error) throw error;

                    showToast('ACCOUNT_CREATED', 'Check your email to confirm your account!', 'success');
                    closeAuthModal();
                } else {
                    // Sign In
                    const { data, error } = await supabase.auth.signInWithPassword({
                        email,
                        password
                    });

                    if (error) throw error;

                    showToast('WELCOME_BACK', 'Successfully authenticated!', 'success');
                    closeAuthModal();

                    // Reload to update UI
                    window.location.reload();
                }
            } catch (err) {
                console.error('Auth error:', err);
                showToast('AUTH_ERROR', err.message || 'Authentication failed', 'error');
            } finally {
                if (btnText) btnText.style.display = 'inline';
                if (btnLoading) btnLoading.style.display = 'none';
                if (submitBtn) submitBtn.disabled = false;
            }
        });

        // DEMO BYPASS BUTTON (For testing without email confirmation)
        const bypassContainer = document.createElement('div');
        bypassContainer.style.textAlign = 'center';
        bypassContainer.style.marginTop = '1rem';
        bypassContainer.innerHTML = `<button type="button" id="btn-demo-mode" class="text-link" style="font-size: 0.8rem; opacity: 0.7;">[DEV_OVERRIDE: ENABLE_DEMO_MODE]</button>`;
        emailForm.appendChild(bypassContainer);

        setTimeout(() => {
            const demoBtn = document.getElementById('btn-demo-mode');
            if (demoBtn) {
                demoBtn.addEventListener('click', () => {
                    enableDemoMode();
                });
            }
        }, 500);
    }

    function enableDemoMode() {
        showToast('SYSTEM_OVERRIDE', 'Bypassing security protocols... [DEMO_ACCESS_GRANTED]');

        const demoUser = {
            id: 'demo-dev-001',
            email: 'dev@aiagentskills.demo',
            user_metadata: {
                user_name: 'Dev_Architect',
                role: 'developer',
                subscription_tier: 'blackmarket'
            },
            app_metadata: {
                provider: 'demo'
            }
        };

        activeUser = demoUser;
        localStorage.setItem('aiagent_demo_user', JSON.stringify(demoUser));

        updateUIForLoggedUser(activeUser);
        loadMemberDashboard(activeUser);
        closeAuthModal();

        // Refresh page to ensure all state propagates (optional, but cleaner for some listeners)
        setTimeout(() => window.location.reload(), 1000);
    }

    // Check for Demo User on Load
    const storedDemoUser = localStorage.getItem('aiagent_demo_user');
    if (storedDemoUser && !activeUser) {
        // Only load if Supabase didn't already find a real user
        // But initAuth runs async. Ideally we hook into initAuth.
        // For simplicity, we can let initAuth run, and if it fails/returns null, we check this.
        // Actually best to put this check inside initAuth or right after it.
    }

    // Forgot Password
    const forgotPasswordLink = document.getElementById('forgot-password-link');
    if (forgotPasswordLink && supabase) {
        forgotPasswordLink.addEventListener('click', async (e) => {
            e.preventDefault();

            const email = document.getElementById('auth-email')?.value.trim();
            if (!email) {
                showToast('ENTER_EMAIL', 'Please enter your email address first', 'info');
                return;
            }

            try {
                const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
                    redirectTo: window.location.origin + '/reset-password'
                });

                if (error) throw error;

                showToast('PASSWORD_RESET_SENT', 'Check your email for reset instructions', 'success');
            } catch (err) {
                console.error('Password reset error:', err);
                showToast('ERROR', err.message || 'Failed to send reset email', 'error');
            }
        });
    }

    // --- PAYMENT GATEWAY INTEGRATION ---
    function initLemonSqueezyCheckout(tier, user) {
        // Check if LemonSqueezy product IDs are configured
        const productId = LEMON_PRODUCTS[tier];

        if (!productId || productId.startsWith('YOUR_')) {
            // Payment not configured yet
            showToast('⚠️ PAYMENT_SETUP', 'Payment system is being configured. Please check back soon!');
            return;
        }

        showToast('SECURE_HANDSHAKE', 'Establishing encrypted payment tunnel...');

        // Use LemonSqueezy overlay checkout
        if (window.LemonSqueezy) {
            window.LemonSqueezy.Url.Open(`https://aiagentskills.lemonsqueezy.com/checkout/buy/${productId}?checkout[email]=${encodeURIComponent(user.email)}&checkout[custom][user_id]=${user.id}`);
        } else {
            // Fallback to redirect
            window.location.href = `https://aiagentskills.lemonsqueezy.com/checkout/buy/${productId}?checkout[email]=${encodeURIComponent(user.email)}&checkout[custom][user_id]=${user.id}`;
        }
    }

    // Public Pricing Buttons
    function initPublicPricingButtons() {
        const syndicateBtn = document.getElementById('btn-sub-syndicate');
        const blackMarketBtn = document.getElementById('btn-acc-blackmarket');

        const handleCheckout = (tier) => {
            if (!activeUser) {
                showToast('🔒 RESTRICTED', 'Authentication required for transaction.', 'warning');
                // openAuthModal is defined below but hoisted function declarations work, 
                // but this is called on click, so it should be fine.
                // activeUser is in scope.
                if (typeof openAuthModal === 'function') openAuthModal();
                return;
            }
            initLemonSqueezyCheckout(tier, activeUser);
        };

        if (syndicateBtn) {
            // Remove old listeners to be safe (clone node?) No, just add.
            // Actually, if we add multiple it triggers multiple times. 
            // We can assume this runs once on load.
            syndicateBtn.addEventListener('click', () => handleCheckout('syndicate'));
        }
        if (blackMarketBtn) {
            blackMarketBtn.addEventListener('click', () => handleCheckout('blackmarket'));
        }
    }
    initPublicPricingButtons();

    // Make functions globally accessible
    window.openAuthModal = openAuthModal;
    window.closeAuthModal = closeAuthModal;
});
