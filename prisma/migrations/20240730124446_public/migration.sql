/*
  Warnings:

  - You are about to drop the `Fileshare` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Fileshare" DROP CONSTRAINT "Fileshare_folderId_fkey";

-- AlterTable
ALTER TABLE "Foldershare" ALTER COLUMN "id" DROP DEFAULT;
DROP SEQUENCE "foldershare_id_seq";

-- DropTable
DROP TABLE "Fileshare";
