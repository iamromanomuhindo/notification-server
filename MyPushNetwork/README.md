# MANO MEDIA - Web Push Notification Admin Panel

A production-ready web push notification admin panel system built with pure HTML, CSS, and JavaScript. This system integrates Firebase Cloud Messaging (FCM) for push notifications and Supabase for real-time database management.

## Features

- 🔐 **Authentication**
  - Firebase Authentication integration
  - Role-based access control (admin, manager, viewer)
  - Secure login system

- 📊 **Dashboard**
  - Real-time statistics
  - Interactive charts and graphs
  - Geolocation heatmaps
  - Device distribution analytics

- 👥 **Subscriber Management**
  - Add and manage subscribers
  - Track subscriber status
  - Real-time activity updates
  - Geographic distribution

- 🔔 **Notification Campaigns**
  - Create and schedule notifications
  - Multi-language support
  - Emoji picker integration
  - Device-specific previews
  - Template management

- 📈 **Analytics**
  - Comprehensive performance metrics
  - Click-through rates
  - Delivery statistics
  - Geographic insights

## Prerequisites

- Firebase account with FCM enabled
- Supabase account
- Web server with HTTPS support (required for service workers)

## Setup Instructions

1. **Clone the Repository**
   ```bash
   git clone https://github.com/your-username/mano-media.git
   cd mano-media
   ```

2. **Configure Firebase**
   - Create a new Firebase project
   - Enable Authentication and Cloud Messaging
   - Update `config.js` with your Firebase credentials:
     ```javascript
     firebase: {
         apiKey: "YOUR_API_KEY",
         authDomain: "your-app.firebaseapp.com",
         projectId: "your-project-id",
         storageBucket: "your-app.appspot.com",
         messagingSenderId: "YOUR_SENDER_ID",
         appId: "YOUR_APP_ID"
     }
     ```

3. **Configure Supabase**
   - Create a new Supabase project
   - Run the provided SQL schema in Supabase SQL editor
   - Update `config.js` with your Supabase credentials:
     ```javascript
     supabase: {
         url: "YOUR_SUPABASE_URL",
         anonKey: "YOUR_ANON_KEY",
         serviceRole: "YOUR_SERVICE_ROLE_KEY"
     }
     ```

4. **Set Up VAPID Keys for Web Push**
   - Generate VAPID keys using the Firebase Console
   - Update `config.js` with your VAPID key:
     ```javascript
     fcm: {
         vapidKey: "YOUR_VAPID_KEY"
     }
     ```

5. **Configure Service Worker**
   - Update `firebase-messaging-sw.js` with your Firebase credentials

6. **Deploy to Web Server**
   - Ensure your web server supports HTTPS
   - Upload all files to your web server
   - Configure your web server to handle URL rewrites if needed

## Development Mode

For development and testing, you can use the mock data mode:

1. Set `USE_MOCK_DATA` to `true` in `config.js`:
   ```javascript
   const config = {
       USE_MOCK_DATA: true,
       // ...
   };
   ```

2. Use the following test credentials:
   - Email: admin@manomedia.com
   - Password: admin123

## Production Deployment

1. Set `USE_MOCK_DATA` to `false` in `config.js`
2. Update all configuration values with your actual credentials
3. Ensure all security measures are in place:
   - HTTPS is enabled
   - API keys are properly secured
   - Rate limiting is configured
   - Error logging is set up

## Security Considerations

- Keep your Supabase service role key secure
- Implement proper CORS policies
- Use environment variables for sensitive data
- Regular security audits
- Monitor error logs
- Implement rate limiting

## Browser Support

- Chrome 50+
- Firefox 44+
- Safari 11.1+
- Edge 17+

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@manomedia.com or create an issue in the repository.
