import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding core database foundation...');

  // 1. Default Gym
  const gym = await prisma.gym.upsert({
    where: { code: 'GYM-001' },
    update: {},
    create: {
      name: 'IronPulse Fitness Club',
      code: 'GYM-001',
      email: 'contact@ironpulse.com',
      phone: '+91 9876543210',
      address: 'Main Commercial Hub, City Center',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001',
      timezone: 'Asia/Kolkata',
      status: 'active',
    },
  });

  console.log(`Default Gym created/verified: ${gym.name} (Code: ${gym.code})`);

  // 2. Default Gym Settings
  const defaultSettings = [
    { key: 'currency', value: { symbol: '₹', code: 'INR' } },
    { key: 'opening_hours', value: { open: '06:00', close: '22:00' } },
    { key: 'membership_expiry_alert_days', value: 7 },
  ];

  for (const s of defaultSettings) {
    await prisma.gymSetting.upsert({
      where: {
        gymId_settingKey: {
          gymId: gym.id,
          settingKey: s.key,
        },
      },
      update: { settingValue: s.value },
      create: {
        gymId: gym.id,
        settingKey: s.key,
        settingValue: s.value,
      },
    });
  }

  // 3. Permissions Catalogue
  const permissionsList = [
    { module: 'dashboard', action: 'view', key: 'dashboard.view', desc: 'View dashboard analytics' },
    { module: 'members', action: 'view', key: 'members.view', desc: 'View member profiles' },
    { module: 'members', action: 'create', key: 'members.create', desc: 'Register new members' },
    { module: 'members', action: 'update', key: 'members.update', desc: 'Update member details' },
    { module: 'members', action: 'delete', key: 'members.delete', desc: 'Delete or deactivate members' },
    { module: 'memberships', action: 'view', key: 'memberships.view', desc: 'View membership plans and assignments' },
    { module: 'memberships', action: 'create', key: 'memberships.create', desc: 'Create membership plans' },
    { module: 'memberships', action: 'update', key: 'memberships.update', desc: 'Update membership plans' },
    { module: 'memberships', action: 'assign', key: 'memberships.assign', desc: 'Assign membership to a member' },
    { module: 'memberships', action: 'renew', key: 'memberships.renew', desc: 'Renew member membership' },
    { module: 'memberships', action: 'freeze', key: 'memberships.freeze', desc: 'Freeze or extend membership' },
    { module: 'attendance', action: 'view', key: 'attendance.view', desc: 'View member attendance records' },
    { module: 'attendance', action: 'mark', key: 'attendance.mark', desc: 'Mark member attendance or scan QR' },
    { module: 'payments', action: 'view', key: 'payments.view', desc: 'View payment history and dues' },
    { module: 'payments', action: 'create', key: 'payments.create', desc: 'Record member payment' },
    { module: 'payments', action: 'refund', key: 'payments.refund', desc: 'Process payment refunds' },
    { module: 'trainers', action: 'view', key: 'trainers.view', desc: 'View trainer list and assignments' },
    { module: 'trainers', action: 'manage', key: 'trainers.manage', desc: 'Assign trainers to members' },
    { module: 'expenses', action: 'view', key: 'expenses.view', desc: 'View gym expenses' },
    { module: 'expenses', action: 'create', key: 'expenses.create', desc: 'Record gym expenses' },
    { module: 'reports', action: 'view', key: 'reports.view', desc: 'View business reports' },
    { module: 'reports', action: 'export', key: 'reports.export', desc: 'Export report data' },
    { module: 'staff', action: 'view', key: 'staff.view', desc: 'View staff members' },
    { module: 'staff', action: 'manage', key: 'staff.manage', desc: 'Create and update staff accounts' },
    { module: 'roles', action: 'manage', key: 'roles.manage', desc: 'Manage roles and permissions' },
    { module: 'settings', action: 'view', key: 'settings.view', desc: 'View gym settings' },
    { module: 'settings', action: 'update', key: 'settings.update', desc: 'Update gym settings' },
  ];

  const permissionRecords: Record<string, string> = {};

  for (const p of permissionsList) {
    const record = await prisma.permission.upsert({
      where: { permissionKey: p.key },
      update: { description: p.desc },
      create: {
        module: p.module,
        action: p.action,
        permissionKey: p.key,
        description: p.desc,
      },
    });
    permissionRecords[p.key] = record.id;
  }

  console.log(`Permission catalogue seeded (${permissionsList.length} permissions)`);

  // 4. System Roles
  const roles = [
    {
      name: 'Owner',
      slug: 'owner',
      description: 'Full administrative access to all gym operations and settings',
      isSystem: true,
      isProtected: true,
      permissions: Object.keys(permissionRecords),
    },
    {
      name: 'Administrator',
      slug: 'admin',
      description: 'Operations manager with access to members, memberships, payments, attendance and reports',
      isSystem: true,
      isProtected: true,
      permissions: [
        'dashboard.view',
        'members.view', 'members.create', 'members.update',
        'memberships.view', 'memberships.assign', 'memberships.renew', 'memberships.freeze',
        'attendance.view', 'attendance.mark',
        'payments.view', 'payments.create',
        'trainers.view', 'trainers.manage',
        'expenses.view', 'expenses.create',
        'reports.view',
        'staff.view',
        'settings.view',
      ],
    },
    {
      name: 'Receptionist',
      slug: 'receptionist',
      description: 'Front-desk staff handling registration, payments and attendance',
      isSystem: true,
      isProtected: false,
      permissions: [
        'members.view', 'members.create', 'members.update',
        'memberships.view', 'memberships.assign',
        'attendance.view', 'attendance.mark',
        'payments.view', 'payments.create',
      ],
    },
    {
      name: 'Trainer',
      slug: 'trainer',
      description: 'Fitness trainer managing member training and attendance',
      isSystem: true,
      isProtected: false,
      permissions: [
        'members.view',
        'attendance.view', 'attendance.mark',
        'trainers.view',
      ],
    },
  ];

  const roleRecords: Record<string, string> = {};

  for (const r of roles) {
    const roleRecord = await prisma.role.upsert({
      where: {
        gymId_slug: {
          gymId: gym.id,
          slug: r.slug,
        },
      },
      update: { description: r.description },
      create: {
        gymId: gym.id,
        name: r.name,
        slug: r.slug,
        description: r.description,
        isSystem: r.isSystem,
        isProtected: r.isProtected,
        status: 'active',
      },
    });

    roleRecords[r.slug] = roleRecord.id;

    for (const permKey of r.permissions) {
      const permId = permissionRecords[permKey];
      if (permId) {
        await prisma.rolePermission.upsert({
          where: {
            roleId_permissionId: {
              roleId: roleRecord.id,
              permissionId: permId,
            },
          },
          update: {},
          create: {
            roleId: roleRecord.id,
            permissionId: permId,
          },
        });
      }
    }
  }

  console.log(`System roles created and mapped to permissions`);

  // 5. Default Owner User with genuine bcrypt hash for "Admin@123"
  const defaultOwnerEmail = 'owner@gym.com';
  const hashedOwnerPassword = await bcrypt.hash('Admin@123', 10);

  const ownerUser = await prisma.user.upsert({
    where: {
      gymId_email: {
        gymId: gym.id,
        email: defaultOwnerEmail,
      },
    },
    update: { passwordHash: hashedOwnerPassword },
    create: {
      gymId: gym.id,
      fullName: 'System Owner',
      email: defaultOwnerEmail,
      mobile: '+91 9876543210',
      passwordHash: hashedOwnerPassword,
      status: 'active',
    },
  });

  const ownerRoleId = roleRecords['owner'];
  if (ownerRoleId) {
    await prisma.userRole.upsert({
      where: {
        userId_roleId: {
          userId: ownerUser.id,
          roleId: ownerRoleId,
        },
      },
      update: {},
      create: {
        userId: ownerUser.id,
        roleId: ownerRoleId,
      },
    });
  }

  await prisma.staff.upsert({
    where: { userId: ownerUser.id },
    update: {},
    create: {
      gymId: gym.id,
      userId: ownerUser.id,
      designation: 'General Manager & Owner',
      joiningDate: new Date(),
      status: 'active',
    },
  });

  console.log(`Default owner user verified/updated (${defaultOwnerEmail})`);
  console.log('Database seeding completed successfully.');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
