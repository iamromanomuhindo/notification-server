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

    // Only show notification if it's a background message without notification data
    if (!payload.notification) {
        const notificationTitle = payload.data.title || 'New Message';
        const notificationOptions = {
            body: payload.data.body || '',
            icon: payload.data.icon || '/assets/img/logo.png',
            image: payload.data.image,
            badge: '/assets/img/badge.png',
            data: { 
                url: payload.data.click_url || DEFAULT_URL
            },
            requireInteraction: true,
            vibrate: [200, 100, 200],
            actions: [{
                action: 'open_url',
                title: 'Open'
            }]
        };

        self.registration.showNotification(notificationTitle, notificationOptions);
    }
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
    console.log('Notification clicked');
    event.notification.close();

    // Get URL from notification data
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
            return clients.openWindow(clickUrl);
        })
        .catch(err => {
            console.error('Error handling click:', err);
            // Fallback
            return clients.openWindow(clickUrl);
        })
    );
});

// Handle push subscription change
self.addEventListener('pushsubscriptionchange', async (event) => {
    console.log('Push subscription change event:', event);
    const oldSubscription = event.oldSubscription;
    
    try {
        // Get new subscription
        const newSubscription = await self.registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: event.oldSubscription?.options?.applicationServerKey
        });
        
        // Here you would typically send the new subscription to your server
        console.log('New subscription obtained:', newSubscription);
        
    } catch (error) {
        console.error('Failed to resubscribe:', error);
    }
});
