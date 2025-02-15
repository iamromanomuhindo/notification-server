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

// Handle background messages
messaging.onBackgroundMessage((payload) => {
    console.log('Received background message:', payload);

    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: '/assets/img/logo.png',
        image: payload.notification.image,
        badge: '/assets/img/badge.png',
        data: payload.data,
        requireInteraction: true,
        actions: [
            {
                action: 'open',
                title: 'Open'
            }
        ]
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification clicks
self.addEventListener('notificationclick', async (event) => {
    console.log('Notification clicked:', event);

    // Close the notification
    event.notification.close();

    // Get campaign and subscriber IDs from notification data
    const campaignId = event.notification.data.campaign_id;
    const subscriberId = event.notification.data.subscriber_id;

    // Track the click
    if (campaignId && subscriberId) {
        try {
            await fetch('http://localhost:3000/track-click', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    campaignId,
                    subscriberId,
                }),
            });
        } catch (error) {
            console.error('Error tracking click:', error);
        }
    }

    // Open the click URL if available
    if (event.notification.data.click_action) {
        // Focus on existing tab if available, otherwise open new one
        event.waitUntil(
            clients.matchAll({ type: 'window', includeUncontrolled: true })
                .then((windowClients) => {
                    for (let client of windowClients) {
                        if (client.url === event.notification.data.click_action && 'focus' in client) {
                            return client.focus();
                        }
                    }
                    return clients.openWindow(event.notification.data.click_action);
                })
        );
    }
});

// Handle push events
self.addEventListener('push', event => {
    if (!event.data) return;

    try {
        const payload = event.data.json();
        console.log('Push data:', payload);

        // Get both URLs from the payload
        const clickUrl = payload.data?.click_url || 'https://manomedia.shop';
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
            vibrate: [200, 100, 200]
        };

        event.waitUntil(
            self.registration.showNotification(notificationTitle, notificationOptions)
        );
    } catch (error) {
        console.error('Error handling push:', error);
    }
});

// Handle push subscription change or unsubscribe
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
        // If resubscription fails, mark as unsubscribed in database
        await fetch('/api/unsubscribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                token: oldSubscription?.endpoint
            })
        });
    }
});
