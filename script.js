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

    const SUPABASE_URL = 'https://dpcxdsxtaujmclmahvk.supabase.co';
    const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRwY3J4ZHN4dGF1am1jbG1haHZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2MjI1NzEsImV4cCI6MjA4NTE5ODU3MX0.FJTvbP3WK6-pX8e37fxq8-a_juG7Hg04gZVa00rNGZk';

    // Initialize Supabase (Global access)
    const supabase = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY) : null;

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

    // --- TOAST NOTIFICATION HELPER ---
    function showToast(title, message) {
        const existing = document.querySelector('.system-toast');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.className = 'system-toast';
        toast.innerHTML = `<strong>${title}</strong><span>${message}</span>`;
        document.body.appendChild(toast);

        setTimeout(() => toast.classList.add('visible'), 100);
        setTimeout(() => {
            toast.classList.remove('visible');
            setTimeout(() => toast.remove(), 300);
        }, 4000);
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

                    card.style.display = shouldShow ? 'flex' : 'none';
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
            console.log('User signed in:', session.user);
            activeUser = session.user;
            updateUIForLoggedUser(activeUser);
            loadMemberDashboard(activeUser); // New: Load dashboard
        }

        // Listen for auth changes
        supabase.auth.onAuthStateChange((_event, session) => {
            activeUser = session ? session.user : null;
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

    // --- MEMBER DASHBOARD LOGIC ---
    async function loadMemberDashboard(user) {
        const dashboard = document.getElementById('member-dashboard');
        if (!dashboard) return;

        // Show dashboard
        dashboard.style.display = 'block';

        // Get DOM elements
        const licenseStat = document.querySelector('.dash-card:nth-child(1) .big-stat');
        const savingsStat = document.querySelector('.dash-card:nth-child(2) .big-stat');
        const syncStatus = document.querySelector('.status-indicator');

        // Set loading state
        if (licenseStat) licenseStat.textContent = '...';
        if (savingsStat) savingsStat.textContent = '...';

        try {
            if (supabase) {
                // Fetch user's purchases from Supabase
                const { data: purchases, error } = await supabase
                    .from('skill_purchases')
                    .select('id, amount, skill_id, created_at')
                    .eq('buyer_id', user.id)
                    .eq('status', 'completed');

                if (error) {
                    console.error('Error fetching purchases:', error);
                    throw error;
                }

                // Calculate stats
                const licenseCount = purchases?.length || 0;
                const totalSpent = purchases?.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0) || 0;
                // Assume each skill saves ~$200 (industry value) vs our price
                const estimatedSavings = licenseCount * 200 - totalSpent;

                // Update UI
                if (licenseStat) licenseStat.textContent = String(licenseCount).padStart(2, '0');
                if (savingsStat) savingsStat.textContent = `$${Math.max(0, estimatedSavings).toLocaleString()}`;
                if (syncStatus) {
                    syncStatus.textContent = 'ONLINE';
                    syncStatus.classList.add('online');
                }
            }
        } catch (err) {
            console.error('Dashboard load error:', err);
            // Fallback to demo data
            if (licenseStat) licenseStat.textContent = '03';
            if (savingsStat) savingsStat.textContent = '$2,400';
            if (syncStatus) {
                syncStatus.textContent = 'DEMO_MODE';
                syncStatus.classList.remove('online');
            }
        }

        // Unlock download buttons for purchased skills
        document.querySelectorAll('.btn-buy').forEach(btn => {
            btn.textContent = 'DOWNLOAD_ACCESS_GRANTED';
            btn.classList.add('unlocked');
            btn.onclick = (e) => {
                e.preventDefault();
                showToast('SECURE_DOWNLOAD', 'Initiating encrypted skill transfer...');
            };
        });
    }

    function hideMemberDashboard() {
        const dashboard = document.getElementById('member-dashboard');
        if (dashboard) dashboard.style.display = 'none';
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
                console.log("Time Warp Visuals Triggered");
                // 1. Trigger Time Warp Visuals
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
        });
    }

    if (manifestoBecomeDev) {
        manifestoBecomeDev.addEventListener('click', () => {
            closeManifestoModal();
            const devModal = document.getElementById('open-dev-modal');
            if (devModal) devModal.click();
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

        // Show modal
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

                card.style.display = shouldShow ? 'flex' : 'none';
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

                card.style.display = matches ? 'flex' : 'none';
            });

            // Show toast for feedback
            if (searchTerm.length > 2) {
                const visibleCount = document.querySelectorAll('.skill-card[style*="flex"]').length;
                showToast('SEARCH_RESULTS', `Found ${visibleCount} skills matching "${searchTerm}"`);
            }
        });
    }

    // --- DEVELOPER PORTAL MODAL HANDLERS ---
    const devPortalModal = document.getElementById('dev-portal-modal');
    const openDevPortal = document.getElementById('open-dev-modal');
    const closeDevPortal = document.getElementById('close-dev-portal');
    const devTabs = document.querySelectorAll('.dev-tab');
    const devTabContents = document.querySelectorAll('.dev-tab-content');

    function openDevPortalModal() {
        if (!devPortalModal) return;
        devPortalModal.style.display = 'flex';
        devPortalModal.classList.add('active');
    }

    function closeDevPortalModal() {
        if (!devPortalModal) return;
        devPortalModal.style.display = 'none';
        devPortalModal.classList.remove('active');
    }

    // Open from button
    if (openDevPortal) {
        openDevPortal.addEventListener('click', openDevPortalModal);
    }

    // Close button
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
            openDevPortalModal();
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

    // GitHub sign-in (placeholder - would connect to real OAuth)
    const githubSignin = document.getElementById('dev-github-signin');
    if (githubSignin) {
        githubSignin.addEventListener('click', () => {
            showToast('GITHUB_AUTH', 'Redirecting to GitHub for authentication...');
            // In production, this would redirect to GitHub OAuth
            // For demo, we can simulate login
            setTimeout(() => {
                const authSection = document.getElementById('dev-portal-auth');
                const dashSection = document.getElementById('dev-portal-dashboard');
                if (authSection && dashSection) {
                    authSection.classList.add('hidden');
                    dashSection.classList.remove('hidden');
                }
                showToast('AUTH_SUCCESS', 'Welcome back, Architect!');
            }, 1500);
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
            price: '$39/mo',
            accent: 'blue',
            features: [
                { category: 'MARKETPLACE_ACCESS', items: [['Skill Catalog', 'Unlimited Standard'], ['Purchases', 'All Included'], ['Updates', 'Auto-Healing']] },
                { category: 'SUPPORT_LEVEL', items: [['Priority', 'Direct Email'], ['Response Time', '< 24h'], ['Architect Tips', 'Weekly Intel']] },
                { category: 'SECURITY_PROTOCOL', items: [['Verification', 'Blue Label Certified'], ['Malware Scan', 'Real-time'], ['Early Access', 'Experimental Skills']] }
            ],
            highlights: ['500+ skills included', '20% OFF Black Market purchases', 'Cancel anytime'],
            cta: 'JOIN_THE_SYNDICATE'
        },
        'black_market': {
            name: 'BLACK_MARKET',
            tagline: 'No restrictions. Elite protocols only.',
            price: '$99/mo',
            accent: 'red',
            features: [
                { category: 'MARKETPLACE_ACCESS', items: [['Skill Catalog', 'Full / No Limits'], ['Restricted Skills', 'Included'], ['CVE Scanners', 'Enabled']] },
                { category: 'SUPPORT_LEVEL', items: [['Architect', '1-on-1 Support'], ['Response Time', '< 2h'], ['Recon Protocols', 'Custom Builds']] },
                { category: 'SECURITY_PROTOCOL', items: [['Protocol', 'Hardened Elite'], ['Audit Logs', 'Deep Trace'], ['Beta Testing', 'Mandatory']] }
            ],
            highlights: ['Competitor intel tools', 'Exclusive offensive skills', '1-on-1 onboarding call'],
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
    // Filter logic moved earlier in file (enhanced version supports TOP SELLERS and FUN)

    // --- INIT: Load skills from database ---
    if (supabase) {
        loadSkillsFromSupabase();
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

                card.style.display = matches ? 'flex' : 'none';
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
            document.getElementById('marketplace')?.scrollIntoView({ behavior: 'smooth' });
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

    // --- BLACK MARKET REDIRECTION ---
    const blackMarketBtn = document.getElementById('btn-acc-blackmarket');
    if (blackMarketBtn) {
        blackMarketBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showToast('SECURE_HANDSHAKE', 'Redirecting to restricted repository Layer...');
            setTimeout(() => {
                window.location.href = 'black-market.html';
            }, 1000);
        });
    }

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
});
