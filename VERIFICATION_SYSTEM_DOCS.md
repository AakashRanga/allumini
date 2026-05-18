# Admin Verification System Documentation

## Overview
This system provides comprehensive alumni verification with auto-matching capabilities.

## Database Tables

### 1. `alumni_users` (Updated)
Stores alumni user accounts with verification status.

**Key Columns:**
- `id` - User ID (Primary Key)
- `name` - Full name
- `email` - Email address (Unique)
- `contact_number` - Phone number (Unique)
- `academic_details` - JSON field with degree, batch, specialization
- `is_approved` - Verification status (0 = Pending, 1 = Approved)
- `rejection_reason` - Reason for rejection
- `email_verified` - Email verification status
- `created_at` / `updated_at` - Timestamps

### 2. `overall_alumni` (New)
Authorized alumni database for cross-verification.

**Key Columns:**
- `id` - Record ID (Primary Key)
- `name` - Alumni name
- `email` - Email address (Indexed)
- `mobile` - Phone number (Indexed)
- `degree` - Degree level (UG/PG)
- `specialization` - Academic specialization
- `batch` - Graduation year (Indexed)
- `roll_number` - Roll number
- `institution` - Institution name
- `department` - Department name
- `status` - Record status (active/inactive/verified)
- `created_at` / `updated_at` - Timestamps

**Indexes:** email, mobile, batch, name (for fast searching)

## API Endpoints

### 1. Get Pending Verification Requests
**Endpoint:** `GET /verification/requests`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Alex Thompson",
      "email": "alex.t@email.com",
      "phone": "+1 234 567 8905",
      "degree": "UG",
      "specialization": "Electrical Engineering",
      "batch": "2024",
      "submittedDate": "2026-04-25"
    }
  ],
  "count": 1
}
```

### 2. Auto-Verification: Check for Matches
**Endpoint:** `POST /verification/check-match`

**Request:**
```json
{
  "user_id": 1
}
```

**Response:**
```json
{
  "success": true,
  "has_match": true,
  "matches": [
    {
      "id": 5,
      "name": "Alex Thompson",
      "email": "alex.t@college.edu",
      "mobile": "+1 234 567 8905",
      "degree": "UG",
      "batch": "2024"
    }
  ],
  "match_count": 1
}
```

**Logic:** Searches `overall_alumni` by matching email OR mobile number

### 3. Search Alumni Database
**Endpoint:** `POST /verification/search`

**Request:**
```json
{
  "query": "alex",
  "batch": "2024",
  "degree": "UG"
}
```

**Response:**
```json
{
  "success": true,
  "data": [...alumni records...],
  "count": 1
}
```

### 4. Approve User
**Endpoint:** `POST /verification/approve`

**Request:**
```json
{
  "user_id": 1
}
```

**Response:**
```json
{
  "success": true,
  "message": "User approved successfully"
}
```

**Updates:** Sets `is_approved = 1` in `alumni_users`

### 5. Reject User
**Endpoint:** `POST /verification/reject`

**Request:**
```json
{
  "user_id": 1,
  "reason": "Records don't match"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User rejected successfully"
}
```

**Updates:** Sets `is_approved = 0` and stores rejection reason

### 6. Get Filter Options
**Endpoint:** `GET /verification/get-batches`
**Endpoint:** `GET /verification/get-degrees`

Returns unique values for dropdown filters.

## Frontend - VerificationRequests Component

### Features

1. **Real-time Auto-Verification**
   - Checks each pending request against `overall_alumni`
   - Shows "Match Found" badge when email/mobile matches
   - Highlights matching records with green border

2. **Manual Verification**
   - Search authorized alumni database by name, email, roll number
   - Filter by batch and degree
   - View detailed alumni information

3. **Approval/Rejection**
   - Click on request to expand details
   - Approve: Updates `is_approved = 1` and removes from pending list
   - Reject: Stores rejection reason

4. **Loading States**
   - Shows spinner while fetching data
   - Disables buttons during processing
   - Real-time sync with backend

## Setup Instructions

### 1. Database Initialization
When you run `app.py`, it automatically:
- Creates `overall_alumni` table if not exists
- Migrates any missing columns
- Creates indexes for fast searching

```bash
python app.py
```

### 2. Populate `overall_alumni` Table
You need to manually add authorized alumni records:

```sql
INSERT INTO overall_alumni (name, email, mobile, degree, specialization, batch, roll_number, institution, department)
VALUES (
  'Alex Thompson',
  'alex.t@college.edu',
  '+1 234 567 8905',
  'UG',
  'Electrical Engineering',
  2024,
  '24EE001',
  'Your Institution',
  'Engineering'
);
```

### 3. User Registration Flow
1. Alumni registers with email/phone
2. Email verification required
3. User appears in `/admin/verification` page
4. Admin can:
   - See if auto-match exists
   - Search/verify in `overall_alumni`
   - Approve or reject
5. On approval: `is_approved = 1` → User gets full access

## Auto-Verification Logic

```
When a user submits registration:
  1. Capture: email, contact_number, name
  
When admin views verification page:
  1. Fetch all users where is_approved = 0 AND email_verified = 1
  
For each pending user:
  1. Search overall_alumni table:
     - Match by email → MATCH FOUND
     - Match by mobile → MATCH FOUND
     - No matches → Manual verification needed
  
When admin clicks approve:
  1. Update alumni_users: is_approved = 1
  2. Remove from pending list
  3. User gains full access
```

## Key Features

✅ **Auto-Verification:** Email/Mobile matching against authorized alumni database
✅ **Manual Search:** Search overall_alumni with multiple filters
✅ **Status Tracking:** Real-time approval/rejection
✅ **Rejection Reasons:** Store reason for future reference
✅ **Fast Searching:** Indexed columns for quick queries
✅ **Responsive UI:** Two-panel layout for efficient verification
✅ **Loading States:** User feedback during processing

## Files Modified/Created

1. `backend/models.py` - Added table definitions
2. `backend/app.py` - Updated to initialize both tables
3. `backend/routes/verification.py` - New verification endpoints
4. `src/app/pages/admin/VerificationRequests.tsx` - Updated with real API calls
