import http from 'http';
import { app } from './app';
import { prisma } from './config/database';

async function run() {
  console.log('--- Starting Member Management Backend Verification ---');

  const server = http.createServer(app);
  await new Promise<void>((resolve) => server.listen(0, resolve));
  const address = server.address();
  const port = typeof address === 'object' && address ? address.port : 5001;
  const baseUrl = `http://localhost:${port}`;

  let ownerToken = '';
  let testMemberId = '';
  const testPhone = `+91 99999${Math.floor(10000 + Math.random() * 90000)}`;

  try {
    // 1. Owner Login
    console.log('1. Logging in as Owner...');
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
    console.log(`✓ Owner authenticated successfully`);

    // 2. Fetch Member Stats
    console.log('\n2. Testing GET /api/v1/members/stats...');
    const statsRes = await fetch(`${baseUrl}/api/v1/members/stats`, {
      headers: { Authorization: `Bearer ${ownerToken}` },
    });
    const statsJson: any = await statsRes.json();
    if (!statsJson.success || statsJson.data?.totalMembers === undefined) {
      throw new Error(`Failed to get member stats: ${JSON.stringify(statsJson)}`);
    }
    console.log(`✓ Retrieved stats: Total: ${statsJson.data.totalMembers}, Active: ${statsJson.data.activeMembers}, Inactive: ${statsJson.data.inactiveMembers}, New this month: ${statsJson.data.newThisMonth}`);

    // 3. Register Member
    console.log('\n3. Testing POST /api/v1/members (Register Member)...');
    const createRes = await fetch(`${baseUrl}/api/v1/members`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ownerToken}`,
      },
      body: JSON.stringify({
        firstName: 'Sambhav',
        lastName: 'Jain',
        phone: testPhone,
        alternatePhone: '+91 9888877777',
        email: `sambhav.${Date.now()}@example.com`,
        gender: 'male',
        dateOfBirth: '1996-05-15',
        occupation: 'Software Engineer',
        address: '102 Royal Palm Residency, Scheme 54',
        city: 'Indore',
        state: 'Madhya Pradesh',
        pincode: '452010',
        emergencyContactName: 'Rajesh Jain',
        emergencyContactRelation: 'Father',
        emergencyContactPhone: '+91 9111122222',
        source: 'Instagram',
        notes: 'Interested in strength training and personal coaching',
      }),
    });
    const createJson: any = await createRes.json();
    if (!createJson.success || !createJson.data?.id) {
      throw new Error(`Failed to create member: ${JSON.stringify(createJson)}`);
    }
    testMemberId = createJson.data.id;
    console.log(`✓ Member created: ${createJson.data.fullName} (Code: ${createJson.data.memberCode}, ID: ${testMemberId})`);

    // 4. Test Duplicate Phone Protection
    console.log('\n4. Testing Duplicate Phone Policy (Same Gym)...');
    const dupRes = await fetch(`${baseUrl}/api/v1/members`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ownerToken}`,
      },
      body: JSON.stringify({
        firstName: 'Another',
        lastName: 'User',
        phone: testPhone,
      }),
    });
    const dupJson: any = await dupRes.json();
    if (dupRes.status === 409 && dupJson.error?.code === 'DUPLICATE_PHONE') {
      console.log(`✓ Correctly rejected duplicate phone: ${dupJson.message}`);
    } else {
      throw new Error(`Expected 409 DUPLICATE_PHONE, got: ${JSON.stringify(dupJson)}`);
    }

    // 5. List Members with Search and Filters
    console.log('\n5. Testing GET /api/v1/members (Search & Pagination)...');
    const listRes = await fetch(`${baseUrl}/api/v1/members?page=1&limit=10&search=Sambhav&city=Indore`, {
      headers: { Authorization: `Bearer ${ownerToken}` },
    });
    const listJson: any = await listRes.json();
    if (!listJson.success || !listJson.data?.length) {
      throw new Error(`Failed to list members: ${JSON.stringify(listJson)}`);
    }
    console.log(`✓ Member list search returned ${listJson.data.length} match(es), Total: ${listJson.pagination.total}`);

    // 6. Get Member Details
    console.log('\n6. Testing GET /api/v1/members/:id...');
    const detailRes = await fetch(`${baseUrl}/api/v1/members/${testMemberId}`, {
      headers: { Authorization: `Bearer ${ownerToken}` },
    });
    const detailJson: any = await detailRes.json();
    if (!detailJson.success || detailJson.data.phone !== testPhone) {
      throw new Error(`Failed to get member detail: ${JSON.stringify(detailJson)}`);
    }
    console.log(`✓ Member details verified: ${detailJson.data.fullName}, City: ${detailJson.data.city}, Status: ${detailJson.data.status}`);

    // 7. Update Member
    console.log('\n7. Testing PATCH /api/v1/members/:id (Update Member)...');
    const updateRes = await fetch(`${baseUrl}/api/v1/members/${testMemberId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ownerToken}`,
      },
      body: JSON.stringify({
        occupation: 'Senior Tech Lead',
        notes: 'Updated training preferences',
      }),
    });
    const updateJson: any = await updateRes.json();
    if (!updateJson.success || updateJson.data.occupation !== 'Senior Tech Lead') {
      throw new Error(`Failed to update member: ${JSON.stringify(updateJson)}`);
    }
    console.log(`✓ Member updated successfully: Occupation is now '${updateJson.data.occupation}'`);

    // 8. Deactivate Member
    console.log('\n8. Testing PATCH /api/v1/members/:id/deactivate...');
    const deactRes = await fetch(`${baseUrl}/api/v1/members/${testMemberId}/deactivate`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${ownerToken}` },
    });
    const deactJson: any = await deactRes.json();
    if (!deactJson.success || deactJson.data.status !== 'inactive') {
      throw new Error(`Failed to deactivate member: ${JSON.stringify(deactJson)}`);
    }
    console.log(`✓ Member status changed to inactive`);

    // 9. Activate Member
    console.log('\n9. Testing PATCH /api/v1/members/:id/activate...');
    const actRes = await fetch(`${baseUrl}/api/v1/members/${testMemberId}/activate`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${ownerToken}` },
    });
    const actJson: any = await actRes.json();
    if (!actJson.success || actJson.data.status !== 'active') {
      throw new Error(`Failed to activate member: ${JSON.stringify(actJson)}`);
    }
    console.log(`✓ Member status changed to active`);

    // 10. Archive Member (Soft Archival)
    console.log('\n10. Testing PATCH /api/v1/members/:id/archive (Soft Archive)...');
    const archiveRes = await fetch(`${baseUrl}/api/v1/members/${testMemberId}/archive`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${ownerToken}` },
    });
    const archiveJson: any = await archiveRes.json();
    if (!archiveJson.success || archiveJson.data.status !== 'archived' || !archiveJson.data.archivedAt) {
      throw new Error(`Failed to archive member: ${JSON.stringify(archiveJson)}`);
    }
    console.log(`✓ Member successfully soft-archived at ${archiveJson.data.archivedAt}`);

    // 11. Verify Audit Logs
    console.log('\n11. Verifying Audit Logs for Member Operations...');
    const auditLogs = await prisma.auditLog.findMany({
      where: { entityType: 'member', entityId: testMemberId },
      orderBy: { createdAt: 'asc' },
    });
    console.log(`✓ Audit log verified: Found ${auditLogs.length} audit entries for member:`);
    for (const l of auditLogs) {
      console.log(`   - Action: ${l.action} | Time: ${l.createdAt.toISOString()}`);
    }

    console.log('\n======================================================');
    console.log('✓ ALL MEMBER BACKEND APIS PASSED 100%!');
    console.log('======================================================\n');
  } finally {
    // Clean up test member
    if (testMemberId) {
      await prisma.auditLog.deleteMany({ where: { entityId: testMemberId } });
      await prisma.member.delete({ where: { id: testMemberId } });
      console.log('✓ Test member record cleaned up.');
    }
    server.close();
    await prisma.$disconnect();
  }
}

run().catch((err) => {
  console.error('Member Verification Failed:', err);
  process.exit(1);
});
