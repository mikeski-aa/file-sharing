-- AlterTable
CREATE SEQUENCE foldershare_id_seq;
ALTER TABLE "Foldershare" ALTER COLUMN "id" SET DEFAULT nextval('foldershare_id_seq');
ALTER SEQUENCE foldershare_id_seq OWNED BY "Foldershare"."id";
