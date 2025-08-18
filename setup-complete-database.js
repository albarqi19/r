const { Client } = require('pg');

// معلومات الاتصال بقاعدة البيانات
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

async function setupDatabase() {
    try {
        console.log('🔗 الاتصال بقاعدة البيانات...');
        await client.connect();
        console.log('✅ تم الاتصال بنجاح!');

        // إنشاء جدول الفروع
        console.log('📋 إنشاء جدول الفروع...');
        await client.query(`
            CREATE TABLE IF NOT EXISTS branches (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                twitter TEXT,
                whatsapp TEXT,
                instagram TEXT,
                location TEXT,
                email TEXT,
                phone TEXT,
                status TEXT DEFAULT 'active',
                region TEXT,
                established TEXT,
                created_at TIMESTAMPTZ DEFAULT NOW(),
                updated_at TIMESTAMPTZ DEFAULT NOW(),
                updated_by UUID
            )
        `);

        // إنشاء جدول المستخدمين
        console.log('👥 إنشاء جدول المستخدمين...');
        await client.query(`
            CREATE TABLE IF NOT EXISTS users (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                email TEXT UNIQUE NOT NULL,
                role TEXT DEFAULT 'branch',
                branch_id TEXT,
                last_login TIMESTAMPTZ,
                last_ip TEXT,
                created_at TIMESTAMPTZ DEFAULT NOW()
            )
        `);

        // إنشاء جدول طلبات التحديث
        console.log('📝 إنشاء جدول طلبات التحديث...');
        await client.query(`
            CREATE TABLE IF NOT EXISTS update_requests (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                branch_id TEXT NOT NULL,
                request_data JSONB NOT NULL,
                status TEXT DEFAULT 'pending',
                requested_by UUID,
                requested_at TIMESTAMPTZ DEFAULT NOW(),
                approved_by UUID,
                approved_at TIMESTAMPTZ,
                rejected_by UUID,
                rejected_at TIMESTAMPTZ,
                rejection_reason TEXT
            )
        `);

        // إدراج بيانات الفروع
        console.log('🏢 إدراج بيانات الفروع...');
        const branches = [
            {
                id: 'garb-dammam',
                name: 'فرع غرب الدمام',
                twitter: 'https://x.com/Org2Qer',
                whatsapp: '966138360356',
                instagram: 'https://www.instagram.com/org2qer/',
                location: 'https://maps.app.goo.gl/cFQHa1b2y3uoDbGy9',
                email: 'garb@tahfeez-sharqiya.com',
                phone: '966138360356',
                region: 'الدمام',
                established: '1388'
            },
            {
                id: 'sharq-dammam',
                name: 'فرع شرق الدمام',
                twitter: 'https://x.com/sharq_dammam',
                whatsapp: '966138365678',
                instagram: 'https://www.instagram.com/sharq_dammam/',
                location: 'https://maps.app.goo.gl/example_sharq',
                email: 'sharq@tahfeez-sharqiya.com',
                phone: '966138365678',
                region: 'الدمام',
                established: '1392'
            },
            {
                id: 'rafeia',
                name: 'فرع الرفيعة',
                twitter: 'https://x.com/rafeia_tahfeez',
                whatsapp: '966138367777',
                instagram: 'https://www.instagram.com/rafeia_tahfeez/',
                location: 'https://maps.app.goo.gl/example_rafeia',
                email: 'rafeia@tahfeez-sharqiya.com',
                phone: '966138367777',
                region: 'الرفيعة',
                established: '1397'
            },
            {
                id: 'baqiq',
                name: 'فرع بقيق',
                twitter: 'https://x.com/baqiq_tahfeez',
                whatsapp: '966138369999',
                instagram: 'https://www.instagram.com/baqiq_tahfeez/',
                location: 'https://maps.app.goo.gl/example_baqiq',
                email: 'baqiq@tahfeez-sharqiya.com',
                phone: '966138369999',
                region: 'بقيق',
                established: '1395'
            },
            {
                id: 'anak',
                name: 'فرع عنك',
                twitter: 'https://x.com/anak_tahfeez',
                whatsapp: '966138361111',
                instagram: 'https://www.instagram.com/anak_tahfeez/',
                location: 'https://maps.app.goo.gl/example_anak',
                email: 'anak@tahfeez-sharqiya.com',
                phone: '966138361111',
                region: 'عنك',
                established: '1400'
            },
            {
                id: 'wadi-almiyah',
                name: 'فرع وادي المياه',
                twitter: 'https://x.com/wadi_almiyah_tahfeez',
                whatsapp: '966138362222',
                instagram: 'https://www.instagram.com/wadi_almiyah_tahfeez/',
                location: 'https://maps.app.goo.gl/example_wadi_almiyah',
                email: 'wadi.almiyah@tahfeez-sharqiya.com',
                phone: '966138362222',
                region: 'وادي المياه',
                established: '1402'
            },
            {
                id: 'khobar',
                name: 'فرع الخبر',
                twitter: 'https://x.com/khobar_tahfeez',
                whatsapp: '966138361234',
                instagram: 'https://www.instagram.com/khobar_tahfeez/',
                location: 'https://maps.app.goo.gl/example_khobar',
                email: 'khobar@tahfeez-sharqiya.com',
                phone: '966138361234',
                region: 'الخبر',
                established: '1390'
            },
            {
                id: 'alsarar',
                name: 'فرع الصرار',
                twitter: 'https://x.com/alsarar_tahfeez',
                whatsapp: '966138363333',
                instagram: 'https://www.instagram.com/alsarar_tahfeez/',
                location: 'https://maps.app.goo.gl/example_alsarar',
                email: 'alsarar@tahfeez-sharqiya.com',
                phone: '966138363333',
                region: 'الصرار',
                established: '1405'
            },
            {
                id: 'ras-tanura',
                name: 'فرع رأس تنورة',
                twitter: 'https://x.com/ras_tanura_tahfeez',
                whatsapp: '966138364444',
                instagram: 'https://www.instagram.com/ras_tanura_tahfeez/',
                location: 'https://maps.app.goo.gl/example_ras_tanura',
                email: 'ras.tanura@tahfeez-sharqiya.com',
                phone: '966138364444',
                region: 'رأس تنورة',
                established: '1408'
            },
            {
                id: 'qaryah',
                name: 'فرع قرية',
                twitter: 'https://x.com/qaryah_tahfeez',
                whatsapp: '966138365555',
                instagram: 'https://www.instagram.com/qaryah_tahfeez/',
                location: 'https://maps.app.goo.gl/example_qaryah',
                email: 'qaryah@tahfeez-sharqiya.com',
                phone: '966138365555',
                region: 'قرية',
                established: '1410'
            },
            {
                id: 'altaeriah',
                name: 'فرع التعيرية',
                twitter: 'https://x.com/altaeriah_tahfeez',
                whatsapp: '966138366666',
                instagram: 'https://www.instagram.com/altaeriah_tahfeez/',
                location: 'https://maps.app.goo.gl/example_altaeriah',
                email: 'altaeriah@tahfeez-sharqiya.com',
                phone: '966138366666',
                region: 'التعيرية',
                established: '1412'
            }
        ];

        for (const branch of branches) {
            try {
                await client.query(`
                    INSERT INTO branches (id, name, twitter, whatsapp, instagram, location, email, phone, region, established, status)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'active')
                    ON CONFLICT (id) DO UPDATE SET
                        name = EXCLUDED.name,
                        twitter = EXCLUDED.twitter,
                        whatsapp = EXCLUDED.whatsapp,
                        instagram = EXCLUDED.instagram,
                        location = EXCLUDED.location,
                        email = EXCLUDED.email,
                        phone = EXCLUDED.phone,
                        region = EXCLUDED.region,
                        established = EXCLUDED.established,
                        updated_at = NOW()
                `, [
                    branch.id,
                    branch.name,
                    branch.twitter,
                    branch.whatsapp,
                    branch.instagram,
                    branch.location,
                    branch.email,
                    branch.phone,
                    branch.region,
                    branch.established
                ]);
                console.log(`✅ تم إدراج/تحديث فرع: ${branch.name}`);
            } catch (error) {
                console.error(`❌ خطأ في إدراج فرع ${branch.name}:`, error.message);
            }
        }

        // إنشاء فهارس للأداء
        console.log('🔍 إنشاء فهارس للأداء...');
        await client.query('CREATE INDEX IF NOT EXISTS idx_branches_status ON branches(status)');
        await client.query('CREATE INDEX IF NOT EXISTS idx_branches_region ON branches(region)');
        await client.query('CREATE INDEX IF NOT EXISTS idx_update_requests_status ON update_requests(status)');
        await client.query('CREATE INDEX IF NOT EXISTS idx_update_requests_branch ON update_requests(branch_id)');

        // التحقق من النتائج
        console.log('📊 فحص النتائج النهائية...');
        const result = await client.query('SELECT id, name, region FROM branches ORDER BY name');
        console.log('🏢 الفروع المتاحة:');
        result.rows.forEach(row => {
            console.log(`   - ${row.name} (${row.id}) - ${row.region}`);
        });

        console.log('🎉 تم إعداد قاعدة البيانات بنجاح!');
        console.log(`📈 المجموع: ${result.rows.length} فرع`);

    } catch (error) {
        console.error('❌ خطأ في إعداد قاعدة البيانات:', error);
        if (error.code) {
            console.error('كود الخطأ:', error.code);
        }
        if (error.detail) {
            console.error('تفاصيل الخطأ:', error.detail);
        }
    } finally {
        await client.end();
        console.log('🔌 تم إغلاق الاتصال بقاعدة البيانات');
    }
}

setupDatabase();
