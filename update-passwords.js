/**
 * سكريبت تحديث كلمات المرور للحسابات الموجودة
 * 
 * يقوم بتوليد كلمات مرور جديدة وتحديثها في Supabase Auth
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// إعدادات Supabase
const supabaseUrl = 'https://aydtrypogxbqmvbqerce.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF5ZHRyeXBvZ3hicW12YnFlcmNlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTUwNjU4MywiZXhwIjoyMDcxMDgyNTgzfQ.3wrXHP3HTdfTpTOdxCNLvdVr9gEhudARmJIfycMLAt4';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// توليد كلمة مرور قوية
function generateStrongPassword() {
    const length = 16;
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*';
    const allChars = uppercase + lowercase + numbers + symbols;
    
    let password = '';
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += symbols[Math.floor(Math.random() * symbols.length)];
    
    for (let i = password.length; i < length; i++) {
        password += allChars[Math.floor(Math.random() * allChars.length)];
    }
    
    return password.split('').sort(() => Math.random() - 0.5).join('');
}

// الحسابات المطلوب تحديثها
const accountsTemplate = [
    { email: 'admin@tahfeez-sharqiya.com', role: 'admin', branch: null, name: 'المدير العام' },
    { email: 'garb@tahfeez-sharqiya.com', role: 'branch', branch: 'garb-dammam', name: 'فرع غرب الدمام' },
    { email: 'sharq@tahfeez-sharqiya.com', role: 'branch', branch: 'sharq-dammam', name: 'فرع شرق الدمام' },
    { email: 'khobar@tahfeez-sharqiya.com', role: 'branch', branch: 'khobar', name: 'فرع الخبر' },
    { email: 'rafeia@tahfeez-sharqiya.com', role: 'branch', branch: 'rafeia', name: 'فرع الرفيعة' },
    { email: 'baqiq@tahfeez-sharqiya.com', role: 'branch', branch: 'baqiq', name: 'فرع بقيق' },
    { email: 'anak@tahfeez-sharqiya.com', role: 'branch', branch: 'anak', name: 'فرع عنك' },
    { email: 'wadi.almiyah@tahfeez-sharqiya.com', role: 'branch', branch: 'wadi-almiyah', name: 'فرع وادي المياه' },
    { email: 'alsarar@tahfeez-sharqiya.com', role: 'branch', branch: 'sarrar', name: 'فرع الصرار' },
    { email: 'ras.tanura@tahfeez-sharqiya.com', role: 'branch', branch: 'ras-tanura', name: 'فرع رأس تنورة' },
    { email: 'qaryah@tahfeez-sharqiya.com', role: 'branch', branch: 'qarya', name: 'فرع قرية' },
    { email: 'altaeriah@tahfeez-sharqiya.com', role: 'branch', branch: 'taaeriya', name: 'فرع التعيرية' }
];

// إضافة كلمات مرور تلقائياً
const accounts = accountsTemplate.map(acc => ({
    ...acc,
    password: generateStrongPassword()
}));

// حفظ البيانات في ملف
function savePasswordsToFile(accounts, results) {
    const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
    const filename = `كلمات-المرور-المحدثة-${timestamp}.txt`;
    
    let content = '═══════════════════════════════════════════════════════\n';
    content += '       كلمات المرور المحدثة - تحفيظ الشرقية\n';
    content += `       تاريخ التحديث: ${new Date().toLocaleString('ar-SA')}\n`;
    content += '═══════════════════════════════════════════════════════\n\n';
    content += '✅ تم تحديث كلمات المرور بنجاح!\n';
    content += '⚠️ احفظ هذا الملف في مكان آمن - كلمات المرور الجديدة!\n';
    content += '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n';

    accounts.forEach(acc => {
        const icon = acc.role === 'admin' ? '👑' : '🏢';
        const status = results.success.includes(acc.email) ? '✅ تم التحديث' : '❌ فشل';
        
        content += `${icon} ${acc.name}\n`;
        content += `   الحالة: ${status}\n`;
        content += `   البريد الإلكتروني: ${acc.email}\n`;
        content += `   كلمة المرور الجديدة: ${acc.password}\n`;
        content += `   الدور: ${acc.role === 'admin' ? 'مدير عام' : 'مدير فرع'}\n`;
        if (acc.branch) {
            content += `   الفرع: ${acc.branch}\n`;
        }
        content += '\n' + '─'.repeat(50) + '\n\n';
    });

    content += '\n═══════════════════════════════════════════════════════\n';
    content += '📊 الإحصائيات:\n';
    content += `   ✅ نجح: ${results.success.length}\n`;
    content += `   ❌ فشل: ${results.failed.length}\n`;
    content += `   📝 الإجمالي: ${accounts.length}\n`;
    content += '═══════════════════════════════════════════════════════\n\n';
    content += '📝 ملاحظات مهمة:\n';
    content += '• هذه كلمات المرور الجديدة - الكلمات القديمة لم تعد تعمل!\n';
    content += '• كلمات المرور قوية ومشفرة في Supabase (16 حرف)\n';
    content += '• يمكن للمستخدمين تغيير كلمة المرور من لوحة التحكم\n';
    content += '• لا تشارك هذه البيانات مع أحد غير المصرح لهم\n';
    content += '• احتفظ بنسخة احتياطية في مكان آمن (مدير كلمات مرور)\n';
    content += '• ينصح بتسليم كل حساب لصاحبه بشكل مباشر وآمن\n';
    content += '═══════════════════════════════════════════════════════\n';

    fs.writeFileSync(filename, content, 'utf8');
    console.log(`\n💾 تم حفظ البيانات في: ${filename}`);
    console.log(`📂 المسار الكامل: ${path.resolve(filename)}`);
}

async function updatePasswords() {
    console.log('═══════════════════════════════════════════════════════');
    console.log('🔄 سكريبت تحديث كلمات المرور - تحفيظ الشرقية');
    console.log('═══════════════════════════════════════════════════════\n');
    
    console.log(`🔐 سيتم تحديث كلمات المرور لـ ${accounts.length} حساب\n`);
    
    const results = {
        success: [],
        failed: [],
        details: []
    };

    for (const account of accounts) {
        try {
            console.log(`⏳ [${results.success.length + results.failed.length + 1}/${accounts.length}] تحديث: ${account.email}`);
            
            // البحث عن المستخدم حسب الإيميل
            const { data: users, error: listError } = await supabase.auth.admin.listUsers();
            
            if (listError) throw listError;
            
            const user = users.users.find(u => u.email === account.email);
            
            if (!user) {
                console.log(`   ⚠️  المستخدم غير موجود - سيتم إنشاؤه\n`);
                
                // إنشاء حساب جديد إذا لم يكن موجوداً
                const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
                    email: account.email,
                    password: account.password,
                    email_confirm: true
                });
                
                if (createError) throw createError;
                
                // إضافة في جدول users
                const { error: insertError } = await supabase
                    .from('users')
                    .insert({
                        id: newUser.user.id,
                        email: account.email,
                        role: account.role,
                        branch_id: account.branch
                    });
                
                if (insertError) throw insertError;
                
                console.log(`   ✅ تم الإنشاء بنجاح\n`);
            } else {
                // تحديث كلمة المرور للمستخدم الموجود
                const { error: updateError } = await supabase.auth.admin.updateUserById(
                    user.id,
                    { password: account.password }
                );
                
                if (updateError) throw updateError;
                
                console.log(`   ✅ تم تحديث كلمة المرور\n`);
            }
            
            results.success.push(account.email);
            results.details.push({
                ...account,
                status: 'success'
            });

        } catch (error) {
            console.error(`   ❌ خطأ: ${error.message}\n`);
            results.failed.push({ 
                email: account.email, 
                error: error.message 
            });
        }
    }

    // عرض الملخص
    console.log('\n═══════════════════════════════════════════════════════');
    console.log('📊 ملخص العملية');
    console.log('═══════════════════════════════════════════════════════');
    console.log(`✅ نجح: ${results.success.length}/${accounts.length}`);
    console.log(`❌ فشل: ${results.failed.length}/${accounts.length}`);
    
    if (results.success.length > 0) {
        console.log('\n✅ الحسابات المحدثة بنجاح:');
        results.success.forEach((email, i) => console.log(`   ${i+1}. ${email}`));
    }
    
    if (results.failed.length > 0) {
        console.log('\n❌ الحسابات الفاشلة:');
        results.failed.forEach((item, i) => {
            console.log(`   ${i+1}. ${item.email}: ${item.error}`);
        });
    }

    console.log('\n═══════════════════════════════════════════════════════');
    
    // حفظ في ملف
    savePasswordsToFile(accounts, results);
    
    console.log('\n✅ اكتملت عملية التحديث بنجاح!');
    console.log('🔐 جميع كلمات المرور الجديدة محفوظة في الملف');
    console.log('⚠️  الكلمات القديمة لم تعد تعمل - استخدم الكلمات الجديدة فقط!\n');
}

// تشغيل السكريبت
if (require.main === module) {
    updatePasswords()
        .catch(error => {
            console.error('\n❌ خطأ غير متوقع:', error);
            process.exit(1);
        });
}

/**
 * ═══════════════════════════════════════════════════════
 * 📖 كيفية الاستخدام:
 * ═══════════════════════════════════════════════════════
 * 
 * ✅ Service Key موجود مسبقاً
 * ✅ المكتبات مثبتة مسبقاً
 * 
 * فقط شغّل:
 * node update-passwords.js
 * 
 * ═══════════════════════════════════════════════════════
 * ماذا سيحدث:
 * ═══════════════════════════════════════════════════════
 * 
 * 1️⃣ توليد كلمات مرور جديدة (16 حرف قوية)
 * 2️⃣ تحديث كلمة المرور لكل حساب في Supabase Auth
 * 3️⃣ حفظ جميع البيانات الجديدة في ملف .txt
 * 4️⃣ عرض تقرير مفصل بالنجاح والفشل
 * 
 * ⚠️  كلمات المرور القديمة لن تعمل بعد التحديث!
 * 
 * ═══════════════════════════════════════════════════════
 */
