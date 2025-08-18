const { Client } = require('pg');

const client = new Client({
    host: 'aws-1-eu-north-1.pooler.supabase.com',
    port: 6543,
    database: 'postgres',
    user: 'postgres.aydtrypogxbqmvbqerce',
    password: '13264897',
    ssl: {
        rejectUnauthorized: false
    }
});

async function addAllUsers() {
    try {
        console.log('🔗 الاتصال بقاعدة البيانات...');
        await client.connect();
        console.log('✅ تم الاتصال بنجاح!');

        // جميع المستخدمين المطلوبين
        const users = [
            {
                email: 'admin@tahfeez-sharqiya.com',
                role: 'admin',
                branch_id: null
            },
            {
                email: 'garb@tahfeez-sharqiya.com',
                role: 'branch',
                branch_id: 'garb-dammam'
            },
            {
                email: 'sharq@tahfeez-sharqiya.com',
                role: 'branch',
                branch_id: 'sharq-dammam'
            },
            {
                email: 'khobar@tahfeez-sharqiya.com',
                role: 'branch',
                branch_id: 'khobar'
            },
            {
                email: 'rafeia@tahfeez-sharqiya.com',
                role: 'branch',
                branch_id: 'rafeia'
            },
            {
                email: 'baqiq@tahfeez-sharqiya.com',
                role: 'branch',
                branch_id: 'baqiq'
            },
            {
                email: 'anak@tahfeez-sharqiya.com',
                role: 'branch',
                branch_id: 'anak'
            },
            {
                email: 'wadi.almiyah@tahfeez-sharqiya.com',
                role: 'branch',
                branch_id: 'wadi-almiyah'
            },
            {
                email: 'alsarar@tahfeez-sharqiya.com',
                role: 'branch',
                branch_id: 'alsarar'
            },
            {
                email: 'ras.tanura@tahfeez-sharqiya.com',
                role: 'branch',
                branch_id: 'ras-tanura'
            },
            {
                email: 'qaryah@tahfeez-sharqiya.com',
                role: 'branch',
                branch_id: 'qaryah'
            },
            {
                email: 'altaeriah@tahfeez-sharqiya.com',
                role: 'branch',
                branch_id: 'altaeriah'
            }
        ];

        console.log('👥 إضافة جميع المستخدمين...');

        for (const user of users) {
            try {
                await client.query(`
                    INSERT INTO users (email, role, branch_id, created_at)
                    VALUES ($1, $2, $3, NOW())
                    ON CONFLICT (email) DO UPDATE SET
                        role = EXCLUDED.role,
                        branch_id = EXCLUDED.branch_id
                `, [user.email, user.role, user.branch_id]);
                
                console.log(`✅ تم إضافة/تحديث: ${user.email} - ${user.role}`);
            } catch (error) {
                console.error(`❌ خطأ في إضافة ${user.email}:`, error.message);
            }
        }

        // التحقق من النتائج
        console.log('\n📊 التحقق من المستخدمين في قاعدة البيانات...');
        const result = await client.query(`
            SELECT email, role, branch_id 
            FROM users 
            ORDER BY 
                CASE WHEN role = 'admin' THEN 1 ELSE 2 END,
                email
        `);

        console.log(`\n👥 المستخدمون الموجودون (${result.rows.length} مستخدم):`);
        result.rows.forEach((user, index) => {
            const branchInfo = user.branch_id ? `- فرع: ${user.branch_id}` : '- جميع الفروع';
            console.log(`${index + 1}. ${user.email} (${user.role}) ${branchInfo}`);
        });

        console.log('\n✅ تم إكمال إضافة جميع المستخدمين!');
        
    } catch (error) {
        console.error('❌ خطأ في العملية:', error);
    } finally {
        await client.end();
        console.log('🔌 تم إغلاق الاتصال');
    }
}

addAllUsers();
