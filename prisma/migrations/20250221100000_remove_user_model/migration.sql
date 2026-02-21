-- Remove User model and Quiz.creatorId (app is account-free / Zero-Account).
-- Safe to run: drops column and table only if they exist.

-- Drop foreign key and column creatorId from Quiz (PostgreSQL drops FK when column is dropped)
ALTER TABLE "Quiz" DROP COLUMN IF EXISTS "creatorId";

-- Drop User table
DROP TABLE IF EXISTS "User";
