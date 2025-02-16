class Dashboard {
    constructor() {
        this.charts = {};
        this.stats = {
            subscribers: 0,
            notifications: 0,
            deliveryRate: 0,
            clickRate: 0,
            uniqueClicks: 0,
            ctr: 0
        };
        this.refreshInterval = null;
        this.isLoading = true;
        this.lastUpdate = null;
        this.updateInterval = 30 * 60 * 1000; // 30 minutes
        this.supabase = null;
        
        this.initializeUI();
        this.setupEventListeners();
        this.initializeCharts();
        this.initializeSupabase();
        this.setupRealtimeSubscription();
        this.loadDashboardData();
        this.startAutoRefresh();
    }

    initializeUI() {
        // Set user email in header
        const userSession = JSON.parse(sessionStorage.getItem('userSession'));
        if (!userSession) {
            window.location.href = '../index.html';
            return;
        }
        document.getElementById('userEmail').textContent = userSession.email;

        // Add loading states to cards
        ['totalSubscribers', 'notificationsSent', 'deliveryRate', 'clickRate'].forEach(id => {
            const element = document.getElementById(id);
            element.innerHTML = '<div class="loading-spinner"></div>';
        });

        // Mobile menu toggle
        const menuToggle = document.querySelector('.mobile-menu-toggle');
        const sidebar = document.querySelector('.sidebar');
        const mainContent = document.querySelector('.main-content');
        
        if (menuToggle) {
            menuToggle.addEventListener('click', () => {
                sidebar.classList.toggle('collapsed');
                mainContent.classList.toggle('expanded');
                if (window.innerWidth <= 768) {
                    sidebar.classList.toggle('active');
                }
            });
        }

        // Close sidebar when clicking outside on mobile
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 768 && 
                !e.target.closest('.sidebar') && 
                !e.target.closest('.mobile-menu-toggle') && 
                sidebar.classList.contains('active')) {
                sidebar.classList.remove('active');
            }
        });
    }

    setupEventListeners() {
        // Logout button
        document.getElementById('logoutBtn').addEventListener('click', () => {
            this.stopAutoRefresh();
            sessionStorage.removeItem('userSession');
            window.location.href = '../index.html';
        });

        // Window resize event for chart responsiveness
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                Object.values(this.charts).forEach(chart => {
                    if (chart && typeof chart.resize === 'function') {
                        chart.resize();
                    }
                });
            }, 250);
        });
    }

    startAutoRefresh() {
        // Refresh data every 30 seconds
        this.refreshInterval = setInterval(() => {
            this.loadDashboardData();
        }, 30000);
    }

    stopAutoRefresh() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
            this.refreshInterval = null;
        }
    }

    showError(message) {
        const container = document.querySelector('.dashboard-grid');
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `
            <i class="fas fa-exclamation-circle"></i>
            <p>${message}</p>
            <button onclick="dashboard.loadDashboardData()" class="btn-retry">
                <i class="fas fa-redo"></i> Retry
            </button>
        `;
        container.insertBefore(errorDiv, container.firstChild);

        setTimeout(() => {
            if (errorDiv.parentNode === container) {
                container.removeChild(errorDiv);
            }
        }, 5000);
    }

    initializeSupabase() {
        this.supabase = window.supabase.createClient(
            config.supabase.url,
            config.supabase.serviceRole
        );
    }

    setupRealtimeSubscription() {
        const channel = this.supabase
            .channel('notifications_changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'notifications'
                },
                (payload) => {
                    console.log('Real-time notification update:', payload);
                    // Force immediate refresh when notification is updated
                    this.lastUpdate = null; // Reset last update time
                    this.loadDashboardData();
                }
            )
            .subscribe((status) => {
                console.log('Realtime subscription status:', status);
            });
    }

    async loadDashboardData() {
        try {
            this.isLoading = true;
            this.showLoadingState();

            // Get notifications data
            const { data: notifications, error: notificationsError } = await this.supabase
                .from('notifications')
                .select('*');

            if (notificationsError) throw notificationsError;

            // Calculate statistics
            const totalNotifications = notifications.length;
            const totalClicks = notifications.reduce((sum, notification) => {
                return sum + (notification.clicked_urls ? notification.clicked_urls.length : 0);
            }, 0);
            const uniqueClicks = notifications.reduce((sum, notification) => {
                return sum + (notification.unique_clicks || 0);
            }, 0);

            // Get subscribers count
            const { count: subscribersCount, error: subscribersError } = await this.supabase
                .from('subscribers')
                .select('*', { count: 'exact' });

            if (subscribersError) throw subscribersError;

            // Update stats
            this.stats.subscribers = subscribersCount;
            this.stats.notifications = totalNotifications;
            this.stats.clickRate = totalClicks;
            this.stats.uniqueClicks = uniqueClicks;
            this.stats.ctr = totalNotifications > 0 ? ((uniqueClicks / totalNotifications) * 100).toFixed(2) : 0;

            // Update UI
            document.getElementById('totalSubscribers').textContent = this.stats.subscribers.toLocaleString();
            document.getElementById('notificationsSent').textContent = this.stats.notifications.toLocaleString();
            document.getElementById('clickRate').textContent = this.stats.clickRate.toLocaleString();
            document.getElementById('deliveryRate').textContent = this.stats.ctr + '%';

            // Remove loading states
            document.querySelectorAll('.loading-spinner').forEach(spinner => {
                spinner.remove();
            });

            this.lastUpdate = new Date();
            this.isLoading = false;

        } catch (error) {
            console.error('Error loading dashboard data:', error);
            // Show error state in UI
            document.querySelectorAll('.card-value').forEach(card => {
                card.textContent = 'Error';
            });
        }
    }

    showLoadingState() {
        ['totalSubscribers', 'notificationsSent', 'deliveryRate', 'clickRate'].forEach(id => {
            const element = document.getElementById(id);
            if (!element.querySelector('.loading-spinner')) {
                element.innerHTML = '<div class="loading-spinner"></div>';
            }
        });
    }

    hideLoadingState() {
        ['totalSubscribers', 'notificationsSent', 'deliveryRate', 'clickRate'].forEach(id => {
            const element = document.getElementById(id);
            const spinner = element.querySelector('.loading-spinner');
            if (spinner) {
                spinner.remove();
            }
        });
    }

    updateDashboardStats(stats) {
        document.getElementById('totalSubscribers').textContent = stats.subscribers;
        document.getElementById('notificationsSent').textContent = stats.notifications;
        document.getElementById('deliveryRate').textContent = stats.deliveryRate + '%';
        document.getElementById('clickRate').textContent = stats.clickRate;
    }

    initializeCharts() {
        // Performance Chart
        this.charts.performance = new Chart(document.getElementById('performanceChart'), {
            type: 'line',
            data: {
                labels: [],
                datasets: [
                    {
                        label: 'Sent',
                        data: [],
                        borderColor: '#4CAF50',
                        backgroundColor: '#4CAF5020',
                        tension: 0.4
                    },
                    {
                        label: 'Delivered',
                        data: [],
                        borderColor: '#2196F3',
                        backgroundColor: '#2196F320',
                        tension: 0.4
                    },
                    {
                        label: 'Clicked',
                        data: [],
                        borderColor: '#FF5722',
                        backgroundColor: '#FF572220',
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

        // Growth Chart
        this.charts.growth = new Chart(document.getElementById('growthChart'), {
            type: 'bar',
            data: {
                labels: [],
                datasets: [{
                    label: 'New Subscribers',
                    data: [],
                    backgroundColor: '#4CAF50'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

        // Geographic Distribution Chart
        this.charts.geo = new Chart(document.getElementById('geoChart'), {
            type: 'doughnut',
            data: {
                labels: ['USA', 'Europe', 'Asia', 'Africa', 'Others'],
                datasets: [{
                    data: [0, 0, 0, 0, 0],
                    backgroundColor: [
                        '#4CAF50',
                        '#2196F3',
                        '#FF5722',
                        '#FFC107',
                        '#9C27B0'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right'
                    }
                }
            }
        });

        // Device Distribution Chart
        this.charts.device = new Chart(document.getElementById('deviceChart'), {
            type: 'doughnut',
            data: {
                labels: ['Desktop', 'Mobile', 'Tablet'],
                datasets: [{
                    data: [0, 0, 0],
                    backgroundColor: [
                        '#4CAF50',
                        '#2196F3',
                        '#FF5722'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right'
                    }
                }
            }
        });
    }

    updatePerformanceChart(notifications) {
        const performanceData = notifications.reduce((acc, n) => {
            const date = new Date(n.created_at).toLocaleDateString();
            if (!acc[date]) {
                acc[date] = { sent: 0, delivered: 0, clicked: 0 };
            }
            acc[date].sent += n.sent_count || 0;
            acc[date].delivered += n.delivered_count || 0;
            acc[date].clicked += n.click_count || 0;
            return acc;
        }, {});

        const dates = Object.keys(performanceData).sort();
        const sent = dates.map(date => performanceData[date].sent);
        const delivered = dates.map(date => performanceData[date].delivered);
        const clicked = dates.map(date => performanceData[date].clicked);

        this.charts.performance.data.labels = dates;
        this.charts.performance.data.datasets[0].data = sent;
        this.charts.performance.data.datasets[1].data = delivered;
        this.charts.performance.data.datasets[2].data = clicked;
        this.charts.performance.update();
    }

    updateGrowthChart(subscribers) {
        const growthData = subscribers.reduce((acc, s) => {
            const date = new Date(s.created_at).toLocaleDateString();
            acc[date] = (acc[date] || 0) + 1;
            return acc;
        }, {});

        const dates = Object.keys(growthData).sort();
        const counts = dates.map(date => growthData[date]);

        this.charts.growth.data.labels = dates;
        this.charts.growth.data.datasets[0].data = counts;
        this.charts.growth.update();
    }

    updateGeoChart(subscribers) {
        const regions = {
            USA: ['US'],
            Europe: ['GB', 'DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'SE', 'NO', 'DK', 'FI', 'PL'],
            Asia: ['CN', 'JP', 'KR', 'IN', 'ID', 'MY', 'SG', 'TH', 'VN', 'PH'],
            Africa: ['ZA', 'NG', 'KE', 'EG', 'MA', 'GH', 'ET', 'TZ', 'UG', 'RW'],
            Others: []
        };

        const geoData = subscribers.reduce((acc, s) => {
            let region = 'Others';
            for (const [key, countries] of Object.entries(regions)) {
                if (countries.includes(s.country)) {
                    region = key;
                    break;
                }
            }
            acc[region] = (acc[region] || 0) + 1;
            return acc;
        }, {});

        this.charts.geo.data.datasets[0].data = [
            geoData.USA || 0,
            geoData.Europe || 0,
            geoData.Asia || 0,
            geoData.Africa || 0,
            geoData.Others || 0
        ];
        this.charts.geo.update();
    }

    updateDeviceChart(subscribers) {
        const deviceData = subscribers.reduce((acc, s) => {
            const device = s.device_type?.toLowerCase() || 'unknown';
            if (device.includes('mobile')) acc.mobile++;
            else if (device.includes('tablet')) acc.tablet++;
            else acc.desktop++;
            return acc;
        }, { desktop: 0, mobile: 0, tablet: 0 });

        this.charts.device.data.datasets[0].data = [
            deviceData.desktop,
            deviceData.mobile,
            deviceData.tablet
        ];
        this.charts.device.update();
    }
}

// Initialize Dashboard when DOM is loaded
let dashboard;
document.addEventListener('DOMContentLoaded', () => {
    dashboard = new Dashboard();
});
