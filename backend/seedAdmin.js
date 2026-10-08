/**
 * Growth IT Solution - CLI Tool to Seed or Reset the Initial SUPER_ADMIN
 * 
 * Usage:
 *   ADMIN_EMAIL=superadmin@company.com ADMIN_PASSWORD=MySecurePassword123! node backend/seedAdmin.js
 */

const db = require('../database/db');
const bcrypt = require('./utils/bcrypt');

function seedAdmin() {
    const email = process.env.ADMIN_EMAIL || 'growthitsolution@gmail.com';
    const password = process.env.ADMIN_PASSWORD;
    const name = process.env.ADMIN_NAME || 'Super Administrator';

    console.log('====================================================');
    console.log('🚀 Growth IT Solution - Admin Seeding Engine');
    console.log('====================================================');

    if (!password) {
        console.log('⚠️ [Notice] ADMIN_PASSWORD environment variable not provided.');
        console.log('Using development default credentials:');
        console.log(`   Email:    ${email}`);
        console.log(`   Password: growthitsolution123`);
        console.log('\nTo set a custom production password, run:');
        console.log('   $env:ADMIN_EMAIL="admin@domain.com"; $env:ADMIN_PASSWORD="YourPassword"; node backend/seedAdmin.js');
    }

    const targetPassword = password || 'growthitsolution123';
    let existingUser = db.getUserByEmail(email);

    if (existingUser) {
        console.log(`\nUpdating existing user (${email}) to SUPER_ADMIN...`);
        const passwordHash = bcrypt.hashPassword(targetPassword, 10);
        db.updateUserPassword(existingUser.id, passwordHash);
        existingUser.role = 'SUPER_ADMIN';
        existingUser.status = 'active';
        console.log(`✅ SUPER_ADMIN user updated successfully! ID: ${existingUser.id}`);
    } else {
        console.log(`\nCreating new SUPER_ADMIN user (${email})...`);
        const passwordHash = bcrypt.hashPassword(targetPassword, 10);
        const newUser = db.createUser({
            full_name: name,
            email: email,
            password_hash: passwordHash,
            role: 'SUPER_ADMIN',
            status: 'active'
        });
        console.log(`✅ SUPER_ADMIN user created successfully! ID: ${newUser.id}`);
    }

    console.log('====================================================');
}

seedAdmin();
