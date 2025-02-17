// Push Notification Manager
class PushManager {
    constructor() {
        this.messaging = null;
        this.initialize();
    }

    async initialize() {
        try {
            // Initialize Firebase Messaging
            this.messaging = firebase.messaging();
            
            // Register service worker
            if ('serviceWorker' in navigator) {
                const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
                    scope: '/'
                });
                console.log('Service Worker registered:', registration);
            }

            // Request permission and get the token
            const permission = await this.requestNotificationPermission();
            if (!permission) {
                console.log('Notification permission not granted');
                return;
            }
            
            // Get registration token
            const token = await this.messaging.getToken({
                vapidKey: config.fcm.vapidKey,
                serviceWorkerRegistration: await navigator.serviceWorker.ready
            });
            
            if (token) {
                console.log('FCM Token:', token);
                await this.saveTokenToDatabase(token);
            } else {
                console.log('No registration token available');
            }

            // Handle token refresh
            this.messaging.onTokenRefresh(async () => {
                try {
                    const newToken = await this.messaging.getToken({
                        vapidKey: config.fcm.vapidKey,
                        serviceWorkerRegistration: await navigator.serviceWorker.ready
                    });
                    console.log('Token refreshed:', newToken);
                    await this.saveTokenToDatabase(newToken);
                } catch (err) {
                    console.error('Error refreshing token:', err);
                }
            });

            // Handle foreground messages
            this.messaging.onMessage((payload) => {
                console.log('Received foreground message:', payload);
                
                // Only show notification for data-only messages or if notification payload is incomplete
                const shouldShowNotification = !payload.notification || 
                                            !payload.notification.title ||
                                            !payload.notification.body;
                
                if (shouldShowNotification) {
                    this.showNotification(payload);
                }
                // Let FCM handle complete notification payloads automatically
            });

        } catch (error) {
            console.error('Error initializing push notifications:', error);
        }
    }

    async requestNotificationPermission() {
        try {
            const permission = await Notification.requestPermission();
            console.log('Notification permission status:', permission);
            return permission === 'granted';
        } catch (error) {
            console.error('Error requesting notification permission:', error);
            return false;
        }
    }

    async saveTokenToDatabase(token) {
        const supabase = window.supabase.createClient(
            config.supabase.url,
            config.supabase.serviceRole
        );

        try {
            const { data, error } = await supabase
                .from('push_tokens')
                .upsert([
                    {
                        token: token,
                        user_agent: navigator.userAgent,
                        created_at: new Date().toISOString(),
                        last_used: new Date().toISOString()
                    }
                ], {
                    onConflict: 'token',
                    update: ['last_used', 'user_agent']
                });

            if (error) throw error;
            console.log('Token saved to database');

        } catch (error) {
            console.error('Error saving token to database:', error);
        }
    }

    async showNotification(payload) {
        if (!('Notification' in window)) {
            console.log('This browser does not support notifications');
            return;
        }

        // Use data payload if available, fallback to notification payload
        const notificationTitle = payload.data?.title || payload.notification?.title || 'New Message';
        const notificationOptions = {
            body: payload.data?.body || payload.notification?.body || '',
            icon: payload.data?.icon || payload.notification?.icon || '/assets/img/logo.png',
            image: payload.data?.image || payload.notification?.image,
            badge: '/assets/img/badge.png',
            data: {
                url: payload.data?.click_url || payload.notification?.click_action || '/'
            },
            requireInteraction: true,
            vibrate: [200, 100, 200],
            actions: [
                {
                    action: 'open_url',
                    title: payload.data?.cta_text || payload.notification?.cta_text || 'Open'
                }
            ]
        };

        try {
            if ('serviceWorker' in navigator) {
                const registration = await navigator.serviceWorker.ready;
                await registration.showNotification(notificationTitle, notificationOptions);
            } else {
                new Notification(notificationTitle, notificationOptions);
            }
        } catch (error) {
            console.error('Error showing notification:', error);
        }
    }
}

// Initialize PushManager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PushManager();
});

