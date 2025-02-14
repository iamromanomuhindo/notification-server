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

// Function to handle opening URLs
function openUrl(url) {
    if (!url || !url.startsWith('http')) {
        console.warn('Invalid URL:', url);
        url = 'https://manomedia.shop';
    }
    
    return clients.matchAll({
        type: 'window',
        includeUncontrolled: true
    }).then(clientList => {
        // If we have a client, try to focus it
        for (const client of clientList) {
            if (client.url === url && 'focus' in client) {
                return client.focus();
            }
        }
        
        // If no matching client, open new window
        if (clients.openWindow) {
            return clients.openWindow(url).catch(err => {
                console.error('Failed to open window:', err);
                // Fallback: try direct window.open
                return self.clients.openWindow(url);
            });
        }
    }).catch(err => {
        console.error('Error handling URL:', err);
        // Last resort fallback
        return self.clients.openWindow(url);
    });
}

// Handle background messages
messaging.onBackgroundMessage((payload) => {
    console.log('Received background message:', payload);
    
    // Extract click URL from payload
    const clickUrl = payload.data?.click_url || 'https://manomedia.shop';
    console.log('Click URL from payload:', clickUrl);

    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: '/assets/img/logo.png',
        image: payload.notification.image,
        badge: '/assets/img/badge.png',
        tag: payload.data?.campaign_id || 'default',
        renotify: true,
        requireInteraction: true,
        vibrate: [200, 100, 200],
        data: {
            click_url: clickUrl,
            campaign_id: payload.data?.campaign_id
        },
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
self.addEventListener('notificationclick', function(event) {
    console.log('Notification clicked:', event);
    
    // Close the notification
    event.notification.close();

    // Get click URL from notification data
    const data = event.notification.data || {};
    const clickUrl = data.click_url || 'https://manomedia.shop';
    
    console.log('Opening URL:', clickUrl);
    
    // Handle the click action
    event.waitUntil(openUrl(clickUrl));
});

// Handle push events
self.addEventListener('push', function(event) {
    console.log('Push event received:', event);
    
    if (event.data) {
        try {
            const payload = event.data.json();
            console.log('Push data:', payload);

            // Extract click URL from payload
            const clickUrl = payload.data?.click_url || 'https://manomedia.shop';
            console.log('Click URL from push:', clickUrl);

            const notificationTitle = payload.notification.title;
            const notificationOptions = {
                body: payload.notification.body,
                icon: '/assets/img/logo.png',
                image: payload.notification.image,
                badge: '/assets/img/badge.png',
                tag: payload.data?.campaign_id || 'default',
                renotify: true,
                requireInteraction: true,
                vibrate: [200, 100, 200],
                data: {
                    click_url: clickUrl,
                    campaign_id: payload.data?.campaign_id
                },
                actions: [
                    {
                        action: 'open',
                        title: 'Open'
                    }
                ]
            };

            event.waitUntil(
                self.registration.showNotification(notificationTitle, notificationOptions)
            );
        } catch (error) {
            console.error('Error handling push event:', error);
        }
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
