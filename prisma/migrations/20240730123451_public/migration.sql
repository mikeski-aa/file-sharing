-- AlterTable
ALTER TABLE "Foldershare" ADD COLUMN     "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "expired" TIMESTAMP(3),
ADD COLUMN     "uniqueurl" TEXT,
ALTER COLUMN "id" DROP DEFAULT;
DROP SEQUENCE "Foldershare_id_seq";
