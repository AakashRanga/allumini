# Verification System - Quick Reference

## 📊 Database Tables

### alumni_users
```
id | name | email | contact_number | academic_details | is_approved | rejection_reason | ...
```
- `is_approved`: 0 = Pending, 1 = Approved
- Only users with `email_verified = 1` and `is_approved = 0` appear in verification page
- Updated when admin approves/rejects

### overall_alumni
```
id | name | email | mobile | degree | batch | roll_number | status | ...
```
- Authorized alumni database
- Indexed columns: email, mobile, batch, name
- Used for auto-verification matching

## 🔄 Verification Flow

```
User Registration
       ↓
   ✉️ Email Verification
       ↓
   Wait for Admin Approval
       ↓
   Show in /admin/verification
       ↓
   Auto-Check: email or mobile matches?
       ├─ YES → "Match Found" badge
       └─ NO  → Manual review required
       ↓
   Admin Decision
       ├─ Approve  → is_approved = 1 → Full Access
       └─ Reject   → Store reason → Show error to user
```

## 🔌 API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | /verification/requests | Get pending requests |
| POST | /verification/check-match | Check email/mobile match |
| POST | /verification/search | Search alumni database |
| POST | /verification/approve | Approve user |
| POST | /verification/reject | Reject user with reason |
| GET | /verification/get-batches | Get batch options |
| GET | /verification/get-degrees | Get degree options |

## 🎨 UI Features

### Left Panel - Pending Requests
- Shows users with `is_approved = 0` and `email_verified = 1`
- Green border if auto-match found
- Click to expand and approve/reject
- Shows email, phone, degree, batch, specialization

### Right Panel - Authorized Alumni Database
- Search by name, email, roll number
- Filter by batch (dropdown)
- Filter by degree (UG/PG)
- Real-time search as you type

## 🚀 Quick Start

```bash
# 1. Initialize database
cd backend
python app.py

# 2. Seed sample data
python seed_alumni_data.py

# 3. Create test users (see SQL examples in VERIFICATION_SETUP_GUIDE.md)

# 4. Open browser
# http://localhost:7777/admin/verification
```

## 📋 Auto-Verification Logic

```python
For each pending user:
  SEARCH overall_alumni WHERE:
    email = user.email  OR  mobile = user.contact_number
  
  IF match found:
    Show "Match Found" badge
    Return matching records
  ELSE:
    Admin must search manually
```

## ✅ Approval/Rejection

### Approve
```
Input: user_id
Action: UPDATE alumni_users SET is_approved = 1
Result: User removed from pending list, gains full access
```

### Reject
```
Input: user_id, rejection_reason
Action: UPDATE alumni_users SET rejection_reason = reason
Result: User remains is_approved = 0, reason stored
```

## 🔍 Search Features

### Search Parameters
- Query: name, email, roll_number (LIKE search)
- Batch: exact match
- Degree: exact match (UG or PG)

### Example Query
```
Search: "alex"
Batch: 2024
Degree: UG

Result: Matches with name/email containing "alex", 
        batch = 2024, degree = UG
```

## 📊 Key Columns Used

### For Matching
- `alumni_users.email` ← compared to → `overall_alumni.email`
- `alumni_users.contact_number` ← compared to → `overall_alumni.mobile`

### For Display
- `alumni_users.academic_details` (JSON) ← contains degree, batch
- `alumni_users.specialization`

### For Status
- `is_approved`: 0 (pending), 1 (approved)
- `rejection_reason`: stores reason if rejected
- `email_verified`: must be 1 to appear in list

## 🔧 Common Issues & Fixes

| Issue | Cause | Fix |
|-------|-------|-----|
| No matching records | Email/mobile format different | Check spaces, + signs, country codes |
| User not in pending list | email_verified ≠ 1 | Verify email first |
| Approval doesn't work | Backend not running | Start backend on port 5555 |
| No alumni in search | overall_alumni empty | Run seed_alumni_data.py |
| Slow search | Too many records | Database indexes are optimized |

## 📝 Fields Stored on Rejection

```json
{
  "user_id": 1,
  "is_approved": 0,
  "rejection_reason": "Email doesn't match authorized database",
  "updated_at": "2026-05-13 10:30:00"
}
```

## 🎯 Success Criteria

✅ Shows pending users  
✅ Auto-matches by email/mobile  
✅ "Match Found" badge appears  
✅ Can search authorized alumni  
✅ Can approve/reject users  
✅ Data persists in database  
✅ Approved users gain access  

## 📞 Need Help?

Check:
1. VERIFICATION_SYSTEM_DOCS.md - Full documentation
2. VERIFICATION_SETUP_GUIDE.md - Detailed setup guide
3. Browser console - for error messages
4. Database - verify data exists
5. Backend logs - check for API errors
