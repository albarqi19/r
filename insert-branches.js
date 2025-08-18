const https = require('https');

const SUPABASE_URL = 'https://aydtrypogxbqmvbqerce.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF5ZHRyeXBvZ3hicW12YnFlcmNlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTUwNjU4MywiZXhwIjoyMDcxMDgyNTgzfQ.3wrXHP3HTdfTpTOdxCNLvdVr9gEhudARmJIfycMLAt4';

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
        console.log(`📡 Response Status: ${res.statusCode}`);
        console.log(`📄 Response: ${responseData}`);
        
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

// دالة للتحقق من وجود الجداول
async function checkTables() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'aydtrypogxbqmvbqerce.supabase.co',
      port: 443,
      path: '/rest/v1/branches?select=count',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'apikey': SERVICE_ROLE_KEY,
        'Prefer': 'count=exact'
      }
    };

    const req = https.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        console.log(`📡 Table Check Status: ${res.statusCode}`);
        console.log(`📄 Response: ${responseData}`);
        resolve(res.statusCode === 200);
      });
    });

    req.on('error', (error) => {
      resolve(false);
    });

    req.end();
  });
}

// تشغيل العملية
async function main() {
  try {
    console.log('🚀 بدء التحقق من قاعدة البيانات...');
    
    const tablesExist = await checkTables();
    console.log(`📊 حالة الجداول: ${tablesExist ? 'موجودة' : 'غير موجودة'}`);
    
    if (tablesExist) {
      console.log('📝 إدراج بيانات الفروع...');
      const result = await insertBranchesData();
      console.log('✅ تم إدراج بيانات جميع الفروع بنجاح!');
      console.log('📋 تم إنشاء 11 فرع تحفيظ في قاعدة البيانات');
    } else {
      console.log('⚠️ الجداول غير موجودة. يرجى إنشاؤها أولاً من Supabase Dashboard.');
      console.log('📋 استخدم المحتوى من setup-database.sql');
    }
    
  } catch (error) {
    console.error('❌ خطأ:', error.message);
  }
}

main();
