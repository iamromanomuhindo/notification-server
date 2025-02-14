class AnalyticsManager {
    constructor() {
        this.supabase = window.supabase.createClient(
            config.supabase.url,
            config.supabase.serviceRole
        );
        this.charts = {};
        this.dateRange = {
            start: moment().subtract(30, 'days'),
            end: moment()
        };
        this.isLoading = true;
        this.refreshInterval = null;
        this.lastUpdate = null;
        this.updateInterval = 5 * 60 * 1000; // 5 minutes
        this.previousMetrics = null;

        this.initializeUI();
        this.setupEventListeners();
        this.initializeDateRangePicker();
        this.initializeCharts();
        this.loadAnalytics();
        this.setupRealtimeSubscriptions();
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
        ['deliveryRate', 'clickRate', 'engagementScore', 'bounceRate'].forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.innerHTML = '<div class="loading-spinner"></div>';
            }
        });

        // Add loading states to trends
        ['deliveryRateTrend', 'clickRateTrend', 'engagementTrend', 'bounceRateTrend'].forEach(id => {
            const element = document.getElementById(id);
            if (element && element.parentElement) {
                element.parentElement.style.display = 'none';
            }
        });

        // Mobile menu toggle
        const menuToggle = document.querySelector('.mobile-menu-toggle');
        const sidebar = document.querySelector('.sidebar');
        if (menuToggle && sidebar) {
            menuToggle.addEventListener('click', () => {
                sidebar.classList.toggle('active');
            });
        }
    }

    initializeDateRangePicker() {
        const picker = $('#dateRange').daterangepicker({
            startDate: this.dateRange.start,
            endDate: this.dateRange.end,
            ranges: {
                'Today': [moment(), moment()],
                'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                'Last 7 Days': [moment().subtract(6, 'days'), moment()],
                'Last 30 Days': [moment().subtract(29, 'days'), moment()],
                'This Month': [moment().startOf('month'), moment().endOf('month')],
                'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
            }
        }, (start, end) => {
            this.dateRange.start = start;
            this.dateRange.end = end;
            this.loadAnalytics();
        });
    }

    initializeCharts() {
        // Performance Chart
        const performanceCtx = document.getElementById('performanceChart')?.getContext('2d');
        if (performanceCtx) {
            this.charts.performance = new Chart(performanceCtx, {
                type: 'line',
                data: {
                    labels: [],
                    datasets: [{
                        label: 'Delivery Rate',
                        data: [],
                        borderColor: '#008040',
                        backgroundColor: 'rgba(0, 128, 64, 0.1)',
                        tension: 0.4,
                        fill: true
                    }]
                },
                options: this.getChartOptions()
            });
        }

        // Geographic Distribution Chart
        const geoCtx = document.getElementById('geoChart')?.getContext('2d');
        if (geoCtx) {
            this.charts.geo = new Chart(geoCtx, {
                type: 'bar',
                data: {
                    labels: [],
                    datasets: [{
                        label: 'Subscribers by Location',
                        data: [],
                        backgroundColor: 'rgba(0, 128, 64, 0.8)',
                        borderRadius: 4
                    }]
                },
                options: {
                    ...this.getChartOptions(),
                    indexAxis: 'y'
                }
            });
        }

        // Device Distribution Chart
        const deviceCtx = document.getElementById('deviceChart')?.getContext('2d');
        if (deviceCtx) {
            this.charts.device = new Chart(deviceCtx, {
                type: 'doughnut',
                data: {
                    labels: [],
                    datasets: [{
                        data: [],
                        backgroundColor: [
                            'rgba(0, 128, 64, 0.8)',
                            'rgba(0, 128, 64, 0.6)',
                            'rgba(0, 128, 64, 0.4)',
                            'rgba(0, 128, 64, 0.2)'
                        ]
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        }
                    }
                }
            });
        }

        // Time Distribution Chart
        const timeCtx = document.getElementById('timeChart')?.getContext('2d');
        if (timeCtx) {
            this.charts.time = new Chart(timeCtx, {
                type: 'bar',
                data: {
                    labels: [],
                    datasets: [{
                        label: 'Notifications by Hour',
                        data: [],
                        backgroundColor: 'rgba(0, 128, 64, 0.8)',
                        borderRadius: 4
                    }]
                },
                options: this.getChartOptions()
            });
        }
    }

    setupEventListeners() {
        // Chart metric selectors
        ['performance', 'geo', 'device', 'time'].forEach(type => {
            const selector = document.getElementById(`${type}Metric`);
            if (selector) {
                selector.addEventListener('change', () => {
                    this.showChartLoading(type);
                    this.updateChart(type);
                });
            }
        });

        // Export button
        const exportBtn = document.getElementById('exportAnalytics');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.exportData());
        }

        // Logout button
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                sessionStorage.removeItem('userSession');
                window.location.href = '../index.html';
            });
        }
    }

    setupRealtimeSubscriptions() {
        // Subscribe to notifications table changes
        const notificationsChannel = this.supabase
            .channel('analytics_notifications')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'notifications'
                },
                (payload) => {
                    console.log('Notification update received:', payload);
                    this.handleNotificationUpdate(payload);
                }
            )
            .subscribe();

        // Subscribe to clicks table changes
        const clicksChannel = this.supabase
            .channel('analytics_clicks')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'notification_clicks'
                },
                (payload) => {
                    console.log('Click update received:', payload);
                    this.handleClickUpdate(payload);
                }
            )
            .subscribe();
    }

    handleNotificationUpdate(payload) {
        // Refresh analytics data when notifications are updated
        this.loadAnalytics();
    }

    handleClickUpdate(payload) {
        // Refresh analytics data when clicks are recorded
        this.loadAnalytics();
    }

    startAutoRefresh() {
        // Clear any existing interval
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
        }

        // Set up auto-refresh every 5 minutes
        this.refreshInterval = setInterval(() => {
            console.log('Auto-refreshing analytics data...');
            this.loadAnalytics();
        }, this.updateInterval);
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
            <button onclick="analytics.loadAnalytics()" class="btn-retry">
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

    showChartLoading(chartType) {
        const container = document.querySelector(`#${chartType}Chart`).closest('.chart-container');
        container.classList.add('loading');
    }

    hideChartLoading(chartType) {
        const container = document.querySelector(`#${chartType}Chart`).closest('.chart-container');
        container.classList.remove('loading');
    }

    async loadAnalytics() {
        try {
            this.isLoading = true;
            this.updateLoadingState();

            // Fetch notifications data
            const { data: notifications, error: notificationsError } = await this.supabase
                .from('notifications')
                .select('*')
                .gte('created_at', this.dateRange.start.format('YYYY-MM-DD'))
                .lte('created_at', this.dateRange.end.format('YYYY-MM-DD'));

            if (notificationsError) throw notificationsError;

            // Fetch clicks data
            const { data: clicks, error: clicksError } = await this.supabase
                .from('notification_clicks')
                .select('*')
                .gte('created_at', this.dateRange.start.format('YYYY-MM-DD'))
                .lte('created_at', this.dateRange.end.format('YYYY-MM-DD'));

            if (clicksError) throw clicksError;

            // Process and update metrics
            this.updateMetrics(notifications, clicks);
            this.updateCharts(notifications, clicks);

            this.isLoading = false;
            this.updateLoadingState();
            this.lastUpdate = new Date();

        } catch (error) {
            console.error('Error loading analytics:', error);
            this.showError('Failed to load analytics data');
            this.isLoading = false;
            this.updateLoadingState();
        }
    }

    async fetchNotifications() {
        const { data, error } = await this.supabase
            .from('notifications')
            .select('*')
            .gte('created_at', this.dateRange.start.toISOString())
            .lte('created_at', this.dateRange.end.toISOString());

        if (error) throw error;
        return data;
    }

    async fetchSubscribers() {
        const { data, error } = await this.supabase
            .from('subscribers')
            .select('*')
            .gte('created_at', this.dateRange.start.toISOString())
            .lte('created_at', this.dateRange.end.toISOString());

        if (error) throw error;
        return data;
    }

    updateMetrics(notifications, clicks) {
        const metrics = this.calculateMetrics(notifications, clicks);
        
        // Update metric cards
        this.updateMetricCard('deliveryRate', metrics.deliveryRate);
        this.updateMetricCard('clickRate', metrics.clickRate);
        this.updateMetricCard('engagementScore', metrics.engagementScore);
        this.updateMetricCard('bounceRate', metrics.bounceRate);

        // Store metrics for trend calculation
        if (this.previousMetrics) {
            this.updateTrends(metrics);
        }
        this.previousMetrics = metrics;
    }

    calculateMetrics(notifications, clicks) {
        const totalNotifications = notifications.length;
        const totalSubscribers = 0; // Removed subscribers.length

        const delivered = notifications.filter(n => n.status === 'delivered').length;
        const clicked = clicks.length;
        const bounced = notifications.filter(n => n.status === 'failed').length;

        const deliveryRate = totalNotifications ? (delivered / totalNotifications) * 100 : 0;
        const clickRate = delivered ? (clicked / delivered) * 100 : 0;
        const bounceRate = totalNotifications ? (bounced / totalNotifications) * 100 : 0;
        
        // Calculate engagement score based on multiple factors
        const uniqueClicks = new Set(clicks.map(c => c.subscriber_id)).size;
        const engagementScore = totalSubscribers ? (uniqueClicks / totalSubscribers) * 100 : 0;

        return {
            deliveryRate,
            clickRate,
            engagementScore,
            bounceRate,
            totalNotifications,
            totalSubscribers
        };
    }

    updateAllCharts(notifications, subscribers) {
        const metrics = {
            performance: this.calculatePerformanceData(notifications),
            geo: this.calculateGeoDistribution(subscribers),
            device: this.calculateDeviceDistribution(subscribers),
            time: this.calculateTimeDistribution(notifications)
        };

        this.updatePerformanceChart(metrics.performance);
        this.updateGeoChart(metrics.geo);
        this.updateDeviceChart(metrics.device);
        this.updateTimeChart(metrics.time);
    }

    calculatePerformanceData(notifications) {
        const dailyData = {};
        const now = moment();
        
        // Initialize all days in the range
        for (let m = moment(this.dateRange.start); m.isSameOrBefore(this.dateRange.end); m.add(1, 'days')) {
            dailyData[m.format('YYYY-MM-DD')] = {
                total: 0,
                delivered: 0,
                clicked: 0
            };
        }

        // Aggregate notification data
        notifications.forEach(notification => {
            const day = moment(notification.created_at).format('YYYY-MM-DD');
            if (dailyData[day]) {
                dailyData[day].total++;
                if (notification.status === 'delivered') dailyData[day].delivered++;
            }
        });

        return Object.entries(dailyData).map(([date, data]) => ({
            date,
            deliveryRate: data.total ? (data.delivered / data.total) * 100 : 0,
            clickRate: data.delivered ? (data.clicked / data.delivered) * 100 : 0
        }));
    }

    calculateGeoDistribution(subscribers) {
        const geoData = {};
        subscribers.forEach(sub => {
            if (sub.location) {
                geoData[sub.location] = (geoData[sub.location] || 0) + 1;
            }
        });

        return Object.entries(geoData)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10);
    }

    calculateDeviceDistribution(subscribers) {
        const deviceData = {};
        subscribers.forEach(sub => {
            if (sub.device_type) {
                deviceData[sub.device_type] = (deviceData[sub.device_type] || 0) + 1;
            }
        });

        return Object.entries(deviceData)
            .sort((a, b) => b[1] - a[1]);
    }

    calculateTimeDistribution(notifications) {
        const hourlyData = Array(24).fill(0);
        
        notifications.forEach(notification => {
            const hour = moment(notification.created_at).hour();
            hourlyData[hour]++;
        });

        return hourlyData.map((count, hour) => ({
            hour: hour.toString().padStart(2, '0') + ':00',
            count
        }));
    }

    updatePerformanceChart(data) {
        if (!this.charts.performance) return;

        const chart = this.charts.performance;
        const metric = document.getElementById('performanceMetric').value;

        chart.data.labels = data.map(d => moment(d.date).format('MMM D'));
        chart.data.datasets[0] = {
            label: metric === 'deliveryRate' ? 'Delivery Rate' : 'Click Rate',
            data: data.map(d => d[metric]),
            borderColor: '#008040',
            backgroundColor: 'rgba(0, 128, 64, 0.1)',
            tension: 0.4,
            fill: true
        };

        chart.update();
    }

    updateGeoChart(data) {
        if (!this.charts.geo) return;

        const chart = this.charts.geo;
        chart.data.labels = data.map(([location]) => location);
        chart.data.datasets[0].data = data.map(([, count]) => count);
        chart.update();
    }

    updateDeviceChart(data) {
        if (!this.charts.device) return;

        const chart = this.charts.device;
        chart.data.labels = data.map(([device]) => device);
        chart.data.datasets[0].data = data.map(([, count]) => count);
        chart.update();
    }

    updateTimeChart(data) {
        if (!this.charts.time) return;

        const chart = this.charts.time;
        chart.data.labels = data.map(d => d.hour);
        chart.data.datasets[0].data = data.map(d => d.count);
        chart.update();
    }

    exportData() {
        const data = {
            dateRange: {
                start: this.dateRange.start.format('YYYY-MM-DD'),
                end: this.dateRange.end.format('YYYY-MM-DD')
            },
            metrics: this.previousMetrics,
            charts: {
                performance: this.charts.performance?.data,
                geo: this.charts.geo?.data,
                device: this.charts.device?.data,
                time: this.charts.time?.data
            }
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `analytics_${moment().format('YYYY-MM-DD')}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    getChartOptions() {
        return {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#ffffff'
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#ffffff'
                    }
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#ffffff'
                    }
                }
            }
        };
    }

    updateMetricCard(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = `${value.toFixed(1)}%`;
        }
    }

    updateTrends(metrics) {
        ['deliveryRate', 'clickRate', 'engagementScore', 'bounceRate'].forEach(id => {
            const trendElement = document.getElementById(`${id}Trend`);
            const trendContainer = trendElement.parentElement;
            const trendIcon = trendContainer.querySelector('i');

            const difference = metrics[id] - this.previousMetrics[id];
            const percentChange = this.previousMetrics[id] ? (difference / this.previousMetrics[id]) * 100 : 0;

            trendElement.textContent = `${Math.abs(percentChange).toFixed(1)}%`;
            trendContainer.classList.remove('positive', 'negative');
            trendContainer.classList.add(difference >= 0 ? 'positive' : 'negative');
            trendIcon.className = `fas fa-arrow-${difference >= 0 ? 'up' : 'down'}`;
            trendContainer.style.display = 'flex';
        });
    }

    showLoadingState() {
        document.querySelectorAll('.chart-container').forEach(container => {
            container.classList.add('loading');
        });
    }

    hideLoadingState() {
        document.querySelectorAll('.chart-container').forEach(container => {
            container.classList.remove('loading');
        });
    }

    updateLoadingState() {
        const loadingElement = document.getElementById('loading-state');
        if (loadingElement) {
            if (this.isLoading) {
                loadingElement.style.display = 'block';
            } else {
                loadingElement.style.display = 'none';
            }
        }
    }
}

// Initialize analytics when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.analyticsManager = new AnalyticsManager();
});
