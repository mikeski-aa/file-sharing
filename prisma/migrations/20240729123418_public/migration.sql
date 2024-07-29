/*
  Warnings:

  - Added the required column `imageId` to the `File` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
CREATE SEQUENCE file_id_seq;
ALTER TABLE "File" ADD COLUMN     "imageId" TEXT NOT NULL,
ALTER COLUMN "id" SET DEFAULT nextval('file_id_seq');
ALTER SEQUENCE file_id_seq OWNED BY "File"."id";
