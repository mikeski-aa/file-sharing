-- CreateTable
CREATE TABLE "Foldershare" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Foldershare_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Fileshare" (
    "id" SERIAL NOT NULL,
    "imageId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "folderId" INTEGER NOT NULL,

    CONSTRAINT "Fileshare_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Fileshare" ADD CONSTRAINT "Fileshare_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "Foldershare"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
