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
    // Removed manual notification display.
    // With a complete notification payload, FCM will automatically display the rich media notification.
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
    console.log('Notification clicked');
    event.notification.close();

    // Get URL and campaign ID from notification data
    const clickUrl = event.notification.data?.url || DEFAULT_URL;
    const campaignId = event.notification.data?.campaignId;
    console.log('Opening URL:', clickUrl);

    // Track the click
    if (campaignId) {
        fetch('https://notification-server-f0so.onrender.com/track-click', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ campaignId })
        })
        .then(response => response.json())
        .then(data => console.log('Click tracked:', data))
        .catch(err => console.error('Error tracking click:', err));
    }

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
                if (client.url === clickUrl && 'focus' in client) {
                    return client.focus();
                }
            }
            return clients.openWindow(clickUrl);
        })
        .catch(err => {
            console.error('Error handling click:', err);
            return clients.openWindow(clickUrl);
        })
    );
});

// Handle push subscription change
self.addEventListener('pushsubscriptionchange', async (event) => {
    console.log('Push subscription change event:', event);
    try {
        const newSubscription = await self.registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: event.oldSubscription?.options?.applicationServerKey
        });
        console.log('New subscription obtained:', newSubscription);
    } catch (error) {
        console.error('Failed to resubscribe:', error);
    }
});


