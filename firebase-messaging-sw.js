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

    // If payload contains a complete notification payload, FCM will display it automatically.
    // Fallback to custom display if required fields are missing.
    const hasCompleteNotification = payload.notification && payload.notification.title && payload.notification.body;
    if (!hasCompleteNotification) {
        const notificationTitle = payload.data?.title || 'New Message';
        const notificationOptions = {
            body: payload.data?.body || '',
            icon: payload.data?.icon || '/assets/img/logo.png',
            image: payload.data?.image,
            badge: '/assets/img/badge.png',
            data: { 
                url: payload.data?.click_url || DEFAULT_URL,
                campaignId: payload.data?.campaignId || ''
            },
            requireInteraction: true,
            vibrate: [200, 100, 200],
            actions: [{
                action: 'open_url',
                title: payload.data?.cta_text || 'Open'
            }]
        };
        self.registration.showNotification(notificationTitle, notificationOptions);
    }
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
    console.log('Notification clicked');
    event.notification.close();

    const clickUrl = event.notification.data?.url || DEFAULT_URL;
    const campaignId = event.notification.data?.campaignId;
    console.log('Opening URL:', clickUrl);

    // Track the click using your tracking endpoint
    if (campaignId) {
        fetch('https://jdyugieeawrcbxpoiyho.functions.supabase.co/track-click', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Replace with your appropriate authorization if needed
                'Authorization': 'Bearer YOUR_SUPABASE_ANON_KEY'
            },
            body: JSON.stringify({
                campaignId,
                url: clickUrl,
                userAgent: self.navigator.userAgent
            })
        })
        .then(response => response.json())
        .then(data => console.log('Click tracked:', data))
        .catch(err => console.error('Error tracking click:', err));
    }

    event.waitUntil(
        clients.matchAll({
            type: 'window',
            includeUncontrolled: true
        })
        .then(windowClients => {
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

// Handle push subscription changes
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

