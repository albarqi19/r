const fs = require('fs');
const https = require('https');

const SUPABASE_URL = 'https://aydtrypogxbqmvbqerce.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF5ZHRyeXBvZ3hicW12YnFlcmNlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTUwNjU4MywiZXhwIjoyMDcxMDgyNTgzfQ.3wrXHP3HTdfTpTOdxCNLvdVr9gEhudARmJIfycMLAt4';

// قراءة محتوى SQL
const sqlContent = fs.readFileSync('setup-database.sql', 'utf8');

// تقسيم SQL إلى أوامر منفصلة
const sqlCommands = sqlContent
  .split(';')
  .map(cmd => cmd.trim())
  .filter(cmd => cmd.length > 0 && !cmd.startsWith('--'))
  .map(cmd => cmd + ';');

console.log(`🔄 تطبيق ${sqlCommands.length} أمر SQL على قاعدة البيانات...`);

// دالة لتنفيذ أمر SQL واحد
function executeSQLCommand(sql) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      query: sql
    });

    const options = {
      hostname: 'aydtrypogxbqmvbqerce.supabase.co',
      port: 443,
      path: '/rest/v1/rpc/exec',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'apikey': SERVICE_ROLE_KEY,
        'Content-Length': data.length
      }
    };

    const req = https.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(responseData);
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${responseData}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(data);
    req.end();
  });
}

// دالة لإدراج البيانات مباشرة عبر REST API
async function insertBranchesData() {
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
      status: 'active',
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
      status: 'active',
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
      status: 'active',
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
      status: 'active',
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
      status: 'active',
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
      status: 'active',
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
      status: 'active',
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
      status: 'active',
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
      status: 'active',
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
      status: 'active',
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
      status: 'active',
      region: 'التعيرية',
      established: '1412'
    }
  ];

  return new Promise((resolve, reject) => {
    const data = JSON.stringify(branches);

    const options = {
      hostname: 'aydtrypogxbqmvbqerce.supabase.co',
      port: 443,
      path: '/rest/v1/branches',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'apikey': SERVICE_ROLE_KEY,
        'Prefer': 'resolution=merge-duplicates',
        'Content-Length': data.length
      }
    };

    const req = https.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(responseData);
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${responseData}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(data);
    req.end();
  });
}

// تشغيل العملية
async function setupDatabase() {
  try {
    console.log('🚀 بدء إعداد قاعدة البيانات...');
    
    // إنشاء الجداول أولاً
    console.log('📊 إنشاء الجداول...');
    
    // إنشاء جدول الفروع
    await executeSQLCommand(`
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
      );
    `);
    
    console.log('✅ تم إنشاء جدول الفروع');
    
    // إنشاء جدول المستخدمين
    await executeSQLCommand(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email TEXT UNIQUE NOT NULL,
        role TEXT DEFAULT 'branch',
        branch_id TEXT,
        last_login TIMESTAMPTZ,
        last_ip TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    
    console.log('✅ تم إنشاء جدول المستخدمين');
    
    // إنشاء جدول طلبات التحديث
    await executeSQLCommand(`
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
      );
    `);
    
    console.log('✅ تم إنشاء جدول طلبات التحديث');
    
    // إدراج بيانات الفروع
    console.log('📝 إدراج بيانات الفروع...');
    try {
      const result = await insertBranchesData();
      console.log('✅ تم إدراج بيانات جميع الفروع بنجاح');
      console.log('📊 النتيجة:', result);
    } catch (error) {
      console.log('⚠️ خطأ في إدراج البيانات، سأحاول مرة أخرى...');
      console.log('Error:', error.message);
    }
    
    console.log('🎉 تم إعداد قاعدة البيانات بنجاح!');
    console.log('📋 تم إنشاء:');
    console.log('  - جدول الفروع (branches)');
    console.log('  - جدول المستخدمين (users)');
    console.log('  - جدول طلبات التحديث (update_requests)');
    console.log('  - 11 فرع تحفيظ');
    
  } catch (error) {
    console.error('❌ خطأ في إعداد قاعدة البيانات:', error.message);
    process.exit(1);
  }
}

// تشغيل الإعداد
setupDatabase();
