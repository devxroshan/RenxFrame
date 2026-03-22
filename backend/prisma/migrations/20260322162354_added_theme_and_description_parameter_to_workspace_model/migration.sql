/*
  Warnings:

  - Added the required column `description` to the `Workspace` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Theme" AS ENUM ('dark', 'light');

-- AlterTable
ALTER TABLE "Workspace" ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "theme" "Theme" DEFAULT 'dark';
