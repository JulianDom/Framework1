import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

/**
 * Seed script for initial database setup
 *
 * Creates a super-admin account that can then create other administrators.
 *
 * IMPORTANT: Change the default credentials in production!
 * Set environment variables:
 *   - SUPER_ADMIN_EMAIL
 *   - SUPER_ADMIN_USERNAME
 *   - SUPER_ADMIN_PASSWORD
 */
async function main() {
  console.log('🌱 Seeding database...');

  const superAdminEmail = process.env.SUPER_ADMIN_EMAIL || 'superadmin@cervak.com';
  const superAdminUsername = process.env.SUPER_ADMIN_USERNAME || 'superadmin';
  const superAdminPassword = process.env.SUPER_ADMIN_PASSWORD || 'ChangeMe123!';

  // Hash the password with bcrypt
  const hashedPassword = await bcrypt.hash(superAdminPassword, 12);

  // Create super-admin (Administrator, not User)
  const admin = await prisma.administrator.upsert({
    where: { emailAddress: superAdminEmail },
    update: {},
    create: {
      emailAddress: superAdminEmail,
      fullName: 'Super Administrator',
      username: superAdminUsername,
      password: hashedPassword,
      enabled: true,
      modules: {
        users: { read: true, write: true, delete: true },
        administrators: { read: true, write: true, delete: true },
        chat: { read: true, write: true, delete: true },
        payments: { read: true, write: true, delete: true },
        notifications: { read: true, write: true, delete: true },
      },
    },
  });

  console.log('✅ Super-admin created:');
  console.log(`   Email: ${admin.emailAddress}`);
  console.log(`   Username: ${admin.username}`);
  console.log('');
  console.log('⚠️  IMPORTANT: Change the default password immediately!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
