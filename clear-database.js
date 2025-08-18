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

async function clearAllData() {
    try {
        console.log('🔗 الاتصال بقاعدة البيانات...');
        await client.connect();
        console.log('✅ تم الاتصال بنجاح!');

        // مسح جميع الطلبات
        console.log('🗑️ مسح جميع طلبات التحديث...');
        const deleteRequestsResult = await client.query('DELETE FROM update_requests');
        console.log(`✅ تم مسح ${deleteRequestsResult.rowCount} طلب`);

        // إعادة تعيين بيانات الفروع إلى القيم الافتراضية
        console.log('🔄 إعادة تعيين بيانات الفروع...');
        
        const branchesData = [
            {
                id: 'garb-dammam',
                name: 'فرع غرب الدمام',
                twitter: '',
                whatsapp: '',
                instagram: '',
                location: '',
                email: '',
                phone: '',
                region: 'الدمام'
            },
            {
                id: 'sharq-dammam',
                name: 'فرع شرق الدمام',
                twitter: '',
                whatsapp: '',
                instagram: '',
                location: '',
                email: '',
                phone: '',
                region: 'الدمام'
            },
            {
                id: 'khobar',
                name: 'فرع الخبر',
                twitter: '',
                whatsapp: '',
                instagram: '',
                location: '',
                email: '',
                phone: '',
                region: 'الخبر'
            },
            {
                id: 'rafeia',
                name: 'فرع الرفيعة',
                twitter: '',
                whatsapp: '',
                instagram: '',
                location: '',
                email: '',
                phone: '',
                region: 'الرفيعة'
            },
            {
                id: 'baqiq',
                name: 'فرع بقيق',
                twitter: '',
                whatsapp: '',
                instagram: '',
                location: '',
                email: '',
                phone: '',
                region: 'بقيق'
            }
        ];

        // حذف البيانات الحالية
        await client.query('DELETE FROM branches');
        
        // إدراج البيانات الجديدة النظيفة
        for (const branch of branchesData) {
            await client.query(`
                INSERT INTO branches (
                    id, name, twitter, whatsapp, instagram, location, 
                    email, phone, region, status, created_at, updated_at
                ) VALUES (
                    $1, $2, $3, $4, $5, $6, $7, $8, $9, 'active', NOW(), NOW()
                )
            `, [
                branch.id, branch.name, branch.twitter, branch.whatsapp,
                branch.instagram, branch.location, branch.email, branch.phone, branch.region
            ]);
            console.log(`✅ تم إعادة تعيين: ${branch.name}`);
        }

        console.log('🧹 مسح localStorage...');
        console.log('   -> يرجى مسح localStorage يدوياً من المتصفح أو تشغيل الكود التالي في console:');
        console.log('   -> localStorage.clear();');

        console.log('\n🎉 تم مسح جميع البيانات وإعادة التعيين بنجاح!');
        console.log('📊 الفروع المتاحة الآن:');
        
        const result = await client.query('SELECT id, name, region FROM branches ORDER BY id');
        result.rows.forEach(row => {
            console.log(`   - ${row.name} (${row.id}) - ${row.region}`);
        });

    } catch (error) {
        console.error('❌ خطأ:', error);
    } finally {
        console.log('🔌 إغلاق الاتصال...');
        await client.end();
    }
}

// تشغيل المسح
clearAllData();
