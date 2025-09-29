/**
 * سكريبت إنشاء حسابات Supabase - نسخة محسّنة
 * 
 * يقوم بتوليد كلمات المرور تلقائياً وإنشاء الحسابات
 * يحفظ البيانات في ملف نصي
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// إعدادات Supabase
const supabaseUrl = 'https://aydtrypogxbqmvbqerce.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF5ZHRyeXBvZ3hicW12YnFlcmNlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTUwNjU4MywiZXhwIjoyMDcxMDgyNTgzfQ.3wrXHP3HTdfTpTOdxCNLvdVr9gEhudARmJIfycMLAt4'; // Service Role Key

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

// الحسابات المطلوب إنشاؤها
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
    const filename = `حسابات-تحفيظ-الشرقية-${timestamp}.txt`;
    
    let content = '═══════════════════════════════════════════════════════\n';
    content += '       بيانات تسجيل الدخول - تحفيظ الشرقية\n';
    content += `       تاريخ الإنشاء: ${new Date().toLocaleString('ar-SA')}\n`;
    content += '═══════════════════════════════════════════════════════\n\n';
    content += '⚠️ تنبيه: احفظ هذا الملف في مكان آمن!\n';
    content += '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n';

    accounts.forEach(acc => {
        const icon = acc.role === 'admin' ? '👑' : '🏢';
        const status = results.success.includes(acc.email) ? '✅ تم الإنشاء' : '❌ فشل';
        
        content += `${icon} ${acc.name}\n`;
        content += `   الحالة: ${status}\n`;
        content += `   البريد الإلكتروني: ${acc.email}\n`;
        content += `   كلمة المرور: ${acc.password}\n`;
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
    content += '📝 ملاحظات:\n';
    content += '• كلمات المرور قوية ومشفرة في Supabase\n';
    content += '• يمكن تغيير كلمة المرور من لوحة التحكم\n';
    content += '• لا تشارك هذه البيانات مع أحد\n';
    content += '• احتفظ بنسخة احتياطية في مكان آمن\n';
    content += '═══════════════════════════════════════════════════════\n';

    fs.writeFileSync(filename, content, 'utf8');
    console.log(`\n💾 تم حفظ البيانات في: ${filename}`);
    console.log(`📂 المسار: ${path.resolve(filename)}`);
}

async function createAccounts() {
    console.log('═══════════════════════════════════════════════════════');
    console.log('🚀 سكريبت إنشاء حسابات تحفيظ الشرقية');
    console.log('═══════════════════════════════════════════════════════\n');
    
    // التحقق من Service Key
    if (supabaseServiceKey === 'YOUR_SERVICE_ROLE_KEY_HERE') {
        console.error('❌ خطأ: يجب إضافة Service Role Key أولاً!');
        console.log('\n📝 كيفية الحصول عليه:');
        console.log('1. اذهب إلى: https://supabase.com/dashboard/project/aydtrypogxbqmvbqerce');
        console.log('2. Settings > API');
        console.log('3. انسخ "service_role" key (secret)');
        console.log('4. ضعه في المتغير supabaseServiceKey في السطر 11\n');
        process.exit(1);
    }

    console.log(`📧 سيتم إنشاء ${accounts.length} حساب\n`);
    
    const results = {
        success: [],
        failed: [],
        details: []
    };

    for (const account of accounts) {
        try {
            console.log(`⏳ [${results.success.length + results.failed.length + 1}/${accounts.length}] إنشاء: ${account.email}`);
            
            // إنشاء المستخدم في Auth
            const { data: authData, error: authError } = await supabase.auth.admin.createUser({
                email: account.email,
                password: account.password,
                email_confirm: true
            });

            if (authError) {
                if (authError.message.includes('already')) {
                    console.log(`   ⚠️  الحساب موجود مسبقاً`);
                    results.failed.push({ 
                        email: account.email, 
                        error: 'الحساب موجود مسبقاً',
                        existing: true 
                    });
                } else {
                    throw authError;
                }
                continue;
            }

            console.log(`   ✅ Auth: تم`);

            // إضافة بيانات المستخدم في جدول users
            const { error: userError } = await supabase
                .from('users')
                .upsert({
                    id: authData.user.id,
                    email: account.email,
                    role: account.role,
                    branch_id: account.branch
                }, {
                    onConflict: 'id'
                });

            if (userError) throw userError;

            console.log(`   ✅ Users: تم\n`);
            
            results.success.push(account.email);
            results.details.push({
                ...account,
                userId: authData.user.id,
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
        console.log('\n✅ الحسابات الناجحة:');
        results.success.forEach((email, i) => console.log(`   ${i+1}. ${email}`));
    }
    
    if (results.failed.length > 0) {
        console.log('\n❌ الحسابات الفاشلة:');
        results.failed.forEach((item, i) => {
            const reason = item.existing ? '(موجود مسبقاً)' : `(${item.error})`;
            console.log(`   ${i+1}. ${item.email} ${reason}`);
        });
    }

    console.log('\n═══════════════════════════════════════════════════════');
    
    // حفظ في ملف
    savePasswordsToFile(accounts, results);
    
    console.log('\n✅ اكتملت العملية بنجاح!');
    console.log('📝 تم حفظ جميع البيانات في ملف نصي\n');
}

// تشغيل السكريبت
if (require.main === module) {
    createAccounts()
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
 * 1️⃣ تثبيت المكتبات:
 *    npm install @supabase/supabase-js
 * 
 * 2️⃣ الحصول على Service Role Key:
 *    • اذهب: https://supabase.com/dashboard/project/aydtrypogxbqmvbqerce
 *    • Settings > API
 *    • انسخ "service_role" key (سري - لا تشاركه!)
 *    • ضعه في السطر 11 من هذا الملف
 * 
 * 3️⃣ تشغيل السكريبت:
 *    node create-accounts-script.js
 * 
 * 4️⃣ النتيجة:
 *    ✅ سيتم إنشاء 12 حساب تلقائياً
 *    ✅ كلمات مرور قوية عشوائية
 *    ✅ ملف نصي بجميع البيانات
 * 
 * ═══════════════════════════════════════════════════════
 * 🔐 الأمان:
 * ═══════════════════════════════════════════════════════
 * 
 * ⚠️ Service Role Key له صلاحيات كاملة - احفظه بأمان
 * ⚠️ لا تشاركه في GitHub أو أي مكان عام
 * ⚠️ استخدمه فقط في بيئة التطوير المحلية
 * ⚠️ في الإنتاج، استخدم متغيرات بيئة مشفرة
 * 
 * ═══════════════════════════════════════════════════════
 */
