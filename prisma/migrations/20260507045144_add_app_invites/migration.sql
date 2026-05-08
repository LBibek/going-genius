-- CreateTable
CREATE TABLE "AppInvite" (
    "id" TEXT NOT NULL,
    "appId" TEXT NOT NULL,
    "email" TEXT,
    "token" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AppInvite_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AppInvite_token_key" ON "AppInvite"("token");

-- CreateIndex
CREATE INDEX "AppInvite_appId_idx" ON "AppInvite"("appId");

-- AddForeignKey
ALTER TABLE "AppInvite" ADD CONSTRAINT "AppInvite_appId_fkey" FOREIGN KEY ("appId") REFERENCES "OAuthApp"("id") ON DELETE CASCADE ON UPDATE CASCADE;
