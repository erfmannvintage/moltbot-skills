// ==========================================
// PHASE 1: RBAC INTEGRATION
// Moltbot Skills Marketplace
// Additive only - wraps existing functionality
// ==========================================

document.addEventListener('DOMContentLoaded', async () => {
    // Wait 100ms for script.js to finish initializing
    await new Promise(resolve => setTimeout(resolve, 100));

(async function initRBAC() {
    'use strict';

    // [RBAC] Initializing...');

    // Wait for dependencies
    const waitForDependencies = async () => {
        let attempts = 0;
        while (attempts < 50) { // 5 seconds max
            if ((window.supabaseClient || window.supabase) && window.PermissionsManager) {
                return true;
            }
            await new Promise(resolve => setTimeout(resolve, 100));
            attempts++;
        }
        return false;
    };

    const ready = await waitForDependencies();
    if (!ready) {
        console.warn('[RBAC] Dependencies not available - Supabase client or PermissionsManager missing');
        return;
    }

    // Get or create Supabase client
    let supabase = window.supabaseClient;
    if (!supabase && window.supabase) {
        // [RBAC] Creating own Supabase client');
        const SUPABASE_URL = 'https://dpcrxdsxtaujmclmahvk.supabase.co';
        const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRwY3J4ZHN4dGF1am1jbG1haHZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2MjI1NzEsImV4cCI6MjA4NTE5ODU3MX0.FJTvbP3WK6-pX8e37fxq8-a_juG7Hg04gZVa00rNGZk';
        supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
        window.supabaseClient = supabase; // Store for future use
    }
    if (!supabase) {
        console.warn('[RBAC] Supabase not available');
        return;
    }

    // Initialize permissions manager
    const permissions = new window.PermissionsManager();

    // Make it globally accessible for debugging
    window.permissions = permissions;

    // ========== INITIALIZATION ==========

    // Initialize on auth state change
    supabase.auth.onAuthStateChange(async (_event, session) => {
        // [RBAC] Auth state changed:', _event);
        if (session?.user) {
            await permissions.init(session.user, supabase);
            await updateUIBasedOnPermissions();
        } else {
            permissions.currentUser = null;
            permissions.userProfile = null;
            hideUpgradeBanner();
        }
    });

    // Initialize for current session
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
        // [RBAC] Initializing for current user:', session.user.email);
        await permissions.init(session.user, supabase);
        await updateUIBasedOnPermissions();
    }

    // ========== UI UPDATE BASED ON PERMISSIONS ==========

    async function updateUIBasedOnPermissions() {
        try {
            const accountType = await permissions.getAccountType();
            const canUpload = await permissions.canUploadSkills();
            const devStatus = await permissions.getDeveloperStatus();

            // [RBAC] Account: ${accountType}, Can Upload: ${canUpload}, Dev Status: ${devStatus}

            // Show/hide developer upgrade banner
            const upgradeBanner = document.getElementById('developer-upgrade-section');
            if (upgradeBanner) {
                // Show banner if user is a customer (not developer/admin) and no pending application
                if (accountType === 'customer' && devStatus !== 'pending') {
                    upgradeBanner.style.display = 'block';
                } else {
                    upgradeBanner.style.display = 'none';
                }
            }

            // Update validator tab access (enhance existing check)
            enhanceValidatorAccess(canUpload);

            // Update submit protocol button (if exists)
            const submitProtocolBtn = document.getElementById('btn-submit-protocol');
            if (submitProtocolBtn) {
                if (!canUpload) {
                    submitProtocolBtn.disabled = true;
                    submitProtocolBtn.title = 'Developer account required';
                    submitProtocolBtn.style.opacity = '0.5';
                    submitProtocolBtn.style.cursor = 'not-allowed';
                } else {
                    submitProtocolBtn.disabled = false;
                    submitProtocolBtn.title = '';
                    submitProtocolBtn.style.opacity = '1';
                    submitProtocolBtn.style.cursor = 'pointer';
                }
            }

            // Show account badge
            updateAccountBadge(accountType, devStatus);

        } catch (err) {
            console.error('[RBAC] Error updating UI:', err);
        }
    }

    function hideUpgradeBanner() {
        const upgradeBanner = document.getElementById('developer-upgrade-section');
        if (upgradeBanner) {
            upgradeBanner.style.display = 'none';
        }
    }

    // ========== ENHANCE VALIDATOR ACCESS ==========

    function enhanceValidatorAccess(canUpload) {
        const validatorTab = document.querySelector('.tab-btn[data-tab="validator"]');
        if (!validatorTab) return;

        // Store original click handlers
        const originalHandlers = validatorTab.onclick;

        // Remove old listener and add new one with permission check
        const newValidatorTab = validatorTab.cloneNode(true);
        validatorTab.parentNode.replaceChild(newValidatorTab, validatorTab);

        newValidatorTab.addEventListener('click', async (e) => {
            // Check if user is authenticated (existing check)
            if (!window.activeUser) {
                e.preventDefault();
                e.stopPropagation();
                if (typeof window.showToast === 'function') {
                    window.showToast('ACCESS_DENIED', 'Authentication required. Please sign in.', 'error');
                }
                document.querySelector('.tab-btn[data-tab="request"]')?.click();
                return;
            }

            // NEW: Check upload permissions
            const hasPermission = await permissions.canUploadSkills();
            if (!hasPermission) {
                e.preventDefault();
                e.stopPropagation();

                const accountType = await permissions.getAccountType();
                const devStatus = await permissions.getDeveloperStatus();

                if (accountType === 'customer') {
                    if (devStatus === 'pending') {
                        if (typeof window.showToast === 'function') {
                            window.showToast('APPLICATION_PENDING', 'Your developer application is under review.', 'warning');
                        }
                    } else {
                        if (typeof window.showToast === 'function') {
                            window.showToast('DEVELOPER_REQUIRED', 'Only developers can upload skills. Apply to become a developer!', 'error');
                        }
                        // Show developer application modal
                        setTimeout(() => openDeveloperApplicationModal(), 500);
                    }
                } else if (accountType === 'developer' && devStatus !== 'approved') {
                    if (typeof window.showToast === 'function') {
                        window.showToast('PENDING_APPROVAL', 'Your developer account is pending approval.', 'warning');
                    }
                }

                document.querySelector('.tab-btn[data-tab="request"]')?.click();
                return;
            }

            // Permission granted - allow access
            // [RBAC] Validator access granted');
        });
    }

    // ========== UPDATE ACCOUNT BADGE ==========

    function updateAccountBadge(accountType, devStatus) {
        const loginBtn = document.getElementById('btn-login');
        const dashboardBadge = document.getElementById('user-account-badge');

        if (!permissions.currentUser) return;

        // Update login button with badge emoji
        if (loginBtn) {
            let badge = '';
            if (accountType === 'admin') {
                badge = ' 👑'; // Admin crown
            } else if (accountType === 'developer' && devStatus === 'approved') {
                badge = ' ⚡'; // Developer badge
            } else if (devStatus === 'pending') {
                badge = ' ⏳'; // Pending badge
            }

            const name = permissions.currentUser.user_metadata?.user_name ||
                         permissions.currentUser.email?.split('@')[0] ||
                         'USER';

            loginBtn.textContent = `// ${name.toUpperCase()}${badge}`;
        }

        // Update dashboard account badge with styling
        if (dashboardBadge) {
            dashboardBadge.classList.remove('developer', 'admin', 'customer');

            if (accountType === 'admin') {
                dashboardBadge.textContent = '👑 ADMIN';
                dashboardBadge.classList.add('admin');
            } else if (accountType === 'developer') {
                dashboardBadge.textContent = '⚡ DEVELOPER';
                dashboardBadge.classList.add('developer');
            } else {
                dashboardBadge.textContent = 'CUSTOMER';
                dashboardBadge.classList.add('customer');
            }

            // [RBAC] Dashboard badge updated:', accountType);
        }

        // Show/hide admin panel button
        const adminBtn = document.getElementById('btn-admin-panel');
        if (adminBtn) {
            if (accountType === 'admin') {
                adminBtn.style.display = 'inline-flex';
                // [RBAC] Admin panel button shown');
            } else {
                adminBtn.style.display = 'none';
            }
        }
    }

    // ========== DEVELOPER APPLICATION MODAL ==========

    function openDeveloperApplicationModal() {
        const modal = document.getElementById('developer-application-modal');
        if (!modal) {
            console.warn('[RBAC] Developer application modal not found');
            return;
        }

        // Reset form
        const form = document.getElementById('developer-application-form');
        const pendingDiv = document.getElementById('dev-app-pending');
        const approvedDiv = document.getElementById('dev-app-approved');
        const rejectedDiv = document.getElementById('dev-app-rejected');

        if (form) form.style.display = 'block';
        if (pendingDiv) pendingDiv.style.display = 'none';
        if (approvedDiv) approvedDiv.style.display = 'none';
        if (rejectedDiv) rejectedDiv.style.display = 'none';

        // Pre-fill email
        const emailInput = document.getElementById('dev-email');
        if (emailInput && permissions.currentUser) {
            emailInput.value = permissions.currentUser.email;
        }

        // Reset form fields
        const formElement = document.getElementById('developer-application-form');
        if (formElement) {
            formElement.reset();
            // Re-set email after reset
            if (emailInput && permissions.currentUser) {
                emailInput.value = permissions.currentUser.email;
            }
        }

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeDeveloperApplicationModal() {
        const modal = document.getElementById('developer-application-modal');
        if (!modal) return;

        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Make modal functions globally accessible
    window.openDeveloperApplicationModal = openDeveloperApplicationModal;
    window.closeDeveloperApplicationModal = closeDeveloperApplicationModal;

    // ========== EVENT HANDLERS ==========

    // "Become Developer" button in dashboard
    const applyBtn = document.getElementById('btn-apply-developer');
    if (applyBtn) {
        applyBtn.addEventListener('click', openDeveloperApplicationModal);
        // [RBAC] Apply button handler attached');
    }

    // Cancel application
    const cancelBtn = document.getElementById('btn-cancel-dev-app');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', closeDeveloperApplicationModal);
    }

    // Close pending/approved/rejected screens
    ['btn-close-pending', 'btn-close-approved', 'btn-close-rejected'].forEach(id => {
        const btn = document.getElementById(id);
        if (btn) {
            btn.addEventListener('click', closeDeveloperApplicationModal);
        }
    });

    // Close modal on outside click
    const devModal = document.getElementById('developer-application-modal');
    if (devModal) {
        devModal.addEventListener('click', (e) => {
            if (e.target === devModal) {
                closeDeveloperApplicationModal();
            }
        });
    }

    // Close modal with X button
    const devModalClose = devModal?.querySelector('.modal-close');
    if (devModalClose) {
        devModalClose.addEventListener('click', closeDeveloperApplicationModal);
    }

    // Form submission
    const devForm = document.getElementById('developer-application-form');
    if (devForm) {
        devForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = new FormData(e.target);
            const applicationData = {
                full_name: formData.get('fullname'),
                portfolio_url: formData.get('portfolio') || null,
                github_url: formData.get('github') || null,
                linkedin_url: formData.get('linkedin') || null,
                why_develop: formData.get('why'),
                experience_level: formData.get('experience'),
                agrees_to_terms: formData.get('terms') === 'on'
            };

            // Validation
            if (!applicationData.full_name || !applicationData.why_develop || !applicationData.experience_level) {
                if (typeof window.showToast === 'function') {
                    window.showToast('ERROR', 'Please fill in all required fields', 'error');
                }
                return;
            }

            if (!applicationData.agrees_to_terms) {
                if (typeof window.showToast === 'function') {
                    window.showToast('ERROR', 'You must agree to the developer terms', 'error');
                }
                return;
            }

            try {
                if (typeof window.showToast === 'function') {
                    window.showToast('SUBMITTING', 'Processing your application...');
                }

                await permissions.submitDeveloperApplication(applicationData);

                // Show pending state
                const form = document.getElementById('developer-application-form');
                const pendingDiv = document.getElementById('dev-app-pending');

                if (form) form.style.display = 'none';
                if (pendingDiv) pendingDiv.style.display = 'block';

                if (typeof window.showToast === 'function') {
                    window.showToast('SUCCESS', 'Application submitted! We\'ll review within 24-48 hours.', 'success');
                }

                // Update UI
                await updateUIBasedOnPermissions();

            } catch (err) {
                console.error('[RBAC] Application error:', err);
                if (typeof window.showToast === 'function') {
                    window.showToast('ERROR', err.message || 'Failed to submit application', 'error');
                }
            }
        });

        // [RBAC] Form submit handler attached');
    }

    // ========== WRAP EXISTING SUBMIT PROTOCOL FUNCTION ==========

    // Find submitProtocol in window scope and wrap it
    // Note: This function is defined in script.js but may not be global
    // If it's not accessible, we'll rely on the button disabled state

    if (typeof window.submitProtocol === 'function') {
        const originalSubmitProtocol = window.submitProtocol;

        window.submitProtocol = async function(file) {
            // Check permissions before allowing upload
            const canUpload = await permissions.canUploadSkills();

            if (!canUpload) {
                const accountType = await permissions.getAccountType();
                if (accountType === 'customer') {
                    if (typeof window.showToast === 'function') {
                        window.showToast('ACCESS_DENIED', 'Developer account required to upload skills', 'error');
                    }
                    openDeveloperApplicationModal();
                } else {
                    if (typeof window.showToast === 'function') {
                        window.showToast('PENDING_APPROVAL', 'Your developer account is pending approval', 'warning');
                    }
                }
                return;
            }

            // Permission granted - call original function
            return originalSubmitProtocol.call(this, file);
        };

        // [RBAC] submitProtocol wrapped with permission check');
    }

    // RBAC system initialized

})();
}); // End DOMContentLoaded
