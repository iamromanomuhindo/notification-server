# Track Click Edge Function

This Edge Function handles click tracking for notifications. It updates the click count and stores click metadata in Supabase.

## Features

- Updates click count for notifications
- Stores click metadata (URL, timestamp, user agent, referrer)
- CORS support
- Error handling
- Rate limiting (coming soon)

## Usage

Send a POST request to the Edge Function with the following data:

```json
{
  "campaignId": "required-notification-id",
  "url": "optional-clicked-url",
  "userAgent": "optional-user-agent",
  "referrer": "optional-referrer"
}
```

## Response

Success:
```json
{
  "success": true,
  "message": "Click tracked successfully"
}
```

Error:
```json
{
  "error": "Error message here"
}
```

## Database Updates

The function updates the following fields in the notifications table:
- click_count: Increments by 1
- last_clicked_at: Updated to current timestamp
- clicked_urls: Array of click metadata

## Development

1. Install Supabase CLI
2. Copy .env.example to .env and fill in your values
3. Run locally: `supabase functions serve track-click`
4. Deploy: `supabase functions deploy track-click`
