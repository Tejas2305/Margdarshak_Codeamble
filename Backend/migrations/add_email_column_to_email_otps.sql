-- Migration: Add email column to email_otps table for pre-registration verification
-- Run this migration before using the new email verification flow

-- Add email column (nullable)
ALTER TABLE email_otps 
ADD COLUMN email VARCHAR(255);

-- Create index on email for faster lookups
CREATE INDEX idx_email_otps_email ON email_otps(email);

-- Make user_id nullable (for pre-registration OTPs)
ALTER TABLE email_otps 
ALTER COLUMN user_id DROP NOT NULL;

-- Note: This migration is backward compatible
-- Existing OTPs will still have user_id and no email
-- New pre-registration OTPs will have email and no user_id
