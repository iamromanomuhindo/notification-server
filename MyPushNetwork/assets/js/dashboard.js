class Dashboard {
    constructor() {
        this.charts = {};
        this.stats = {
            subscribers: 0,
            notifications: 0,
            deliveryRate: 0,
            clickRate: 0
        };
        this.refreshInterval = null;
        this.isLoading = true;
        this.lastUpdate = null;
        this.updateInterval = 30 * 60 * 1000; // 30 minutes
        
        this.initializeUI();
        this.setupEventListeners();
        this.initializeCharts();
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

    async loadDashboardData() {
        // Check if it's time to update
        const now = Date.now();
        if (this.lastUpdate && (now - this.lastUpdate < this.updateInterval)) {
            return;
        }

        try {
            this.isLoading = true;
            this.showLoadingState();

            // Initialize Supabase client
            const supabase = window.supabase.createClient(
                config.supabase.url,
                config.supabase.serviceRole
            );

            // Fetch all required data from Supabase
            const [
                { data: subscribers, error: subsError },
                { data: notifications, error: notifError }
            ] = await Promise.all([
                supabase.from('subscribers')
                    .select('*')
                    .order('created_at', { ascending: true }),
                supabase.from('notifications')
                    .select('*')
                    .order('created_at', { ascending: true })
            ]);

            if (subsError) throw subsError;
            if (notifError) throw notifError;

            // Calculate stats
            const totalDelivered = notifications?.filter(n => n.status === 'delivered').length || 0;
            const totalClicked = notifications?.filter(n => n.clicked).length || 0;

            const stats = {
                subscribers: subscribers.length,
                notifications: notifications?.length || 0,
                deliveryRate: notifications?.length ? 
                    (totalDelivered / notifications.length * 100).toFixed(1) : 0,
                clickRate: totalDelivered ? 
                    (totalClicked / totalDelivered * 100).toFixed(1) : 0
            };

            // Update stats display
            this.updateDashboardStats(stats);

            // Process and update chart data
            this.updatePerformanceChart(notifications);
            this.updateGrowthChart(subscribers);
            this.updateGeoChart(subscribers);
            this.updateDeviceChart(subscribers);

            this.lastUpdate = now;
            console.log('Dashboard data loaded:', { stats, lastUpdate: new Date(this.lastUpdate) });

        } catch (error) {
            console.error('Error loading dashboard data:', error);
            // Don't show error message, just keep previous data
        } finally {
            this.isLoading = false;
            this.hideLoadingState();
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
        document.getElementById('clickRate').textContent = stats.clickRate + '%';
    }

    initializeCharts() {
        const commonOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        usePointStyle: true
                    }
                }
            }
        };

        // Performance Chart
        this.charts.performance = new Chart(
            document.getElementById('performanceChart'),
            {
                type: 'line',
                data: {
                    labels: [],
                    datasets: [
                        {
                            label: 'Sent',
                            data: [],
                            borderColor: '#10B981',
                            backgroundColor: 'rgba(16, 185, 129, 0.1)',
                            tension: 0.4
                        },
                        {
                            label: 'Delivered',
                            data: [],
                            borderColor: '#3B82F6',
                            backgroundColor: 'rgba(59, 130, 246, 0.1)',
                            tension: 0.4
                        }
                    ]
                },
                options: {
                    ...commonOptions,
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                stepSize: 1
                            }
                        }
                    }
                }
            }
        );

        // Growth Chart
        this.charts.growth = new Chart(
            document.getElementById('growthChart'),
            {
                type: 'line',
                data: {
                    labels: [],
                    datasets: [{
                        label: 'Subscribers',
                        data: [],
                        borderColor: '#8B5CF6',
                        backgroundColor: 'rgba(139, 92, 246, 0.1)',
                        tension: 0.4
                    }]
                },
                options: {
                    ...commonOptions,
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                stepSize: 1
                            }
                        }
                    }
                }
            }
        );

        // Geographic Distribution Chart
        this.charts.geo = new Chart(
            document.getElementById('geoChart'),
            {
                type: 'doughnut',
                data: {
                    labels: [],
                    datasets: [{
                        data: [],
                        backgroundColor: [
                            '#10B981',
                            '#3B82F6',
                            '#8B5CF6',
                            '#EC4899',
                            '#F59E0B',
                            '#6366F1'
                        ]
                    }]
                },
                options: {
                    ...commonOptions,
                    cutout: '60%'
                }
            }
        );

        // Device Distribution Chart
        this.charts.device = new Chart(
            document.getElementById('deviceChart'),
            {
                type: 'pie',
                data: {
                    labels: [],
                    datasets: [{
                        data: [],
                        backgroundColor: [
                            '#10B981',
                            '#3B82F6',
                            '#8B5CF6'
                        ]
                    }]
                },
                options: commonOptions
            }
        );
    }

    updatePerformanceChart(notifications) {
        if (!notifications?.length) return;

        // Group by date and aggregate metrics
        const grouped = notifications.reduce((acc, n) => {
            const date = new Date(n.created_at).toLocaleDateString();
            if (!acc[date]) acc[date] = { sent: 0, delivered: 0 };
            acc[date].sent++;
            if (n.status === 'delivered') acc[date].delivered++;
            return acc;
        }, {});

        const dates = Object.keys(grouped).sort((a, b) => new Date(a) - new Date(b));
        const sent = dates.map(d => grouped[d].sent);
        const delivered = dates.map(d => grouped[d].delivered);

        this.charts.performance.data.labels = dates;
        this.charts.performance.data.datasets[0].data = sent;
        this.charts.performance.data.datasets[1].data = delivered;
        this.charts.performance.update();
    }

    updateGrowthChart(subscribers) {
        if (!subscribers?.length) return;

        // Group by date and count cumulative subscribers
        const grouped = subscribers.reduce((acc, s) => {
            const date = new Date(s.created_at).toLocaleDateString();
            acc[date] = (acc[date] || 0) + 1;
            return acc;
        }, {});

        const dates = Object.keys(grouped).sort((a, b) => new Date(a) - new Date(b));
        let cumulative = 0;
        const subscriberCounts = dates.map(date => cumulative += grouped[date]);

        this.charts.growth.data.labels = dates;
        this.charts.growth.data.datasets[0].data = subscriberCounts;
        this.charts.growth.update();
    }

    updateGeoChart(subscribers) {
        if (!subscribers?.length) return;

        // Group by country
        const grouped = subscribers.reduce((acc, s) => {
            const country = s.country || 'Unknown';
            acc[country] = (acc[country] || 0) + 1;
            return acc;
        }, {});

        const countries = Object.keys(grouped);
        const counts = countries.map(c => grouped[c]);

        this.charts.geo.data.labels = countries;
        this.charts.geo.data.datasets[0].data = counts;
        this.charts.geo.update();
    }

    updateDeviceChart(subscribers) {
        if (!subscribers?.length) return;

        // Group by device type
        const grouped = subscribers.reduce((acc, s) => {
            const device = s.device_type || 'Unknown';
            acc[device] = (acc[device] || 0) + 1;
            return acc;
        }, {});

        const devices = Object.keys(grouped);
        const counts = devices.map(d => grouped[d]);

        this.charts.device.data.labels = devices;
        this.charts.device.data.datasets[0].data = counts;
        this.charts.device.update();
    }
}

// Initialize Dashboard when DOM is loaded
let dashboard;
document.addEventListener('DOMContentLoaded', () => {
    dashboard = new Dashboard();
});
