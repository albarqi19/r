const { Client } = require('pg');
const fs = require('fs');

// إعدادات قاعدة البيانات
const client = new Client({
  host: 'aws-0-us-west-1.pooler.supabase.com',
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
    console.log('🚀 الاتصال بقاعدة البيانات...');
    await client.connect();
    console.log('✅ تم الاتصال بقاعدة البيانات بنجاح');
    
    // قراءة ملف SQL
    const sqlContent = fs.readFileSync('setup-database.sql', 'utf8');
    console.log('📄 تم قراءة ملف SQL');
    
    // تقسيم الأوامر وتنفيذها واحدة تلو الأخرى
    const commands = sqlContent
      .split(';')
      .map(cmd => cmd.trim())
      .filter(cmd => cmd.length > 0 && !cmd.startsWith('--'));
    
    console.log(`🔄 تنفيذ ${commands.length} أمر SQL...`);
    
    for (let i = 0; i < commands.length; i++) {
      const command = commands[i] + ';';
      console.log(`📝 تنفيذ الأمر ${i + 1}/${commands.length}...`);
      
      try {
        const result = await client.query(command);
        console.log(`✅ تم تنفيذ الأمر ${i + 1} بنجاح`);
        if (result.rows && result.rows.length > 0) {
          console.log(`   📊 النتائج: ${result.rows.length} صف`);
        }
      } catch (error) {
        if (error.message.includes('already exists')) {
          console.log(`⚠️  الأمر ${i + 1} موجود مسبقاً - تخطي`);
        } else {
          console.error(`❌ خطأ في الأمر ${i + 1}:`, error.message);
          // لا نتوقف عند الأخطاء، نكمل مع الأوامر الأخرى
        }
      }
    }
    
    console.log('🎉 تم إعداد قاعدة البيانات بنجاح!');
    
    // التحقق من البيانات
    console.log('🔍 التحقق من البيانات...');
    const result = await client.query('SELECT id, name, region FROM branches ORDER BY name');
    console.log(`✅ تم العثور على ${result.rows.length} فرع:`);
    
    result.rows.forEach((branch, index) => {
      console.log(`   ${index + 1}. ${branch.name} - ${branch.region}`);
    });
    
  } catch (error) {
    console.error('❌ خطأ في إعداد قاعدة البيانات:', error.message);
  } finally {
    await client.end();
    console.log('🔚 تم إغلاق الاتصال بقاعدة البيانات');
  }
}

// تشغيل الإعداد
setupDatabase();
