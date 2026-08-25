import { execSync } from 'node:child_process';
import { PrismaClient } from '@prisma/client';
import { clear } from 'node:console';

const repoRoot = process.cwd();

export const testDatabaseUrl = process.env.TEST_DATABASE_URL;

if (!testDatabaseUrl) {
  throw new Error(
    'TEST_DATABASE_URL environment variable is not set. Please set it to a test database URL.'
  );
}

process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = testDatabaseUrl;
process.env.JWT_SECRET = process.env.JWT_SECRET ?? 'test-secret';
process.env.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? '1h';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: testDatabaseUrl
    }
  }
});

// Safety: refuse to run tests against a non-test database URL.
try {
  const parsed = new URL(testDatabaseUrl);
  const dbName = parsed.pathname.replace(/^\//, '');
  if (!/test/i.test(dbName)) {
    throw new Error(
      `Refusing to run tests: TEST_DATABASE_URL database name "${dbName}" does not appear to be a test database. Please set TEST_DATABASE_URL to a test database (name should include 'test').`
    );
  }
} catch (err) {
  // If URL parsing fails, be conservative and refuse to continue.
  throw new Error(
    `Invalid TEST_DATABASE_URL or unsafe database target: ${String(err)}. Set TEST_DATABASE_URL to a valid test database URL.`
  );
}

function run(command: string) {
  execSync(command, {
    cwd: repoRoot,
    stdio: 'inherit',
    env: {
      ...process.env,
      DATABASE_URL: testDatabaseUrl,
      NODE_ENV: 'test',
      JWT_SECRET: process.env.JWT_SECRET ?? 'test-secret',
      JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN ?? '1h'
    }
  });
}

export async function resetTestDatabase() {
  run('npx prisma migrate deploy');
  await prisma.statusHistory.deleteMany();
  await prisma.comments.deleteMany();
  await prisma.ticket.deleteMany();
  await prisma.user.deleteMany();
  run('npm run db:seed');
}

export async function disconnectTestDatabase() {
  await prisma.$disconnect();
}
