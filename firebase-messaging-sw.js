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

    // For data-only messages or when notification payload is missing required fields
    const shouldShowNotification = !payload.notification || 
                                 !payload.notification.title ||
                                 !payload.notification.body;

    if (shouldShowNotification) {
        const notificationTitle = payload.data?.title || payload.notification?.title || 'New Message';
        const notificationOptions = {
            body: payload.data?.body || payload.notification?.body || '',
            icon: payload.data?.icon || '/assets/img/logo.png',
            image: payload.data?.image,
            badge: '/assets/img/badge.png',
            data: { 
                url: payload.data?.click_url || DEFAULT_URL
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
    // If payload.notification exists with required fields, FCM will handle it automatically
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
    console.log('Notification clicked');
    event.notification.close();

    // Get URL and campaign ID from notification data
    const clickUrl = event.notification.data?.url || DEFAULT_URL;
    const campaignId = event.notification.data?.campaignId;
    console.log('Opening URL:', clickUrl);

    // Track the click using Edge Function
    if (campaignId) {
        fetch('https://jdyugieeawrcbxpoiyho.functions.supabase.co/track-click', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpkeXVnaWVlYXdyY2J4cG9peWhvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzcyODU2NzMsImV4cCI6MjA1Mjg2MTY3M30.rvY2yZcPGrHQtqDyFUe_lO-LGu3_tZGAXOXYwJY7aD8'
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
        
        console.log('New subscription obtained:', newSubscription);
        
    } catch (error) {
        console.error('Failed to resubscribe:', error);
    }
});
