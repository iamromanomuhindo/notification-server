// Configuration Settings
const config = {
    // Toggle between mock data and real data
    USE_MOCK_DATA: false,

    // Firebase Configuration
    firebase: {
        apiKey: "AIzaSyC0GLlf0R9zVdr_1Kf5I330GVLwGLpCbJ4",
        authDomain: "manomediapush.firebaseapp.com",
        projectId: "manomediapush",
        storageBucket: "manomediapush.firebasestorage.app",
        messagingSenderId: "555436210817",
        appId: "1:555436210817:web:9990362d0719508f84eb80",
        measurementId: "G-G1MBFVRWNV",
        region: "us-central1"  // Add Firebase Cloud Functions region
    },

    // Supabase Configuration
    supabase: {
        url: "https://jdyugieeawrcbxpoiyho.supabase.co",
        anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpkeXVnaWVlYXdyY2J4cG9peWhvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzcyODU2NzMsImV4cCI6MjA1Mjg2MTY3M30.ICFZ4gNMeo_C6KDWVzscCwTx9qZWK6sHQavg1L_Y1OQ",
        serviceRole: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpkeXVnaWVlYXdyY2J4cG9peWhvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNzI4NTY3MywiZXhwIjoyMDUyODYxNjczfQ.LjYypQbIYm30-4jgLUg1r8I4Wug5HBEOg_QYPrxQk0M" // Keep this secret in production
    },

    // FCM Configuration
    fcm: {
        vapidKey: "BN6qhGtnqlp9bxyakErnWyXIMbUSbS3Ex6uuQaObNrNmbrN3vqyswMVt4R5vsDZDDtnOrKPsb9oAg-TybrmPQZg"
    },

    // API Endpoints
    endpoints: {
        notifications: "/api/notifications",
        subscribers: "/api/subscribers",
        analytics: "/api/analytics"
    },

    // Rate Limiting
    rateLimit: {
        maxRequests: 100,
        timeWindow: 60000 // 1 minute in milliseconds
    },

    // Analytics Settings
    analytics: {
        refreshInterval: 30000, // 30 seconds
        retentionDays: 30
    }
};

// Initialize Firebase
if (!config.USE_MOCK_DATA) {
    firebase.initializeApp(config.firebase);
}

// Error tracking configuration
window.onerror = function(msg, url, lineNo, columnNo, error) {
    const errorDetails = {
        message: msg,
        url: url,
        line: lineNo,
        column: columnNo,
        error: error?.stack,
        userEmail: sessionStorage.getItem('userSession')?.email,
        timestamp: new Date().toISOString()
    };
    
    // Log to console in development
    console.error('Error:', errorDetails);
    
    // You can add server logging here if needed
    // fetch('/api/log-error', {
    //     method: 'POST',
    //     body: JSON.stringify(errorDetails)
    // });
    
    return false;
};

// Unhandled promise rejection tracking
window.onunhandledrejection = function(event) {
    console.error('Unhandled promise rejection:', event.reason);
};
