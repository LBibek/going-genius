import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Setting up Row Level Security (RLS) policies...');

  // Enable RLS on key tables
  const tables = [
    'GGUser',
    'OAuthApp',
    'Subscription',
    'Transaction',
    'Lead',
    'Cart',
    'Thread',
    'Message',
    'AuditLog',
    'ProcessedTransaction',
  ];

  for (const table of tables) {
    try {
      await prisma.$executeRawUnsafe(`ALTER TABLE "${table}" ENABLE ROW LEVEL SECURITY;`);
      console.log(`✅ RLS enabled for ${table}`);
    } catch (e) {
      console.warn(`⚠️ Could not enable RLS for ${table}:`, e);
    }
  }

  // Create basic policies
  // Note: These policies assume the user_id is passed via a database setting 'app.current_user_id'
  // which can be set in a transaction.
  
  const policies = [
    // GGUser: Users can only see/edit themselves
    `DROP POLICY IF EXISTS user_self_access ON "GGUser";
     CREATE POLICY user_self_access ON "GGUser" 
     USING (id = current_setting('app.current_user_id', true))
     WITH CHECK (id = current_setting('app.current_user_id', true));`,

    // OAuthApp: Owners can see/edit their apps
    `DROP POLICY IF EXISTS app_owner_access ON "OAuthApp";
     CREATE POLICY app_owner_access ON "OAuthApp" 
     USING ("ownerId" = current_setting('app.current_user_id', true))
     WITH CHECK ("ownerId" = current_setting('app.current_user_id', true));`,

    // Transaction: Users can see their own transactions
    `DROP POLICY IF EXISTS transaction_user_access ON "Transaction";
     CREATE POLICY transaction_user_access ON "Transaction" 
     USING ("userId" = current_setting('app.current_user_id', true));`,
  ];

  for (const policy of policies) {
    try {
      await prisma.$executeRawUnsafe(policy);
      console.log('✅ Policy applied successfully');
    } catch (e) {
      console.warn('⚠️ Policy application failed:', e);
    }
  }

  console.log('🏁 RLS setup complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
