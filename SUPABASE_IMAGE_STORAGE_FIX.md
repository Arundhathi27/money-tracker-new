# Supabase Image Storage Fix for Transaction Attachments

## Problem Description

The transaction image attachments were not being stored persistently in Supabase storage. When users uploaded images:

1. Images showed immediately after upload in Transaction Details
2. After page refresh, images disappeared 
3. Images were not stored in Supabase storage bucket
4. The backend was only saving files locally using multer disk storage

## Root Cause

The backend transaction routes were using local file storage (`uploads/transactions/`) instead of uploading files to Supabase storage. When the Supabase account was paused and resumed, local files were lost, and no persistent storage mechanism was in place.

## Solution Implemented

### 1. Created Transaction Attachment Service

**File:** `backend/services/transactionAttachmentService.js`

- New service specifically for handling transaction attachments
- Uses Supabase storage with `transaction-attachments` bucket
- Provides methods for upload, delete, and validation
- Automatically creates bucket if it doesn't exist
- Organizes files by user ID and transaction ID: `{userId}/{transactionId}/{uniqueFileName}`

### 2. Updated Transaction Routes

**File:** `backend/routes/transactions.js`

**Changes made:**
- Switched from `multer.diskStorage()` to `multer.memoryStorage()`
- Integrated `transactionAttachmentService` for file operations
- Updated POST route to upload files to Supabase after transaction creation
- Updated PUT route to handle file replacement (delete old, upload new)
- Updated DELETE route to clean up attachments from Supabase storage
- Added proper error handling and rollback mechanisms

**Key improvements:**
- Files are now stored persistently in Supabase storage
- Transaction records contain Supabase URLs instead of local paths
- Automatic cleanup of old attachments when updating/deleting
- Better error handling with transaction rollback on upload failures

### 3. Updated Frontend Image Display

**File:** `frontend/src/components/Tables/TransactionTableRow.js`

**Changes made:**
- Updated `getImageSource()` function to handle both Supabase URLs and legacy local paths
- Added check for full URLs (starting with 'http') to use Supabase URLs directly
- Maintains backward compatibility with existing local file references

## Technical Details

### Supabase Storage Structure

```
transaction-attachments/
├── {userId}/
│   ├── {transactionId}/
│   │   ├── {uuid}.jpg
│   │   ├── {uuid}.png
│   │   └── {uuid}.pdf
```

### File Upload Flow

1. **Frontend** sends FormData with file to backend API
2. **Backend** receives file in memory (multer.memoryStorage)
3. **Backend** creates transaction record in database
4. **Backend** uploads file to Supabase storage using transaction ID
5. **Backend** updates transaction record with Supabase URL
6. **Frontend** receives transaction data with Supabase URL
7. **Frontend** displays image using Supabase URL

### Error Handling

- File validation before upload (size, type)
- Transaction rollback if upload fails
- Graceful handling of storage deletion failures
- Fallback display for failed image loads

## Configuration Requirements

### Environment Variables

Ensure these are set in your backend `.env` file:

```env
SUPABASE_URL=your-supabase-project-url
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```

### Supabase Storage Bucket

The service automatically creates the `transaction-attachments` bucket with:
- Public access enabled
- Allowed MIME types: image/jpeg, image/png, image/gif, image/webp, application/pdf
- File size limit: 5MB

## Testing Checklist

- [ ] Upload new transaction with image attachment
- [ ] Verify image displays immediately in Transaction Details
- [ ] Refresh page and verify image still displays
- [ ] Check Supabase storage bucket for uploaded file
- [ ] Update transaction with new image (verify old image is deleted)
- [ ] Delete transaction (verify image is removed from storage)
- [ ] Test with different file types (JPG, PNG, PDF)
- [ ] Test file size validation (>5MB should fail)
- [ ] Test invalid file types (should fail)

## Benefits

1. **Persistent Storage**: Images are now stored in Supabase storage and survive server restarts
2. **Scalability**: No local disk space limitations
3. **CDN Performance**: Supabase storage provides global CDN access
4. **Automatic Cleanup**: Old attachments are automatically deleted when transactions are updated/deleted
5. **Better Organization**: Files are organized by user and transaction for easy management
6. **Error Recovery**: Proper rollback mechanisms prevent orphaned data

## Migration Notes

- Existing transactions with local file paths will continue to work (backward compatibility)
- New transactions will use Supabase storage URLs
- No data migration required for existing transactions
- Local `uploads/transactions/` directory can be safely removed after verification

## Monitoring

Monitor the following:
- Supabase storage usage in dashboard
- Upload success/failure rates in backend logs
- Image load performance in frontend
- Storage bucket organization and cleanup
