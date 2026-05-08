-- AlterTable
ALTER TABLE "OAuthApp" ADD COLUMN     "githubClientId" TEXT,
ADD COLUMN     "githubClientSecret" TEXT,
ADD COLUMN     "googleClientId" TEXT,
ADD COLUMN     "googleClientSecret" TEXT,
ADD COLUMN     "steamApiKey" TEXT;
