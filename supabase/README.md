# Supabase Functions & Migrations Setup

This folder contains Supabase-specific configurations.

## Structure

```
supabase/
├── schema.sql       - PostgreSQL database schema and policies
├── seed.sql         - Optional test data
└── functions/       - Edge Functions (future)
```

## Setting Up Database in Supabase

### Option 1: Using Supabase Dashboard

1. Go to your Supabase project
2. Navigate to **SQL Editor**
3. Click **New Query**
4. Copy and paste the contents of `schema.sql`
5. Click **Run**

### Option 2: Using Supabase CLI

```bash
# Install Supabase CLI
npm install -g supabase

# Link your project
supabase link --project-ref YOUR_PROJECT_REF

# Run migrations
supabase db push
```

## Database Schema Overview

### Users Table
Extends Supabase auth.users with location tracking fields:
- `id` - User ID (foreign key to auth.users)
- `email` - User email
- `phone` - Phone number for contacts
- `full_name` - Display name
- `latitude`, `longitude` - Current location
- `last_location_update` - Timestamp of last location update

### Locations Table
Stores current/recent locations:
- `id` - Location ID (UUID)
- `user_id` - Owner of location
- `latitude`, `longitude`, `accuracy` - GPS data
- `timestamp` - When location was recorded

### Location History Table
Historical trail of locations:
- `id` - Record ID
- `user_id` - Owner
- `latitude`, `longitude`, `accuracy` - Historical GPS data
- `timestamp` - Recording time

### Contacts Table
Manages contact relationships:
- `id` - Contact ID
- `user_id` - Your user ID
- `contact_phone` - Phone of contact
- `contact_user_id` - Supabase user ID of contact (if found)
- `status` - pending/accepted/blocked
- `contact_name` - Display name for contact

### Contact Requests Table
Manages mutual connection requests:
- `id` - Request ID
- `from_user_id` - Who sent the request
- `to_user_id` - Who received the request
- `status` - pending/accepted/rejected

## Row-Level Security (RLS)

All tables have RLS policies:

- **users**: Users see only their profile + contacts' profiles
- **locations**: Users see only their locations + contacts can see theirs
- **location_history**: Users see only their own history
- **contacts**: Users manage only their own contacts
- **contact_requests**: Users see requests sent/received

This ensures privacy - no user can access another's data without permission.

## Triggers & Functions

### Automatic Profile Creation
When a user signs up via Supabase Auth:
- `handle_new_user()` trigger automatically creates a user profile
- Email is populated from auth.users

## Indexes

Performance indexes on frequently queried columns:
- `user_id` on locations, location_history, contacts
- `timestamp` on locations and location_history
- `contact_user_id` on contacts
- Foreign key references

## Future Enhancements

1. **Edge Functions** - Server-side functions for complex logic
2. **Webhooks** - Send notifications when locations update
3. **Geofencing** - Server-side geofence logic
4. **Analytics** - Track user engagement
5. **Rate Limiting** - Prevent abuse of location updates

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Can't see database tables | Check RLS policies allow your user |
| Insert fails with permission error | Verify RLS policy for insert operation |
| Location not updating | Check user ID and RLS policy |
| Contact search failing | Ensure phone number format is consistent |

For help with Supabase, visit: https://supabase.com/docs
