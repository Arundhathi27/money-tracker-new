# Supabase Profile Image Upload Fix - Summary

## Problem Identified

The profile image upload was failing with the error:
```
StorageApiError: new row violates row-level security policy
Status: 403 (Forbidden)
```

## Root Cause Analysis

1. **Authentication Mismatch**: The application uses custom JWT authentication, but the Supabase setup guide assumed Supabase Auth would be used.

2. **RLS Policy Issue**: The Row Level Security (RLS) policies were written to expect `auth.uid()` from Supabase Auth, but since the app uses custom authentication, `auth.uid()` returns null.

3. **Permission Denied**: Without a valid `auth.uid()`, the RLS policies blocked all storage operations, resulting in the 403 error.

## Solution Implemented

### 1. Updated Supabase Configuration (`backend/config/supabase.js`)

**Before:**
```javascript
const supabase = createClient(supabaseUrl, supabaseKey);
module.exports = supabase;
```

**After:**
```javascript
const supabase = createClient(supabaseUrl, supabaseAnonKey);
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

module.exports = {
  supabase,        // Regular client with anon key
  supabaseAdmin    // Admin client with service role key (bypasses RLS)
};
```

### 2. Updated Image Upload Service (`backend/services/imageUpload.js`)

**Key Changes:**
- Now uses `supabaseAdmin` instead of regular `supabase` client
- Service role key bypasses RLS policies automatically
- All upload and delete operations now work without authentication issues

**Before:**
```javascript
const { data, error } = await supabase.storage
  .from(this.bucketName)
  .upload(uniqueFileName, imageBuffer, options);
```

**After:**
```javascript
const { data, error } = await supabaseAdmin.storage
  .from(this.bucketName)
  .upload(uniqueFileName, imageBuffer, options);
```

### 3. Updated Setup Documentation (`backend/SUPABASE_SETUP.md`)

**Key Updates:**
- Added service role key requirement
- Simplified RLS policy approach
- Updated environment variables section
- Added security notes about service role key

## Environment Variables Required

Add to your `.env` file:
```env
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Security Considerations

1. **Service Role Key**: Has full access to your Supabase project - keep it secure
2. **Backend Only**: Never expose the service role key in client-side code
3. **RLS Bypass**: Service role operations bypass all RLS policies
4. **File Organization**: Images are still organized by user ID for security

## Benefits of This Approach

1. **Compatibility**: Works with custom JWT authentication
2. **Simplicity**: No complex RLS policies needed
3. **Security**: Backend-controlled access with proper user validation
4. **Performance**: No additional authentication overhead
5. **Reliability**: Service role key provides consistent access

## Testing Steps

1. Add `SUPABASE_SERVICE_ROLE_KEY` to your `.env` file
2. Restart your backend server
3. Try uploading a profile image through the frontend
4. Verify the image appears in your Supabase storage bucket
5. Check that old images are deleted when new ones are uploaded

## Files Modified

- ✅ `backend/config/supabase.js` - Added admin client configuration
- ✅ `backend/services/imageUpload.js` - Updated to use admin client
- ✅ `backend/SUPABASE_SETUP.md` - Updated setup instructions
- ✅ `TODO.md` - Progress tracking
- ✅ `SUPABASE_FIX_SUMMARY.md` - This summary document

## Expected Result

After implementing this fix:
- Profile image uploads should work without RLS errors
- Images will be stored in the `profile-images` bucket
- Old images will be automatically deleted when new ones are uploaded
- Public URLs will be generated correctly for image display
- All existing validation (file type, size) will continue to work

## Troubleshooting

If you still encounter issues:

1. **Check Environment Variables**: Ensure all three Supabase variables are set correctly
2. **Restart Server**: Make sure to restart your backend after adding the service role key
3. **Verify Bucket**: Confirm the `profile-images` bucket exists and is public
4. **Check Logs**: Look for any console errors in your backend logs
5. **Test Connection**: Use the test commands in the setup documentation

## Support

If you need further assistance:
- Check the updated `SUPABASE_SETUP.md` for detailed instructions
- Review the console logs for specific error messages
- Verify your Supabase project settings match the documentation
