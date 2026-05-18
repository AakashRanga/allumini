# Getting Started with the Verification System

## Step 1: Database Initialization

When you run the backend, tables are automatically created:

```bash
cd backend
python app.py
```

✅ This will:
- Create `alumni_users` table with `is_approved` column
- Create `overall_alumni` table with email/mobile indexes
- Auto-migrate any missing columns

## Step 2: Seed Sample Data

Run the seed script to populate authorized alumni:

```bash
python seed_alumni_data.py
```

✅ Inserts 8 sample alumni records for testing

## Step 3: Create Test Alumni Users

You need to create some pending verification requests manually in the database:

```sql
-- Insert test alumni user awaiting verification
INSERT INTO alumni_users 
(name, email, password_hash, contact_number, academic_details, specialization, role, email_verified, is_approved)
VALUES (
  'Alex Thompson',
  'alex.t@email.com',
  'hashed_password',
  '+1 234 567 8905',
  '{"degree":"UG","batch":"2024","specialization":"Electrical Engineering"}',
  'Electrical Engineering',
  'alumni',
  1,  -- email_verified = TRUE
  0   -- is_approved = FALSE (PENDING)
);

-- Insert another test user
INSERT INTO alumni_users 
(name, email, password_hash, contact_number, academic_details, specialization, role, email_verified, is_approved)
VALUES (
  'Sophia Martinez',
  'sophia.m@email.com',
  'hashed_password',
  '+1 234 567 8908',
  '{"degree":"PG","batch":"2023","specialization":"Artificial Intelligence"}',
  'Artificial Intelligence',
  'alumni',
  1,
  0
);
```

## Step 4: Access the Verification Page

Navigate to: `http://localhost:7777/admin/verification`

### What You'll See:

**Left Panel - Pending Requests:**
- List of all users with `is_approved = 0` and `email_verified = 1`
- If email/mobile matches `overall_alumni` → "Match Found" badge appears
- Click to expand and approve/reject

**Right Panel - Authorized Alumni Database:**
- Search by name, email, roll number
- Filter by batch and degree
- View authorized records

## Step 5: Test Auto-Verification

The system auto-matches by email OR mobile:

1. **Match on Email**: Alex Thompson (email: alex.t@college.edu in DB matches alex.t@email.com request)
2. **Match on Mobile**: If phone numbers match
3. **No Match**: Shows only in left panel, needs manual review

## Testing Workflow

### Test Case 1: Auto-Match Found
```
User Registration:
  Name: Alex Thompson
  Email: alex.t@email.com
  Phone: +1 234 567 8905
  
Check overall_alumni:
  ✓ Phone match found (+1 234 567 8905)
  
Admin sees:
  - "Match Found" badge
  - Green highlight
  - Can approve with confidence
```

### Test Case 2: No Auto-Match (Manual Review)
```
User Registration:
  Name: New User
  Email: newuser@email.com
  Phone: +9 999 999 9999
  
Check overall_alumni:
  ✗ No matches
  
Admin needs to:
  - Search authorized alumni database
  - Verify details manually
  - Approve or reject with reason
```

### Test Case 3: Approval Flow
```
1. Click on pending request
2. Review information
3. Check auto-match results
4. Click "Approve" button
5. User disappears from pending list
6. Database updated: is_approved = 1
7. User gains full access to alumni portal
```

### Test Case 4: Rejection Flow
```
1. Click on pending request
2. Review information
3. Find issues (fake details, etc.)
4. Click "Reject" button
5. User disappears from pending list
6. Rejection reason stored in database
7. User remains is_approved = 0
```

## API Testing with cURL

### Get Pending Requests
```bash
curl http://localhost:5555/verification/requests
```

### Check Match for User
```bash
curl -X POST http://localhost:5555/verification/check-match \
  -H "Content-Type: application/json" \
  -d '{"user_id": 1}'
```

### Search Alumni
```bash
curl -X POST http://localhost:5555/verification/search \
  -H "Content-Type: application/json" \
  -d '{"query":"Alex","batch":"all","degree":"all"}'
```

### Approve User
```bash
curl -X POST http://localhost:5555/verification/approve \
  -H "Content-Type: application/json" \
  -d '{"user_id": 1}'
```

### Reject User
```bash
curl -X POST http://localhost:5555/verification/reject \
  -H "Content-Type: application/json" \
  -d '{"user_id":1,"reason":"Records don'\''t match"}'
```

## Database Queries for Testing

### Check Pending Users
```sql
SELECT id, name, email, contact_number, is_approved, email_verified 
FROM alumni_users 
WHERE is_approved = 0 AND email_verified = 1
ORDER BY created_at DESC;
```

### Check Overall Alumni
```sql
SELECT * FROM overall_alumni WHERE status = 'active';
```

### Verify User Approval
```sql
SELECT name, email, is_approved, updated_at 
FROM alumni_users 
WHERE id = 1;
```

## Troubleshooting

### Issue: "No pending requests" but there should be
**Solution:** Ensure `is_approved = 0` AND `email_verified = 1`

### Issue: Match not showing even though records exist
**Solution:** Check email and mobile format matches exactly (spacing, + sign, etc.)

### Issue: Overall Alumni search returns nothing
**Solution:** Verify data in `overall_alumni` table with:
```sql
SELECT COUNT(*) FROM overall_alumni;
```

### Issue: Approval button doesn't work
**Solution:** 
1. Check browser console for errors
2. Verify backend is running on port 5555
3. Check CORS headers in app.py

## Performance Optimization Tips

For large databases:

1. **Indexes are already created on:**
   - email, mobile, batch, name

2. **For more speed, consider:**
   - Email match has dedicated index
   - Mobile match has dedicated index
   - Batch filter uses index
   - Name search uses index

3. **Query optimization:**
   - Searches use LIKE with leading wildcard (slow if too many records)
   - Consider full-text search for large datasets

## Next Steps

- Customize rejection reasons
- Add email notifications on approval/rejection
- Add bulk approval/rejection
- Add verification history logging
- Integrate with email service for notifications
