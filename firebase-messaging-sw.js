// Import and configure the Firebase SDK
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "AIzaSyC0GLlf0R9zVdr_1Kf5I330GVLwGLpCbJ4",
    authDomain: "manomediapush.firebaseapp.com",
    projectId: "manomediapush",
    storageBucket: "manomediapush.firebasestorage.app",
    messagingSenderId: "555436210817",
    appId: "1:555436210817:web:9990362d0719508f84eb80"
});

const messaging = firebase.messaging();
const DEFAULT_URL = 'https://datingsites30plus.online';

// Handle background messages
messaging.onBackgroundMessage((payload) => {
    console.log('Received background message:', payload);

    // Get both URLs from the payload
    const clickUrl = payload.data?.click_url || DEFAULT_URL;
    const originalUrl = payload.data?.original_url;

    console.log('Click URL:', clickUrl);
    console.log('Original URL:', originalUrl);

    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: '/assets/img/logo.png',
        image: payload.notification.image,
        badge: '/assets/img/badge.png',
        data: { 
            url: clickUrl,
            originalUrl: originalUrl 
        },
        requireInteraction: true,
        vibrate: [200, 100, 200],
        actions: [{
            action: 'open_url',
            title: 'Open'
        }]
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
    console.log('Notification clicked');
    event.notification.close();

    // Get URLs from notification data
    const clickUrl = event.notification.data?.url || DEFAULT_URL;
    console.log('Opening URL:', clickUrl);

    // Try to open the window
    event.waitUntil(
        clients.matchAll({
            type: 'window',
            includeUncontrolled: true
        })
        .then(windowClients => {
            // Check if there is already a window/tab open with the target URL
            for (let i = 0; i < windowClients.length; i++) {
                const client = windowClients[i];
                // If so, just focus it.
                if (client.url === clickUrl && 'focus' in client) {
                    return client.focus();
                }
            }
            // If not, open a new window.
            return clients.openWindow(clickUrl).catch(err => {
                console.error('Failed to open window:', err);
                // Try a simpler window.open as fallback
                return new Promise((resolve) => {
                    const newWindow = window.open(clickUrl, '_blank');
                    resolve(newWindow);
                });
            });
        })
        .catch(err => {
            console.error('Error handling click:', err);
            // Final fallback
            return clients.openWindow(clickUrl);
        })
    );
});

// Handle push events
self.addEventListener('push', event => {
    if (!event.data) return;

    try {
        const payload = event.data.json();
        console.log('Push data:', payload);

        // Get both URLs from the payload
        const clickUrl = payload.data?.click_url || DEFAULT_URL;
        const originalUrl = payload.data?.original_url;

        console.log('Click URL:', clickUrl);
        console.log('Original URL:', originalUrl);

        const notificationTitle = payload.notification.title;
        const notificationOptions = {
            body: payload.notification.body,
            icon: '/assets/img/logo.png',
            image: payload.notification.image,
            badge: '/assets/img/badge.png',
            data: { 
                url: clickUrl,
                originalUrl: originalUrl 
            },
            requireInteraction: true,
            vibrate: [200, 100, 200],
            actions: [{
                action: 'open_url',
                title: 'Open'
            }]
        };

        event.waitUntil(
            self.registration.showNotification(notificationTitle, notificationOptions)
        );
    } catch (error) {
        console.error('Error handling push:', error);
    }
});

// Handle push subscription change
self.addEventListener('pushsubscriptionchange', async (event) => {
    const oldSubscription = event.oldSubscription;
    
    try {
        // Try to resubscribe
        const newSubscription = await registration.pushManager.subscribe({ 
            userVisibleOnly: true 
        });
        
        // Send to backend
        const response = await fetch('/api/update-subscription', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                oldToken: oldSubscription?.endpoint,
                newToken: newSubscription.endpoint
            })
        });
        
        if (!response.ok) {
            throw new Error('Failed to update subscription');
        }
    } catch (error) {
        console.error('Subscription change error:', error);
        // If resubscription fails, mark as unsubscribed
        await fetch('/api/unsubscribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                token: oldSubscription?.endpoint
            })
        });
    }
});
