-- AlterTable
ALTER TABLE "OAuthApp" ADD COLUMN     "esewaMerchantId" TEXT,
ADD COLUMN     "esewaSecretKey" TEXT,
ADD COLUMN     "isPremium" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "khaltiPublicKey" TEXT,
ADD COLUMN     "khaltiSecretKey" TEXT;
