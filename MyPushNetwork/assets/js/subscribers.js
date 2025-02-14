class SubscriberManager {
    constructor() {
        this.map = null;
        this.markers = [];
        this.subscribers = [];
        this.currentPage = 1;
        this.itemsPerPage = 10;
        this.filters = {
            search: '',
            status: 'all',
            browser: 'all'
        };
        this.isLoading = false;
        this.debounceTimer = null;
        this.supabase = null;

        // Initialize immediately
        this.initializeSupabase();
        this.initializeUI();
        this.setupEventListeners();
        this.initializeMap();
        this.loadSubscribers();
    }

    initializeSupabase() {
        try {
            console.log('Initializing Supabase with URL:', config.supabase.url);
            this.supabase = window.supabase.createClient(
                config.supabase.url,
                config.supabase.serviceRole
            );
            console.log('Supabase initialized successfully');
            
            // Set up real-time subscription
            this.setupRealtimeSubscription();
        } catch (error) {
            console.error('Failed to initialize Supabase:', error);
            this.showError('Failed to initialize database connection');
        }
    }

    setupRealtimeSubscription() {
        const channel = this.supabase
            .channel('subscribers_changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'subscribers'
                },
                (payload) => {
                    console.log('Real-time update received:', payload);
                    this.handleRealtimeUpdate(payload);
                }
            )
            .subscribe((status) => {
                console.log('Subscription status:', status);
            });
    }

    handleRealtimeUpdate(payload) {
        const { eventType, new: newRecord, old: oldRecord } = payload;
        
        switch (eventType) {
            case 'INSERT':
                this.subscribers.unshift({
                    id: newRecord.id,
                    deviceId: newRecord.device_id || 'Unknown Device',
                    browser: newRecord.browser || 'Unknown Browser',
                    country: newRecord.country || 'Unknown Country',
                    city: newRecord.city || 'Unknown City',
                    latitude: newRecord.latitude || 0,
                    longitude: newRecord.longitude || 0,
                    status: newRecord.status || 'inactive',
                    lastActive: newRecord.last_active_at || newRecord.created_at,
                    createdAt: newRecord.created_at,
                    deviceType: newRecord.device_type || 'Unknown Device',
                    isProxyOrVpn: newRecord.is_proxy_or_vpn || false
                });
                break;
                
            case 'UPDATE':
                const index = this.subscribers.findIndex(s => s.id === newRecord.id);
                if (index !== -1) {
                    this.subscribers[index] = {
                        id: newRecord.id,
                        deviceId: newRecord.device_id || 'Unknown Device',
                        browser: newRecord.browser || 'Unknown Browser',
                        country: newRecord.country || 'Unknown Country',
                        city: newRecord.city || 'Unknown City',
                        latitude: newRecord.latitude || 0,
                        longitude: newRecord.longitude || 0,
                        status: newRecord.status || 'inactive',
                        lastActive: newRecord.last_active_at || newRecord.created_at,
                        createdAt: newRecord.created_at,
                        deviceType: newRecord.device_type || 'Unknown Device',
                        isProxyOrVpn: newRecord.is_proxy_or_vpn || false
                    };
                }
                break;
                
            case 'DELETE':
                const deleteIndex = this.subscribers.findIndex(s => s.id === oldRecord.id);
                if (deleteIndex !== -1) {
                    this.subscribers.splice(deleteIndex, 1);
                }
                break;
        }
        
        // Update UI
        this.updateStats();
        this.updateSubscriberList();
        this.updateMap();
    }

    async loadSubscribers() {
        try {
            if (!this.supabase) {
                console.log('Reinitializing Supabase...');
                this.initializeSupabase();
            }

            if (!this.supabase) {
                throw new Error('Supabase client not initialized');
            }

            this.isLoading = true;
            this.updateLoadingState();

            console.log('Fetching subscribers from Supabase...');
            
            // First, test the connection
            const { data: testData, error: testError } = await this.supabase
                .from('subscribers')
                .select('count');

            if (testError) {
                throw new Error(`Database connection test failed: ${testError.message}`);
            }

            console.log('Connection test successful, fetching subscribers...');

            // Now fetch the actual data
            const { data, error } = await this.supabase
                .from('subscribers')
                .select('*');

            console.log('Supabase response:', { data, error });

            if (error) {
                throw error;
            }

            if (!data) {
                console.log('No data received from Supabase');
                this.subscribers = [];
            } else {
                console.log('Received subscribers:', data);
                this.subscribers = data.map(subscriber => ({
                    id: subscriber.id,
                    deviceId: subscriber.device_id || 'Unknown Device',
                    browser: subscriber.browser || 'Unknown Browser',
                    country: subscriber.country || 'Unknown Country',
                    city: subscriber.city || 'Unknown City',
                    latitude: subscriber.latitude || 0,
                    longitude: subscriber.longitude || 0,
                    status: subscriber.status || 'inactive',
                    lastActive: subscriber.last_active_at || subscriber.created_at,
                    createdAt: subscriber.created_at,
                    deviceType: subscriber.device_type || 'Unknown Device',
                    isProxyOrVpn: subscriber.is_proxy_or_vpn || false
                }));
            }

            this.updateStats();
            this.updateSubscriberList();
            this.updateMap();

        } catch (error) {
            console.error('Error loading subscribers:', error);
            this.showError(`Failed to load subscribers: ${error.message}`);
            
            // Try to reinitialize Supabase on error
            try {
                console.log('Attempting to reinitialize Supabase...');
                this.initializeSupabase();
            } catch (initError) {
                console.error('Failed to reinitialize Supabase:', initError);
            }
        } finally {
            this.isLoading = false;
            this.updateLoadingState();
        }
    }

    updateLoadingState() {
        const tbody = document.getElementById('subscribersList');
        if (!tbody) {
            console.error('subscribersList element not found');
            return;
        }

        if (this.isLoading) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" class="loading-state">
                        <div class="loading-spinner"></div>
                        <p>Loading subscribers...</p>
                    </td>
                </tr>
            `;
        } else if (this.subscribers.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" class="no-data">
                        <i class="fas fa-users"></i>
                        <p>No subscribers found</p>
                    </td>
                </tr>
            `;
        }
    }

    initializeUI() {
        // Set user email in header
        const userSession = JSON.parse(sessionStorage.getItem('userSession'));
        if (!userSession) {
            window.location.href = '../index.html';
            return;
        }
        document.getElementById('userEmail').textContent = userSession.email;

        // Mobile menu toggle
        const menuToggle = document.querySelector('.mobile-menu-toggle');
        const sidebar = document.querySelector('.sidebar');
        if (menuToggle) {
            menuToggle.addEventListener('click', () => {
                sidebar.classList.toggle('active');
            });
        }

        // Add loading state to subscriber list
        const tbody = document.getElementById('subscribersList');
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="loading-state">
                    <div class="loading-spinner"></div>
                    <p>Loading subscribers...</p>
                </td>
            </tr>
        `;
    }

    setupEventListeners() {
        // Search and filters with debounce
        document.getElementById('searchSubscriber').addEventListener('input', (e) => {
            clearTimeout(this.debounceTimer);
            this.debounceTimer = setTimeout(() => {
                this.filters.search = e.target.value.toLowerCase();
                this.updateSubscriberList();
            }, 300);
        });

        document.getElementById('statusFilter').addEventListener('change', (e) => {
            this.filters.status = e.target.value;
            this.updateSubscriberList();
        });

        document.getElementById('browserFilter').addEventListener('change', (e) => {
            this.filters.browser = e.target.value;
            this.updateSubscriberList();
        });

        // Pagination
        document.getElementById('prevPage').addEventListener('click', () => this.changePage(-1));
        document.getElementById('nextPage').addEventListener('click', () => this.changePage(1));

        // Export button
        document.getElementById('exportSubscribers').addEventListener('click', () => this.exportSubscribers());

        // Logout button
        document.getElementById('logoutBtn').addEventListener('click', () => {
            sessionStorage.removeItem('userSession');
            window.location.href = '../index.html';
        });

        // Modal close button
        document.querySelector('.modal-close').addEventListener('click', () => {
            document.getElementById('subscriberModal').style.display = 'none';
        });

        // Close modal on outside click
        window.addEventListener('click', (e) => {
            const modal = document.getElementById('subscriberModal');
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }

    initializeMap() {
        try {
            this.map = L.map('subscriberMap').setView([0, 0], 2);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: ' OpenStreetMap contributors'
            }).addTo(this.map);
        } catch (error) {
            console.error('Error initializing map:', error);
            document.getElementById('subscriberMap').innerHTML = `
                <div class="map-error">
                    <i class="fas fa-map-marked-alt"></i>
                    <p>Error loading map. Please refresh the page.</p>
                </div>
            `;
        }
    }

    updateMap() {
        // Clear existing markers
        this.markers.forEach(marker => marker.remove());
        this.markers = [];

        if (!this.map) return;

        // Reset map view
        this.map.setView([0, 0], 2);

        // Add markers for each subscriber with valid coordinates
        this.subscribers.forEach(subscriber => {
            if (subscriber.latitude && subscriber.longitude && 
                subscriber.latitude !== 0 && subscriber.longitude !== 0) {
                try {
                    const marker = L.marker([subscriber.latitude, subscriber.longitude])
                        .bindPopup(`
                            <div class="map-popup">
                                <h4>${subscriber.deviceId}</h4>
                                <p><strong>Location:</strong> ${subscriber.city}, ${subscriber.country}</p>
                                <p><strong>Browser:</strong> ${subscriber.browser}</p>
                                <p><strong>Status:</strong> ${subscriber.status}</p>
                                <p><strong>Last Active:</strong> ${new Date(subscriber.lastActive).toLocaleString()}</p>
                            </div>
                        `);
                    
                    marker.addTo(this.map);
                    this.markers.push(marker);
                } catch (error) {
                    console.error('Error adding marker:', error);
                }
            }
        });

        // If we have markers, fit the map to show all of them
        if (this.markers.length > 0) {
            const group = L.featureGroup(this.markers);
            this.map.fitBounds(group.getBounds(), { padding: [50, 50] });
        }
    }

    updateStats() {
        const total = this.subscribers.length;
        const active = this.subscribers.filter(s => s.status === 'active').length;
        const unsubscribed = this.subscribers.filter(s => s.status === 'unsubscribed').length;
        const conversionRate = total ? ((active / total) * 100).toFixed(1) : 0;

        document.getElementById('totalSubscribers').textContent = total;
        document.getElementById('activeSubscribers').textContent = active;
        document.getElementById('unsubscribedCount').textContent = unsubscribed;
        document.getElementById('conversionRate').textContent = `${conversionRate}%`;
    }

    updateSubscriberList() {
        if (this.isLoading) return;

        const tbody = document.getElementById('subscribersList');
        if (!tbody) {
            console.error('subscribersList element not found');
            return;
        }

        const filteredSubscribers = this.getFilteredSubscribers();
        const paginatedSubscribers = this.getPaginatedSubscribers(filteredSubscribers);

        if (filteredSubscribers.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" class="no-data">
                        <i class="fas fa-search"></i>
                        <p>No subscribers found</p>
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = paginatedSubscribers.map(subscriber => `
            <tr>
                <td>${this.escapeHTML(subscriber.deviceId)}</td>
                <td>${this.escapeHTML(subscriber.browser)}</td>
                <td>${this.escapeHTML(subscriber.city)}, ${this.escapeHTML(subscriber.country)}</td>
                <td>
                    <span class="status-badge ${subscriber.status}">
                        ${this.escapeHTML(subscriber.status)}
                    </span>
                </td>
                <td>${new Date(subscriber.lastActive).toLocaleString()}</td>
                <td>
                    <button onclick="subscriberManager.viewSubscriberDetails('${subscriber.id}')" class="btn-icon">
                        <i class="fas fa-eye"></i>
                    </button>
                </td>
            </tr>
        `).join('');

        this.updatePagination(filteredSubscribers.length);
    }

    getFilteredSubscribers() {
        return this.subscribers.filter(subscriber => {
            const matchesSearch = subscriber.deviceId.toLowerCase().includes(this.filters.search) ||
                                subscriber.browser.toLowerCase().includes(this.filters.search) ||
                                subscriber.city.toLowerCase().includes(this.filters.search) ||
                                subscriber.country.toLowerCase().includes(this.filters.search);
            
            const matchesStatus = this.filters.status === 'all' || subscriber.status === this.filters.status;
            const matchesBrowser = this.filters.browser === 'all' || subscriber.browser === this.filters.browser;
            
            return matchesSearch && matchesStatus && matchesBrowser;
        });
    }

    getPaginatedSubscribers(subscribers) {
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        return subscribers.slice(startIndex, endIndex);
    }

    updatePagination(totalItems) {
        const totalPages = Math.ceil(totalItems / this.itemsPerPage);
        this.currentPage = Math.min(this.currentPage, totalPages);
        if (this.currentPage < 1) this.currentPage = 1;

        document.querySelector('.pagination-info').textContent = 
            `Showing ${(this.currentPage - 1) * this.itemsPerPage + 1}-${Math.min(this.currentPage * this.itemsPerPage, totalItems)} of ${totalItems} subscribers`;

        document.getElementById('prevPage').disabled = this.currentPage === 1;
        document.getElementById('nextPage').disabled = this.currentPage >= totalPages;
    }

    changePage(delta) {
        const totalPages = Math.ceil(this.subscribers.length / this.itemsPerPage);
        this.currentPage = Math.max(1, Math.min(this.currentPage + delta, totalPages));
        this.updateSubscriberList();
    }

    viewSubscriberDetails(id) {
        const subscriber = this.subscribers.find(s => s.id === id);
        if (!subscriber) return;

        const modal = document.getElementById('subscriberModal');
        const details = document.getElementById('subscriberDetails');
        
        details.innerHTML = `
            <div class="details-grid">
                <div class="detail-item">
                    <label>Device ID:</label>
                    <span>${subscriber.deviceId}</span>
                </div>
                <div class="detail-item">
                    <label>Browser:</label>
                    <span>${subscriber.browser}</span>
                </div>
                <div class="detail-item">
                    <label>Location:</label>
                    <span>${subscriber.city}, ${subscriber.country}</span>
                </div>
                <div class="detail-item">
                    <label>Status:</label>
                    <span class="status-badge ${subscriber.status}">
                        ${subscriber.status}
                    </span>
                </div>
                <div class="detail-item">
                    <label>Last Active:</label>
                    <span>${new Date(subscriber.lastActive).toLocaleString()}</span>
                </div>
                <div class="detail-item">
                    <label>Subscribed Date:</label>
                    <span>${new Date(subscriber.createdAt).toLocaleString()}</span>
                </div>
            </div>
        `;

        // Show modal
        modal.style.display = 'block';
    }

    formatDate(dateString) {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            return new Intl.DateTimeFormat('default', {
                dateStyle: 'medium',
                timeStyle: 'short'
            }).format(date);
        } catch (error) {
            console.error('Error formatting date:', error);
            return 'Invalid Date';
        }
    }

    escapeCSV(str) {
        if (typeof str !== 'string') return str;
        if (str.includes(',') || str.includes('"') || str.includes('\n')) {
            return `"${str.replace(/"/g, '""')}"`;
        }
        return str;
    }

    async exportSubscribers() {
        try {
            const exportBtn = document.getElementById('exportSubscribers');
            exportBtn.disabled = true;
            exportBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Exporting...';

            // Filter subscribers based on current filters
            let filtered = this.subscribers.filter(subscriber => {
                const matchesSearch = subscriber.deviceId.toLowerCase().includes(this.filters.search) ||
                                    subscriber.city.toLowerCase().includes(this.filters.search) ||
                                    subscriber.country.toLowerCase().includes(this.filters.search);
                const matchesStatus = this.filters.status === 'all' || subscriber.status === this.filters.status;
                const matchesBrowser = this.filters.browser === 'all' || 
                                     subscriber.browser.toLowerCase() === this.filters.browser.toLowerCase();
                
                return matchesSearch && matchesStatus && matchesBrowser;
            });

            // Convert to CSV with proper escaping
            const headers = ['Device ID', 'Browser', 'Country', 'City', 'Status', 'Last Active', 'Subscribed Date'];
            const csv = [
                headers.join(','),
                ...filtered.map(s => [
                    this.escapeCSV(s.deviceId),
                    this.escapeCSV(s.browser),
                    this.escapeCSV(s.country),
                    this.escapeCSV(s.city),
                    this.escapeCSV(s.status),
                    this.escapeCSV(this.formatDate(s.lastActive)),
                    this.escapeCSV(this.formatDate(s.createdAt))
                ].join(','))
            ].join('\n');

            // Create download link
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.setAttribute('hidden', '');
            a.setAttribute('href', url);
            a.setAttribute('download', `subscribers_export_${new Date().toISOString().slice(0,10)}.csv`);
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error exporting subscribers:', error);
            this.showError('Failed to export subscribers. Please try again.');
        } finally {
            const exportBtn = document.getElementById('exportSubscribers');
            exportBtn.disabled = false;
            exportBtn.innerHTML = '<i class="fas fa-download"></i> Export';
        }
    }

    generateMockSubscribers() {
        const browsers = ['Chrome', 'Firefox', 'Safari', 'Edge'];
        const statuses = ['active', 'inactive', 'unsubscribed'];
        const countries = ['USA', 'UK', 'Canada', 'Australia', 'Germany', 'France', 'Japan'];
        const cities = {
            'USA': ['New York', 'Los Angeles', 'Chicago'],
            'UK': ['London', 'Manchester', 'Birmingham'],
            'Canada': ['Toronto', 'Vancouver', 'Montreal'],
            'Australia': ['Sydney', 'Melbourne', 'Brisbane'],
            'Germany': ['Berlin', 'Munich', 'Hamburg'],
            'France': ['Paris', 'Lyon', 'Marseille'],
            'Japan': ['Tokyo', 'Osaka', 'Kyoto']
        };

        return Array.from({ length: 100 }, (_, i) => {
            const country = countries[Math.floor(Math.random() * countries.length)];
            const city = cities[country][Math.floor(Math.random() * cities[country].length)];
            const status = statuses[Math.floor(Math.random() * statuses.length)];
            const lastActive = status === 'unsubscribed' ? null : 
                new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString();

            return {
                id: i + 1,
                deviceId: `device_${Math.random().toString(36).substr(2, 9)}`,
                browser: browsers[Math.floor(Math.random() * browsers.length)],
                country: country,
                city: city,
                latitude: (Math.random() * 180) - 90,
                longitude: (Math.random() * 360) - 180,
                status: status,
                lastActive: lastActive,
                createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString()
            };
        });
    }

    showError(message) {
        const container = document.querySelector('.subscriber-list-container');
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `
            <i class="fas fa-exclamation-circle"></i>
            <p>${message}</p>
            <button onclick="subscriberManager.loadSubscribers()" class="btn-retry">
                <i class="fas fa-redo"></i> Retry
            </button>
        `;
        container.insertBefore(errorDiv, container.firstChild);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (errorDiv.parentNode === container) {
                container.removeChild(errorDiv);
            }
        }, 5000);
    }

    escapeHTML(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }
}

// Initialize SubscriberManager when DOM is loaded
let subscriberManager;
document.addEventListener('DOMContentLoaded', () => {
    subscriberManager = new SubscriberManager();
});
