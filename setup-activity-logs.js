const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// إعدادات Supabase
const supabaseUrl = 'https://aydtrypogxbqmvbqerce.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF5ZHRyeXBvZ3hicW12YnFlcmNlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTUwNjU4MywiZXhwIjoyMDcxMDgyNTgzfQ.3wrXHP3HTdfTpTOdxCNLvdVr9gEhudARmJIfycMLAt4';

// إنشاء عميل Supabase
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupActivityLogsTable() {
    console.log('🚀 بدء إنشاء جدول النشاطات...\n');

    try {
        // قراءة ملف SQL
        const sqlContent = fs.readFileSync('create-activity-logs.sql', 'utf8');
        console.log('✅ تم قراءة ملف SQL\n');

        // ملاحظة: Supabase JavaScript SDK لا يدعم تنفيذ SQL المباشر
        // يجب تنفيذ SQL من خلال Supabase Dashboard > SQL Editor
        console.log('📋 محتوى SQL جاهز للتنفيذ:\n');
        console.log('─────────────────────────────────────────');
        console.log(sqlContent);
        console.log('─────────────────────────────────────────\n');

        console.log('⚠️  لتنفيذ هذا الكود:');
        console.log('1. افتح Supabase Dashboard: https://app.supabase.com/project/aydtrypogxbqmvbqerce');
        console.log('2. اذهب إلى SQL Editor');
        console.log('3. انسخ محتوى ملف create-activity-logs.sql');
        console.log('4. الصقه في SQL Editor واضغط Run\n');

        // محاولة إدراج نشاط تجريبي للتحقق من الجدول
        console.log('🔍 التحقق من إمكانية الوصول إلى الجدول...\n');
        
        const { data, error } = await supabase
            .from('activity_logs')
            .select('count');

        if (error) {
            if (error.code === '42P01') {
                console.log('❌ الجدول غير موجود بعد');
                console.log('📝 يرجى تنفيذ SQL من Dashboard\n');
            } else {
                console.error('❌ خطأ:', error.message);
            }
        } else {
            console.log('✅ الجدول موجود ويعمل بنجاح! 🎉\n');
            
            // جلب آخر 5 نشاطات
            const { data: activities, error: fetchError } = await supabase
                .from('activity_logs')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(5);
            
            if (fetchError) {
                console.error('❌ خطأ في جلب النشاطات:', fetchError);
            } else {
                console.log('📊 آخر النشاطات:');
                console.log(activities);
            }
        }

    } catch (error) {
        console.error('❌ خطأ في setup:', error.message);
    }
}

// تشغيل
setupActivityLogsTable();
