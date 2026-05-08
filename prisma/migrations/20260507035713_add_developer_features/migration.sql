/*
  Warnings:

  - Added the required column `ownerId` to the `OAuthApp` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "OAuthApp" ADD COLUMN     "ownerId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "AppUser" (
    "id" TEXT NOT NULL,
    "appId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "metadata" JSONB,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AppUser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AppUser_userId_idx" ON "AppUser"("userId");

-- CreateIndex
CREATE INDEX "AppUser_appId_idx" ON "AppUser"("appId");

-- CreateIndex
CREATE UNIQUE INDEX "AppUser_appId_userId_key" ON "AppUser"("appId", "userId");

-- CreateIndex
CREATE INDEX "OAuthApp_ownerId_idx" ON "OAuthApp"("ownerId");

-- AddForeignKey
ALTER TABLE "OAuthApp" ADD CONSTRAINT "OAuthApp_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "GGUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppUser" ADD CONSTRAINT "AppUser_appId_fkey" FOREIGN KEY ("appId") REFERENCES "OAuthApp"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppUser" ADD CONSTRAINT "AppUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "GGUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;
