-- Migration: add jobTitle and municipality to User
-- Archivo: Backend/prisma/migrations/YYYYMMDD_add_user_fields/migration.sql

ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "jobTitle" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "municipality" TEXT;
