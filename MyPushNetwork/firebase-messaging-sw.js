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
        icon: payload.notification.icon || '/assets/img/logo.png',
        image: payload.notification.image,
        badge: '/assets/img/badge.png',
        data: payload.data || {}, // Ensure data exists
        requireInteraction: true,
        vibrate: [200, 100, 200],
        actions: [
            {
                action: 'open_url',
                title: payload.notification.cta_text || 'Open'
            }
        ]
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
    console.log('Notification clicked:', event);
    event.notification.close();

    // Get the URL from notification data or fallback to default
    let url = '/';
    
    if (event.notification.data) {
        // Check for direct URL in data
        if (event.notification.data.url) {
            url = event.notification.data.url;
        } 
        // Check for click_url in data
        else if (event.notification.data.click_url) {
            url = event.notification.data.click_url;
        }
    }

    // Log the URL being opened
    console.log('Opening URL:', url);
    
    // Open the URL in a new window/tab
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true })
            .then((clientList) => {
                // Try to reuse an existing window
                for (const client of clientList) {
                    if (client.url === url && 'focus' in client) {
                        return client.focus();
                    }
                }
                
                // If we have a client but not matching the URL, navigate to it
                if (clientList.length > 0) {
                    const client = clientList[0];
                    return client.navigate(url).then(client => client.focus());
                }
                
                // If no client is open, open a new window
                return clients.openWindow(url);
            })
            .catch(err => {
                console.error('Error opening notification URL:', err);
                // Fallback to simple window.open
                return clients.openWindow(url);
            })
    );
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
