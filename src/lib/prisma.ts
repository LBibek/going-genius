/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/ban-ts-comment */
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { withAccelerate } from '@prisma/extension-accelerate';
import pg from 'pg';

const primaryUrl = process.env.DATABASE_URL!;
const regionalUrl = process.env.DATABASE_URL_REGIONAL || primaryUrl;

const globalForPrisma = globalThis as unknown as {
  prisma: any | undefined;
};

function createPrismaClient() {
  // Use Driver Adapter for Node.js environments with optimized connection pooling
  // In serverless/production, limiting pool size prevents database connection starvation.
  const pool = new pg.Pool({
    connectionString: primaryUrl,
    max: process.env.NODE_ENV === 'production' ? 3 : 10,
    idleTimeoutMillis: 15000,
    connectionTimeoutMillis: 5000,
  });

  const regionalPool = new pg.Pool({
    connectionString: regionalUrl,
    max: process.env.NODE_ENV === 'production' ? 3 : 10,
    idleTimeoutMillis: 15000,
    connectionTimeoutMillis: 5000,
  });
  
  const primaryAdapter = new PrismaPg(pool);
  const regionalAdapter = new PrismaPg(regionalPool);
  
  const client = new PrismaClient({
    adapter: primaryAdapter,
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

  return client
    .$extends(withAccelerate())
    .$extends({
      query: {
        $allModels: {
          async $allOperations({ operation, model, args, query }: any) {
            const isRead = ['findUnique', 'findMany', 'findFirst', 'count', 'aggregate', 'groupBy'].includes(operation);
            
            // Log performance
            const start = performance.now();
            
            // Future: Implement region-aware routing here if needed
            // For now, we utilize the provided adapter
            
            const result = await query(args);
            const duration = performance.now() - start;

            if (duration > 150) {
              console.warn(`[PRISMA PERF] ${model}.${operation} took ${duration.toFixed(2)}ms`);
            }
            
            return result;
          },
        },
      },
    });
}

// @ts-ignore - Prisma extension types can be tricky
export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

