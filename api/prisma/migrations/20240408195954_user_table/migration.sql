/*
  Warnings:

  - Added the required column `description` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `position` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "description" VARCHAR(255) NOT NULL,
ADD COLUMN     "experience" TEXT,
ADD COLUMN     "position" TEXT NOT NULL,
ADD COLUMN     "skills" TEXT[];
