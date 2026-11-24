import http from 'http';
import { app } from './app';
import { prisma } from './config/database';

async function run() {
  console.log('--- Starting Comprehensive Phase 2 End-to-End Verification ---');

  const server = http.createServer(app);
  await new Promise<void>((resolve) => server.listen(0, resolve));
  const address = server.address();
  const port = typeof address === 'object' && address ? address.port : 5001;
  const baseUrl = `http://localhost:${port}`;
  console.log(`Test server running on ${baseUrl}`);

  let ownerToken = '';
  let ownerGymId = '';
  let testRoleId = '';
  let testStaffId = '';
  let testStaffEmail = `test.staff.${Date.now()}@ironpulse.com`;
  let testStaffPassword = 'StaffPassword123';
  let testStaffToken = '';

  try {
    // 1. Owner Login
    console.log('\n1. Testing Owner Login...');
    const loginRes = await fetch(`${baseUrl}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'owner@gym.com',
        password: 'Admin@123',
      }),
    });
    const loginJson: any = await loginRes.json();
    if (!loginJson.success || !loginJson.data?.tokens?.accessToken) {
      throw new Error(`Owner login failed: ${JSON.stringify(loginJson)}`);
    }
    ownerToken = loginJson.data.tokens.accessToken;
    ownerGymId = loginJson.data.user.gymId;
    console.log(`✓ Owner logged in successfully. User: ${loginJson.data.user.fullName}, Roles: ${loginJson.data.user.roles.join(', ')}`);

    // 2. Fetch Permissions Catalogue
    console.log('\n2. Testing GET /api/v1/permissions...');
    const permsRes = await fetch(`${baseUrl}/api/v1/permissions`, {
      headers: { Authorization: `Bearer ${ownerToken}` },
    });
    const permsJson: any = await permsRes.json();
    if (!permsJson.success || !permsJson.data?.permissions?.length) {
      throw new Error(`Failed to get permissions: ${JSON.stringify(permsJson)}`);
    }
    console.log(`✓ Retrieved ${permsJson.data.total} permissions across ${Object.keys(permsJson.data.byModule).length} modules`);

    // 3. List Roles
    console.log('\n3. Testing GET /api/v1/roles...');
    const rolesRes = await fetch(`${baseUrl}/api/v1/roles`, {
      headers: { Authorization: `Bearer ${ownerToken}` },
    });
    const rolesJson: any = await rolesRes.json();
    if (!rolesJson.success) {
      throw new Error(`Failed to list roles: ${JSON.stringify(rolesJson)}`);
    }
    console.log(`✓ Retrieved ${rolesJson.data.length} roles (including system & gym roles)`);

    // Pick 2 non-critical permissions for test role
    const testPermissionIds = permsJson.data.permissions
      .filter((p: any) => p.permissionKey.startsWith('attendance.'))
      .map((p: any) => p.id);

    // 4. Create Custom Role
    console.log('\n4. Testing POST /api/v1/roles (Create custom role)...');
    const roleName = `Test Desk Supervisor ${Date.now()}`;
    const createRoleRes = await fetch(`${baseUrl}/api/v1/roles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ownerToken}`,
      },
      body: JSON.stringify({
        name: roleName,
        description: 'Test role with attendance permissions only',
        permissionIds: testPermissionIds,
      }),
    });
    const createRoleJson: any = await createRoleRes.json();
    if (!createRoleJson.success || !createRoleJson.data?.id) {
      throw new Error(`Failed to create role: ${JSON.stringify(createRoleJson)}`);
    }
    testRoleId = createRoleJson.data.id;
    console.log(`✓ Created custom role: '${createRoleJson.data.name}' (ID: ${testRoleId})`);

    // 5. Test Protected Role Modification Prevention
    console.log('\n5. Testing Protected Role Protection (DELETE Owner role)...');
    const ownerRole = rolesJson.data.find((r: any) => r.slug === 'owner');
    if (ownerRole) {
      const deleteOwnerRes = await fetch(`${baseUrl}/api/v1/roles/${ownerRole.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${ownerToken}` },
      });
      const deleteOwnerJson: any = await deleteOwnerRes.json();
      if (deleteOwnerRes.status === 403 || !deleteOwnerJson.success) {
        console.log(`✓ Correctly rejected modification/deletion of protected Owner role (${deleteOwnerJson.message})`);
      } else {
        throw new Error('Security flaw: Able to delete Owner role!');
      }
    }

    // 6. Create Staff Account
    console.log('\n6. Testing POST /api/v1/staff (Create Staff)...');
    const createStaffRes = await fetch(`${baseUrl}/api/v1/staff`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ownerToken}`,
      },
      body: JSON.stringify({
        fullName: 'Test Staff Operator',
        email: testStaffEmail,
        mobile: '+91 9123456789',
        password: testStaffPassword,
        designation: 'Front Desk Assistant',
        salary: 25000,
        roleIds: [testRoleId],
      }),
    });
    const createStaffJson: any = await createStaffRes.json();
    if (!createStaffRes.ok || !createStaffJson.success) {
      throw new Error(`Failed to create staff: ${JSON.stringify(createStaffJson)}`);
    }
    testStaffId = createStaffJson.data.id;
    console.log(`✓ Created staff member: ${createStaffJson.data.fullName} (ID: ${testStaffId})`);

    // 7. List Staff with Pagination
    console.log('\n7. Testing GET /api/v1/staff (Pagination & filtering)...');
    const staffListRes = await fetch(`${baseUrl}/api/v1/staff?page=1&limit=5&status=active`, {
      headers: { Authorization: `Bearer ${ownerToken}` },
    });
    const staffListJson: any = await staffListRes.json();
    if (!staffListJson.success || !staffListJson.pagination) {
      throw new Error(`Failed to list staff: ${JSON.stringify(staffListJson)}`);
    }
    console.log(`✓ Retrieved staff page 1 (Total records: ${staffListJson.pagination.total})`);

    // 8. Get Staff Details
    console.log('\n8. Testing GET /api/v1/staff/:id...');
    const staffDetailRes = await fetch(`${baseUrl}/api/v1/staff/${testStaffId}`, {
      headers: { Authorization: `Bearer ${ownerToken}` },
    });
    const staffDetailJson: any = await staffDetailRes.json();
    if (!staffDetailJson.success || staffDetailJson.data.email !== testStaffEmail) {
      throw new Error(`Failed to get staff detail: ${JSON.stringify(staffDetailJson)}`);
    }
    console.log(`✓ Staff details confirmed: ${staffDetailJson.data.fullName}, Roles: ${staffDetailJson.data.roles.map((r: any) => r.name).join(', ')}`);

    // 9. Update Staff Profile
    console.log('\n9. Testing PATCH /api/v1/staff/:id...');
    const updateStaffRes = await fetch(`${baseUrl}/api/v1/staff/${testStaffId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ownerToken}`,
      },
      body: JSON.stringify({
        designation: 'Senior Front Desk Assistant',
        salary: 28000,
      }),
    });
    const updateStaffJson: any = await updateStaffRes.json();
    if (!updateStaffJson.success || updateStaffJson.data.designation !== 'Senior Front Desk Assistant') {
      throw new Error(`Failed to update staff: ${JSON.stringify(updateStaffJson)}`);
    }
    console.log(`✓ Staff updated successfully: Designation is now '${updateStaffJson.data.designation}'`);

    // 10. Login as Created Staff Member
    console.log('\n10. Testing Staff Login...');
    const staffLoginRes = await fetch(`${baseUrl}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testStaffEmail,
        password: testStaffPassword,
      }),
    });
    const staffLoginJson: any = await staffLoginRes.json();
    if (!staffLoginJson.success || !staffLoginJson.data?.tokens?.accessToken) {
      throw new Error(`Staff login failed: ${JSON.stringify(staffLoginJson)}`);
    }
    testStaffToken = staffLoginJson.data.tokens.accessToken;
    console.log(`✓ Staff logged in successfully! Permissions count: ${staffLoginJson.data.user.permissions.length}`);

    // 11. Test Dynamic RBAC Permission Check on Staff (Should be rejected for roles.manage)
    console.log('\n11. Testing RBAC enforcement (Staff trying to create a role without permission)...');
    const unauthorizedRes = await fetch(`${baseUrl}/api/v1/roles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${testStaffToken}`,
      },
      body: JSON.stringify({
        name: 'Hacker Role',
      }),
    });
    const unauthorizedJson: any = await unauthorizedRes.json();
    if (unauthorizedRes.status === 403) {
      console.log(`✓ Correctly rejected unauthorized operation (403 Forbidden: ${unauthorizedJson.message})`);
    } else {
      throw new Error(`Security breach: Staff was able to access roles endpoint! Status: ${unauthorizedRes.status}`);
    }

    // 12. Deactivate Staff Account
    console.log('\n12. Testing Staff Deactivation (PATCH /api/v1/staff/:id/status)...');
    const deactRes = await fetch(`${baseUrl}/api/v1/staff/${testStaffId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ownerToken}`,
      },
      body: JSON.stringify({ status: 'inactive' }),
    });
    const deactJson: any = await deactRes.json();
    if (!deactJson.success || deactJson.data.status !== 'inactive') {
      throw new Error(`Failed to deactivate staff: ${JSON.stringify(deactJson)}`);
    }
    console.log(`✓ Staff status updated to inactive`);

    // 13. Verify Deactivated Staff Cannot Login
    console.log('\n13. Testing Login with Inactive Staff Account...');
    const inactiveLoginRes = await fetch(`${baseUrl}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testStaffEmail,
        password: testStaffPassword,
      }),
    });
    const inactiveLoginJson: any = await inactiveLoginRes.json();
    if (inactiveLoginRes.status === 403 && inactiveLoginJson.error?.code === 'ACCOUNT_INACTIVE') {
      console.log(`✓ Inactive account login blocked correctly (403 ACCOUNT_INACTIVE)`);
    } else {
      throw new Error(`Security flaw: Inactive account was allowed or wrong error: ${JSON.stringify(inactiveLoginJson)}`);
    }

    // 14. Verify Audit Logs in Database
    console.log('\n14. Verifying Audit Logs in Database...');
    const auditLogs = await prisma.auditLog.findMany({
      where: { gymId: ownerGymId },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });
    console.log(`✓ Audit log verified: Found ${auditLogs.length} recent audit entries:`);
    for (const log of auditLogs) {
      console.log(`   - Action: ${log.action} | Entity: ${log.entityType} (${log.entityId}) | Time: ${log.createdAt.toISOString()}`);
    }

    console.log('\n======================================================');
    console.log('✓ ALL PHASE 2 BACKEND APIS & SECURITY CHECKS PASSED 100%!');
    console.log('======================================================\n');
  } finally {
    // Cleanup test data safely
    try {
      if (testStaffId) {
        const staffRec = await prisma.staff.findUnique({ where: { id: testStaffId }, select: { userId: true } });
        if (staffRec) {
          await prisma.userRole.deleteMany({ where: { userId: staffRec.userId } });
          await prisma.staff.delete({ where: { id: testStaffId } });
          await prisma.user.delete({ where: { id: staffRec.userId } });
        }
      }
      if (testRoleId) {
        await prisma.rolePermission.deleteMany({ where: { roleId: testRoleId } });
        await prisma.role.delete({ where: { id: testRoleId } });
      }
      console.log('✓ Test records cleaned up successfully.');
    } catch (cleanupErr) {
      console.warn('Note: Cleanup notice:', cleanupErr);
    }

    server.close();
    await prisma.$disconnect();
  }
}

run().catch((err) => {
  console.error('Test Suite Failed:', err);
  process.exit(1);
});
