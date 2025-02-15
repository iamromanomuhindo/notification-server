// ====================
// Firebase Initialization
// ====================

// Replace with your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC0GLlf0R9zVdr_1Kf5I330GVLwGLpCbJ4",
  authDomain: "manomediapush.firebaseapp.com",
  projectId: "manomediapush",
  storageBucket: "manomediapush.firebasestorage.app",
  messagingSenderId: "555436210817",
  appId: "1:555436210817:web:9990362d0719508f84eb80"
};

// Initialize Firebase if it hasn't been already
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const messaging = firebase.messaging();

// Define your public VAPID key (safe to expose on the client)
const VAPID_KEY = "BN6qhGtnqlp9bxyakErnWyXIMbUSbS3Ex6uuQaObNrNmbrN3vqyswMVt4R5vsDZDDtnOrKPsb9oAg-TybrmPQZg";

// ====================
// Supabase Initialization
// ====================

// Replace with your Supabase project details
const SUPABASE_URL = "https://jdyugieeawrcbxpoiyho.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpkeXVnaWVlYXdyY2J4cG9peWhvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzcyODU2NzMsImV4cCI6MjA1Mjg2MTY3M30.ICFZ4gNMeo_C6KDWVzscCwTx9qZWK6sHQavg1L_Y1OQ";

// Initialize the Supabase client
const supabaseClient = (typeof supabase !== "undefined" && supabase.createClient)
  ? supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

// ====================
// Redirect URL for VPN/Proxy users
// ====================
const REDIRECT_URL = "https://mdundo.com"; // Replace with the URL to redirect VPN/proxy users

// ====================
// API Key Rotation Setup for Abstract API
// ====================

// List your API keys here
const abstractApiKeys = [
  "793c930ddc6f43c1bd53173a996206e9",
  "YOUR_ABSTRACT_API_KEY_2"
  // Add more API keys as needed
];

let currentKeyIndex = 0;
let requestCount = 0;

/**
 * Returns the current API key and increments the counter.
 * Once 900 requests have been made using the current key, that key is removed
 * ("commented out") from the active list and the next key is used.
 */
function getNextAbstractApiKey() {
  requestCount++;
  if (requestCount >= 900) {
    console.log(
      `API key ${abstractApiKeys[currentKeyIndex]} has reached 900 requests and will be deactivated.`
    );
    // Remove the key from the active pool
    abstractApiKeys.splice(currentKeyIndex, 1);
    // Reset the counter for the next key
    requestCount = 0;
    if (abstractApiKeys.length === 0) {
      throw new Error("All API keys have been exhausted.");
    }
    // After removal, currentKeyIndex remains 0 (the next key in the array)
  }
  return abstractApiKeys[currentKeyIndex];
}

// ====================
// Combined Abstract API Function
// ====================

async function getAbstractData() {
  const apiKey = getNextAbstractApiKey();
  const url = `https://ipgeolocation.abstractapi.com/v1/?api_key=${apiKey}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data; // Data includes location info (country, city, latitude, longitude) and security details.
  } catch (error) {
    console.error("Error fetching Abstract API data:", error);
    return null;
  }
}

// ====================
// Device and Browser Detection Functions
// ====================

// Detect device type (mobile, tablet, or desktop)
function getDeviceType() {
  const ua = navigator.userAgent;
  if (/Mobi|Android/i.test(ua)) {
    if (/Tablet|iPad/i.test(ua)) {
      return "tablet";
    }
    return "mobile";
  }
  return "desktop";
}

// Detect browser type (Chrome, Firefox, Safari, or Edge)
function getBrowserType() {
  const ua = navigator.userAgent;
  if (ua.indexOf("Edge/") > -1 || ua.indexOf("Edg/") > -1) {
    return "Edge";
  } else if (ua.indexOf("Chrome/") > -1 && ua.indexOf("Safari/") > -1) {
    return "Chrome";
  } else if (ua.indexOf("Firefox/") > -1) {
    return "Firefox";
  } else if (ua.indexOf("Safari/") > -1 && ua.indexOf("Chrome/") === -1) {
    return "Safari";
  }
  return "Unknown";
}

// ====================
// Save Subscriber Data to Supabase
// ====================

async function saveUserDataToSupabase(userUid, fcmToken, ipLocationData, isProxyOrVpn, deviceType, browserType) {
  // Use the country from the IP-based data provided by Abstract API
  const ipCountry = ipLocationData?.country || "Unknown";
  const currentTime = new Date().toISOString();

  // Insert data into your "subscribers" table in Supabase
  const { error } = await supabaseClient
    .from("subscribers")
    .insert({
      id: userUid,                // Using the FCM token as a unique identifier
      device_id: fcmToken,        // Full FCM token as device_id
      browser: browserType,       // Browser type (Chrome, Firefox, etc)
      country: ipCountry,         // Country from Abstract API
      city: ipLocationData?.city || "Unknown", // City from Abstract API
      latitude: ipLocationData?.latitude || null,
      longitude: ipLocationData?.longitude || null,
      status: 'active',           // Initial status is active
      last_active_at: currentTime,
      created_at: currentTime,
      device_type: deviceType,    // Additional info (mobile, tablet, desktop)
      is_proxy_or_vpn: isProxyOrVpn || false
    });

  if (error) {
    console.error("Error inserting data into Supabase:", error);
  } else {
    console.log("Subscriber data saved to Supabase.");
  }
}

// ====================
// UI Functions for Subscription Modal
// ====================

// Check if the user has already granted notification permission
function isUserSubscribed() {
  return Notification.permission === "granted";
}

// Display a modal to prompt the user for notification permission
function showModal() {
  const modal = document.createElement("div");
  modal.style.position = "fixed";
  modal.style.top = "0";
  modal.style.left = "0";
  modal.style.width = "100%";
  modal.style.height = "100%";
  modal.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
  modal.style.display = "flex";
  modal.style.justifyContent = "center";
  modal.style.alignItems = "center";
  modal.style.zIndex = "9999";

  const content = document.createElement("div");
  content.style.backgroundColor = "#fff";
  content.style.padding = "20px 40px";
  content.style.borderRadius = "8px";
  content.style.boxShadow = "0 4px 10px rgba(0, 0, 0, 0.2)";

  const icon = document.createElement("img");
  icon.src = "https://via.placeholder.com/50"; // Replace with your padlock icon URL if desired
  icon.style.width = "50px";
  icon.style.height = "50px";
  icon.style.marginBottom = "10px";

  const message = document.createElement("p");
  message.textContent =
    "This website's content is locked. Please click 'Allow Notifications' to unlock the site.";
  message.style.textAlign = "center";
  message.style.fontSize = "16px";
  message.style.color = "#333";

  const buttons = document.createElement("div");
  buttons.style.display = "flex";
  buttons.style.gap = "10px";
  buttons.style.justifyContent = "center";
  buttons.style.marginTop = "20px";

  const cancelBtn = document.createElement("button");
  cancelBtn.textContent = "Cancel";
  cancelBtn.style.backgroundColor = "#ccc";
  cancelBtn.style.color = "#333";
  cancelBtn.style.padding = "10px 20px";
  cancelBtn.style.border = "none";
  cancelBtn.style.borderRadius = "4px";
  cancelBtn.style.cursor = "pointer";

  const allowBtn = document.createElement("button");
  allowBtn.textContent = "Allow";
  allowBtn.style.backgroundColor = "#007bff";
  allowBtn.style.color = "#fff";
  allowBtn.style.padding = "10px 20px";
  allowBtn.style.border = "none";
  allowBtn.style.borderRadius = "4px";
  allowBtn.style.cursor = "pointer";

  cancelBtn.addEventListener("click", () => {
    modal.remove();
    setTimeout(() => showModal(), 100); // Re-show modal on next interaction
  });

  allowBtn.addEventListener("click", async () => {
    // Request permission using the modern Notification API
    if ("Notification" in window && Notification.permission !== "granted") {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        // Get the token using the public VAPID key
        const token = await messaging.getToken({ vapidKey: VAPID_KEY });
        if (token) {
          const userUid = token; // Use the FCM token as a unique identifier

          // Retrieve Abstract API data (location and security) with a single request
          const abstractData = await getAbstractData();
          if (!abstractData) {
            alert("Failed to fetch location data.");
            return;
          }

          // Extract location data
          const ipLocationData = {
            country: abstractData.country,
            city: abstractData.city,
            latitude: abstractData.latitude,
            longitude: abstractData.longitude
          };

          // Check for VPN/proxy usage from the security section
          const proxyOrVpn = abstractData.security &&
                             (abstractData.security.is_vpn || abstractData.security.is_proxy);

          // If a proxy or VPN is detected, redirect the user immediately
          if (proxyOrVpn) {
            window.location.href = REDIRECT_URL;
            return; // Stop further processing
          }

          // Collect device and browser type data
          const deviceType = getDeviceType();
          const browserType = getBrowserType();

          // Save subscriber data to Supabase with all information
          await saveUserDataToSupabase(
            userUid,
            token,
            ipLocationData,
            proxyOrVpn,
            deviceType,
            browserType
          );

          modal.remove(); // Grant access by removing the modal
        } else {
          alert("Failed to retrieve push notification token.");
        }
      } else {
        alert("Notifications must be allowed to access this site.");
        window.location.href = "/blocked.html"; // Redirect to a blocked page if necessary
      }
    } else {
      alert("Your browser does not support push notifications.");
    }
  });

  buttons.appendChild(cancelBtn);
  buttons.appendChild(allowBtn);

  content.appendChild(icon);
  content.appendChild(message);
  content.appendChild(buttons);

  modal.appendChild(content);
  document.body.appendChild(modal);
}

// Prevent interactions until the user subscribes
function blockInteractions() {
  const blocker = document.createElement("div");
  blocker.style.position = "fixed";
  blocker.style.top = "0";
  blocker.style.left = "0";
  blocker.style.width = "100%";
  blocker.style.height = "100%";
  blocker.style.backgroundColor = "transparent";
  blocker.style.zIndex = "9998";

  blocker.addEventListener("click", (e) => {
    e.preventDefault();
    showModal();
  });

  document.body.appendChild(blocker);
}

// ====================
// Subscription Management
// ====================

// Handle unsubscribe request (only for manual unsubscribe button if you have one)
async function handleUnsubscribe() {
  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    
    if (subscription) {
      await subscription.unsubscribe();
      // Firebase will automatically detect this and send a token invalidation
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error unsubscribing:", error);
    return false;
  }
}

// ====================
// Main Initialization Logic
// ====================

(async () => {
  if (!("Notification" in window)) {
    alert("Your browser does not support push notifications.");
    return;
  }

  // Request permission if not already granted using the modern Notification API
  if (Notification.permission !== "granted") {
    await Notification.requestPermission();
  }

  // Get the token using the public VAPID key
  const token = await messaging.getToken({ vapidKey: VAPID_KEY });
  if (token && isUserSubscribed()) {
    console.log("User is already subscribed.");
    return;
  }

  blockInteractions(); // Block interactions until the user subscribes
})();
