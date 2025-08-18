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

async function checkUserTable() {
    try {
        await client.connect();
        console.log('✅ متصل بقاعدة البيانات');
        
        // فحص تركيب الجدول
        const result = await client.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'users' 
            ORDER BY ordinal_position
        `);
        
        console.log('\n📋 أعمدة جدول المستخدمين:');
        result.rows.forEach(col => {
            console.log(`- ${col.column_name}: ${col.data_type}`);
        });
        
        // فحص البيانات الموجودة
        const userData = await client.query('SELECT * FROM users LIMIT 5');
        console.log('\n👥 عينة من البيانات:');
        userData.rows.forEach((user, index) => {
            console.log(`${index + 1}. ${JSON.stringify(user)}`);
        });
        
    } catch (error) {
        console.error('❌ خطأ:', error.message);
    } finally {
        await client.end();
    }
}

checkUserTable();
