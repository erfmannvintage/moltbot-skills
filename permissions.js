// ==========================================
// RBAC Permissions Library
// Moltbot Skills Marketplace - Phase 1
// Additive security layer
// DO NOT modify - only import and use
// ==========================================

class PermissionsManager {
    constructor() {
        this.currentUser = null;
        this.userProfile = null;
        this.cacheExpiry = 5 * 60 * 1000; // 5 minutes
        this.lastFetch = null;
    }

    // Initialize with current user
    async init(user, supabaseClient) {
        this.currentUser = user;
        this.supabase = supabaseClient;

        if (user) {
            await this.fetchUserProfile();
        }
    }

    // Fetch user profile from database
    async fetchUserProfile(forceRefresh = false) {
        if (!this.currentUser) return null;

        // Use cache if available and not expired
        const now = Date.now();
        if (!forceRefresh && this.userProfile && this.lastFetch && (now - this.lastFetch < this.cacheExpiry)) {
            return this.userProfile;
        }

        try {
            const { data, error } = await this.supabase
                .from('user_profiles')
                .select('*')
                .eq('id', this.currentUser.id)
                .single();

            if (error) {
                console.error('[RBAC] Error fetching user profile:', error);

                // If profile doesn't exist, create it
                if (error.code === 'PGRST116') {
                    console.log('[RBAC] Profile not found, creating...');
                    await this.createUserProfile();
                    return await this.fetchUserProfile(true);
                }

                return null;
            }

            this.userProfile = data;
            this.lastFetch = now;
            console.log('[RBAC] Profile loaded:', {
                account_type: data.account_type,
                developer_status: data.developer_status
            });
            return data;
        } catch (err) {
            console.error('[RBAC] Permission fetch error:', err);
            return null;
        }
    }

    // Create user profile if it doesn't exist
    async createUserProfile() {
        try {
            const { data, error } = await this.supabase
                .from('user_profiles')
                .insert({
                    id: this.currentUser.id,
                    account_type: 'customer',
                    is_verified: false
                })
                .select()
                .single();

            if (error) throw error;

            this.userProfile = data;
            this.lastFetch = Date.now();
            console.log('[RBAC] Profile created:', data);
            return data;
        } catch (err) {
            console.error('[RBAC] Error creating user profile:', err);
            return null;
        }
    }

    // Check if user can upload skills
    async canUploadSkills() {
        const profile = await this.fetchUserProfile();

        if (!profile) return false;

        // Only developers and admins can upload
        if (profile.account_type === 'customer') return false;

        // Developers must be approved
        if (profile.account_type === 'developer') {
            return profile.developer_status === 'approved';
        }

        // Admins always can
        if (profile.account_type === 'admin') return true;

        return false;
    }

    // Check if user is admin
    async isAdmin() {
        const profile = await this.fetchUserProfile();
        return profile?.account_type === 'admin';
    }

    // Check if user is developer
    async isDeveloper() {
        const profile = await this.fetchUserProfile();
        return profile?.account_type === 'developer' && profile?.developer_status === 'approved';
    }

    // Check if user is customer
    async isCustomer() {
        const profile = await this.fetchUserProfile();
        return profile?.account_type === 'customer';
    }

    // Get account type
    async getAccountType() {
        const profile = await this.fetchUserProfile();
        return profile?.account_type || 'customer';
    }

    // Get developer status
    async getDeveloperStatus() {
        const profile = await this.fetchUserProfile();
        return profile?.developer_status || null;
    }

    // Check if user has pending developer application
    async hasPendingApplication() {
        if (!this.currentUser) return false;

        try {
            const { data, error } = await this.supabase
                .from('developer_applications')
                .select('status')
                .eq('user_id', this.currentUser.id)
                .eq('status', 'pending')
                .limit(1);

            if (error) throw error;

            return data && data.length > 0;
        } catch (err) {
            console.error('[RBAC] Error checking application status:', err);
            return false;
        }
    }

    // Submit developer application
    async submitDeveloperApplication(applicationData) {
        if (!this.currentUser) {
            throw new Error('User must be authenticated');
        }

        try {
            // Check if already a developer or has pending application
            const profile = await this.fetchUserProfile();

            if (profile?.account_type === 'developer') {
                throw new Error('You are already a developer');
            }

            const hasPending = await this.hasPendingApplication();
            if (hasPending) {
                throw new Error('You already have a pending application');
            }

            // Insert application
            const { data, error } = await this.supabase
                .from('developer_applications')
                .insert({
                    user_id: this.currentUser.id,
                    email: this.currentUser.email,
                    ...applicationData,
                    status: 'pending'
                })
                .select()
                .single();

            if (error) throw error;

            // Update user profile developer_status
            await this.supabase
                .from('user_profiles')
                .update({
                    developer_status: 'pending',
                    developer_application_date: new Date().toISOString()
                })
                .eq('id', this.currentUser.id);

            // Refresh profile cache
            await this.fetchUserProfile(true);

            console.log('[RBAC] Developer application submitted:', data.id);
            return data;
        } catch (err) {
            console.error('[RBAC] Error submitting developer application:', err);
            throw err;
        }
    }

    // Clear cache (e.g., after profile update)
    clearCache() {
        this.userProfile = null;
        this.lastFetch = null;
        console.log('[RBAC] Cache cleared');
    }
}

// Export singleton instance
if (typeof window !== 'undefined') {
    window.PermissionsManager = PermissionsManager;
    console.log('✅ PermissionsManager loaded');
}
