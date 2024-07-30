/*
  Warnings:

  - You are about to drop the column `shared` on the `Test` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Test" DROP COLUMN "shared",
ADD COLUMN     "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "expired" TIMESTAMP(3),
ALTER COLUMN "name" DROP NOT NULL;
