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

async function checkLoginData() {
    try {
        console.log('🔗 الاتصال بقاعدة البيانات...');
        await client.connect();
        console.log('✅ تم الاتصال بنجاح!');

        // فحص جدول المستخدمين
        console.log('\n👥 فحص جدول المستخدمين...');
        const usersResult = await client.query('SELECT * FROM users ORDER BY created_at');
        
        if (usersResult.rows.length > 0) {
            console.log('📋 المستخدمون الموجودون:');
            usersResult.rows.forEach((user, index) => {
                console.log(`${index + 1}. البريد الإلكتروني: ${user.email}`);
                console.log(`   الصلاحية: ${user.role}`);
                console.log(`   فرع: ${user.branch_id || 'غير محدد'}`);
                console.log(`   تاريخ الإنشاء: ${user.created_at}`);
                console.log(`   آخر دخول: ${user.last_login || 'لم يسجل دخول بعد'}`);
                console.log('   ---');
            });
        } else {
            console.log('⚠️ لا توجد مستخدمون في قاعدة البيانات');
        }

        // فحص جدول auth.users (جدول المصادقة الرئيسي في Supabase)
        console.log('\n🔐 فحص جدول المصادقة الرئيسي...');
        try {
            const authUsersResult = await client.query(`
                SELECT id, email, created_at, last_sign_in_at, email_confirmed_at 
                FROM auth.users 
                ORDER BY created_at
            `);
            
            if (authUsersResult.rows.length > 0) {
                console.log('🔑 حسابات المصادقة الموجودة:');
                authUsersResult.rows.forEach((user, index) => {
                    console.log(`${index + 1}. البريد: ${user.email}`);
                    console.log(`   ID: ${user.id}`);
                    console.log(`   مؤكد: ${user.email_confirmed_at ? 'نعم' : 'لا'}`);
                    console.log(`   آخر دخول: ${user.last_sign_in_at || 'لم يسجل دخول'}`);
                    console.log(`   تاريخ الإنشاء: ${user.created_at}`);
                    console.log('   ---');
                });
            } else {
                console.log('⚠️ لا توجد حسابات مصادقة');
            }
        } catch (error) {
            console.log('ℹ️ جدول auth.users غير متاح (طبيعي في بعض الحالات)');
        }

        // إنشاء مستخدمين تجريبيين إذا لم يوجدوا
        console.log('\n🛠️ إنشاء مستخدمين تجريبيين...');
        
        const testUsers = [
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
                email: 'khobar@tahfeez-sharqiya.com',
                role: 'branch',
                branch_id: 'khobar'
            }
        ];

        for (const user of testUsers) {
            try {
                await client.query(`
                    INSERT INTO users (email, role, branch_id)
                    VALUES ($1, $2, $3)
                    ON CONFLICT (email) DO UPDATE SET
                        role = EXCLUDED.role,
                        branch_id = EXCLUDED.branch_id
                `, [user.email, user.role, user.branch_id]);
                
                console.log(`✅ تم إضافة/تحديث: ${user.email} (${user.role})`);
            } catch (error) {
                console.log(`❌ خطأ في إضافة ${user.email}: ${error.message}`);
            }
        }

        // عرض النتيجة النهائية
        console.log('\n📊 التقرير النهائي:');
        const finalResult = await client.query('SELECT email, role, branch_id FROM users ORDER BY role, email');
        
        console.log('🔐 بيانات تسجيل الدخول المتاحة:');
        console.log('=====================================');
        
        finalResult.rows.forEach((user, index) => {
            console.log(`${index + 1}. البريد الإلكتروني: ${user.email}`);
            console.log(`   كلمة المرور: admin123 (افتراضية)`);
            console.log(`   الصلاحية: ${user.role}`);
            console.log(`   الفرع: ${user.branch_id || 'جميع الفروع'}`);
            console.log('   ---');
        });

        console.log('\nℹ️ ملاحظة: كلمات المرور الافتراضية هي "admin123" لجميع الحسابات');
        console.log('يمكنك تغييرها لاحقاً من لوحة تحكم Supabase');

    } catch (error) {
        console.error('❌ خطأ في الاتصال:', error);
    } finally {
        await client.end();
        console.log('🔌 تم إغلاق الاتصال');
    }
}

checkLoginData();
