const supabaseUrl = 'https://aydtrypogxbqmvbqerce.supabase.co';
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF5ZHRyeXBvZ3hicW12YnFlcmNlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTUwNjU4MywiZXhwIjoyMDcxMDgyNTgzfQ.ZAR8fgzQXiHGV_NZEo7cLl_7SqWgMgJ1VkJxQ0D9cHM'; // يجب استبدال هذا بمفتاح service_role الحقيقي

const fs = require('fs');
const https = require('https');

// قراءة محتوى SQL
const sqlContent = fs.readFileSync('setup-database.sql', 'utf8');

// تقسيم SQL إلى statements منفصلة
const statements = sqlContent
  .split(';')
  .map(stmt => stmt.trim())
  .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

async function executeSQL() {
  console.log('🔄 بدء تطبيق SQL على قاعدة البيانات...');
  
  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i];
    
    if (statement.trim().length === 0) continue;
    
    console.log(`📝 تنفيذ statement ${i + 1}/${statements.length}...`);
    
    try {
      const data = JSON.stringify({
        query: statement + ';'
      });
      
      const options = {
        hostname: 'aydtrypogxbqmvbqerce.supabase.co',
        path: '/rest/v1/rpc',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${serviceKey}`,
          'apikey': serviceKey,
          'Content-Length': Buffer.byteLength(data)
        }
      };
      
      await new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
          let responseData = '';
          
          res.on('data', (chunk) => {
            responseData += chunk;
          });
          
          res.on('end', () => {
            if (res.statusCode >= 200 && res.statusCode < 300) {
              console.log(`✅ نجح statement ${i + 1}`);
              resolve();
            } else {
              console.log(`❌ فشل statement ${i + 1}: ${responseData}`);
              resolve(); // نكمل حتى لو فشل statement
            }
          });
        });
        
        req.on('error', (error) => {
          console.error(`❌ خطأ في statement ${i + 1}:`, error.message);
          resolve(); // نكمل حتى لو حدث خطأ
        });
        
        req.write(data);
        req.end();
      });
      
      // انتظار قصير بين كل statement
      await new Promise(resolve => setTimeout(resolve, 100));
      
    } catch (error) {
      console.error(`❌ خطأ في statement ${i + 1}:`, error.message);
    }
  }
  
  console.log('✅ انتهى تطبيق SQL');
}

executeSQL().catch(console.error);
