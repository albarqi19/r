const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://pnfrnqhjtlutgtylhcra.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBuZnJucWhqdGx1dGd0eWxoY3JhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ1MTYzMzgsImV4cCI6MjA1MDA5MjMzOH0.FHiWlPyY2zVyrhfSb2MrXJmCIGPL8dN5JKsqLXUbdNE';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDatabase() {
    console.log('🔍 فحص قاعدة البيانات...');
    
    try {
        // فحص الفروع
        const { data: branches, error: branchError } = await supabase
            .from('branches')
            .select('*')
            .order('name');
        
        if (branchError) {
            console.error('❌ خطأ في استرداد الفروع:', branchError);
        } else {
            console.log('\n📋 الفروع الموجودة في قاعدة البيانات:');
            branches.forEach((branch, index) => {
                console.log(`${index + 1}. المعرف: ${branch.id} - الاسم: ${branch.name} - المنطقة: ${branch.region}`);
            });
            console.log(`\n📊 إجمالي الفروع: ${branches.length}`);
        }
        
        // فحص المستخدمين
        const { data: users, error: userError } = await supabase
            .from('users')
            .select('*')
            .order('email');
        
        if (userError) {
            console.error('❌ خطأ في استرداد المستخدمين:', userError);
        } else {
            console.log('\n👥 المستخدمون في قاعدة البيانات:');
            users.forEach((user, index) => {
                console.log(`${index + 1}. البريد: ${user.email} - الدور: ${user.role} - الفرع: ${user.branch_id || 'جميع الفروع'}`);
            });
            console.log(`\n👤 إجمالي المستخدمين: ${users.length}`);
        }
        
    } catch (error) {
        console.error('❌ خطأ عام:', error);
    }
}

checkDatabase().then(() => {
    console.log('\n✅ انتهى فحص قاعدة البيانات');
    process.exit(0);
}).catch(error => {
    console.error('❌ خطأ في تشغيل الفحص:', error);
    process.exit(1);
});
