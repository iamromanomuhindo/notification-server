# MANO MEDIA - Web Push Notification Admin Panel

A production-ready web push notification admin panel system built with pure HTML, CSS, and JavaScript. This system integrates Firebase Cloud Messaging (FCM) for push notifications and Supabase for real-time database management.

## System Overview

### 1. Authentication Flow
1. Users visit the login page
2. Enter their credentials (email/password)
3. Firebase Authentication verifies credentials
4. Upon successful login:
   - JWT token is generated
   - User session is created
   - Redirect to dashboard
5. Session persistence handles automatic login

### 2. Dashboard Overview
The dashboard provides real-time insights through four main sections:

#### Performance Cards
- **Active Subscribers**: Total number of valid FCM tokens
- **Notifications Sent**: Total notifications delivered
- **Delivery Rate**: Successful delivery percentage
- **Total Clicks**: Notification interaction count

#### Interactive Charts
1. **Notification Performance**
   - Line chart showing sent vs delivered vs clicked
   - 30-day historical data
   - Real-time updates

2. **Subscriber Growth**
   - Bar chart of new subscribers
   - Daily acquisition metrics
   - Trend analysis

3. **Geographic Distribution**
   - Doughnut chart of subscriber locations
   - Region-wise breakdown
   - Country-specific insights

4. **Device Distribution**
   - Doughnut chart of device types
   - Mobile vs Desktop vs Tablet
   - Platform-specific data

### 3. Notification System
The notification system operates in three main stages:

1. **Campaign Creation**
   - Set notification title and message
   - Upload images/icons
   - Define target audience
   - Set click URL

2. **Delivery Process**
   - Server receives campaign request
   - Subscribers are filtered based on targeting
   - Tokens are processed in batches (500 per batch)
   - Exponential backoff between batches
   - Invalid tokens are automatically cleaned up

3. **Analytics Tracking**
   - Delivery status monitoring
   - Click tracking
   - Performance metrics
   - Error logging

## Complete Setup Guide

### Step 1: Firebase Setup

1. **Create Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com)
   - Click "Add Project"
   - Enter project name: "YourCompanyName-Notifications"
   - Enable Google Analytics (recommended)

2. **Enable Authentication**
   - In Firebase Console, go to "Authentication"
   - Click "Get Started"
   - Enable Email/Password authentication
   - Add your first admin user

3. **Set Up Cloud Messaging**
   - Go to Project Settings
   - Navigate to "Cloud Messaging"
   - Generate new Web Push certificate
   - Save the VAPID key

4. **Get Configuration**
   - In Project Settings
   - Find "Your apps" section
   - Click web icon (</>)
   - Register app and copy config

### Step 2: Supabase Setup

1. **Create Project**
   - Visit [Supabase](https://supabase.com)
   - Create new project
   - Note down project URL and keys

2. **Database Setup**
   Run these SQL commands in Supabase SQL editor:

   ```sql
   -- Subscribers table
   CREATE TABLE subscribers (
     id TEXT PRIMARY KEY,
     device_type TEXT,
     country TEXT,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
     last_active TIMESTAMP WITH TIME ZONE,
     status TEXT DEFAULT 'active'
   );

   -- Notifications table
   CREATE TABLE notifications (
     id SERIAL PRIMARY KEY,
     title TEXT NOT NULL,
     message TEXT NOT NULL,
     icon_url TEXT,
     image_url TEXT,
     click_url TEXT,
     target_device TEXT DEFAULT 'all',
     target_countries TEXT[] DEFAULT '{ALL}',
     status TEXT DEFAULT 'draft',
     sent_count INTEGER DEFAULT 0,
     delivered_count INTEGER DEFAULT 0,
     click_count INTEGER DEFAULT 0,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
     scheduled_for TIMESTAMP WITH TIME ZONE
   );
   ```

### Step 3: Server Setup

1. **Prerequisites**
   - Node.js 14+ installed
   - npm or yarn installed
   - Git installed

2. **Installation**
   ```bash
   # Clone repository
   git clone https://github.com/your-username/mano-media.git
   cd mano-media

   # Install dependencies
   npm install

   # Create environment file
   cp .env.example .env
   ```

3. **Configuration**
   Update `.env` file:
   ```
   SUPABASE_URL=your_supabase_url
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   FIREBASE_PROJECT_ID=your_project_id
   FIREBASE_PRIVATE_KEY_ID=your_private_key_id
   FIREBASE_PRIVATE_KEY=your_private_key
   FIREBASE_CLIENT_EMAIL=your_client_email
   FIREBASE_CLIENT_ID=your_client_id
   FIREBASE_CLIENT_CERT_URL=your_client_cert_url
   ```

4. **Start Server**
   ```bash
   npm start
   ```

### Step 4: Web Setup

1. **Update Configuration**
   Edit `assets/js/config.js`:
   ```javascript
   const config = {
     firebase: {
       // Your Firebase config
     },
     supabase: {
       // Your Supabase config
     },
     fcm: {
       vapidKey: "your_vapid_key"
     }
   };
   ```

2. **Deploy Files**
   - Upload all files to your web server
   - Ensure HTTPS is enabled
   - Configure your domain

### Step 5: Testing

1. **Login Test**
   - Visit your domain
   - Log in with admin credentials
   - Verify dashboard loads

2. **Send Test Notification**
   - Create new campaign
   - Send to test device
   - Verify delivery

3. **Monitor Dashboard**
   - Check real-time updates
   - Verify charts populate
   - Test all features

## Daily Operations Guide

### 1. Sending Notifications

1. Click "New Campaign" button
2. Fill in notification details:
   - Title
   - Message
   - Image (optional)
   - Click URL
3. Select target audience:
   - All users
   - Specific countries
   - Device types
4. Preview notification
5. Click "Send" or "Schedule"

### 2. Monitoring Performance

1. Check dashboard regularly:
   - Monitor delivery rates
   - Track click rates
   - Review subscriber growth
2. Investigate any unusual patterns:
   - Low delivery rates
   - High unsubscribe rates
   - Error spikes

### 3. Subscriber Management

1. Review subscriber list:
   - Check active status
   - Monitor growth
   - Identify patterns
2. Clean up invalid tokens:
   - System automatically removes invalid tokens
   - Monitor cleanup logs
   - Track token validity rates

### 4. Troubleshooting

Common issues and solutions:

1. **Notifications Not Sending**
   - Check FCM token validity
   - Verify server status
   - Review error logs

2. **Dashboard Not Updating**
   - Clear browser cache
   - Check internet connection
   - Verify Supabase connection

3. **Login Issues**
   - Reset browser cache
   - Check Firebase status
   - Verify credentials

## Support and Maintenance

### Regular Maintenance

1. **Daily**
   - Monitor error logs
   - Check delivery rates
   - Review performance metrics

2. **Weekly**
   - Analyze subscriber growth
   - Review geographic distribution
   - Check system performance

3. **Monthly**
   - Clean up old campaigns
   - Review security settings
   - Update documentation

### Getting Help

1. **Technical Support**
   - Email: support@manomedia.com
   - Response time: 24-48 hours
   - Include error messages and screenshots

2. **Documentation**
   - Visit: docs.manomedia.com
   - Video tutorials available
   - Step-by-step guides

3. **Emergency Support**
   - 24/7 emergency line: +1-XXX-XXX-XXXX
   - Priority support available
   - Direct developer access

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@manomedia.com or create an issue in the repository.
