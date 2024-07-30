-- CreateTable
CREATE TABLE "Test" (
    "id" SERIAL NOT NULL,
    "shared" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,

    CONSTRAINT "Test_pkey" PRIMARY KEY ("id")
);
