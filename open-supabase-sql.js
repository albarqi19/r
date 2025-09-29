const { exec } = require('child_process');
const fs = require('fs');

console.log('🚀 معالج SQL التلقائي لـ Supabase\n');
console.log('═════════════════════════════════════════════════════════\n');

// قراءة محتوى SQL
const sqlContent = fs.readFileSync('create-activity-logs.sql', 'utf8');

console.log('📋 محتوى SQL جاهز للتنفيذ!\n');
console.log('⚠️  للأسف، Supabase لا يدعم تنفيذ SQL عبر API بدون إنشاء RPC function أولاً\n');
console.log('🔧 الحلول المتاحة:\n');
console.log('1️⃣  تنفيذ يدوي (موصى به):');
console.log('   • افتح: https://app.supabase.com/project/aydtrypogxbqmvbqerce/sql');
console.log('   • انسخ محتوى ملف: create-activity-logs.sql');
console.log('   • الصق في SQL Editor واضغط Run ▶️\n');

console.log('2️⃣  فتح Dashboard تلقائياً:');
console.log('   • سأفتح لك الرابط في المتصفح...\n');

// فتح المتصفح تلقائياً
const url = 'https://app.supabase.com/project/aydtrypogxbqmvbqerce/sql';

console.log('🌐 جاري فتح Supabase Dashboard...\n');

// فتح المتصفح حسب نظام التشغيل
const command = process.platform === 'win32' ? `start ${url}` :
                process.platform === 'darwin' ? `open ${url}` :
                `xdg-open ${url}`;

exec(command, (error) => {
    if (error) {
        console.log('❌ لم أستطع فتح المتصفح تلقائياً');
        console.log(`\n🔗 افتح هذا الرابط يدوياً:\n${url}\n`);
    } else {
        console.log('✅ تم فتح Dashboard في المتصفح!\n');
    }
    
    console.log('═════════════════════════════════════════════════════════\n');
    console.log('📝 الخطوات التالية:');
    console.log('   1. انسخ محتوى ملف create-activity-logs.sql');
    console.log('   2. الصق في SQL Editor');
    console.log('   3. اضغط Run ▶️');
    console.log('   4. بعد التنفيذ، شغّل: node setup-activity-logs.js للتحقق\n');
    console.log('═════════════════════════════════════════════════════════\n');
    
    // عرض محتوى SQL للنسخ السهل
    console.log('📄 محتوى SQL (للنسخ):');
    console.log('─────────────────────────────────────────────────────────');
    console.log(sqlContent);
    console.log('─────────────────────────────────────────────────────────\n');
});
